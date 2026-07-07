"use client";

import { motion } from "framer-motion";
import { Play, Sparkles, ArrowRight } from "lucide-react";
import BodyScan from "./BodyScan";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    badge: "Анализ тела нового поколения",
    h1: "Ваш персональный AI-тренер, который анализирует тело по фотографии",
    p: "Загрузите фото своего тела и получите подробный анализ, персональную программу тренировок и отслеживание прогресса с помощью искусственного интеллекта.",
    start: "Начать бесплатно",
    demo: "Посмотреть демо",
    stats: [
      ["120K+", "пользователей"],
      ["4.9", "средняя оценка"],
      ["30 сек", "на анализ"],
    ],
  },
  en: {
    badge: "Next-generation body analysis",
    h1: "Your personal AI coach that analyzes your body from a photo",
    p: "Upload photos of your body and get a detailed analysis, a personal workout program and progress tracking powered by artificial intelligence.",
    start: "Start free",
    demo: "Watch demo",
    stats: [
      ["120K+", "users"],
      ["4.9", "average rating"],
      ["30 sec", "per analysis"],
    ],
  },
} as const;

export default function Hero() {
  const t = T[useLang()];
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-white/5 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-lime-400/5 rounded-full blur-[140px]" />
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-zinc-300 mb-8"
          >
            <Sparkles size={14} className="text-lime-300" />
            {t.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] text-gradient"
          >
            {t.h1}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg text-zinc-400 max-w-xl leading-relaxed"
          >
            {t.p}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a href="/register" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full">
              {t.start}
              <ArrowRight size={18} />
            </a>
            <a href="#analysis" className="btn-secondary inline-flex items-center gap-2 text-white font-medium px-7 py-3.5 rounded-full">
              <Play size={16} className="text-lime-300" />
              {t.demo}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-12 flex items-center gap-8 text-sm text-zinc-500"
          >
            {t.stats.map(([v, k]) => (
              <div key={k}>
                <div className="text-xl font-bold text-lime-300">{v}</div>
                <div>{k}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <BodyScan />
        </motion.div>
      </div>
    </section>
  );
}
