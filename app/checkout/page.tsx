"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Lock, Loader2, CheckCircle2, ChevronLeft } from "lucide-react";
import { getUser, getProfile, setPlan, type Plan } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

const PRICES: Record<Exclude<Plan, "free">, { name: string; price: string }> = {
  pro: { name: "Pro", price: "499 ₽" },
  premium: { name: "Premium", price: "899 ₽" },
};

const T = {
  ru: {
    title: "Оплата",
    plan: "План",
    perMonth: "/ мес",
    card: "Номер карты",
    expiry: "Срок",
    cvc: "CVC",
    processing: "Обрабатываем…",
    pay: "Оплатить",
    testNote: "Тестовый платёж — деньги не списываются",
    doneTitle: "Готово!",
    doneActivated: "активирован.",
    doneToDashboard: "Переходим в приложение…",
    doneToProfile: "Осталось заполнить анкету…",
    back: "Планы",
  },
  en: {
    title: "Payment",
    plan: "Plan",
    perMonth: "/ mo",
    card: "Card number",
    expiry: "Expiry",
    cvc: "CVC",
    processing: "Processing…",
    pay: "Pay",
    testNote: "Test payment — no money is charged",
    doneTitle: "Done!",
    doneActivated: "activated.",
    doneToDashboard: "Going to the app…",
    doneToProfile: "One short questionnaire left…",
    back: "Plans",
  },
} as const;

function CheckoutForm() {
  const router = useRouter();
  const lang = useLang();
  const t = T[lang];
  const params = useSearchParams();
  const plan: Exclude<Plan, "free"> = params.get("plan") === "premium" ? "premium" : "pro";

  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [state, setState] = useState<"form" | "processing" | "done">("form");
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!getUser()) { router.replace("/register"); return; }
    setHasProfile(!!getProfile());
  }, [router]);

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setState("processing");
    setTimeout(() => {
      setPlan(plan);
      setState("done");
      setTimeout(() => router.push(getProfile() ? "/dashboard" : "/profile"), 1600);
    }, 2000);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[#090909] flex flex-col">
      {/* iOS Nav */}
      <div className="flex items-center px-4 pt-safe pt-14 pb-2">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-lime-400 py-2 pr-3 cursor-pointer">
          <ChevronLeft size={22} />
          <span className="text-base font-medium">{t.back}</span>
        </button>
      </div>

      <div className="px-6 pt-4 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
      </div>

      <div className="flex-1 px-6">
        <AnimatePresence mode="wait">
          {state === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 rounded-full bg-lime-400/15 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-lime-400" />
              </div>
              <h2 className="text-2xl font-bold">{t.doneTitle}</h2>
              <p className="text-sm text-zinc-400">
                {t.plan} <span className="text-gradient-accent font-semibold">{PRICES[plan].name}</span>{" "}
                {t.doneActivated}
              </p>
              <p className="text-xs text-zinc-600">{hasProfile ? t.doneToDashboard : t.doneToProfile}</p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4">
              {/* Plan summary */}
              <div className="ios-card flex items-center justify-between">
                <span className="text-sm text-zinc-300">{t.plan} {PRICES[plan].name}</span>
                <span className="font-semibold text-gradient-accent">{PRICES[plan].price} {t.perMonth}</span>
              </div>

              <form onSubmit={pay} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">{t.card}</label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      value={card}
                      onChange={(e) => setCard(e.target.value)}
                      className="ios-input pl-11 font-mono"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">{t.expiry}</label>
                    <input value={expiry} onChange={(e) => setExpiry(e.target.value)} className="ios-input font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">{t.cvc}</label>
                    <input value={cvc} onChange={(e) => setCvc(e.target.value)} className="ios-input font-mono" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state === "processing"}
                  className="btn-primary w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {state === "processing" ? (
                    <><Loader2 size={18} className="animate-spin" /> {t.processing}</>
                  ) : (
                    <><Lock size={16} /> {t.pay} {PRICES[plan].price} {t.perMonth}</>
                  )}
                </button>
              </form>

              <p className="text-xs text-zinc-600 text-center flex items-center justify-center gap-1.5 mt-2">
                <Lock size={11} /> {t.testNote}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutForm />
    </Suspense>
  );
}
