"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Lock, Loader2, CheckCircle2, Scan } from "lucide-react";
import { getUser, getProfile, setPlan, type Plan } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

const PRICES: Record<Exclude<Plan, "free">, { name: string; price: string }> = {
  pro: { name: "Pro", price: "499 ₽" },
  premium: { name: "Premium", price: "899 ₽" },
};

const T = {
  ru: {
    title: "Оформление подписки",
    plan: "План",
    perMonth: "/ мес",
    card: "Номер карты",
    expiry: "Срок",
    cvc: "CVC",
    processing: "Обрабатываем платёж…",
    pay: "Оплатить",
    testNote: "Тестовый платёж — деньги не списываются",
    doneTitle: "Оплата прошла!",
    doneActivated: "активирован.",
    doneToDashboard: "Возвращаемся в кабинет…",
    doneToProfile: "Осталось заполнить короткую анкету…",
  },
  en: {
    title: "Checkout",
    plan: "Plan",
    perMonth: "/ mo",
    card: "Card number",
    expiry: "Expiry",
    cvc: "CVC",
    processing: "Processing payment…",
    pay: "Pay",
    testNote: "Test payment — no money is charged",
    doneTitle: "Payment successful!",
    doneActivated: "activated.",
    doneToDashboard: "Returning to your dashboard…",
    doneToProfile: "One short questionnaire left…",
  },
} as const;

function CheckoutForm() {
  const router = useRouter();
  const t = T[useLang()];
  const params = useSearchParams();
  const plan: Exclude<Plan, "free"> = params.get("plan") === "premium" ? "premium" : "pro";

  const [card, setCard] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [state, setState] = useState<"form" | "processing" | "done">("form");
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!getUser()) {
      router.replace("/register");
      return;
    }
    setHasProfile(!!getProfile());
  }, [router]);

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setState("processing");
    setTimeout(() => {
      setPlan(plan);
      setState("done");
      /* анкета уже есть — не заставляем заполнять заново */
      setTimeout(() => router.push(getProfile() ? "/dashboard" : "/profile"), 1600);
    }, 2000);
  };

  const inputCls =
    "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-lime-400/60 transition-colors font-mono";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass relative rounded-3xl p-8 sm:p-10 w-full max-w-md"
    >
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-500">
          <Scan size={18} className="text-black" />
        </span>
        <span className="text-lg font-semibold">
          BodyVision <span className="text-gradient-accent">AI</span>
        </span>
      </Link>

      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <CheckCircle2 size={64} className="text-lime-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">{t.doneTitle}</h1>
            <p className="text-sm text-zinc-400">
              {t.plan}{" "}
              <span className="text-gradient-accent font-semibold">{PRICES[plan].name}</span>{" "}
              {t.doneActivated} {hasProfile ? t.doneToDashboard : t.doneToProfile}
            </p>
          </motion.div>
        ) : (
          <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
            <h1 className="text-2xl font-bold tracking-tight mb-2">{t.title}</h1>
            <div className="glass rounded-2xl p-4 flex items-center justify-between mb-8 mt-6">
              <span className="text-sm text-zinc-300">{t.plan} {PRICES[plan].name}</span>
              <span className="font-semibold text-gradient-accent">{PRICES[plan].price} {t.perMonth}</span>
            </div>

            <form onSubmit={pay} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.card}</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input value={card} onChange={(e) => setCard(e.target.value)} className={`${inputCls} pl-11`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.expiry}</label>
                  <input value={expiry} onChange={(e) => setExpiry(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.cvc}</label>
                  <input value={cvc} onChange={(e) => setCvc(e.target.value)} className={inputCls} />
                </div>
              </div>

              <button
                type="submit"
                disabled={state === "processing"}
                className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full disabled:opacity-70 cursor-pointer"
              >
                {state === "processing" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> {t.processing}
                  </>
                ) : (
                  <>
                    <Lock size={16} /> {t.pay} {PRICES[plan].price} {t.perMonth}
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-zinc-500 mt-6 text-center flex items-center justify-center gap-1.5">
              <Lock size={12} /> {t.testNote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-16">
      <div className="absolute -top-40 -right-40 w-[36rem] h-[36rem] bg-lime-400/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 -left-40 w-[32rem] h-[32rem] bg-white/5 rounded-full blur-[140px]" />
      <Suspense fallback={null}>
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
