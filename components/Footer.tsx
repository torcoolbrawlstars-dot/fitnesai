"use client";

import { motion } from "framer-motion";
import { Scan, Globe, MessageCircle, AtSign, Send, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    ctaTitle: "Готовы увидеть своё тело глазами AI?",
    ctaText: "Первый анализ — бесплатно. Без карты, без обязательств.",
    ctaBtn: "Начать бесплатно",
    about: "Персональный AI-тренер, который анализирует тело по фотографии и строит путь к вашей лучшей форме.",
    groups: [
      ["Продукт", [["Как это работает", "#how"], ["Анализ тела", "#analysis"], ["Тренировки", "#workouts"], ["Тарифы", "#pricing"]]],
      ["Компания", [["О нас", "#"], ["Блог", "#"], ["Карьера", "#"], ["Контакты", "#"]]],
      ["Поддержка", [["FAQ", "#faq"], ["Политика конфиденциальности", "#"], ["Условия использования", "#"], ["support@bodyvision.ai", "mailto:support@bodyvision.ai"]]],
    ],
    rights: "Все права защищены.",
    made: "Сделано с искусственным интеллектом и настоящей любовью к спорту.",
  },
  en: {
    ctaTitle: "Ready to see your body through the eyes of AI?",
    ctaText: "First analysis is free. No card, no commitment.",
    ctaBtn: "Start free",
    about: "A personal AI coach that analyzes your body from a photo and builds the path to your best shape.",
    groups: [
      ["Product", [["How it works", "#how"], ["Body analysis", "#analysis"], ["Workouts", "#workouts"], ["Pricing", "#pricing"]]],
      ["Company", [["About", "#"], ["Blog", "#"], ["Careers", "#"], ["Contacts", "#"]]],
      ["Support", [["FAQ", "#faq"], ["Privacy policy", "#"], ["Terms of use", "#"], ["support@bodyvision.ai", "mailto:support@bodyvision.ai"]]],
    ],
    rights: "All rights reserved.",
    made: "Made with artificial intelligence and a real love of sport.",
  },
} as const;

export default function Footer() {
  const t = T[useLang()];
  return (
    <footer className="relative border-t border-white/5 pt-20 pb-10 mt-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-lime-400/10 border border-lime-400/25 p-10 sm:p-14 text-center mb-20"
        >
          <div className="absolute inset-0 bg-grid opacity-30" />
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight text-gradient mb-4">
            {t.ctaTitle}
          </h2>
          <p className="relative text-zinc-400 max-w-xl mx-auto mb-8">{t.ctaText}</p>
          <a href="/register" className="btn-primary relative inline-flex items-center gap-2 px-8 py-4 rounded-full">
            {t.ctaBtn}
            <ArrowRight size={18} />
          </a>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-500">
                <Scan size={18} className="text-black" />
              </span>
              <span className="text-lg font-semibold">
                BodyVision <span className="text-gradient-accent">AI</span>
              </span>
            </a>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mb-6">{t.about}</p>
            <div className="flex gap-3">
              {[Globe, MessageCircle, AtSign, Send].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" className="btn-secondary grid place-items-center w-10 h-10 rounded-full text-zinc-400 hover:text-white">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {t.groups.map(([title, links]) => (
            <div key={title as string}>
              <h4 className="text-sm font-semibold text-zinc-200 mb-5">{title as string}</h4>
              <ul className="space-y-3">
                {(links as unknown as [string, string][]).map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <span>© {new Date().getFullYear()} BodyVision AI. {t.rights}</span>
          <span>{t.made}</span>
        </div>
      </div>
    </footer>
  );
}
