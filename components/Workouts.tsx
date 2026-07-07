"use client";

import { motion } from "framer-motion";
import { Play, Flame, Repeat, Layers } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    eyebrow: "Персональная программа",
    title: "Тренировки, созданные под ваше тело",
    subtitle: "Каждое упражнение подобрано AI на основе анализа: слабые зоны получают приоритет, сильные — поддержку.",
    workouts: [
      { title: "Подтягивания широким хватом", zone: "Спина", sets: "4 подхода", reps: "8–12 повторений", level: "Средний", result: "Ширина спины +12% за 8 недель" },
      { title: "Планка с ротацией", zone: "Кор", sets: "3 подхода", reps: "45–60 секунд", level: "Начальный", result: "Стабилизация кора и осанка" },
      { title: "Румынская тяга", zone: "Ноги / Спина", sets: "4 подхода", reps: "10 повторений", level: "Продвинутый", result: "Сила задней цепи +18%" },
    ],
  },
  en: {
    eyebrow: "Personal program",
    title: "Workouts built for your body",
    subtitle: "Every exercise is chosen by the AI based on your analysis: weak zones get priority, strong ones get support.",
    workouts: [
      { title: "Wide-grip pull-ups", zone: "Back", sets: "4 sets", reps: "8–12 reps", level: "Intermediate", result: "Back width +12% in 8 weeks" },
      { title: "Plank with rotation", zone: "Core", sets: "3 sets", reps: "45–60 seconds", level: "Beginner", result: "Core stability and posture" },
      { title: "Romanian deadlift", zone: "Legs / Back", sets: "4 sets", reps: "10 reps", level: "Advanced", result: "Posterior chain strength +18%" },
    ],
  },
} as const;

const gradients = ["from-zinc-600/30 to-zinc-500/20", "from-zinc-700/30 to-zinc-500/20", "from-zinc-600/30 to-zinc-400/20"];

export default function Workouts() {
  const t = T[useLang()];
  return (
    <section id="workouts" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
        <div className="grid md:grid-cols-3 gap-6">
          {t.workouts.map((w, i) => (
            <motion.article
              key={w.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="glass glass-hover rounded-3xl overflow-hidden group"
            >
              <div className={`relative h-44 bg-gradient-to-br ${gradients[i]} grid place-items-center`}>
                <div className="absolute inset-0 bg-grid opacity-40" />
                <button
                  aria-label={w.title}
                  className="relative grid place-items-center w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md group-hover:scale-110 group-hover:bg-lime-400/30 transition-all duration-300"
                >
                  <Play size={20} className="text-white ml-0.5" />
                </button>
                <span className="absolute top-4 left-4 text-xs font-medium glass rounded-full px-3 py-1 text-zinc-200">
                  {w.zone}
                </span>
                <span className="absolute top-4 right-4 text-xs font-medium border border-lime-400/30 bg-lime-400/10 text-lime-300 rounded-full px-3 py-1">
                  {w.level}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">{w.title}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-5">
                  <span className="flex items-center gap-1.5">
                    <Layers size={15} className="text-lime-300" /> {w.sets}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Repeat size={15} className="text-lime-300" /> {w.reps}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-300 border-t border-white/5 pt-4">
                  <Flame size={15} className="text-lime-400" />
                  {w.result}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
