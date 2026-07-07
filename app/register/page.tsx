"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scan, ArrowRight, Loader2 } from "lucide-react";
import { register, getUser } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

const T = {
  ru: {
    title: "Создайте аккаунт",
    sub: "Тестовая регистрация — данные хранятся только в вашем браузере.",
    name: "Имя",
    namePh: "Иван",
    email: "Email",
    pass: "Пароль",
    passPh: "Минимум 6 символов",
    err: "Заполните все поля (пароль — минимум 6 символов)",
    creating: "Создаём аккаунт…",
    btn: "Зарегистрироваться",
    note: "Нажимая кнопку, вы соглашаетесь с условиями использования. Это демо — настоящие письма не отправляются.",
  },
  en: {
    title: "Create an account",
    sub: "Test registration — data is stored only in your browser.",
    name: "Name",
    namePh: "John",
    email: "Email",
    pass: "Password",
    passPh: "At least 6 characters",
    err: "Fill in all fields (password — at least 6 characters)",
    creating: "Creating account…",
    btn: "Sign up",
    note: "By clicking the button you agree to the terms of use. This is a demo — no real emails are sent.",
  },
} as const;

export default function RegisterPage() {
  const router = useRouter();
  const t = T[useLang()];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* сессия сохраняется: уже вошли — сразу в кабинет */
  useEffect(() => {
    if (getUser()) router.replace("/dashboard");
  }, [router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || password.length < 6) {
      setError(t.err);
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      register(name.trim(), email.trim());
      router.push("/plans");
    }, 1200);
  };

  const inputCls =
    "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-lime-400/60 transition-colors placeholder:text-zinc-600";

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-16">
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-white/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 -right-40 w-[32rem] h-[32rem] bg-lime-400/5 rounded-full blur-[140px]" />

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

        <h1 className="text-2xl font-bold tracking-tight mb-2">{t.title}</h1>
        <p className="text-sm text-zinc-400 mb-8">{t.sub}</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.name}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePh} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.pass}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.passPh} className={inputCls} />
          </div>

          {error && <p className="text-sm text-zinc-300 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> {t.creating}
              </>
            ) : (
              <>
                {t.btn} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-zinc-500 mt-6 text-center">{t.note}</p>
      </motion.div>
    </main>
  );
}
