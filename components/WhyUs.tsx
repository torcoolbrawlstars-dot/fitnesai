"use client";

import { motion } from "framer-motion";
import { Zap, UserCheck, LineChart, Camera, Clock, Home } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const icons = [Zap, UserCheck, LineChart, Camera, Clock, Home];

const T = {
  ru: {
    eyebrow: "Почему мы",
    title: "Технологии, которые работают на ваш результат",
    features: [
      ["Анализ за секунды", "AI обрабатывает фотографии и строит полную карту тела быстрее, чем вы завяжете шнурки."],
      ["Индивидуальные рекомендации", "Никаких шаблонных программ — план строится под ваши слабые зоны и цели."],
      ["Отслеживание прогресса", "Автоматическое сравнение «До / После» и графики по каждому показателю."],
      ["Анализ по фотографиям", "Не нужны весы, калиперы и замеры — достаточно камеры смартфона."],
      ["Персональный тренер 24/7", "AI-коуч отвечает на вопросы, корректирует план и мотивирует в любое время."],
      ["Без посещения спортзала", "Программы адаптируются под дом, зал или тренировки на улице."],
    ],
  },
  en: {
    eyebrow: "Why us",
    title: "Technology that works for your results",
    features: [
      ["Analysis in seconds", "The AI processes photos and builds a full body map faster than you tie your shoes."],
      ["Personal recommendations", "No template programs — the plan targets your weak zones and goals."],
      ["Progress tracking", "Automatic Before / After comparison and charts for every metric."],
      ["Photo-based analysis", "No scales, calipers or measurements — a smartphone camera is enough."],
      ["Personal coach 24/7", "The AI coach answers questions, adjusts your plan and keeps you motivated."],
      ["No gym required", "Programs adapt to home, gym or outdoor training."],
    ],
  },
} as const;

export default function WhyUs() {
  const t = T[useLang()];
  return (
    <section id="why" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.map(([title, text], i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="glass glass-hover rounded-3xl p-8"
              >
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
