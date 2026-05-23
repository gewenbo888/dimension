"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang, type Bi } from "./lang";
import {
  SECTIONS, PHYSICS_CARDS, AI_CARDS, CIVILIZATIONS, COMPANIONS, OPENING_LINE,
} from "./content";
import CosmosCanvas from "./CosmosCanvas";
import DimensionLadder from "./DimensionLadder";
import Tesseract from "./Tesseract";
import CalabiYau from "./CalabiYau";
import EquationGallery from "./EquationGallery";
import ConsciousnessChamber from "./ConsciousnessChamber";
import SpacetimeFabric from "./SpacetimeFabric";
import LatentSpace from "./LatentSpace";
import DimensionRadar from "./DimensionRadar";
import EdgeCollapse from "./EdgeCollapse";
import AudioEngine from "./AudioEngine";
import PortalSecret from "./PortalSecret";

function TesseractGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" strokeLinejoin="round">
      <rect x="5" y="5" width="14" height="14" stroke="#22e0ff" strokeWidth="1" opacity="0.85" />
      <rect x="11" y="11" width="14" height="14" stroke="#7b5cff" strokeWidth="1" opacity="0.9" />
      <g stroke="#c84dff" strokeWidth="1" opacity="0.7">
        <line x1="5" y1="5" x2="11" y2="11" /><line x1="19" y1="5" x2="25" y2="11" />
        <line x1="5" y1="19" x2="11" y2="25" /><line x1="19" y1="19" x2="25" y2="25" />
      </g>
      <circle cx="15" cy="15" r="1.4" fill="#ffb454" />
    </svg>
  );
}

function Header() {
  const nav: { id: string; label: Bi }[] = [
    { id: "evolution", label: { en: "Evolution", zh: "演化" } },
    { id: "mathematics", label: { en: "Mathematics", zh: "数学" } },
    { id: "consciousness", label: { en: "Mind", zh: "意识" } },
    { id: "physics", label: { en: "Physics", zh: "物理" } },
    { id: "civilizations", label: { en: "Civilizations", zh: "文明" } },
    { id: "ai", label: { en: "AI", zh: "智能" } },
    { id: "edge", label: { en: "The Edge", zh: "尽头" } },
  ];
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-ion-500/12 bg-void-950/75 px-5 py-3 backdrop-blur-md md:px-9">
      <a href="#top" className="flex items-center gap-3">
        <TesseractGlyph className="h-8 w-8 spin-slow" />
        <div className="leading-tight">
          <div className="display text-lg tracking-wide text-ghost-50">DIMENSION</div>
          <div className="zh text-[0.6rem] text-ghost-500">维度</div>
        </div>
      </a>
      <nav className="hidden gap-5 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-ghost-500 xl:flex">
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} className="hover:text-cyan-400"><T v={n.label} /></a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a href="https://psyverse.fun" className="hidden font-mono text-[0.56rem] uppercase tracking-[0.18em] text-cyan-400 hover:text-ion-300 sm:block">← Psyverse</a>
      </div>
    </header>
  );
}

function Hero() {
  const open = OPENING_LINE;
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0 z-0"><CosmosCanvas /></div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-void-950/40 via-transparent to-void-950" />
      {/* intro veil — opens from complete darkness */}
      <div className="pointer-events-none absolute inset-0 z-30 bg-void-950" style={{ animation: "introOut 2.6s ease forwards" }} />
      <style>{`@keyframes introOut{0%{opacity:1}60%{opacity:1}100%{opacity:0}}`}</style>

      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono fade-in" style={{ animationDelay: "1.8s", animationFillMode: "both" }}>
          Psyverse · An infinite museum of reality
        </div>
        <h1 className="display mt-6 text-7xl leading-[0.92] tracking-tight text-ghost-50 md:text-[10rem]">
          <span className="spectral-text">DIMENSION</span>
        </h1>
        <h2 className="zh mt-2 text-3xl text-ghost-200 md:text-5xl">维度</h2>
        <p className="mt-4 max-w-2xl font-mono text-[0.62rem] uppercase tracking-[0.3em] text-ghost-500">
          <T v={{ en: "The Infinite Architecture of Reality", zh: "现实的无限架构" }} />
        </p>

        <div className="mt-12 max-w-2xl">
          {open.en.split("\n").map((_, i) => (
            <p
              key={i}
              className="fade-in text-2xl leading-relaxed text-ghost-50 md:text-3xl"
              style={{ animationDelay: `${2.4 + i * 0.5}s`, animationFillMode: "both" }}
            >
              <span className="display">{OPENING_LINE.en.split("\n")[i]}</span>
              <span className="zh ml-0 block text-xl text-ghost-300 md:text-2xl">{OPENING_LINE.zh.split("\n")[i]}</span>
            </p>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-ghost-500 fade-in" style={{ animationDelay: "3.6s", animationFillMode: "both" }}>
          <span>0D → 11D</span>
          <span>tesseract · calabi–yau · black holes</span>
          <span>EN · 中文</span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 fade-in" style={{ animationDelay: "4s", animationFillMode: "both" }}>
        <div className="flex flex-col items-center gap-2 text-ghost-500">
          <span className="mono text-[0.55rem] uppercase tracking-[0.3em]"><T v={{ en: "descend", zh: "下行" }} /></span>
          <span className="h-8 w-px bg-gradient-to-b from-cyan-400/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function sec(id: string) {
  return SECTIONS.find((s) => s.id === id)!;
}

function SectionHead({ id }: { id: string }) {
  const s = sec(id);
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-baseline gap-5">
        <span className="display text-6xl text-ion-500/30">{s.num}</span>
        <div>
          <h2 className="display text-4xl text-ghost-50 md:text-6xl"><T v={s.title} /></h2>
          <h3 className="mt-1 text-base text-cyan-400 md:text-lg"><T v={s.sub} /></h3>
        </div>
      </div>
      <div className="mt-6 h-px rule-ion opacity-50" />
      <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ghost-200"><T v={s.body} /></p>
    </div>
  );
}

function Section({ id, children, tint }: { id: string; children?: ReactNode; tint?: string }) {
  return (
    <section id={id} className="relative border-t border-ion-500/8 px-6 py-28 md:px-12">
      <SectionHead id={id} />
      {children && <div className="mx-auto mt-14 max-w-6xl">{children}</div>}
    </section>
  );
}

function PhysicsCards() {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {PHYSICS_CARDS.map((c, i) => (
        <div key={i} className="holo rounded-xl p-5" style={{ borderTopColor: c.accent, borderTopWidth: 2 }}>
          <div className={`text-lg text-ghost-50 ${lang === "zh" ? "zh" : "display"}`} style={{ color: c.accent }}>
            <T v={c.name} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ghost-300"><T v={c.body} /></p>
        </div>
      ))}
    </div>
  );
}

function AICards() {
  const { lang } = useLang();
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
      {AI_CARDS.map((c, i) => (
        <div key={i} className="holo rounded-xl p-6">
          <div className={`text-lg leading-snug text-cyan-300 ${lang === "zh" ? "zh" : "display"}`}><T v={c.q} /></div>
          <p className="mt-3 text-sm leading-relaxed text-ghost-300"><T v={c.take} /></p>
        </div>
      ))}
    </div>
  );
}

function CivilizationsGrid() {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {CIVILIZATIONS.map((civ, i) => (
        <div key={i} className="holo rounded-2xl p-7">
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl text-ghost-50 ${lang === "zh" ? "zh" : "display"}`}><T v={civ.name} /></span>
            <span className="mono text-sm tracking-widest text-flare-400">{civ.dim}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ghost-300"><T v={civ.essence} /></p>
          <div className="mt-5 space-y-3 border-t border-ion-500/10 pt-5">
            {civ.traits.map((tr, j) => (
              <div key={j} className="grid grid-cols-[5.5rem_1fr] gap-3">
                <span className="label-mono pt-0.5"><T v={tr.k} /></span>
                <span className="text-sm leading-relaxed text-ghost-200"><T v={tr.v} /></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MetaModel() {
  return (
    <section id="model" className="relative border-t border-ion-500/8 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="label-mono">Meta-model · 元模型</div>
        <h2 className="display mt-3 text-4xl text-ghost-50 md:text-5xl">
          <T v={{ en: "The anatomy of a dimensional regime", zh: "维度规模的解剖" }} />
        </h2>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ghost-200">
          <T v={{
            en: "Every world is a setting of the same dials. Add directions and you buy freedom, information and strangeness — and you spend the stability that lets ordinary matter cohere. Our 3D world is a narrow, livable compromise on a vast spectrum of possible architectures.",
            zh: "每一个世界，都是同一组旋钮的一种设定。增添方向，你便买来自由、信息与陌异——也便花掉了那让寻常物质得以凝聚的稳定。我们的三维世界，不过是在一片浩瀚的、可能架构的光谱之上，一个狭窄而宜居的折衷。",
          }} />
        </p>
        <div className="mt-14"><DimensionRadar /></div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative border-t border-ion-500/8 px-6 py-32 md:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="display text-4xl leading-snug text-ghost-50 md:text-6xl">
          <T v={{ en: "We never left the point. We only learned its directions.", zh: "我们从未离开那一点。我们只是，认出了它的方向。" }} />
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ghost-300">
          <T v={{
            en: "Dimension is not scenery you move through. It is the set of ways things can differ — the grammar that lets a universe say more than 'here'. To climb the dimensions is to discover that reality was never made of stuff, but of relations: of distance, of time, of possibility, of mind. The architecture is infinite. We have walked only its lowest floors.",
            zh: "维度，不是你穿行其间的布景。它是万物得以彼此相异的种种方式——是那让一个宇宙能说出多于「此处」之言的语法。攀登维度，便是发现：现实，从不曾由「东西」构成，而是由「关系」构成——距离的、时间的、可能的、心智的关系。这架构，是无限的。而我们，只走过了它最低的几层。",
          }} />
        </p>
        <div className="mx-auto mt-10 max-w-xl rounded-lg border border-plasma-500/25 bg-void-900/60 p-5">
          <p className="text-xs leading-relaxed text-ghost-500">
            <T v={{
              en: "An educational synthesis of geometry, physics, philosophy and computer science. The simulations are illustrative simplifications, not literal models of nature; the speculative civilizations are art. Open questions are stated as open.",
              zh: "一份融合几何、物理、哲学与计算机科学的教育性综述。文中的模拟，是示意性的简化，而非自然的字面模型；那些思辨的文明，是艺术。悬而未决的问题，如实陈述为悬而未决。",
            }} />
          </p>
        </div>
        <div className="mx-auto mt-12 h-px w-40 rule-ion" />
        <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-cyan-400/70">
          DIMENSION · 维度 · Psyverse · 2026
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const { lang } = useLang();
  return (
    <footer className="border-t border-ion-500/12 bg-void-950 px-6 py-16 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <TesseractGlyph className="h-7 w-7" />
            <div className="display text-xl text-ghost-50">DIMENSION</div>
          </div>
          <div className="zh mt-2 text-sm text-ghost-300">维度 · 现实的无限架构</div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ghost-500">
            <T v={{ en: "From the point to eleven dimensions and beyond — geometry, physics, consciousness, civilizations and machine cognition across the architecture of the real.", zh: "从一个点，到十一维，再向外——几何、物理、意识、文明，与机器认知，遍历现实的架构。" }} />
          </p>
        </div>
        <div>
          <div className="label-mono">Systems · 系统</div>
          <ul className="mt-4 space-y-1.5 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-ghost-500">
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="hover:text-cyan-400">{s.num} · <T v={s.title} /></a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="label-mono">Companion archives · 同系</div>
          <ul className="mt-4 space-y-1.5 text-sm text-ghost-300">
            {COMPANIONS.map((c, i) => (
              <li key={i}><a href={c.href} className={`hover:text-cyan-300 ${lang === "zh" ? "zh" : ""}`}><T v={c.label} /></a></li>
            ))}
            <li className="pt-3"><a href="https://psyverse.fun" className="text-cyan-400 hover:text-ion-300">↩ All Psyverse archives</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 h-px max-w-7xl rule-ion" />
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-between gap-2 text-[0.56rem] uppercase tracking-[0.3em] text-ghost-500">
        <div>© 2026 Gewenbo · Psyverse</div>
        <div>EN · 中文 · educational · ◇ ↑↑↓↓←→←→ba</div>
      </div>
    </footer>
  );
}

function Body() {
  return (
    <main className="relative bg-void-950 text-ghost-100">
      <Header />
      <Hero />

      {/* ticker */}
      <div className="grid-bg overflow-hidden border-y border-ion-500/12 bg-void-900/60 py-2.5">
        <div className="ticker inline-block whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.3em] text-cyan-400/70">
          {("POINT · LINE · PLANE · SOLID · SPACETIME · TESSERACT · BRANCHING WORLDS · CALABI–YAU · SUPERSTRINGS · M-THEORY · HILBERT SPACE · HOLOGRAPHIC UNIVERSE · 点 · 线 · 面 · 体 · 时空 · 超立方体 · 多重宇宙 · 卡拉比丘 · 超弦 · M理论 · ").repeat(2)}
        </div>
      </div>

      <Section id="evolution"><DimensionLadder /></Section>

      <Section id="mathematics">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Tesseract />
          <CalabiYau />
        </div>
        <div className="mt-10"><EquationGallery /></div>
      </Section>

      <Section id="consciousness"><ConsciousnessChamber /></Section>

      <Section id="physics">
        <SpacetimeFabric />
        <div className="mt-10"><PhysicsCards /></div>
      </Section>

      <Section id="civilizations"><CivilizationsGrid /></Section>

      <Section id="ai">
        <LatentSpace />
        <AICards />
      </Section>

      <MetaModel />

      {/* Section VII lives in its own tall scroll-driven stage */}
      <section id="edge" className="relative border-t border-ion-500/8">
        <div className="px-6 pt-28 md:px-12">
          <SectionHead id="edge" />
        </div>
        <EdgeCollapse />
      </section>

      <Closing />
      <Footer />

      <AudioEngine />
      <PortalSecret />
    </main>
  );
}

export default function Dimension() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
