"use client";

import { useState } from "react";
import { useLang, T } from "./lang";
import { META_AXES, META_REGIMES } from "./content";

/** 7-axis radar comparing dimensional regimes (3D / 4D / 11D / ∞D). */
export default function DimensionRadar() {
  const { lang } = useLang();
  const [active, setActive] = useState<boolean[]>(META_REGIMES.map(() => true));

  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.36;
  const N = META_AXES.length;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const point = (i: number, v: number) => {
    const a = angle(i);
    return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v] as const;
  };

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative mx-auto w-full max-w-[480px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full">
          {/* concentric heptagon rings */}
          {rings.map((r, ri) => (
            <polygon
              key={ri}
              points={META_AXES.map((_, i) => point(i, r).join(",")).join(" ")}
              fill="none"
              stroke="rgba(157,131,255,0.12)"
              strokeWidth={1}
            />
          ))}
          {/* spokes + labels */}
          {META_AXES.map((ax, i) => {
            const [x, y] = point(i, 1);
            const [lx, ly] = point(i, 1.16);
            return (
              <g key={i}>
                <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(157,131,255,0.14)" strokeWidth={1} />
                <text
                  x={lx}
                  y={ly}
                  textAnchor={Math.abs(lx - cx) < 6 ? "middle" : lx > cx ? "start" : "end"}
                  dominantBaseline="middle"
                  className={lang === "zh" ? "zh" : "mono"}
                  fontSize={lang === "zh" ? 12 : 9.5}
                  fill="#9ba2cf"
                  style={lang === "zh" ? {} : { letterSpacing: "0.06em", textTransform: "uppercase" }}
                >
                  {ax[lang]}
                </text>
              </g>
            );
          })}
          {/* regime polygons */}
          {META_REGIMES.map((reg, ri) =>
            active[ri] ? (
              <g key={ri} className="rise-in">
                <polygon
                  points={reg.values.map((v, i) => point(i, v).join(",")).join(" ")}
                  fill={hexA(reg.color, 0.12)}
                  stroke={reg.color}
                  strokeWidth={1.8}
                  style={{ filter: `drop-shadow(0 0 10px ${hexA(reg.color, 0.5)})` }}
                />
                {reg.values.map((v, i) => {
                  const [x, y] = point(i, v);
                  return <circle key={i} cx={x} cy={y} r={2.6} fill={reg.color} />;
                })}
              </g>
            ) : null
          )}
        </svg>
      </div>

      <div>
        <div className="label-mono">Comparative profiles · 维度规模对照</div>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ghost-300">
          <T
            v={{
              en: "Seven properties, four regimes. As dimensions multiply, freedom, information and strangeness rise — while the stability that lets ordinary worlds hold together falls away. Toggle each profile.",
              zh: "七种属性，四种规模。随着维度倍增，自由、信息与陌异度节节攀升——而那让寻常世界得以维系的稳定性，却悄然退场。点击以切换每一种剖面。",
            }}
          />
        </p>
        <div className="mt-6 space-y-2.5">
          {META_REGIMES.map((reg, ri) => (
            <button
              key={ri}
              onClick={() => setActive((a) => a.map((x, i) => (i === ri ? !x : x)))}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition ${
                active[ri] ? "holo" : "border-ghost-700/40 opacity-50 hover:opacity-90"
              }`}
              style={active[ri] ? { borderColor: hexA(reg.color, 0.5) } : {}}
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: reg.color, boxShadow: `0 0 10px ${reg.color}` }} />
              <span className={`text-sm text-ghost-100 ${lang === "zh" ? "zh" : "display"}`}>
                <T v={reg.name} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function hexA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
