"use client";

import { useEffect, useRef, useState } from "react";
import { useLang, T, type Bi } from "./lang";

/* ---------------------------------------------------------------- *
 * Tesseract — an interactive 4D hypercube (and friends) you can
 * rotate by dragging. Projects 4D -> 3D -> 2D with two perspective
 * divides, so you literally watch the inner cell turn inside-out
 * through the outer one.
 * ---------------------------------------------------------------- */

type Vec4 = [number, number, number, number];
type Edge = [number, number];

type Shape = {
  id: ShapeId;
  label: Bi;
  vertices: Vec4[];
  edges: Edge[];
};

type ShapeId = "tesseract" | "5cell" | "16cell";

/* ---- build the four-dimensional figures ---- */

function buildTesseract(): { vertices: Vec4[]; edges: Edge[] } {
  const vertices: Vec4[] = [];
  for (let i = 0; i < 16; i++) {
    vertices.push([
      i & 1 ? 1 : -1,
      i & 2 ? 1 : -1,
      i & 4 ? 1 : -1,
      i & 8 ? 1 : -1,
    ]);
  }
  const edges: Edge[] = [];
  for (let a = 0; a < 16; a++) {
    for (let b = a + 1; b < 16; b++) {
      // connect vertices differing in exactly one coordinate (one bit)
      const diff = a ^ b;
      if (diff && (diff & (diff - 1)) === 0) edges.push([a, b]);
    }
  }
  return { vertices, edges };
}

function build5Cell(): { vertices: Vec4[]; edges: Edge[] } {
  // 5 vertices of a regular 4-simplex, centred at the origin
  const s = 1.4;
  const r5 = Math.sqrt(5);
  const raw: Vec4[] = [
    [1, 1, 1, -1 / r5],
    [1, -1, -1, -1 / r5],
    [-1, 1, -1, -1 / r5],
    [-1, -1, 1, -1 / r5],
    [0, 0, 0, r5 - 1 / r5],
  ];
  const vertices = raw.map(
    (v) => v.map((c) => (c * s) / 1.6) as unknown as Vec4,
  );
  const edges: Edge[] = [];
  for (let a = 0; a < 5; a++)
    for (let b = a + 1; b < 5; b++) edges.push([a, b]); // complete graph
  return { vertices, edges };
}

function build16Cell(): { vertices: Vec4[]; edges: Edge[] } {
  // 4-orthoplex: the 8 unit points ±e_i
  const vertices: Vec4[] = [
    [1.4, 0, 0, 0],
    [-1.4, 0, 0, 0],
    [0, 1.4, 0, 0],
    [0, -1.4, 0, 0],
    [0, 0, 1.4, 0],
    [0, 0, -1.4, 0],
    [0, 0, 0, 1.4],
    [0, 0, 0, -1.4],
  ];
  const edges: Edge[] = [];
  // every pair connected EXCEPT antipodal pairs (which share an axis)
  for (let a = 0; a < 8; a++) {
    for (let b = a + 1; b < 8; b++) {
      const antipodal = a % 2 === 0 && b === a + 1; // (0,1)(2,3)(4,5)(6,7)
      if (!antipodal) edges.push([a, b]);
    }
  }
  return { vertices, edges };
}

const SHAPES: Record<ShapeId, Shape> = {
  tesseract: {
    id: "tesseract",
    label: { en: "Tesseract", zh: "超立方体" },
    ...buildTesseract(),
  },
  "5cell": {
    id: "5cell",
    label: { en: "5-cell", zh: "五胞体" },
    ...build5Cell(),
  },
  "16cell": {
    id: "16cell",
    label: { en: "16-cell", zh: "正十六胞体" },
    ...build16Cell(),
  },
};

/* ---- 4D rotation helpers ---- */

function rot4(v: Vec4, ax1: number, ax2: number, angle: number): Vec4 {
  const out: Vec4 = [v[0], v[1], v[2], v[3]];
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const a = v[ax1];
  const b = v[ax2];
  out[ax1] = a * c - b * s;
  out[ax2] = a * s + b * c;
  return out;
}

/* ---- spectral colour ramp ion -> cyan -> plasma -> flare ---- */
const STOPS: Array<[number, number, number]> = [
  [192, 174, 255], // ion-300
  [34, 224, 255], // cyan
  [200, 77, 255], // plasma
  [255, 180, 84], // flare
];
function spectral(t: number): [number, number, number] {
  const x = Math.max(0, Math.min(1, t)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(x));
  const f = x - i;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

export default function Tesseract() {
  const { lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [shapeId, setShapeId] = useState<ShapeId>("tesseract");
  const [speed4d, setSpeed4d] = useState(0.5); // 4D rotation speed multiplier

  // refs so the animation loop reads live values without re-binding
  const shapeRef = useRef<ShapeId>(shapeId);
  const speedRef = useRef(speed4d);
  shapeRef.current = shapeId;
  speedRef.current = speed4d;

  // user-driven rotation, accumulated by dragging
  const dragRot = useRef({ xy: 0.3, yz: -0.4, xw: 0, zw: 0 });

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx2d = canvasEl.getContext("2d");
    if (!ctx2d) return;
    const ctx: CanvasRenderingContext2D = ctx2d;
    const canvas: HTMLCanvasElement = canvasEl;

    let width = canvas.clientWidth || 600;
    let height = canvas.clientHeight || 420;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = canvas.clientWidth || 600;
      height = canvas.clientHeight || 420;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    /* ---- pointer drag ---- */
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      // vertical drag tilts in 3D (YZ-ish via X axis), horizontal spins XY
      dragRot.current.xy += dx * 0.006;
      dragRot.current.yz += dy * 0.006;
      // horizontal drag also nudges a true 4D plane — feel the 4th direction
      dragRot.current.xw += dx * 0.0022;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => resize());
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }

    let raf = 0;
    let running = true;
    const start = performance.now();

    function frame(now: number) {
      if (!running) return;
      const time = (now - start) / 1000;
      const shape = SHAPES[shapeRef.current];
      const sp = speedRef.current;

      ctx.clearRect(0, 0, width, height);

      // idle auto-rotation in two 4D planes + the user's accumulated drag
      const aXW = dragRot.current.xw + time * 0.45 * sp; // X-W plane (the 4D twist)
      const aYZ = dragRot.current.yz + time * 0.22;
      const aXY = dragRot.current.xy + (dragging ? 0 : time * 0.05);
      const aZW = dragRot.current.zw + time * 0.3 * sp;

      const dist4 = 3.0; // 4D camera distance
      const dist3 = 4.5; // 3D camera distance
      const scale = Math.min(width, height) * 0.32;
      const cx = width / 2;
      const cy = height / 2;

      // project every vertex; remember w for colouring
      const proj = shape.vertices.map((v0) => {
        let v = rot4(v0, 0, 3, aXW); // XW
        v = rot4(v, 2, 3, aZW); // ZW
        v = rot4(v, 1, 2, aYZ); // YZ
        v = rot4(v, 0, 1, aXY); // XY

        // 4D -> 3D perspective divide by (dist4 - w)
        const w4 = 1 / (dist4 - v[3]);
        const x3 = v[0] * w4 * dist4;
        const y3 = v[1] * w4 * dist4;
        const z3 = v[2] * w4 * dist4;

        // 3D -> 2D perspective divide by (dist3 - z)
        const w3 = 1 / (dist3 - z3);
        const x2 = cx + x3 * w3 * dist3 * scale;
        const y2 = cy + y3 * w3 * dist3 * scale;

        return { x: x2, y: y2, w: v[3], z: z3, scale: w3 };
      });

      // depth-sort edges so nearer ones draw last (over the far ones)
      const edgeList = shape.edges
        .map(([a, b]) => ({
          a,
          b,
          depth: (proj[a].z + proj[b].z) / 2,
        }))
        .sort((p, q) => p.depth - q.depth);

      for (const e of edgeList) {
        const A = proj[e.a];
        const B = proj[e.b];
        // colour by w-coordinate of the edge (the dimension you can't see)
        const tCol = (A.w + B.w) / 4 + 0.5; // w in [-1.4,1.4] -> ~[0,1]
        const [r, g, bl] = spectral(tCol);
        const depthA = 0.5 + (A.z + 1.4) / 3; // farther = dimmer
        const alpha = Math.max(0.22, Math.min(0.95, depthA));
        const lw = 1 + Math.max(0, (A.scale + B.scale) * dist3 * 0.9 - 0.4) * 2;

        ctx.save();
        ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${alpha})`;
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.shadowBlur = 16;
        ctx.shadowColor = `rgba(${r}, ${g}, ${bl}, 0.85)`;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
        ctx.restore();
      }

      // glowing vertex nodes
      for (const p of proj) {
        const tCol = p.w / 2.8 + 0.5;
        const [r, g, bl] = spectral(tCol);
        const radius = 2 + Math.max(0, p.scale * dist3 - 0.5) * 4;
        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = `rgba(${r}, ${g}, ${bl}, 0.95)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.6, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${bl}, 0.95)`;
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

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
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const shapeOrder: ShapeId[] = ["tesseract", "5cell", "16cell"];

  return (
    <div className="holo rounded-2xl p-4 sm:p-5">
      {/* controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="label-mono mr-1 hidden sm:inline">
          <T v={{ en: "Object", zh: "四维体" }} />
        </span>
        {shapeOrder.map((id) => {
          const active = id === shapeId;
          return (
            <button
              key={id}
              onClick={() => setShapeId(id)}
              aria-pressed={active}
              className={`glass label-mono rounded-full px-3 py-1.5 transition ${
                active
                  ? "border-ion-400/60 text-ion-300 shadow-glow"
                  : "text-ghost-500 hover:text-cyan-400"
              }`}
              style={
                active
                  ? { borderColor: "rgba(157,131,255,0.6)" }
                  : undefined
              }
            >
              <T v={SHAPES[id].label} />
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          <span className="label-mono hidden text-cyan-400 sm:inline">
            <T v={{ en: "4-rotation", zh: "四维旋转" }} />
          </span>
          <input
            type="range"
            min={0}
            max={1.6}
            step={0.01}
            value={speed4d}
            onChange={(e) => setSpeed4d(parseFloat(e.target.value))}
            aria-label={lang === "zh" ? "四维旋转速度" : "4D rotation speed"}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-void-600 accent-ion-500 sm:w-32"
          />
        </div>
      </div>

      {/* the 4D viewport */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-xl border border-ion-500/15 bg-void-950/60 grid-bg-fine">
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        />
      </div>

      {/* caption */}
      <p className="mono mt-3 text-center text-[0.72rem] leading-relaxed text-ghost-500">
        <T
          v={{
            en: "Drag to rotate through the fourth dimension.",
            zh: "拖动，以穿过第四维旋转。",
          }}
        />
      </p>
    </div>
  );
}
