"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, ChevronLeft, Zap, Shield, Crown } from "lucide-react";
import { getUser, getProfile, setPlan, type Plan } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    title: "Выберите план",
    sub: "Начните бесплатно или откройте весь потенциал AI-тренера",
    period: "/мес",
    forever: "навсегда",
    popular: "Популярный",
    best: "Лучший выбор",
    freeBtn: "Начать бесплатно",
    buyBtn: "Выбрать",
    restore: "Восстановить покупки",
    terms: "Условия использования",
    plans: [
      {
        id: "free" as Plan,
        name: "Free",
        price: "0 ₽",
        icon: "🌱",
        color: "#71717a",
        features: [
          "1 анализ раз в 2 месяца",
          "Краткий отчёт (3 показателя)",
          "Базовые рекомендации",
        ],
      },
      {
        id: "pro" as Plan,
        name: "Pro",
        price: "499 ₽",
        icon: "⚡️",
        color: "#a3e635",
        features: [
          "Безлимитные анализы",
          "Полный отчёт (15+ показателей)",
          "Персональные тренировки и питание",
          "Режим: похудение / набор массы",
          "Графики прогресса",
        ],
      },
      {
        id: "premium" as Plan,
        name: "Premium",
        price: "899 ₽",
        icon: "👑",
        color: "#fbbf24",
        features: [
          "Всё из Pro",
          "AI-коуч 24/7 в чате",
          "Система достижений",
          "Приоритетная поддержка",
        ],
      },
    ],
  },
  en: {
    title: "Choose your plan",
    sub: "Start free or unlock the full AI coach potential",
    period: "/mo",
    forever: "forever",
    popular: "Popular",
    best: "Best value",
    freeBtn: "Start for free",
    buyBtn: "Choose",
    restore: "Restore purchases",
    terms: "Terms of service",
    plans: [
      {
        id: "free" as Plan,
        name: "Free",
        price: "$0",
        icon: "🌱",
        color: "#71717a",
        features: [
          "1 analysis every 2 months",
          "Short report (3 metrics)",
          "Basic recommendations",
        ],
      },
      {
        id: "pro" as Plan,
        name: "Pro",
        price: "$4.99",
        icon: "⚡️",
        color: "#a3e635",
        features: [
          "Unlimited analyses",
          "Full report (15+ metrics)",
          "Personal workouts & nutrition",
          "Mode: weight loss / muscle gain",
          "Progress charts",
        ],
      },
      {
        id: "premium" as Plan,
        name: "Premium",
        price: "$8.99",
        icon: "👑",
        color: "#fbbf24",
        features: [
          "Everything in Pro",
          "24/7 AI coach chat",
          "Achievement system",
          "Priority support",
        ],
      },
    ],
  },
} as const;

const PlanIcons = { free: Shield, pro: Zap, premium: Crown };

export default function PlansPage() {
  const router = useRouter();
  const lang = useLang();
  const t = T[lang];
  const [name, setName] = useState<string | null>(null);
  const [selected, setSelected] = useState<Plan>("pro");

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace("/register"); return; }
    setName(u.name);
  }, [router]);

  const choose = (id: Plan) => {
    if (id === "free") {
      setPlan("free");
      router.push(getProfile() ? "/dashboard" : "/profile");
    } else {
      router.push(`/checkout?plan=${id}`);
    }
  };

  if (!name) return null;

  return (
    <div className="min-h-screen min-h-dvh bg-[#090909] flex flex-col">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-lime-400/8 rounded-full blur-[80px]" />
      </div>

      {/* iOS Nav */}
      <div className="flex items-center px-4 pt-safe pt-14 pb-2 relative z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-lime-400 py-2 pr-3 cursor-pointer"
        >
          <ChevronLeft size={22} />
          <span className="text-base font-medium">{lang === "ru" ? "Назад" : "Back"}</span>
        </button>
      </div>

      {/* Header */}
      <div className="px-6 pt-4 pb-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold tracking-tight mb-1">{t.title}</h1>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">{t.sub}</p>
        </motion.div>
      </div>

      {/* Plans */}
      <div className="flex-1 px-4 relative z-10 flex flex-col gap-3 pb-4">
        {t.plans.map((plan, i) => {
          const isSelected = selected === plan.id;
          const isHighlight = plan.id === "pro";
          return (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(plan.id)}
              className={`w-full text-left rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? isHighlight
                    ? "border-lime-400 bg-lime-400/8"
                    : plan.id === "premium"
                    ? "border-amber-400/60 bg-amber-400/5"
                    : "border-zinc-500/60 bg-zinc-500/5"
                  : "border-white/8 bg-white/3"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `${plan.color}18` }}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">{plan.name}</span>
                      {isHighlight && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-lime-400 text-black">
                          <Sparkles size={8} /> {t.popular}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold" style={{ color: plan.color }}>
                      {plan.price}
                      <span className="text-xs font-normal text-zinc-500 ml-1">
                        {plan.id === "free" ? t.forever : t.period}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? plan.id === "premium"
                        ? "border-amber-400 bg-amber-400"
                        : plan.id === "pro"
                        ? "border-lime-400 bg-lime-400"
                        : "border-zinc-400 bg-zinc-400"
                      : "border-white/20"
                  }`}
                >
                  {isSelected && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l3 3 7-7" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="px-6 pb-safe pb-12 pt-4 relative z-10">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => choose(selected)}
          className="btn-primary w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wider cursor-pointer mb-3"
        >
          {selected === "free" ? t.freeBtn : `${t.buyBtn} ${t.plans.find(p => p.id === selected)?.name}`}
        </motion.button>
        <div className="flex items-center justify-center gap-4">
          <button className="text-xs text-zinc-600 cursor-pointer">{t.restore}</button>
          <span className="text-zinc-700">·</span>
          <button className="text-xs text-zinc-600 cursor-pointer">{t.terms}</button>
        </div>
      </div>
    </div>
  );
}
