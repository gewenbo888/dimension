import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "DIMENSION · The Infinite Architecture of Reality";
const TITLE_ZH = "维度 · 现实的无限架构";
const DESC =
  "A civilization-scale, bilingual cathedral of dimensions — spatial, temporal, quantum, mathematical, conscious and informational. From 0D to 11D, through tesseracts, Calabi–Yau manifolds, black holes, holographic worlds, dimensional civilizations and machine cognition, DIMENSION explores the possibility that reality is a projection from higher dimensions.";

export const metadata: Metadata = {
  metadataBase: new URL("https://dimension.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "dimensions", "higher dimensions", "fourth dimension", "tesseract", "hypercube",
    "spacetime", "string theory", "M-theory", "Calabi-Yau manifold", "eleven dimensions",
    "quantum mechanics", "general relativity", "black holes", "holographic principle",
    "multiverse", "parallel universes", "consciousness", "non-Euclidean geometry",
    "topology", "Hilbert space", "fractal dimension", "entropy", "gravity",
    "AI consciousness", "latent space", "dimensional compression", "simulation theory",
    "interdimensional", "sacred geometry", "cosmology", "philosophy of physics",
    "维度", "高维空间", "四维", "超立方体", "时空", "弦理论", "卡拉比丘流形",
    "量子力学", "相对论", "黑洞", "全息原理", "多重宇宙", "平行宇宙", "意识",
    "非欧几何", "拓扑学", "希尔伯特空间", "分形维度", "熵", "引力", "高维文明",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "DIMENSION · 维度 — The Infinite Architecture of Reality" }],
    title: TITLE_EN,
    description:
      "Reality is not built from matter. Reality is built from dimensions. A bilingual cathedral of 0D→11D — geometry, physics, consciousness, civilizations and machine cognition across the architecture of the real.",
    url: "https://dimension.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description: "Reality is not built from matter — it is built from dimensions. A bilingual, cinematic journey from the point to eleven dimensions and beyond.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#020207" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Sora:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400;500&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://dimension.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-void-950 text-ghost-100 antialiased">
        {children}
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
