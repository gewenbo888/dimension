"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./lang";
import { EDGE_LINES, FINAL_LINE } from "./content";

/**
 * The Edge of Dimensions. Scroll-driven: geometry fractures, the questions
 * glitch in, reality collapses to white light, then the final line emerges.
 */
export default function EdgeCollapse() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prog, setProg] = useState(0);
  const progRef = useRef(0);

  // scroll progress through the tall section
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / (total || 1)));
      progRef.current = p;
      setProg(p);
    };
    const loop = () => { onScroll(); raf = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  // fracturing canvas
  useEffect(() => {
    const canvas = canvasRef.current;
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

    // tesseract vertices (4D)
    const verts4: number[][] = [];
    for (let i = 0; i < 16; i++) {
      verts4.push([(i & 1) ? 1 : -1, (i & 2) ? 1 : -1, (i & 4) ? 1 : -1, (i & 8) ? 1 : -1]);
    }
    const edges: [number, number][] = [];
    for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) {
      let diff = 0; for (let k = 0; k < 4; k++) if (verts4[i][k] !== verts4[j][k]) diff++;
      if (diff === 1) edges.push([i, j]);
    }

    let raf = 0, t = 0;
    const tick = () => {
      t += 0.016;
      const p = progRef.current;
      ctx.clearRect(0, 0, w, h);
      const fade = 1 - Math.min(1, Math.max(0, (p - 0.6) / 0.25)); // canvas fades as white takes over
      if (fade <= 0.01) { raf = requestAnimationFrame(tick); return; }

      const jitter = p * 60;
      const scale = Math.min(w, h) * (0.22 + p * 0.1);
      const ox = w / 2, oy = h / 2;
      const a = t * 0.5, b = t * 0.7 + p * 6;
      const project = (v: number[]) => {
        // 4D rotation in xw + yz, intensifies with p
        const c1 = Math.cos(a), s1 = Math.sin(a);
        let x = v[0] * c1 - v[3] * s1, ww = v[0] * s1 + v[3] * c1;
        const c2 = Math.cos(b), s2 = Math.sin(b);
        let y = v[1] * c2 - v[2] * s2, z = v[1] * s2 + v[2] * c2;
        const k4 = 2 / (3 - ww);
        x *= k4; y *= k4; z *= k4;
        const k3 = 2 / (3 - z);
        return [ox + x * scale * k3 + (Math.random() - 0.5) * jitter, oy + y * scale * k3 + (Math.random() - 0.5) * jitter] as const;
      };

      const ghosts = 1 + Math.floor(p * 4);
      for (let g = 0; g < ghosts; g++) {
        const off = g === 0 ? 0 : (Math.random() - 0.5) * p * 40;
        const col = g === 0 ? "#c0aeff" : g % 2 ? "#22e0ff" : "#c84dff";
        const sp = verts4.map(project);
        ctx.strokeStyle = hexA(col, (0.5 - g * 0.08) * fade);
        ctx.lineWidth = 1.1;
        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(sp[i][0] + off, sp[i][1]); ctx.lineTo(sp[j][0] + off, sp[j][1]);
          ctx.stroke();
        });
      }
      // sparks flying out
      if (p > 0.2) {
        for (let i = 0; i < p * 30; i++) {
          const ang = Math.random() * 7, d = Math.random() * scale * 2 * p;
          ctx.beginPath();
          ctx.arc(ox + Math.cos(ang) * d, oy + Math.sin(ang) * d, Math.random() * 1.6, 0, 7);
          ctx.fillStyle = hexA(["#ffb454", "#22e0ff", "#c84dff"][(i % 3)], 0.5 * fade);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  // text phases
  const whiteOpacity = Math.min(1, Math.max(0, (prog - 0.62) / 0.16));
  const finalOpacity = Math.min(1, Math.max(0, (prog - 0.86) / 0.12));
  const lineWindow = (i: number) => {
    const start = 0.06 + i * 0.16;
    const end = start + 0.14;
    if (prog < start || prog > end + 0.05) return 0;
    if (prog < end) return Math.min(1, (prog - start) / 0.05);
    return Math.max(0, 1 - (prog - end) / 0.05);
  };

  return (
    <section ref={sectionRef} className="relative" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {/* glitch questions */}
        {EDGE_LINES.map((ln, i) => {
          const o = lineWindow(i);
          if (o <= 0) return null;
          const text = ln[lang];
          return (
            <div key={i} className="absolute px-6 text-center" style={{ opacity: o }}>
              <p
                className={`glitch ${lang === "zh" ? "zh text-3xl md:text-5xl" : "display text-4xl md:text-6xl"} leading-tight text-ghost-50`}
                data-text={text}
              >
                {text}
              </p>
            </div>
          );
        })}
        {/* white light */}
        <div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: whiteOpacity }} />
        {/* final line */}
        <div className="absolute px-6 text-center" style={{ opacity: finalOpacity }}>
          {FINAL_LINE[lang].split("\n").map((l, i) => (
            <p key={i} className={`${lang === "zh" ? "zh text-2xl md:text-4xl" : "display text-3xl md:text-5xl"} leading-snug`} style={{ color: "#0a0a14", textShadow: "0 0 1px rgba(0,0,0,0.2)" }}>
              {l}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
