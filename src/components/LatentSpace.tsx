"use client";

import { useEffect, useRef } from "react";
import { useLang, T } from "./lang";

/**
 * Latent space — a rotating projection of a high-dimensional concept cloud.
 * Meaning becomes direction and distance. The analogy king − man + woman ≈ queen
 * is built into 6D and survives any linear projection, so the arrows stay parallel.
 */
export default function LatentSpace() {
  const ref = useRef<HTMLCanvasElement>(null);

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

    const DIMS = 6;
    type Pt = { v: number[]; label?: string; col: string; key?: string };

    // analogy anchors: dim0 = gender, dim1 = royalty
    const anchor = (g: number, r: number, key: string, label: string): Pt => ({
      v: [g, r, 0.1, -0.1, 0.05, 0], label, key, col: "#ffb454",
    });
    const pts: Pt[] = [
      anchor(0, 0, "man", "man"),
      anchor(1, 0, "woman", "woman"),
      anchor(0, 1, "king", "king"),
      anchor(1, 1, "queen", "queen"),
    ];
    // clusters for galaxy texture
    const clusterCenters = [
      { c: [-1.4, -1.2, 1, 0.5, -0.8, 0.3], col: "#22e0ff" },
      { c: [1.3, -1.3, -0.7, 1, 0.6, -0.4], col: "#c84dff" },
      { c: [0.2, 1.6, 0.8, -1, 0.9, 0.7], col: "#7b5cff" },
    ];
    for (const cl of clusterCenters) {
      for (let i = 0; i < 22; i++) {
        pts.push({ v: cl.c.map((x) => x + (Math.random() - 0.5) * 1.1), col: cl.col });
      }
    }

    let raf = 0, t = 0;
    const tick = () => {
      t += 0.004;
      ctx.clearRect(0, 0, w, h);
      // rotating projection basis (2 x DIMS)
      const b1 = Array.from({ length: DIMS }, (_, i) => Math.cos(t * (0.6 + i * 0.18) + i));
      const b2 = Array.from({ length: DIMS }, (_, i) => Math.sin(t * (0.5 + i * 0.21) + i * 1.3));
      const scale = Math.min(w, h) * 0.17;
      const ox = w / 2, oy = h / 2;
      const proj = (v: number[]) => {
        let a = 0, b = 0;
        for (let i = 0; i < DIMS; i++) { a += v[i] * b1[i]; b += v[i] * b2[i]; }
        return [ox + a * scale, oy + b * scale] as const;
      };

      const screen = pts.map((p) => proj(p.v));

      // faint links between near points
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = screen[i][0] - screen[j][0], dy = screen[i][1] - screen[j][1];
          const d = Math.hypot(dx, dy);
          if (d < 70) {
            ctx.beginPath(); ctx.moveTo(screen[i][0], screen[i][1]); ctx.lineTo(screen[j][0], screen[j][1]);
            ctx.strokeStyle = `rgba(157,131,255,${0.12 * (1 - d / 70)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      // points
      pts.forEach((p, i) => {
        const [x, y] = screen[i];
        ctx.beginPath(); ctx.arc(x, y, p.label ? 4 : 2, 0, 7);
        ctx.fillStyle = p.col; ctx.shadowColor = p.col; ctx.shadowBlur = p.label ? 12 : 5;
        ctx.fill(); ctx.shadowBlur = 0;
        if (p.label) {
          ctx.fillStyle = "rgba(255,227,182,0.92)"; ctx.font = "600 13px ui-serif, Georgia, serif";
          ctx.fillText(p.label, x + 8, y - 6);
        }
      });
      // analogy arrows: man→king and woman→queen (parallel), man→woman and king→queen
      const idx = (k: string) => pts.findIndex((p) => p.key === k);
      const arrow = (aK: string, bK: string, col: string) => {
        const [ax, ay] = screen[idx(aK)], [bx, by] = screen[idx(bK)];
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
        const ang = Math.atan2(by - ay, bx - ax);
        ctx.beginPath(); ctx.moveTo(bx, by);
        ctx.lineTo(bx - Math.cos(ang - 0.4) * 7, by - Math.sin(ang - 0.4) * 7);
        ctx.lineTo(bx - Math.cos(ang + 0.4) * 7, by - Math.sin(ang + 0.4) * 7);
        ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      };
      arrow("man", "king", "#22e0ff");
      arrow("woman", "queen", "#22e0ff");
      arrow("man", "woman", "#c84dff");
      arrow("king", "queen", "#c84dff");

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ion-500/15">
      <canvas ref={ref} className="h-[58vh] min-h-[400px] w-full" />
      <div className="pointer-events-none absolute right-5 top-5 max-w-[16rem] text-right">
        <div className="label-mono">latent space · 6D → 2D</div>
        <p className="mt-2 text-sm leading-relaxed text-ghost-300">
          <T v={{ en: "Concepts become points; meaning becomes direction. king − man + woman ≈ queen — the arrows stay parallel under any projection.", zh: "概念化作点；意义化作方向。国王 − 男人 + 女人 ≈ 女王 —— 无论如何投影，那些箭头，始终平行。" }} />
        </p>
      </div>
    </div>
  );
}
