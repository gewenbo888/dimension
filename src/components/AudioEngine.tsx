"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "./lang";

/**
 * Procedural cosmic soundscape — a black-hole drone built from oscillators,
 * a slow filter LFO, and a shimmer. Off by default (autoplay policy).
 * Filter cutoff follows scroll depth; detune follows the cursor.
 */
export default function AudioEngine() {
  const { lang } = useLang();
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ master: GainNode; filter: BiquadFilterNode; oscs: OscillatorNode[]; lfo: OscillatorNode } | null>(null);

  const start = async () => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    await ctx.resume();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 3);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.Q.value = 6;
    filter.connect(master);
    master.connect(ctx.destination);

    // drone voices: fundamental, fifth, octave shimmer
    const freqs = [55, 82.5, 110, 220.5];
    const types: OscillatorType[] = ["sine", "sine", "triangle", "sine"];
    const oscs = freqs.map((f, i) => {
      const o = ctx.createOscillator();
      o.type = types[i];
      o.frequency.value = f;
      o.detune.value = (Math.random() - 0.5) * 8;
      const g = ctx.createGain();
      g.gain.value = i === 3 ? 0.12 : 0.4 - i * 0.06;
      o.connect(g); g.connect(filter);
      o.start();
      return o;
    });

    // slow LFO sweeping the filter
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 320;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
    lfo.start();

    ctxRef.current = ctx;
    nodesRef.current = { master, filter, oscs, lfo };
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const n = nodesRef.current;
    if (ctx && n) {
      n.master.gain.cancelScheduledValues(ctx.currentTime);
      n.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      setTimeout(() => { ctx.close().catch(() => {}); }, 1100);
    }
    ctxRef.current = null;
    nodesRef.current = null;
  };

  useEffect(() => {
    if (on) start().catch(() => setOn(false));
    else stop();
    return () => { if (ctxRef.current) stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  // scroll + mouse modulation
  useEffect(() => {
    const onScroll = () => {
      const n = nodesRef.current; const ctx = ctxRef.current;
      if (!n || !ctx) return;
      const max = document.body.scrollHeight - window.innerHeight;
      const frac = max > 0 ? window.scrollY / max : 0;
      n.filter.frequency.setTargetAtTime(300 + frac * 2200, ctx.currentTime, 0.5);
    };
    const onMove = (e: PointerEvent) => {
      const n = nodesRef.current; const ctx = ctxRef.current;
      if (!n || !ctx) return;
      const fx = e.clientX / window.innerWidth;
      n.oscs.forEach((o, i) => o.detune.setTargetAtTime((fx - 0.5) * 18 * (i + 1), ctx.currentTime, 0.3));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <button
      onClick={() => setOn((v) => !v)}
      aria-label={on ? "Mute soundscape" : "Play soundscape"}
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-full border border-ion-500/30 bg-void-900/70 px-3.5 py-2 backdrop-blur transition hover:border-ion-500/60"
    >
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-cyan-400"
            style={{
              height: on ? undefined : 4,
              animation: on ? `eqbar 0.9s ${i * 0.13}s ease-in-out infinite alternate` : "none",
            }}
          />
        ))}
      </span>
      <span className="mono text-[0.6rem] uppercase tracking-[0.2em] text-ghost-300">
        {on ? (lang === "zh" ? "声 · 开" : "Sound · On") : (lang === "zh" ? "声 · 关" : "Sound · Off")}
      </span>
      <style>{`@keyframes eqbar{from{height:3px}to{height:14px}}`}</style>
    </button>
  );
}
