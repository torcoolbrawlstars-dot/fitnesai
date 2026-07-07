"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MoveHorizontal, TrendingUp } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    eyebrow: "До / После",
    title: "Увидьте разницу своими глазами",
    subtitle: "AI автоматически сравнивает фотографии и рассчитывает прогресс по каждому показателю.",
    after: "AFTER · 30 ДНЕЙ",
    results: [
      ["Жир", "24%", "17%"],
      ["Мышцы", "61 кг", "66 кг"],
      ["Вес", "82 кг", "79 кг"],
      ["Осанка", "72", "91"],
    ],
    total: "Общий прогресс:",
  },
  en: {
    eyebrow: "Before / After",
    title: "See the difference with your own eyes",
    subtitle: "The AI automatically compares photos and calculates progress for every metric.",
    after: "AFTER · 30 DAYS",
    results: [
      ["Fat", "24%", "17%"],
      ["Muscle", "61 kg", "66 kg"],
      ["Weight", "82 kg", "79 kg"],
      ["Posture", "72", "91"],
    ],
    total: "Total progress:",
  },
} as const;

function Figure({ variant, afterLabel }: { variant: "before" | "after"; afterLabel: string }) {
  const after = variant === "after";
  return (
    <svg viewBox="0 0 300 420" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`fig-${variant}`} x1="0" y1="0" x2="0" y2="1">
          {after ? (
            <>
              <stop offset="0%" stopColor="#d9f99d" />
              <stop offset="100%" stopColor="#a3e635" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#52525b" />
              <stop offset="100%" stopColor="#3f3f46" />
            </>
          )}
        </linearGradient>
      </defs>
      <g
        stroke={`url(#fig-${variant})`}
        strokeWidth="2.5"
        fill={after ? "rgba(163,230,53,0.08)" : "rgba(113,113,122,0.08)"}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="150" cy="48" r="22" />
        {after ? (
          <path d="M150 72 C112 78 92 92 90 110 C88 132 104 148 110 168 C116 190 116 210 118 228 C119 240 130 248 150 248 C170 248 181 240 182 228 C184 210 184 190 190 168 C196 148 212 132 210 110 C208 92 188 78 150 72 Z" />
        ) : (
          <path d="M150 72 C122 78 108 90 106 108 C104 130 112 148 114 168 C116 192 112 212 114 230 C115 242 128 250 150 250 C172 250 185 242 186 230 C188 212 184 192 186 168 C188 148 196 130 194 108 C192 90 178 78 150 72 Z" />
        )}
        <path d={after
          ? "M92 108 C74 120 66 144 62 170 C58 194 58 218 60 238 C61 248 72 250 76 240 C82 220 84 198 88 178 C92 160 98 140 100 126"
          : "M108 106 C94 118 88 140 84 166 C80 190 80 214 82 234 C83 244 94 246 98 236 C104 216 104 196 108 176 C110 160 112 140 114 124"} />
        <path d={after
          ? "M208 108 C226 120 234 144 238 170 C242 194 242 218 240 238 C239 248 228 250 224 240 C218 220 216 198 212 178 C208 160 202 140 200 126"
          : "M192 106 C206 118 212 140 216 166 C220 190 220 214 218 234 C217 244 206 246 202 236 C196 216 196 196 192 176 C190 160 188 140 186 124"} />
        <path d="M128 250 C124 280 122 308 124 336 C126 364 128 386 130 404 C131 414 143 414 144 404 C146 378 147 350 147 322 C147 300 148 276 148 256" />
        <path d="M172 250 C176 280 178 308 176 336 C174 364 172 386 170 404 C169 414 157 414 156 404 C154 378 153 350 153 322 C153 300 152 276 152 256" />
      </g>
      <text x="150" y="410" textAnchor="middle" fill={after ? "#a3e635" : "#71717a"} fontSize="13" fontFamily="monospace" letterSpacing="3">
        {after ? afterLabel : "BEFORE"}
      </text>
    </svg>
  );
}

export default function BeforeAfter() {
  const t = T[useLang()];
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.min(96, Math.max(4, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <section id="results" className="relative py-28">
      <div className="absolute -right-40 top-1/4 w-[30rem] h-[30rem] bg-lime-400/5 blur-[140px] rounded-full" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative h-[26rem] rounded-2xl overflow-hidden bg-black/40 border border-white/5 cursor-ew-resize select-none touch-none"
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              update(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && update(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
          >
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute inset-0 p-6">
              <Figure variant="after" afterLabel={t.after} />
            </div>
            <div
              className="absolute inset-0 p-6 bg-[#0c0c0e]"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            >
              <div className="absolute inset-0 bg-grid opacity-30" />
              <Figure variant="before" afterLabel={t.after} />
            </div>
            <div
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-lime-300 via-lime-400 to-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.8)]"
              style={{ left: `${pos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 shadow-xl shadow-lime-400/40">
                <MoveHorizontal size={18} className="text-black" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {t.results.map(([label, from, to], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-5 text-center"
              >
                <div className="text-xs uppercase tracking-wider text-zinc-500 mb-2">{label}</div>
                <div className="text-lg font-semibold">
                  <span className="text-zinc-500">{from}</span>
                  <span className="text-zinc-600 mx-1.5">→</span>
                  <span className="text-gradient-accent">{to}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-lime-400/10 border border-lime-400/25 py-4"
          >
            <TrendingUp size={20} className="text-lime-400" />
            <span className="text-lg font-semibold">
              {t.total} <span className="text-lime-400">+34%</span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
