"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, T } from "./lang";

/**
 * A Calabi–Yau manifold cross-section (Hanson's parametrization) — the shape
 * into which string theory folds its six hidden dimensions. Rotates in 3D;
 * a slider tilts the projection angle between the two imaginary axes.
 */
export default function CalabiYau() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [n, setN] = useState(5);
  const [alpha, setAlpha] = useState(0.4);
  const nRef = useRef(n);
  const aRef = useRef(alpha);
  nRef.current = n;
  aRef.current = alpha;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const SPECTRUM = ["#7b5cff", "#5c7cff", "#22e0ff", "#2fe0b0", "#f5c542", "#ff9a3c", "#c84dff"];

    // complex helpers
    const cpow = (re: number, im: number, p: number): [number, number] => {
      const r = Math.pow(Math.hypot(re, im), p);
      const t = Math.atan2(im, re) * p;
      return [r * Math.cos(t), r * Math.sin(t)];
    };
    // z = cos(a+ib) and sin(a+ib)
    const ccos = (a: number, b: number): [number, number] => [Math.cos(a) * Math.cosh(b), -Math.sin(a) * Math.sinh(b)];
    const csin = (a: number, b: number): [number, number] => [Math.sin(a) * Math.cosh(b), Math.cos(a) * Math.sinh(b)];

    let raf = 0;
    let t = 0;
    const STEPS_A = 14;
    const STEPS_B = 9;

    const tick = () => {
      t += 0.005;
      const N = nRef.current;
      const al = aRef.current;
      ctx.clearRect(0, 0, w, h);

      const scale = Math.min(w, h) * 0.3;
      const ox = w / 2;
      const oy = h / 2;

      // rotation
      const rx = t * 0.6;
      const ry = t * 0.9;
      const cosx = Math.cos(rx), sinx = Math.sin(rx);
      const cosy = Math.cos(ry), siny = Math.sin(ry);

      const project = (x0: number, y0: number, z0: number) => {
        // rotate Y then X
        let x = x0 * cosy - z0 * siny;
        let z = x0 * siny + z0 * cosy;
        let y = y0 * cosx - z * sinx;
        z = y0 * sinx + z * cosx;
        const persp = 3 / (3 - z);
        return [ox + x * scale * persp, oy + y * scale * persp, z] as const;
      };

      for (let k1 = 0; k1 < N; k1++) {
        for (let k2 = 0; k2 < N; k2++) {
          const col = SPECTRUM[(k1 + k2) % SPECTRUM.length];
          // build a patch mesh
          for (let ia = 0; ia < STEPS_A; ia++) {
            for (let ib = 0; ib < STEPS_B; ib++) {
              const verts: Array<readonly [number, number, number]> = [];
              const corners = [
                [ia, ib], [ia + 1, ib], [ia + 1, ib + 1], [ia, ib + 1],
              ];
              let ok = true;
              for (const [ca, cb] of corners) {
                const a = (ca / STEPS_A) * (Math.PI / 2);
                const b = -1 + (cb / STEPS_B) * 2; // b in [-1,1]
                const [cr, ci] = ccos(a, b);
                const [sr, si] = csin(a, b);
                const [z1r, z1i] = cpow(cr, ci, 2 / N);
                const [z2r, z2i] = cpow(sr, si, 2 / N);
                const ph1 = (2 * Math.PI * k1) / N;
                const ph2 = (2 * Math.PI * k2) / N;
                // multiply by e^{i ph}
                const Z1r = z1r * Math.cos(ph1) - z1i * Math.sin(ph1);
                const Z1i = z1r * Math.sin(ph1) + z1i * Math.cos(ph1);
                const Z2r = z2r * Math.cos(ph2) - z2i * Math.sin(ph2);
                const Z2i = z2r * Math.sin(ph2) + z2i * Math.cos(ph2);
                const x = Z1r;
                const y = Z2r;
                const z = Math.cos(al) * Z1i + Math.sin(al) * Z2i;
                if (!isFinite(x) || !isFinite(y) || !isFinite(z)) { ok = false; break; }
                verts.push([x, y, z]);
              }
              if (!ok) continue;
              const p = verts.map((v) => project(v[0], v[1], v[2]));
              const depth = (p[0][2] + p[1][2] + p[2][2] + p[3][2]) / 4;
              const opacity = 0.18 + Math.max(0, (depth + 1) / 2) * 0.5;
              ctx.beginPath();
              ctx.moveTo(p[0][0], p[0][1]);
              ctx.lineTo(p[1][0], p[1][1]);
              ctx.lineTo(p[2][0], p[2][1]);
              ctx.lineTo(p[3][0], p[3][1]);
              ctx.closePath();
              ctx.strokeStyle = hexA(col, opacity * 0.55);
              ctx.lineWidth = 0.7;
              ctx.fillStyle = hexA(col, opacity * 0.07);
              ctx.fill();
              ctx.stroke();
            }
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="holo overflow-hidden rounded-2xl">
      <canvas ref={ref} className="h-[54vh] min-h-[360px] w-full" />
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ion-500/12 px-5 py-4">
        <Control label={{ en: "Degree n", zh: "次数 n" }}>
          <input type="range" min={3} max={7} step={1} value={n} onChange={(e) => setN(+e.target.value)} className="accent-cyan-500" />
          <span className="mono ml-2 text-cyan-300">{n}</span>
        </Control>
        <Control label={{ en: "Projection α", zh: "投影角 α" }}>
          <input type="range" min={0} max={1.57} step={0.01} value={alpha} onChange={(e) => setAlpha(+e.target.value)} className="accent-plasma-500" />
        </Control>
        <p className="mono text-[0.62rem] text-ghost-500">
          <T v={{ en: "z₁ⁿ + z₂ⁿ = 1 — six folded dimensions, made visible.", zh: "z₁ⁿ + z₂ⁿ = 1 —— 蜷折的六维，得以显形。" }} />
        </p>
      </div>
    </div>
  );
}

function Control({ label, children }: { label: { en: string; zh: string }; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2">
      <span className="label-mono"><T v={label} /></span>
      {children}
    </label>
  );
}

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
