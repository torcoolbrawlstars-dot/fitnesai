"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    eyebrow: "FAQ",
    title: "Частые вопросы",
    faqs: [
      ["Как работает анализ?", "Вы загружаете фотографию тела. Нейросеть Gemini определяет состав тела, осанку, симметрию и пропорции, после чего формирует персональный план тренировок и питания под ваш пол, возраст и цель."],
      ["Безопасны ли мои фотографии?", "Да. Фотографии передаются по шифрованному каналу напрямую в AI и не сохраняются на наших серверах. Все данные аккаунта хранятся только в вашем браузере."],
      ["Сколько занимает анализ?", "В среднем 20–30 секунд. Сразу после обработки вы получаете полный отчёт с оценками и готовой программой."],
      ["Насколько точен AI?", "Точность оценки процента жира сопоставима с биоимпедансным анализом (погрешность ±2–3%). Для осанки и симметрии AI использует определение ключевых точек тела."],
      ["Какие планы доступны?", "Free — 1 анализ раз в 2 месяца и краткий отчёт. Pro (499 ₽) — безлимитные анализы, полный отчёт, тренировки и питание. Premium (899 ₽) — всё из Pro плюс AI-коуч 24/7 в чате."],
    ],
  },
  en: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    faqs: [
      ["How does the analysis work?", "You upload a body photo. The Gemini neural network estimates body composition, posture, symmetry and proportions, then builds a personal workout and nutrition plan for your gender, age and goal."],
      ["Are my photos safe?", "Yes. Photos are sent over an encrypted channel directly to the AI and are not stored on our servers. All account data lives only in your browser."],
      ["How long does the analysis take?", "About 20–30 seconds. Right after processing you get a full report with scores and a ready-made program."],
      ["How accurate is the AI?", "Body fat estimation accuracy is comparable to bioimpedance analysis (±2–3%). For posture and symmetry the AI uses body keypoint detection."],
      ["What plans are available?", "Free — 1 analysis every 2 months and a short report. Pro (499 ₽) — unlimited analyses, full report, workouts and nutrition. Premium (899 ₽) — everything in Pro plus a 24/7 AI coach chat."],
    ],
  },
} as const;

export default function FAQ() {
  const t = T[useLang()];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} />
        <div className="space-y-4">
          {t.faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`glass rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen ? "border-lime-400/30" : ""
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-zinc-100">{q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid place-items-center w-8 h-8 rounded-full bg-white/5 border border-white/10 shrink-0"
                  >
                    <Plus size={16} className="text-lime-300" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
