"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, Scan } from "lucide-react";
import { getUser, getProfile, setPlan, type Plan } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

const T = {
  ru: {
    hello: (n: string) => `${n}, выберите план`,
    sub: "Начните с Free или откройте все возможности AI-тренера. Оплата тестовая — деньги не списываются.",
    period: "в месяц",
    forever: "навсегда",
    popular: "Лучший выбор",
    freeBtn: "Продолжить бесплатно",
    buyBtn: "Купить (тест)",
    plans: [
      { id: "free" as Plan, name: "Free", price: "0 ₽", features: ["1 анализ раз в 2 месяца", "Краткий отчёт (3 показателя)"] },
      { id: "pro" as Plan, name: "Pro", price: "499 ₽", features: ["Безлимитные анализы", "Полный отчёт (15+ показателей)", "Персональные тренировки и питание", "Выбор режима: похудение / масса", "Графики прогресса"] },
      { id: "premium" as Plan, name: "Premium", price: "899 ₽", features: ["Всё из Pro", "AI-коуч 24/7 в чате", "Система достижений", "Приоритетная поддержка"] },
    ],
  },
  en: {
    hello: (n: string) => `${n}, choose a plan`,
    sub: "Start with Free or unlock the full AI coach. Payment is a test — no money is charged.",
    period: "per month",
    forever: "forever",
    popular: "Best choice",
    freeBtn: "Continue for free",
    buyBtn: "Buy (test)",
    plans: [
      { id: "free" as Plan, name: "Free", price: "0 ₽", features: ["1 analysis every 2 months", "Short report (3 metrics)"] },
      { id: "pro" as Plan, name: "Pro", price: "499 ₽", features: ["Unlimited analyses", "Full report (15+ metrics)", "Personal workouts and nutrition", "Mode choice: weight loss / muscle gain", "Progress charts"] },
      { id: "premium" as Plan, name: "Premium", price: "899 ₽", features: ["Everything in Pro", "24/7 AI coach chat", "Achievement system", "Priority support"] },
    ],
  },
} as const;

export default function PlansPage() {
  const router = useRouter();
  const t = T[useLang()];
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/register");
      return;
    }
    setName(u.name);
  }, [router]);

  const choose = (id: Plan) => {
    if (id === "free") {
      setPlan("free");
      /* анкета уже заполнена — сразу в кабинет, повторно не спрашиваем */
      router.push(getProfile() ? "/dashboard" : "/profile");
    } else {
      router.push(`/checkout?plan=${id}`);
    }
  };

  if (!name) return null;

  return (
    <main className="relative min-h-screen px-6 py-16">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/4 w-[44rem] h-[26rem] bg-lime-400/5 blur-[160px] rounded-full" />

      <div className="relative mx-auto max-w-6xl">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-10">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-500">
            <Scan size={18} className="text-black" />
          </span>
          <span className="text-lg font-semibold">
            BodyVision <span className="text-gradient-accent">AI</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gradient mb-4">
            {t.hello(name)}
          </h1>
          <p className="text-zinc-400">{t.sub}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {t.plans.map((p, i) => {
            const highlight = p.id === "premium";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  highlight
                    ? "bg-gradient-to-b from-lime-400/10 to-transparent border border-lime-400/40 shadow-2xl shadow-lime-400/10 md:-translate-y-3"
                    : "glass glass-hover"
                }`}
              >
                {highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 btn-primary text-xs px-4 py-1.5 rounded-full">
                    <Sparkles size={12} /> {t.popular}
                  </span>
                )}
                <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-bold text-gradient">{p.price}</span>
                  <span className="text-sm text-zinc-500">{p.id === "free" ? t.forever : t.period}</span>
                </div>
                <ul className="space-y-3.5 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check size={16} className="text-lime-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => choose(p.id)}
                  className={`text-center font-medium px-6 py-3.5 rounded-full cursor-pointer ${
                    highlight ? "btn-primary" : "btn-secondary text-white"
                  }`}
                >
                  {p.id === "free" ? t.freeBtn : t.buyBtn}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
