"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, T, type Bi } from "./lang";
import { EQUATIONS } from "./content";

const CONTROL: Record<string, { label: Bi; min: number; max: number; step: number; init: number }> = {
  quartic: { label: { en: "coefficient of x²", zh: "x² 的系数" }, min: -8, max: 2, step: 0.1, init: -4 },
  hypersphere: { label: { en: "slice w", zh: "切片 w" }, min: -1, max: 1, step: 0.01, init: 0 },
  einstein: { label: { en: "mass", zh: "质量" }, min: 0.1, max: 1.4, step: 0.01, init: 0.7 },
  hausdorff: { label: { en: "iterations", zh: "迭代次数" }, min: 0, max: 5, step: 1, init: 4 },
  hilbert: { label: { en: "coherence", zh: "相干度" }, min: 0, max: 1, step: 0.01, init: 0.7 },
};

export default function EquationGallery() {
  const { lang } = useLang();
  const [id, setId] = useState(EQUATIONS[0].id);
  const [param, setParam] = useState(CONTROL[EQUATIONS[0].id].init);
  const idRef = useRef(id);
  const pRef = useRef(param);
  idRef.current = id;
  pRef.current = param;
  const ref = useRef<HTMLCanvasElement>(null);

  const selected = EQUATIONS.find((e) => e.id === id)!;
  const ctl = CONTROL[id];

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0, t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const cur = idRef.current;
      const p = pRef.current;
      if (cur === "quartic") drawQuartic(ctx, w, h, p);
      else if (cur === "hypersphere") drawHypersphere(ctx, w, h, p, t);
      else if (cur === "einstein") drawEinstein(ctx, w, h, p, t);
      else if (cur === "hausdorff") drawKoch(ctx, w, h, Math.round(p));
      else if (cur === "hilbert") drawHilbert(ctx, w, h, p, t);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      {/* equation list */}
      <div className="space-y-2.5">
        {EQUATIONS.map((e) => (
          <button
            key={e.id}
            onClick={() => { setId(e.id); setParam(CONTROL[e.id].init); }}
            className={`block w-full rounded-xl border px-5 py-3.5 text-left transition ${
              e.id === id ? "holo border-ion-500/45" : "border-ghost-700/30 hover:border-ion-500/30"
            }`}
          >
            <div className="mono text-base text-cyan-300">{e.expr}</div>
            <div className={`mt-1 text-sm text-ghost-100 ${lang === "zh" ? "zh" : "display"}`}><T v={e.name} /></div>
          </button>
        ))}
      </div>

      {/* canvas + meaning */}
      <div className="holo overflow-hidden rounded-2xl">
        <canvas ref={ref} className="h-[42vh] min-h-[300px] w-full" />
        <div className="border-t border-ion-500/12 px-5 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="label-mono"><T v={ctl.label} /></span>
            <input
              type="range" min={ctl.min} max={ctl.max} step={ctl.step} value={param}
              onChange={(e) => setParam(+e.target.value)}
              className="flex-1 accent-cyan-500"
            />
            <span className="mono text-sm text-cyan-300">{param.toFixed(ctl.step < 1 ? 2 : 0)}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ghost-300"><T v={selected.meaning} /></p>
        </div>
      </div>
    </div>
  );
}

/* ---------- per-equation drawings ---------- */
function drawQuartic(ctx: CanvasRenderingContext2D, w: number, h: number, c: number) {
  const ox = w / 2, oy = h * 0.62, sx = w / 8, sy = h / 22;
  // axes
  ctx.strokeStyle = "rgba(157,131,255,0.16)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
  // curve f(x)=x^4 + c x^2 + 3
  ctx.beginPath();
  for (let px = 0; px <= w; px++) {
    const x = (px - ox) / sx;
    const y = x * x * x * x + c * x * x + 3;
    const py = oy - y * sy;
    px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = "#22e0ff"; ctx.lineWidth = 2.2;
  ctx.shadowColor = "#22e0ff"; ctx.shadowBlur = 14; ctx.stroke(); ctx.shadowBlur = 0;
  // mark minima x = ±sqrt(-c/2)
  if (c < 0) {
    const xm = Math.sqrt(-c / 2);
    [xm, -xm].forEach((x) => {
      const y = x * x * x * x + c * x * x + 3;
      ctx.beginPath(); ctx.arc(ox + x * sx, oy - y * sy, 4, 0, 7); ctx.fillStyle = "#ffb454"; ctx.fill();
    });
  }
}

function drawHypersphere(ctx: CanvasRenderingContext2D, w: number, h: number, wSlice: number, t: number) {
  const cx = w / 2, cy = h / 2;
  const r = Math.sqrt(Math.max(0, 1 - wSlice * wSlice));
  const R = Math.min(w, h) * 0.34 * r;
  // wireframe sphere
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI;
    const ry = R * Math.cos(a + t * 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, R, Math.abs(ry), 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(123,92,255,${0.14 + 0.3 * Math.abs(Math.sin(a + t * 0.2))})`;
    ctx.lineWidth = 1; ctx.stroke();
  }
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI;
    const rx = R * Math.cos(a + t * 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(rx), R, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(34,224,255,${0.1 + 0.25 * Math.abs(Math.sin(a + t * 0.2))})`;
    ctx.lineWidth = 1; ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(0, 0, Math.max(1, R), 0, 7);
  ctx.strokeStyle = "#c0aeff"; ctx.lineWidth = 1.6;
  ctx.shadowColor = "#7b5cff"; ctx.shadowBlur = 20; ctx.stroke(); ctx.shadowBlur = 0;
  ctx.restore();
  ctx.fillStyle = "rgba(232,234,255,0.5)"; ctx.font = "12px ui-monospace, monospace";
  ctx.fillText(`r(w) = √(1 − w²) = ${r.toFixed(3)}`, 16, h - 16);
}

function drawEinstein(ctx: CanvasRenderingContext2D, w: number, h: number, mass: number, t: number) {
  const cols = 22, rows = 14;
  const cx = w / 2, cy = h * 0.5;
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) {
      const x0 = (c / cols - 0.5) * w * 1.1;
      const y0 = (r / rows - 0.5) * h * 1.1;
      const d = Math.hypot(x0, y0) + 1;
      const dip = (mass * 9000) / (d + 60);
      const x = cx + x0;
      const y = cy + y0 * 0.55 + dip * 0.15;
      c === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "rgba(123,92,255,0.22)"; ctx.lineWidth = 1; ctx.stroke();
  }
  // central mass
  ctx.beginPath(); ctx.arc(cx, cy + 20, 8 + mass * 8, 0, 7);
  const g = ctx.createRadialGradient(cx, cy + 20, 0, cx, cy + 20, 30 + mass * 14);
  g.addColorStop(0, "#ffe3b6"); g.addColorStop(1, "rgba(255,154,60,0)");
  ctx.fillStyle = g; ctx.fill();
}

function drawKoch(ctx: CanvasRenderingContext2D, w: number, h: number, iter: number) {
  const D = Math.log(4) / Math.log(3);
  let pts: Array<[number, number]> = [];
  const s = Math.min(w, h) * 0.62;
  const cx = w / 2, cy = h * 0.62;
  const A: [number, number] = [cx - s / 2, cy];
  const B: [number, number] = [cx + s / 2, cy];
  const C: [number, number] = [cx, cy - (s * Math.sqrt(3)) / 2];
  pts = [A, B, C, A];
  for (let it = 0; it < iter; it++) {
    const next: Array<[number, number]> = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const dx = (x2 - x1) / 3, dy = (y2 - y1) / 3;
      const pa: [number, number] = [x1 + dx, y1 + dy];
      const pb: [number, number] = [x1 + 2 * dx, y1 + 2 * dy];
      const ang = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 3;
      const len = Math.hypot(dx, dy);
      const peak: [number, number] = [pa[0] + Math.cos(ang) * len, pa[1] + Math.sin(ang) * len];
      next.push([x1, y1], pa, peak, pb);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
  }
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.strokeStyle = "#5cebff"; ctx.lineWidth = 1.3;
  ctx.shadowColor = "#22e0ff"; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(232,234,255,0.55)"; ctx.font = "13px ui-monospace, monospace";
  ctx.fillText(`D = log 4 / log 3 ≈ ${D.toFixed(4)}`, 16, h - 16);
}

function drawHilbert(ctx: CanvasRenderingContext2D, w: number, h: number, coh: number, t: number) {
  const n = 12;
  const bw = (w * 0.8) / n;
  const x0 = w * 0.1;
  const baseY = h * 0.78;
  let sum = 0;
  const amps: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = Math.abs(Math.sin(t * (0.4 + i * 0.13) + i)) * (0.3 + coh * Math.exp(-i * 0.18 * (1 - coh)));
    amps.push(a); sum += a * a;
  }
  const norm = Math.sqrt(sum) || 1;
  for (let i = 0; i < n; i++) {
    const a = amps[i] / norm;
    const bh = a * h * 0.6;
    const x = x0 + i * bw;
    const col = i % 3 === 0 ? "#7b5cff" : i % 3 === 1 ? "#22e0ff" : "#c84dff";
    ctx.fillStyle = hexA(col, 0.75);
    ctx.shadowColor = col; ctx.shadowBlur = 10;
    ctx.fillRect(x, baseY - bh, bw * 0.74, bh);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(232,234,255,0.4)"; ctx.font = "10px ui-monospace, monospace";
    ctx.fillText(`|${i}⟩`, x, baseY + 14);
  }
  ctx.fillStyle = "rgba(232,234,255,0.55)"; ctx.font = "13px ui-monospace, monospace";
  ctx.fillText("|ψ⟩ = Σ cₙ|n⟩", 16, 26);
}

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
