"use client";

import { useEffect, useRef } from "react";

/* ---- palette (matches the DIMENSION design system) ---- */
const ION = "123, 92, 255";
const ION_300 = "192, 174, 255";
const CYAN = "34, 224, 255";
const PLASMA = "200, 77, 255";
const FLARE = "255, 180, 84";
const GHOST = "232, 234, 255";

type Star = {
  x: number; // 0..1 normalized
  y: number;
  r: number;
  base: number; // base brightness 0..1
  tw: number; // twinkle phase
  twSpeed: number;
  depth: number; // 0.2..1, parallax factor
};

type Particle = {
  x: number; // 0..1 normalized
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string; // "r,g,b"
  depth: number; // parallax
  phase: number;
};

/**
 * CosmosCanvas — the living cosmic backdrop behind the hero.
 * Darkness blooms into stars, a spacetime grid bends, and
 * hyperdimensional particles drift and quietly connect.
 */
export default function CosmosCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;
    const ctx: CanvasRenderingContext2D = ctx2d;
    const canvas: HTMLCanvasElement = canvasEl;

    let width = canvas.clientWidth || window.innerWidth;
    let height = canvas.clientHeight || window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // pointer (normalized -0.5..0.5), defaults to centre
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    let stars: Star[] = [];
    let particles: Particle[] = [];

    const PARTICLE_COLORS = [ION, ION_300, CYAN, PLASMA, FLARE];

    function seed() {
      // density scales gently with area, but capped so it stays calm
      const area = width * height;
      const starCount = Math.min(420, Math.max(160, Math.round(area / 2600)));
      const partCount = Math.min(64, Math.max(26, Math.round(area / 26000)));

      stars = new Array(starCount).fill(0).map(() => {
        const depth = 0.2 + Math.random() * 0.8;
        return {
          x: Math.random(),
          y: Math.random(),
          r: 0.3 + Math.random() * (1.4 * depth),
          base: 0.25 + Math.random() * 0.75,
          tw: Math.random() * Math.PI * 2,
          twSpeed: 0.4 + Math.random() * 1.4,
          depth,
        };
      });

      particles = new Array(partCount).fill(0).map(() => {
        const depth = 0.4 + Math.random() * 0.6;
        return {
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.00012,
          vy: (Math.random() - 0.5) * 0.00012,
          r: 1.1 + Math.random() * 2.2,
          color: PARTICLE_COLORS[(Math.random() * PARTICLE_COLORS.length) | 0],
          depth,
          phase: Math.random() * Math.PI * 2,
        };
      });
    }

    function resize() {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    resize();

    /* ---------- intro reveal ---------- */
    const start = performance.now();
    const REVEAL_MS = 2500;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    let raf = 0;
    let running = true;

    function drawGrid(reveal: number, time: number) {
      // a perspective plane receding to a horizon, gently waving
      const horizon = height * 0.62;
      const px = pointer.x; // -0.5..0.5
      const py = pointer.y;
      const rows = 16;
      const cols = 22;

      ctx.lineWidth = 1;

      // map a logical grid cell to screen space with perspective + wave
      const project = (u: number, v: number): [number, number] => {
        // v: 0 (horizon) .. 1 (foreground)
        const persp = Math.pow(v, 1.9); // compress toward horizon
        const yScreen = horizon + persp * (height - horizon);
        const spread = 0.5 + persp * 2.6;
        const cx = width * 0.5 + px * 60 * persp;
        const wave =
          Math.sin(u * 5 + time * 0.5 + v * 4) * 10 * persp +
          Math.sin(v * 7 - time * 0.7) * 7 * persp;
        const xScreen = cx + (u - 0.5) * width * spread + py * 24 * persp;
        return [xScreen, yScreen + wave];
      };

      // longitudinal lines
      for (let c = 0; c <= cols; c++) {
        const u = c / cols;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
          const v = r / rows;
          const [x, y] = project(u, v);
          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${ION}, ${0.05 * reveal})`;
        ctx.stroke();
      }

      // transverse lines (brighter toward foreground, tinted cyan)
      for (let r = 0; r <= rows; r++) {
        const v = r / rows;
        const fade = 0.02 + Math.pow(v, 2) * 0.07;
        ctx.beginPath();
        for (let c = 0; c <= cols; c++) {
          const u = c / cols;
          const [x, y] = project(u, v);
          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${CYAN}, ${fade * reveal})`;
        ctx.stroke();
      }
    }

    function drawStars(reveal: number, time: number) {
      for (const s of stars) {
        const par = (s.depth - 0.6) * 26;
        const sx = s.x * width - pointer.x * par;
        const sy = s.y * height - pointer.y * par;
        const tw = 0.55 + 0.45 * Math.sin(s.tw + time * s.twSpeed);
        const a = s.base * tw * reveal;
        if (a <= 0.01) continue;
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GHOST}, ${a})`;
        ctx.fill();
        // soft halo for the brighter stars
        if (s.r > 1.1) {
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ION_300}, ${a * 0.12})`;
          ctx.fill();
        }
      }
    }

    function drawParticles(reveal: number, time: number) {
      // update + draw connecting lines, then nodes
      const screen = particles.map((p) => {
        p.x += p.vx;
        p.y += p.vy;
        // wrap softly
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;
        const par = p.depth * 40;
        const drift = Math.sin(time * 0.4 + p.phase) * 4;
        return {
          x: p.x * width + pointer.x * par,
          y: p.y * height + pointer.y * par + drift,
          p,
        };
      });

      // constellation lines to nearby particles
      const linkDist = Math.min(width, height) * 0.16;
      ctx.lineWidth = 1;
      for (let i = 0; i < screen.length; i++) {
        for (let j = i + 1; j < screen.length; j++) {
          const dx = screen[i].x - screen[j].x;
          const dy = screen[i].y - screen[j].y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const a = (1 - d / linkDist) * 0.16 * reveal;
            ctx.beginPath();
            ctx.moveTo(screen[i].x, screen[i].y);
            ctx.lineTo(screen[j].x, screen[j].y);
            ctx.strokeStyle = `rgba(${screen[i].p.color}, ${a})`;
            ctx.stroke();
          }
        }
      }

      // glowing nodes
      for (const s of screen) {
        const p = s.p;
        const pulse = 0.7 + 0.3 * Math.sin(time * 0.9 + p.phase);
        const a = 0.85 * reveal * pulse;
        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(${p.color}, ${0.8 * reveal})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${a})`;
        ctx.fill();
        ctx.restore();
        // faint outer glow ring
        ctx.beginPath();
        ctx.arc(s.x, s.y, p.r * 3.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${0.05 * reveal})`;
        ctx.fill();
      }
    }

    function frame(now: number) {
      if (!running) return;
      const time = (now - start) / 1000;
      const reveal = ease(Math.min(1, (now - start) / REVEAL_MS));

      // ease pointer toward target for a calm feel
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // a subtle central bloom that fades up with the reveal
      const bloom = ctx.createRadialGradient(
        width * 0.5,
        height * 0.46,
        0,
        width * 0.5,
        height * 0.46,
        Math.max(width, height) * 0.7,
      );
      bloom.addColorStop(0, `rgba(${ION}, ${0.05 * reveal})`);
      bloom.addColorStop(0.5, `rgba(${PLASMA}, ${0.02 * reveal})`);
      bloom.addColorStop(1, "rgba(2, 2, 7, 0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, width, height);

      drawGrid(reveal, time);
      drawStars(reveal, time);
      drawParticles(reveal, time);

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    /* ---------- listeners ---------- */
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
      pointer.ty = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => resize());
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
