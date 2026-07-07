"use client";

import { motion } from "framer-motion";
import { Camera, BrainCircuit, Dumbbell, TrendingUp } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const icons = [Camera, BrainCircuit, Dumbbell, TrendingUp];

const T = {
  ru: {
    eyebrow: "Как это работает",
    title: "Четыре шага к идеальной форме",
    subtitle: "Никаких замеров, весов и сложных приложений. Только камера телефона и искусственный интеллект.",
    steps: [
      ["Загрузите фотографии тела", "Три ракурса — спереди, сбоку и сзади. Этого достаточно, чтобы AI построил полную модель вашего тела."],
      ["AI анализирует тело", "Жир, мышцы, осанка, симметрия, пропорции, сильные стороны и слабые места — всё за несколько секунд."],
      ["Получите персональную программу", "ИИ автоматически создаёт тренировки, упражнения, план питания и рекомендации по восстановлению."],
      ["Загрузите новые фото через месяц", "AI сравнит результаты «До» и «После» и покажет полный прогресс по каждой зоне тела."],
    ],
  },
  en: {
    eyebrow: "How it works",
    title: "Four steps to your best shape",
    subtitle: "No measurements, scales or complicated apps. Just your phone camera and artificial intelligence.",
    steps: [
      ["Upload body photos", "Three angles: front, side and back. That is enough for the AI to build a full model of your body."],
      ["AI analyzes your body", "Fat, muscle, posture, symmetry, proportions, strengths and weak spots — all in a few seconds."],
      ["Get a personal program", "The AI automatically creates workouts, exercises, a nutrition plan and recovery recommendations."],
      ["Upload new photos in a month", "The AI compares Before and After and shows full progress for every body zone."],
    ],
  },
} as const;

export default function HowItWorks() {
  const t = T[useLang()];
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {t.steps.map(([title, text], i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="glass glass-hover rounded-3xl p-8 relative overflow-hidden group"
              >
                <span className="absolute top-6 right-7 text-5xl font-bold text-white/[0.05] group-hover:text-lime-400/15 transition-colors duration-500">
                  0{i + 1}
                </span>
                <div className="grid place-items-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-6">
                  <Icon size={22} className="text-lime-300" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
