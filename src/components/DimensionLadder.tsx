"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useLang, T, type Bi } from "./lang";
import { DIMENSIONS } from "./content";

/* ============================================================
   DimensionLadder — "The Evolution of Dimensions"
   A spectral selector (0D → 11D) drives an animated canvas
   figure for the selected dimension, plus a holo text panel.
   Canvas 2D only. No external libs.
   ============================================================ */

const AUTO_MS = 5000; // auto-advance interval
const PAUSE_MS = 14000; // pause auto-advance after user interaction

/* ---- small color helpers (operate on the #rrggbb spectral colors) ---- */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const v = parseInt(n, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function rgba(rgb: [number, number, number], a: number): string {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
}
function lighten(rgb: [number, number, number], amt: number): [number, number, number] {
  return [
    Math.min(255, rgb[0] + (255 - rgb[0]) * amt),
    Math.min(255, rgb[1] + (255 - rgb[1]) * amt),
    Math.min(255, rgb[2] + (255 - rgb[2]) * amt),
  ];
}

/* ---- n-cube geometry: generate 2^n vertices (±1 per axis) ---- */
function cubeVertices(n: number): number[][] {
  const count = 1 << n;
  const verts: number[][] = [];
  for (let i = 0; i < count; i++) {
    const v: number[] = [];
    for (let b = 0; b < n; b++) v.push(i & (1 << b) ? 1 : -1);
    verts.push(v);
  }
  return verts;
}
/* edges = pairs of vertices differing in exactly one coordinate */
function cubeEdges(n: number): [number, number][] {
  const count = 1 << n;
  const edges: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    for (let b = 0; b < n; b++) {
      const j = i | (1 << b);
      if (j !== i && (i & (1 << b)) === 0) edges.push([i, j]);
    }
  }
  return edges;
}

/* rotate a point's two given axes by angle */
function rot(v: number[], a: number, b: number, ang: number): void {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const va = v[a];
  const vb = v[b];
  v[a] = va * c - vb * s;
  v[b] = va * s + vb * c;
}

/* project n-D point down to 2D via successive perspective divides */
function projectND(v: number[], n: number, persp: number): [number, number] {
  const p = v.slice();
  // collapse from highest dim down to 2: each higher axis foreshortens lower ones
  for (let dim = n; dim > 2; dim--) {
    const w = p[dim - 1];
    const f = persp / (persp - w);
    for (let k = 0; k < dim - 1; k++) p[k] *= f;
  }
  return [p[0], p[1]];
}

/* precompute geometry per dimension (cached) */
type Geo = { verts: number[][]; edges: [number, number][]; n: number; sub: boolean };
const geoCache = new Map<number, Geo>();
function geometryFor(d: number): Geo {
  if (geoCache.has(d)) return geoCache.get(d)!;
  // map dimension d to an n-cube of n axes (cap at 7 for perf; subsample beyond 6)
  let n = d;
  if (d <= 1) n = 1;
  const cap = Math.min(n, 7);
  let edges = cubeEdges(cap);
  let sub = false;
  if (cap >= 7 && edges.length > 360) {
    // subsample edges for the densest figures
    edges = edges.filter((_, i) => i % 2 === 0);
    sub = true;
  }
  const geo: Geo = { verts: cubeVertices(cap), edges, n: cap, sub };
  geoCache.set(d, geo);
  return geo;
}

export default function DimensionLadder() {
  const { lang } = useLang();
  const [sel, setSel] = useState(3); // start at 3D — "the room we call real"
  const pausedUntil = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);

  // mutable render-state shared with the rAF loop
  const stateRef = useRef({
    sel: 3,
    morph: 1, // 0..1 transition progress into current `sel`
    prevSel: 3,
    t: 0,
  });

  const markInteract = useCallback(() => {
    pausedUntil.current = Date.now() + PAUSE_MS;
  }, []);

  const choose = useCallback(
    (i: number) => {
      markInteract();
      setSel(i);
    },
    [markInteract]
  );

  /* auto-advance */
  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil.current) return;
      setSel((s) => (s + 1) % DIMENSIONS.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, []);

  /* keep render-state in sync + trigger morph on selection change */
  useEffect(() => {
    const st = stateRef.current;
    if (st.sel !== sel) {
      st.prevSel = st.sel;
      st.sel = sel;
      st.morph = 0;
    }
  }, [sel]);

  /* the canvas animation loop */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.floor(rect.width));
      H = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = stateRef.current;
      st.t += dt;
      if (st.morph < 1) st.morph = Math.min(1, st.morph + dt * 2.4);

      ctx.clearRect(0, 0, W, H);

      const dim = DIMENSIONS[st.sel];
      const rgb = hexToRgb(dim.color);
      const cx = W / 2;
      const cy = H / 2;
      const R = Math.min(W, H) * 0.34;
      const t = st.t;
      // morph easing: scale-in + fade
      const m = st.morph;
      const ease = m * m * (3 - 2 * m);
      const figAlpha = 0.25 + 0.75 * ease;
      const figScale = 0.82 + 0.18 * ease;

      // ambient backdrop glow centered, tinted to dim color
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.62);
      bg.addColorStop(0, rgba(rgb, 0.1));
      bg.addColorStop(0.45, rgba(rgb, 0.03));
      bg.addColorStop(1, "rgba(2,2,7,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.globalAlpha = figAlpha;
      ctx.translate(cx, cy);
      ctx.scale(figScale, figScale);

      drawFigure(ctx, st.sel, t, R, rgb);

      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  const dim = DIMENSIONS[sel];
  const accent = dim.color;
  const whisperLines = dim.whisper[lang].split("\n");

  const labelScience: Bi = { en: "Science", zh: "科学" };
  const labelPhil: Bi = { en: "Philosophy", zh: "哲学" };
  const labelMind: Bi = { en: "Mind", zh: "心智" };

  return (
    <div className="w-full">
      {/* spectral selector */}
      <div className="relative mb-7">
        {/* progress line behind chips */}
        <div className="rule-ion pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 opacity-50 sm:block" />
        <div className="relative flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {DIMENSIONS.map((dd, i) => {
            const active = i === sel;
            return (
              <button
                key={dd.d}
                onClick={() => choose(i)}
                onMouseEnter={markInteract}
                aria-pressed={active}
                aria-label={`${dd.tag} — ${dd.name[lang]}`}
                className="group relative grid h-11 w-11 place-items-center rounded-full font-mono text-[0.72rem] transition-all duration-300 sm:h-12 sm:w-12 sm:text-[0.78rem]"
                style={{
                  background: active
                    ? `radial-gradient(circle at 50% 35%, ${accentRgba(dd.color, 0.32)}, ${accentRgba(
                        dd.color,
                        0.08
                      )})`
                    : "rgba(8,8,22,0.6)",
                  border: `1px solid ${accentRgba(dd.color, active ? 0.85 : 0.28)}`,
                  color: active ? lightHex(dd.color) : "rgba(155,162,207,0.85)",
                  boxShadow: active
                    ? `0 0 0 4px ${accentRgba(dd.color, 0.12)}, 0 0 26px -4px ${accentRgba(dd.color, 0.85)}`
                    : "none",
                  transform: active ? "scale(1.16)" : "scale(1)",
                }}
              >
                <span
                  className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: `0 0 18px -3px ${accentRgba(dd.color, 0.7)}` }}
                />
                {dd.tag.replace("D", "")}
                <span className="pointer-events-none absolute -bottom-4 text-[0.5rem] tracking-[0.2em] text-ghost-500/70">
                  D
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* main: canvas + text panel */}
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-7">
        {/* canvas */}
        <div
          ref={wrapRef}
          className="relative h-[46vh] min-h-[340px] overflow-hidden rounded-2xl border bg-void-950/70 sm:h-[52vh] lg:h-[58vh]"
          style={{
            borderColor: accentRgba(accent, 0.3),
            boxShadow: `inset 0 0 90px -30px ${accentRgba(accent, 0.4)}`,
          }}
        >
          <div className="grid-bg-fine pointer-events-none absolute inset-0 opacity-40" />
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
          {/* floating dimension tag on the canvas */}
          <div className="pointer-events-none absolute left-4 top-4">
            <div className="label-mono" style={{ color: lightHex(accent) }}>
              {dim.tag}
            </div>
            <div
              key={`${sel}-${lang}`}
              className="display lang-fade mt-0.5 text-2xl leading-none sm:text-3xl"
              style={{ color: lightHex(accent), textShadow: `0 0 32px ${accentRgba(accent, 0.7)}` }}
            >
              <T v={dim.name} />
            </div>
          </div>
        </div>

        {/* text panel */}
        <div
          key={sel}
          className="holo rise-in flex flex-col rounded-2xl p-6 sm:p-7"
          style={{ borderColor: accentRgba(accent, 0.22) }}
        >
          <div className="flex items-baseline gap-3">
            <span
              className="display text-5xl leading-none sm:text-6xl"
              style={{ color: lightHex(accent), textShadow: `0 0 36px ${accentRgba(accent, 0.6)}` }}
            >
              {dim.tag}
            </span>
            <span
              className="display text-2xl leading-none sm:text-3xl"
              style={{ color: lightHex(accent) }}
            >
              <T v={dim.name} />
            </span>
          </div>

          {/* whisper — two poetic lines */}
          <div className="spectral-text mt-4 font-display text-lg italic leading-snug sm:text-xl">
            {whisperLines.map((line, i) => (
              <p key={i} className={lang === "zh" ? "zh not-italic" : ""}>
                {line}
              </p>
            ))}
          </div>

          <div
            className="my-5 h-px w-full"
            style={{
              background: `linear-gradient(90deg, ${accentRgba(accent, 0.6)}, transparent)`,
            }}
          />

          {/* three labeled blocks */}
          <div className="flex flex-col gap-4 text-[0.92rem] leading-relaxed text-ghost-200">
            <Block label={labelScience} body={dim.science} accent={accent} />
            <Block label={labelPhil} body={dim.philosophy} accent={accent} />
            <Block label={labelMind} body={dim.mind} accent={accent} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- a labeled text block in the panel ---- */
function Block({ label, body, accent }: { label: Bi; body: Bi; accent: string }) {
  return (
    <div className="border-l pl-3.5" style={{ borderColor: accentRgba(accent, 0.45) }}>
      <div className="label-mono mb-1" style={{ color: lightHex(accent) }}>
        <T v={label} />
      </div>
      <p>
        <T v={body} />
      </p>
    </div>
  );
}

/* ---- string helpers usable in JSX (don't recompute rgb each call heavily) ---- */
function accentRgba(hex: string, a: number): string {
  return rgba(hexToRgb(hex), a);
}
function lightHex(hex: string): string {
  const l = lighten(hexToRgb(hex), 0.3);
  return `rgb(${Math.round(l[0])},${Math.round(l[1])},${Math.round(l[2])})`;
}

/* ============================================================
   FIGURE RENDERERS — drawn in canvas-local coords centered at 0,0
   ============================================================ */
function drawFigure(
  ctx: CanvasRenderingContext2D,
  d: number,
  t: number,
  R: number,
  rgb: [number, number, number]
): void {
  switch (d) {
    case 0:
      drawPoint(ctx, t, R, rgb);
      return;
    case 1:
      drawLine(ctx, t, R, rgb);
      return;
    case 2:
      drawPlane(ctx, t, R, rgb);
      return;
    case 5:
      drawBranching(ctx, t, R, rgb);
      return;
    case 9:
      drawFolded(ctx, t, R, rgb);
      return;
    case 10:
      drawStrings(ctx, t, R, rgb);
      return;
    case 11:
      drawBranes(ctx, t, R, rgb);
      return;
    default:
      // 3,4,6,7,8 — generic rotating n-cube projection
      drawNCube(ctx, d, t, R, rgb);
      return;
  }
}

/* 0D — a single breathing singularity */
function drawPoint(ctx: CanvasRenderingContext2D, t: number, R: number, rgb: [number, number, number]) {
  const breath = 1 + 0.12 * Math.sin(t * 1.4);
  const core = R * 0.06 * breath;
  for (let i = 6; i >= 1; i--) {
    const rr = core * (1 + i * 1.7);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rr);
    g.addColorStop(0, rgba(lighten(rgb, 0.5), 0.18 / i));
    g.addColorStop(1, rgba(rgb, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = rgba(lighten(rgb, 0.7), 0.95);
  ctx.beginPath();
  ctx.arc(0, 0, core, 0, Math.PI * 2);
  ctx.fill();
}

/* 1D — a line drawn out, with a point sliding along it */
function drawLine(ctx: CanvasRenderingContext2D, t: number, R: number, rgb: [number, number, number]) {
  const half = R * 1.05;
  const grow = 0.5 + 0.5 * Math.min(1, (Math.sin(t * 0.5) + 1) / 2 + 0.3);
  const ext = half * grow;
  const grad = ctx.createLinearGradient(-ext, 0, ext, 0);
  grad.addColorStop(0, rgba(rgb, 0));
  grad.addColorStop(0.5, rgba(lighten(rgb, 0.4), 0.95));
  grad.addColorStop(1, rgba(rgb, 0));
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5;
  ctx.shadowColor = rgba(rgb, 0.8);
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(-ext, 0);
  ctx.lineTo(ext, 0);
  ctx.stroke();
  // sliding point
  const px = ext * Math.sin(t * 1.1);
  ctx.shadowBlur = 26;
  ctx.fillStyle = rgba(lighten(rgb, 0.7), 1);
  ctx.beginPath();
  ctx.arc(px, 0, R * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

/* 2D — a tilting/rotating plane grid */
function drawPlane(ctx: CanvasRenderingContext2D, t: number, R: number, rgb: [number, number, number]) {
  const ang = t * 0.4;
  const tilt = 0.45 + 0.25 * Math.sin(t * 0.6); // perspective squash on Y
  const half = R * 1.05;
  const N = 8;
  ctx.save();
  ctx.rotate(ang * 0.25);
  ctx.lineWidth = 1;
  for (let i = 0; i <= N; i++) {
    const f = (i / N) * 2 - 1; // -1..1
    const a = 0.18 + 0.5 * (1 - Math.abs(f));
    ctx.strokeStyle = rgba(lighten(rgb, 0.3), a);
    // horizontal lines (squashed in Y)
    ctx.beginPath();
    ctx.moveTo(-half, f * half * tilt);
    ctx.lineTo(half, f * half * tilt);
    ctx.stroke();
    // vertical lines
    ctx.beginPath();
    ctx.moveTo(f * half, -half * tilt);
    ctx.lineTo(f * half, half * tilt);
    ctx.stroke();
  }
  // bright outer square
  ctx.strokeStyle = rgba(lighten(rgb, 0.5), 0.9);
  ctx.lineWidth = 2;
  ctx.shadowColor = rgba(rgb, 0.7);
  ctx.shadowBlur = 16;
  ctx.strokeRect(-half, -half * tilt, half * 2, half * tilt * 2);
  ctx.restore();
}

/* generic n-cube (3D..8D) projected to 2D, rotating through several planes */
function drawNCube(
  ctx: CanvasRenderingContext2D,
  d: number,
  t: number,
  R: number,
  rgb: [number, number, number]
) {
  const geo = geometryFor(d);
  const n = geo.n;
  const scale = R * 0.78;
  const persp = 3.4;

  // rotate each vertex
  const pts: [number, number][] = new Array(geo.verts.length);
  for (let vi = 0; vi < geo.verts.length; vi++) {
    const v = geo.verts[vi].slice();
    // base 3D-ish rotation
    rot(v, 0, 2 >= n ? 1 : 2, t * 0.45);
    rot(v, 1, n > 2 ? 2 : 0, t * 0.32);
    // higher-plane rotations involving the extra axes (the "impossible" turns)
    if (n >= 4) rot(v, 0, 3, t * 0.5);
    if (n >= 4) rot(v, 1, 3, t * 0.27);
    if (n >= 5) rot(v, 2, 4, t * 0.6);
    if (n >= 6) rot(v, 0, 5, t * 0.4);
    if (n >= 7) rot(v, 3, 6, t * 0.34);
    const [x, y] = projectND(v, n, persp);
    pts[vi] = [x * scale, y * scale];
  }

  // edge opacity scales down with dimension density
  const edgeBase = n <= 3 ? 0.85 : n === 4 ? 0.55 : n === 5 ? 0.34 : n === 6 ? 0.2 : 0.13;
  const lw = n <= 3 ? 1.8 : n <= 5 ? 1.2 : 0.8;

  ctx.lineWidth = lw;
  ctx.shadowColor = rgba(rgb, 0.5);
  ctx.shadowBlur = n <= 4 ? 14 : 6;
  const eRgb = lighten(rgb, 0.25);
  for (let i = 0; i < geo.edges.length; i++) {
    const [a, b] = geo.edges[i];
    const pa = pts[a];
    const pb = pts[b];
    // slight depth shimmer
    const a01 = edgeBase * (0.7 + 0.3 * Math.sin(t * 1.5 + i * 0.4));
    ctx.strokeStyle = rgba(eRgb, a01);
    ctx.beginPath();
    ctx.moveTo(pa[0], pa[1]);
    ctx.lineTo(pb[0], pb[1]);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  // vertices as faint glow dots (only for lower dims to avoid clutter)
  if (n <= 5) {
    ctx.fillStyle = rgba(lighten(rgb, 0.6), n <= 3 ? 0.95 : 0.5);
    const vr = n <= 3 ? R * 0.018 : R * 0.01;
    for (let vi = 0; vi < pts.length; vi++) {
      ctx.beginPath();
      ctx.arc(pts[vi][0], pts[vi][1], vr, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* 5D — branching tree of timelines splitting (clearer than penteract here) */
function drawBranching(
  ctx: CanvasRenderingContext2D,
  t: number,
  R: number,
  rgb: [number, number, number]
) {
  ctx.save();
  ctx.rotate(Math.sin(t * 0.15) * 0.15);
  const root = R * 1.05;
  const baseLight = lighten(rgb, 0.35);

  const branch = (
    x: number,
    y: number,
    ang: number,
    len: number,
    depth: number
  ) => {
    if (depth > 5 || len < 6) return;
    const wob = Math.sin(t * 0.8 + depth + x * 0.01) * 0.18;
    const a2 = ang + wob;
    const x2 = x + Math.cos(a2) * len;
    const y2 = y + Math.sin(a2) * len;
    const alpha = 0.18 + 0.7 * (1 - depth / 6);
    ctx.strokeStyle = rgba(baseLight, alpha);
    ctx.lineWidth = Math.max(0.6, 3 - depth * 0.5);
    ctx.shadowColor = rgba(rgb, 0.5);
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    // node glow at branch point
    ctx.fillStyle = rgba(lighten(rgb, 0.6), alpha * 0.9);
    ctx.beginPath();
    ctx.arc(x2, y2, Math.max(1, 3 - depth * 0.4), 0, Math.PI * 2);
    ctx.fill();
    const spread = 0.5 - depth * 0.03;
    branch(x2, y2, a2 - spread, len * 0.72, depth + 1);
    branch(x2, y2, a2 + spread, len * 0.72, depth + 1);
  };
  ctx.shadowBlur = 8;
  // grow upward (negative y) from bottom
  branch(0, root * 0.7, -Math.PI / 2, root * 0.5, 0);
  ctx.shadowBlur = 0;
  ctx.restore();
}

/* 9D — compactified: curled strands looping around a central manifold */
function drawFolded(
  ctx: CanvasRenderingContext2D,
  t: number,
  R: number,
  rgb: [number, number, number]
) {
  // faint host manifold (a torus-ish ring)
  const ring = R * 0.62;
  ctx.lineWidth = 1.4;
  ctx.strokeStyle = rgba(lighten(rgb, 0.2), 0.22);
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.08) {
    const x = Math.cos(a) * ring;
    const y = Math.sin(a) * ring * 0.42;
    a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  // many tiny curled strands distributed on the ring (Calabi–Yau nod)
  const STRANDS = 16;
  ctx.shadowColor = rgba(rgb, 0.6);
  ctx.shadowBlur = 6;
  for (let s = 0; s < STRANDS; s++) {
    const base = (s / STRANDS) * Math.PI * 2;
    const bx = Math.cos(base) * ring;
    const by = Math.sin(base) * ring * 0.42;
    const curlR = R * 0.1;
    const turns = 3;
    const phase = t * 0.9 + s;
    ctx.strokeStyle = rgba(lighten(rgb, 0.45), 0.55);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 0; k <= 36; k++) {
      const u = (k / 36) * turns * Math.PI * 2;
      const rr = curlR * (0.3 + 0.7 * (k / 36));
      const x = bx + Math.cos(u + phase) * rr;
      const y = by + Math.sin(u + phase) * rr * 0.7;
      k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

/* 10D — vibrating strings in standing-wave modes */
function drawStrings(
  ctx: CanvasRenderingContext2D,
  t: number,
  R: number,
  rgb: [number, number, number]
) {
  const half = R * 1.05;
  const COUNT = 5;
  const gap = (R * 1.2) / (COUNT - 1);
  ctx.shadowColor = rgba(rgb, 0.7);
  for (let i = 0; i < COUNT; i++) {
    const y0 = (i - (COUNT - 1) / 2) * gap;
    const mode = i + 1; // harmonic
    const amp = R * 0.11 * (1 - i * 0.08);
    const light = lighten(rgb, 0.1 + i * 0.12);
    ctx.strokeStyle = rgba(light, 0.85);
    ctx.lineWidth = 1.8;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    for (let k = 0; k <= 80; k++) {
      const u = k / 80; // 0..1
      const x = -half + u * half * 2;
      const env = Math.sin(u * Math.PI); // pinned ends
      const y = y0 + env * amp * Math.sin(mode * u * Math.PI * 2 - t * (1.6 + i * 0.4));
      k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // endpoints
    ctx.fillStyle = rgba(lighten(rgb, 0.6), 0.9);
    ctx.beginPath();
    ctx.arc(-half, y0, R * 0.018, 0, Math.PI * 2);
    ctx.arc(half, y0, R * 0.018, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
}

/* 11D — translucent rippling membranes (branes), folding back toward a point */
function drawBranes(
  ctx: CanvasRenderingContext2D,
  t: number,
  R: number,
  rgb: [number, number, number]
) {
  const SHEETS = 3;
  const cols = 12;
  const w = R * 1.5;
  // fold factor: periodically the membranes collapse toward the center point (ladder→ring)
  const fold = (Math.sin(t * 0.35) + 1) / 2; // 0..1
  const shrink = 1 - 0.7 * Math.pow(fold, 2);

  for (let s = 0; s < SHEETS; s++) {
    const baseY = (s - (SHEETS - 1) / 2) * R * 0.42;
    const phase = t * 1.1 + s * 1.3;
    const light = lighten(rgb, 0.1 + s * 0.18);
    // build a ripple ribbon
    const top: [number, number][] = [];
    const bot: [number, number][] = [];
    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      const x = (-w / 2 + u * w) * shrink;
      const ripple =
        Math.sin(u * Math.PI * 2 + phase) * R * 0.1 +
        Math.sin(u * Math.PI * 4 - phase * 0.7) * R * 0.04;
      const yMid = (baseY + ripple) * shrink;
      const thick = R * 0.06 * (1 - fold * 0.6);
      top.push([x, yMid - thick]);
      bot.push([x, yMid + thick]);
    }
    // fill translucent sheet
    ctx.beginPath();
    top.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
    for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
    ctx.closePath();
    const grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    grad.addColorStop(0, rgba(light, 0.03));
    grad.addColorStop(0.5, rgba(light, 0.16));
    grad.addColorStop(1, rgba(light, 0.03));
    ctx.fillStyle = grad;
    ctx.fill();
    // bright top edge
    ctx.strokeStyle = rgba(lighten(rgb, 0.55), 0.55 * (1 - fold * 0.4));
    ctx.lineWidth = 1.4;
    ctx.shadowColor = rgba(rgb, 0.6);
    ctx.shadowBlur = 12;
    ctx.beginPath();
    top.forEach((p, i) => (i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1])));
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  // the point the ladder closes into — intensifies as it folds
  const core = R * 0.05 * (0.5 + fold);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, core * 6);
  g.addColorStop(0, rgba(lighten(rgb, 0.7), 0.5 * fold + 0.15));
  g.addColorStop(1, rgba(rgb, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, core * 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = rgba(lighten(rgb, 0.8), 0.5 + 0.5 * fold);
  ctx.beginPath();
  ctx.arc(0, 0, core, 0, Math.PI * 2);
  ctx.fill();
}
