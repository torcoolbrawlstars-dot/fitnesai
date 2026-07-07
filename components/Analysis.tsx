"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  UploadCloud, CheckCircle2, Percent, Activity, Ruler, Scale,
  Shield, Zap, Footprints, Target,
} from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const metricIcons = [Percent, Activity, Ruler, Scale, Shield, Zap, Target, Footprints, Activity];

const T = {
  ru: {
    eyebrow: "AI-анализ",
    title: "Полный отчёт о вашем теле за 30 секунд",
    subtitle: "AI обрабатывает фотографии и формирует детальную карту тела: от процента жира до слабых мышечных групп.",
    scanning: "AI сканирует фотографии…",
    done: "Анализ завершён",
    stages: ["Определение контуров тела…", "Расчёт мышечной массы и жира…", "Оценка осанки и симметрии…", "Отчёт готов"],
    ringNote: "Отличная база — AI усилит слабые зоны",
    recsTitle: "Рекомендации AI",
    metrics: [
      ["Body Fat", "18%"], ["Muscle Mass", "73%"], ["Posture", "Good"],
      ["Symmetry", "Excellent"], ["Chest", "Medium"], ["Shoulders", "Strong"],
      ["Back", "Needs Improvement"], ["Legs", "Excellent"], ["Core", "Average"],
    ],
    recs: ["Увеличить нагрузку на спину", "Добавить подтягивания", "Укрепить мышцы кора", "Делать растяжку после тренировок", "Увеличить потребление белка", "Спать минимум 8 часов"],
  },
  en: {
    eyebrow: "AI analysis",
    title: "A full body report in 30 seconds",
    subtitle: "The AI processes your photos and builds a detailed body map: from body fat percentage to weak muscle groups.",
    scanning: "AI is scanning your photos…",
    done: "Analysis complete",
    stages: ["Detecting body contours…", "Estimating muscle mass and fat…", "Scoring posture and symmetry…", "Report ready"],
    ringNote: "Great base — the AI will strengthen weak zones",
    recsTitle: "AI recommendations",
    metrics: [
      ["Body Fat", "18%"], ["Muscle Mass", "73%"], ["Posture", "Good"],
      ["Symmetry", "Excellent"], ["Chest", "Medium"], ["Shoulders", "Strong"],
      ["Back", "Needs Improvement"], ["Legs", "Excellent"], ["Core", "Average"],
    ],
    recs: ["Increase back training volume", "Add pull-ups", "Strengthen your core", "Stretch after workouts", "Eat more protein", "Sleep at least 8 hours"],
  },
} as const;

function ScoreRing({ score, note }: { score: number; note: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);
  const r = 84;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1600, 1);
      setDisplay(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, score]);

  return (
    <>
      <svg ref={ref} viewBox="0 0 220 220" className="w-56 h-56">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9f99d" />
            <stop offset="100%" stopColor="#a3e635" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        <motion.circle
          cx="110" cy="110" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circ} transform="rotate(-90 110 110)"
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ * (1 - score / 100) } : {}}
          transition={{ duration: 1.6, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 12px rgba(163,230,53,0.5))" }}
        />
        <text x="110" y="104" textAnchor="middle" fill="#fff" fontSize="44" fontWeight="700">{display}</text>
        <text x="110" y="132" textAnchor="middle" fill="#71717a" fontSize="14">Overall Score</text>
      </svg>
      <p className="mt-4 text-sm text-zinc-400 text-center">{note}</p>
    </>
  );
}

export default function Analysis() {
  const t = T[useLang()];
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const inView = useInView(barRef, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 2)), 36);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section id="analysis" className="relative py-28">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] bg-lime-400/5 blur-[140px] rounded-full" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <motion.div
          ref={barRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="grid place-items-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shrink-0">
            <UploadCloud size={26} className="text-lime-300" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-300 font-medium">{progress < 100 ? t.scanning : t.done}</span>
              <span className="font-mono text-lime-300">{progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-lime-400 transition-all duration-100 shadow-[0_0_16px_rgba(163,230,53,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-zinc-500 font-mono">
              {progress < 35 ? t.stages[0] : progress < 70 ? t.stages[1] : progress < 100 ? t.stages[2] : "✓ " + t.stages[3]}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_20rem] gap-8">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {t.metrics.map(([label, value], i) => {
              const Icon = metricIcons[i];
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="glass glass-hover rounded-2xl p-5"
                >
                  <div className="flex items-center gap-2.5 text-zinc-400 text-xs uppercase tracking-wider mb-3">
                    <Icon size={15} className="text-lime-300" />
                    {label}
                  </div>
                  <div className="text-xl font-semibold text-gradient-accent">{value}</div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7 }}
            className="glass rounded-3xl p-8 flex flex-col items-center justify-center"
          >
            <ScoreRing score={88} note={t.ringNote} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-8 sm:p-10 mt-8"
        >
          <h3 className="text-xl font-semibold mb-6">
            <span className="text-gradient-accent">{t.recsTitle}</span>
          </h3>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {t.recs.map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3 text-sm text-zinc-300"
              >
                <CheckCircle2 size={18} className="text-lime-400 shrink-0" />
                {r}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
