"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    eyebrow: "Тарифы",
    title: "Выберите свой уровень",
    subtitle: "Начните бесплатно — обновитесь, когда увидите первые результаты.",
    period: "в месяц",
    forever: "навсегда",
    popular: "Лучший выбор",
    cta: "Начать сейчас",
    plans: [
      { name: "Free", price: "0 ₽", features: ["1 анализ раз в 2 месяца", "Краткий отчёт (3 показателя)"] },
      { name: "Pro", price: "499 ₽", features: ["Безлимитные анализы", "Полный отчёт (15+ показателей)", "Персональные тренировки и питание", "Выбор режима: похудение / масса", "Графики прогресса"] },
      { name: "Premium", price: "899 ₽", features: ["Всё из Pro", "AI-коуч 24/7 в чате", "Система достижений", "Экспорт отчётов в PDF", "Приоритетная поддержка"] },
    ],
  },
  en: {
    eyebrow: "Pricing",
    title: "Choose your level",
    subtitle: "Start free — upgrade when you see your first results.",
    period: "per month",
    forever: "forever",
    popular: "Best choice",
    cta: "Start now",
    plans: [
      { name: "Free", price: "0 ₽", features: ["1 analysis every 2 months", "Short report (3 metrics)"] },
      { name: "Pro", price: "499 ₽", features: ["Unlimited analyses", "Full report (15+ metrics)", "Personal workouts and nutrition", "Mode choice: weight loss / muscle gain", "Progress charts"] },
      { name: "Premium", price: "899 ₽", features: ["Everything in Pro", "24/7 AI coach chat", "Achievement system", "PDF report export", "Priority support"] },
    ],
  },
} as const;

export default function Pricing() {
  const t = T[useLang()];
  return (
    <section id="pricing" className="relative py-28">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/3 w-[44rem] h-[26rem] bg-lime-400/5 blur-[160px] rounded-full" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {t.plans.map((p, i) => {
            const highlight = p.name === "Premium";
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  highlight
                    ? "bg-gradient-to-b from-lime-400/10 to-transparent border border-lime-400/40 shadow-2xl shadow-lime-400/10 md:-translate-y-3"
                    : "glass glass-hover"
                }`}
              >
                {highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 btn-primary text-xs px-4 py-1.5 rounded-full">
                    <Sparkles size={12} />
                    {t.popular}
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-bold text-gradient">{p.price}</span>
                  <span className="text-sm text-zinc-500">{p.name === "Free" ? t.forever : t.period}</span>
                </div>
                <ul className="space-y-3.5 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check size={16} className="text-lime-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/register"
                  className={`text-center font-medium px-6 py-3.5 rounded-full ${
                    highlight ? "btn-primary" : "btn-secondary text-white"
                  }`}
                >
                  {t.cta}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
