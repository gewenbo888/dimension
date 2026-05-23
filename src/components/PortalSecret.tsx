"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, T, type Bi } from "./lang";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const SECRETS: { eq: string; note: Bi }[] = [
  { eq: "e^{iπ} + 1 = 0", note: { en: "Five constants. One sentence. The universe rhymes.", zh: "五个常数。一句话。宇宙，是押韵的。" } },
  { eq: "S = kA / 4ℓ²", note: { en: "A black hole's entropy lives on its surface, not its volume. Reality counts in two dimensions.", zh: "一个黑洞的熵，活在它的表面，而非体积之上。现实，以二维计数。" } },
  { eq: "ds² = −c²dt² + dx² + dy² + dz²", note: { en: "Time enters with a minus sign. That single sign is why the future feels different from the left.", zh: "时间，带着一个负号进入。正是那一个符号，让未来，感觉不同于左方。" } },
];

const ARCHIVE: Bi = {
  en: "You found a fold. Most never look for the directions they cannot see. If reality is a projection, then attention is the only instrument that points upward — out of the page, toward whatever is casting us. Keep looking. Not all rooms have doors you were meant to find.",
  zh: "你找到了一道折痕。多数人，从不去寻找他们看不见的方向。倘若现实是一道投影，那么注意，便是唯一指向「上方」的仪器——指出纸面之外，朝向那正在投下我们之物。继续看下去。并非所有的房间，都有一扇你本应找到的门。",
};

export default function PortalSecret() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const bufRef = useRef<string[]>([]);
  const typedRef = useRef("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); return; }
      // konami
      const buf = bufRef.current;
      buf.push(e.key);
      if (buf.length > KONAMI.length) buf.shift();
      if (buf.length === KONAMI.length && buf.every((k, i) => k.toLowerCase() === KONAMI[i].toLowerCase())) {
        setOpen(true); buf.length = 0;
      }
      // typed words
      if (e.key.length === 1) {
        typedRef.current = (typedRef.current + e.key.toLowerCase()).slice(-9);
        if (typedRef.current.includes("dimension") || typedRef.current.endsWith("void11")) setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // recursive mirror canvas
  useEffect(() => {
    if (!open) return;
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
    let raf = 0, t = 0;
    const tick = () => {
      t += 0.01;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const cols = ["#7b5cff", "#22e0ff", "#c84dff", "#ffb454"];
      for (let i = 0; i < 26; i++) {
        const s = Math.min(w, h) * 0.46 * Math.pow(0.86, i);
        const rot = t * (0.3 + i * 0.05) + i * 0.2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.strokeStyle = hexA(cols[i % cols.length], 0.5 - i * 0.012);
        ctx.lineWidth = 1;
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [open]);

  return (
    <>
      {/* faint discoverable sigil */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Hidden portal"
        className="fixed bottom-5 right-5 z-40 text-ghost-700/50 transition hover:text-cyan-400/80"
        title="◇"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" className="breathe" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2l10 10-10 10L2 12z" /><path d="M12 7l5 5-5 5-5-5z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center fade-in" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-void-950/92 backdrop-blur-md" onClick={() => setOpen(false)} />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-50" />
          <div className="glass relative z-10 mx-5 max-h-[86vh] max-w-2xl overflow-auto rounded-2xl p-8 md:p-10">
            <div className="label-mono flex items-center justify-between">
              <span><T v={{ en: "Hidden transmission · 隐藏的传讯", zh: "隐藏的传讯 · Hidden transmission" }} /></span>
              <button onClick={() => setOpen(false)} className="text-ghost-500 hover:text-cyan-400">✕</button>
            </div>
            <p className="mt-5 text-lg leading-relaxed text-ghost-100"><T v={ARCHIVE} /></p>
            <div className="mt-8 h-px rule-ion opacity-60" />
            <div className="mt-6 space-y-5">
              {SECRETS.map((s, i) => (
                <div key={i}>
                  <div className="mono text-lg text-cyan-300" style={{ textShadow: "0 0 16px rgba(34,224,255,0.5)" }}>{s.eq}</div>
                  <p className="mt-1 text-sm leading-relaxed text-ghost-300"><T v={s.note} /></p>
                </div>
              ))}
            </div>
            <p className="mt-8 mono text-[0.6rem] uppercase tracking-[0.3em] text-ghost-500">
              <T v={{ en: "↑↑↓↓←→←→ b a — you remembered.", zh: "↑↑↓↓←→←→ b a —— 你记得。" }} />
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
