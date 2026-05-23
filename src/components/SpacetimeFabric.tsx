"use client";

import { useEffect, useRef } from "react";
import { useLang, T } from "./lang";

type Well = { x: number; z: number; m: number; kind: "hole" | "worm" | "mouse" };

/**
 * The spacetime fabric. A 3D grid sags under mass: a black hole, a wormhole
 * pair, and a gravity well that follows the cursor. Particles orbit and fall in.
 */
export default function SpacetimeFabric() {
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

    // world is x in [-1,1], z in [-1,1]
    const wells: Well[] = [
      { x: -0.45, z: 0.1, m: 0.5, kind: "hole" },
      { x: 0.5, z: -0.3, m: 0.22, kind: "worm" },
      { x: 0.72, z: 0.45, m: 0.22, kind: "worm" },
      { x: 9, z: 9, m: 0.28, kind: "mouse" },
    ];
    const mouseWell = wells[3];

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseWell.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouseWell.z = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onLeave = () => { mouseWell.x = 9; mouseWell.z = 9; };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const depthAt = (x: number, z: number) => {
      let d = 0;
      for (const wl of wells) {
        const dist = Math.hypot(x - wl.x, z - wl.z) + 0.04;
        d += wl.m / dist;
      }
      return d;
    };

    // project world (x,z,depth) to screen
    const project = (x: number, z: number, depth: number) => {
      const sx = w / 2 + x * w * 0.42;
      const sy = h * 0.36 + z * h * 0.3 + depth * 42;
      return [sx, sy] as const;
    };

    // particles
    type P = { x: number; z: number; vx: number; vz: number; col: string; life: number };
    const parts: P[] = [];
    const spawn = () => {
      const a = Math.random() * Math.PI * 2;
      const r = 0.9;
      const hole = wells[0];
      parts.push({
        x: hole.x + Math.cos(a) * r, z: hole.z + Math.sin(a) * r,
        vx: -Math.sin(a) * 0.012, vz: Math.cos(a) * 0.012,
        col: ["#22e0ff", "#c84dff", "#ffb454", "#7b5cff"][(Math.random() * 4) | 0], life: 1,
      });
    };

    let raf = 0, t = 0;
    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // animate wormhole pulsing
      wells[1].m = 0.18 + Math.sin(t) * 0.05;
      wells[2].m = 0.18 + Math.cos(t) * 0.05;

      // grid
      const N = 46, M = 30;
      for (let i = 0; i <= M; i++) {
        ctx.beginPath();
        for (let j = 0; j <= N; j++) {
          const x = (j / N) * 2 - 1, z = (i / M) * 2 - 1;
          const [sx, sy] = project(x, z, depthAt(x, z));
          j === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = "rgba(123,92,255,0.18)"; ctx.lineWidth = 1; ctx.stroke();
      }
      for (let j = 0; j <= N; j += 1) {
        ctx.beginPath();
        for (let i = 0; i <= M; i++) {
          const x = (j / N) * 2 - 1, z = (i / M) * 2 - 1;
          const [sx, sy] = project(x, z, depthAt(x, z));
          i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = "rgba(34,224,255,0.07)"; ctx.lineWidth = 0.7; ctx.stroke();
      }

      // wormhole mouths
      [wells[1], wells[2]].forEach((wl) => {
        const [sx, sy] = project(wl.x, wl.z, depthAt(wl.x, wl.z));
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 34);
        g.addColorStop(0, "rgba(200,77,255,0.6)"); g.addColorStop(1, "rgba(200,77,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, sy, 34, 0, 7); ctx.fill();
      });

      // particles
      if (parts.length < 140 && Math.random() < 0.5) spawn();
      const hole = wells[0];
      for (let k = parts.length - 1; k >= 0; k--) {
        const p = parts[k];
        const dx = hole.x - p.x, dz = hole.z - p.z;
        const dist = Math.hypot(dx, dz) + 0.03;
        const f = (0.0009) / (dist * dist);
        p.vx += (dx / dist) * f; p.vz += (dz / dist) * f;
        p.x += p.vx; p.z += p.vz; p.life -= 0.002;
        if (dist < 0.08 || p.life <= 0) { parts.splice(k, 1); continue; }
        const [sx, sy] = project(p.x, p.z, depthAt(p.x, p.z));
        ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, 7);
        ctx.fillStyle = hexA(p.col, p.life * 0.9);
        ctx.shadowColor = p.col; ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0;
      }

      // black hole + accretion
      const [hx, hy] = project(hole.x, hole.z, depthAt(hole.x, hole.z));
      ctx.save();
      ctx.translate(hx, hy);
      for (let r = 0; r < 3; r++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, 30 + r * 9, (12 + r * 4), t * 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = hexA(["#ffb454", "#ff9a3c", "#c84dff"][r], 0.5 - r * 0.12);
        ctx.lineWidth = 2; ctx.shadowColor = "#ffb454"; ctx.shadowBlur = 16; ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.arc(0, 0, 16, 0, 7); ctx.fillStyle = "#020207"; ctx.fill();
      ctx.strokeStyle = "rgba(255,180,84,0.6)"; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.restore();

      // mouse well marker
      if (mouseWell.x < 8) {
        const [mx, my] = project(mouseWell.x, mouseWell.z, depthAt(mouseWell.x, mouseWell.z));
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 26);
        g.addColorStop(0, "rgba(34,224,255,0.5)"); g.addColorStop(1, "rgba(34,224,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, 26, 0, 7); ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ion-500/15">
      <canvas ref={ref} className="h-[62vh] min-h-[420px] w-full" />
      <div className="pointer-events-none absolute left-5 top-5 max-w-xs">
        <div className="label-mono">Curvature = gravity</div>
        <p className="mt-2 text-sm leading-relaxed text-ghost-300">
          <T v={{ en: "Move your cursor. Mass bends the fabric; the bend is what we feel as gravity. The black hole consumes; the wormhole pair folds two distances into one.", zh: "移动你的光标。质量弯折织物；那弯折，便是我们感受到的引力。黑洞吞噬一切；那一对虫洞，把两段距离，折成一段。" }} />
        </p>
      </div>
    </div>
  );
}

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
