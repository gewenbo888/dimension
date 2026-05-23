"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./lang";
import { QUOTES } from "./content";

/**
 * The Consciousness Chamber. A lattice of nodes warps toward the cursor —
 * attention bending dimensional space — while quotes surface and dissolve.
 */
export default function ConsciousnessChamber() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { lang } = useLang();
  const [qi, setQi] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setQi((i) => (i + 1) % QUOTES.length), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    let raf = 0, t = 0;
    const tick = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);
      const gap = 34;
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;
      // breathing default focus if no mouse
      const fx = mouse.active ? mouse.x : w / 2 + Math.cos(t * 0.5) * w * 0.2;
      const fy = mouse.active ? mouse.y : h / 2 + Math.sin(t * 0.4) * h * 0.2;

      const pos: Array<Array<[number, number, number]>> = [];
      for (let r = 0; r < rows; r++) {
        pos[r] = [];
        for (let c = 0; c < cols; c++) {
          const bx = c * gap, by = r * gap;
          const dx = bx - fx, dy = by - fy;
          const dist = Math.hypot(dx, dy) + 1;
          const pull = Math.min(60, 5200 / dist);
          const ang = Math.atan2(dy, dx);
          const x = bx + Math.cos(ang) * pull + Math.sin(t + r * 0.3) * 2;
          const y = by + Math.sin(ang) * pull + Math.cos(t + c * 0.3) * 2;
          const intensity = Math.min(1, pull / 40);
          pos[r][c] = [x, y, intensity];
        }
      }
      // edges
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const [x, y, in0] = pos[r][c];
          if (c < cols - 1) line(ctx, pos[r][c], pos[r][c + 1]);
          if (r < rows - 1) line(ctx, pos[r][c], pos[r + 1][c]);
          ctx.beginPath();
          ctx.arc(x, y, 1 + in0 * 2.4, 0, 7);
          ctx.fillStyle = `rgba(${lerpC(in0)},${0.3 + in0 * 0.6})`;
          ctx.fill();
        }
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

  const quote = QUOTES[qi][lang].split("\n");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-ion-500/15">
      <canvas ref={ref} className="h-[64vh] min-h-[420px] w-full" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <blockquote key={qi} className="rise-in max-w-2xl text-center">
          {quote.map((l, i) => (
            <p key={i} className={`${lang === "zh" ? "zh text-2xl md:text-4xl" : "display text-3xl md:text-5xl"} leading-tight text-ghost-50`} style={{ textShadow: "0 0 30px rgba(123,92,255,0.5)" }}>
              {l}
            </p>
          ))}
        </blockquote>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {QUOTES.map((_, i) => (
          <span key={i} className={`h-1 w-5 rounded-full transition ${i === qi ? "bg-cyan-400" : "bg-ghost-700/50"}`} />
        ))}
      </div>
    </div>
  );
}

function line(ctx: CanvasRenderingContext2D, a: [number, number, number], b: [number, number, number]) {
  const inten = (a[2] + b[2]) / 2;
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
  ctx.strokeStyle = `rgba(${lerpC(inten)},${0.05 + inten * 0.35})`;
  ctx.lineWidth = 0.6 + inten * 0.8;
  ctx.stroke();
}

// interpolate violet -> cyan with intensity
function lerpC(i: number) {
  const r = Math.round(123 + (34 - 123) * i);
  const g = Math.round(92 + (224 - 92) * i);
  const b = Math.round(255 + (255 - 255) * i);
  return `${r},${g},${b}`;
}
