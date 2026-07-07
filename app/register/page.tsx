"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { register, getUser } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    signIn: "Войти",
    signUp: "Регистрация",
    name: "Имя",
    namePh: "Иван Иванов",
    email: "Email",
    emailPh: "you@example.com",
    pass: "Пароль",
    passPh: "Минимум 6 символов",
    errFields: "Заполните все поля",
    errEmail: "Введите корректный email",
    errPass: "Пароль минимум 6 символов",
    errPassMismatch: "Пароли не совпадают",
    passConfirm: "Подтвердите пароль",
    passConfirmPh: "Повторите пароль",
    creating: "Входим…",
    btnSignIn: "Войти",
    btnSignUp: "Создать аккаунт",
    demo: "Демо — данные хранятся только в браузере",
    noAccount: "Нет аккаунта? ",
    hasAccount: "Уже есть аккаунт? ",
    switchSignUp: "Зарегистрироваться",
    switchSignIn: "Войти",
    demoHint: "Введите любой email и пароль от 6 символов",
  },
  en: {
    signIn: "Sign In",
    signUp: "Sign Up",
    name: "Name",
    namePh: "John Doe",
    email: "Email",
    emailPh: "you@example.com",
    pass: "Password",
    passPh: "At least 6 characters",
    errFields: "Please fill in all fields",
    errEmail: "Enter a valid email",
    errPass: "Password must be at least 6 characters",
    errPassMismatch: "Passwords don't match",
    passConfirm: "Confirm password",
    passConfirmPh: "Repeat password",
    creating: "Signing in…",
    btnSignIn: "Sign In",
    btnSignUp: "Create account",
    demo: "Demo mode — data is stored in your browser",
    noAccount: "No account? ",
    hasAccount: "Already have an account? ",
    switchSignUp: "Sign up",
    switchSignIn: "Sign in",
    demoHint: "Enter any email and a 6+ character password",
  },
} as const;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = useLang();
  const t = T[lang];

  const initMode = searchParams.get("mode") === "login" ? "login" : "register";
  const [mode, setMode] = useState<"register" | "login">(initMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (getUser()) router.replace("/dashboard");
  }, [router]);

  useEffect(() => {
    setError("");
  }, [mode]);

  const switchMode = (m: "register" | "login") => {
    setMode(m);
    setError("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError(t.errFields);
    if (!email.includes("@")) return setError(t.errEmail);
    if (password.length < 6) return setError(t.errPass);
    if (mode === "register") {
      if (!name.trim()) return setError(t.errFields);
      if (password !== passConfirm) return setError(t.errPassMismatch);
    }

    setLoading(true);
    setTimeout(() => {
      register(mode === "register" ? name.trim() : email.split("@")[0], email.trim());
      router.push("/plans");
    }, 1000);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[#090909] flex flex-col">
      {/* iOS Navigation Bar */}
      <div className="flex items-center px-4 pt-safe pt-14 pb-2">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-lime-400 py-2 pr-3 cursor-pointer"
        >
          <ChevronLeft size={22} />
          <span className="text-base font-medium">BodyVision</span>
        </button>
      </div>

      {/* Header */}
      <div className="px-6 pt-4 pb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {mode === "register" ? t.signUp : t.signIn}
        </h1>
        <p className="text-sm text-zinc-500">{t.demo}</p>
      </div>

      {/* Segment Control */}
      <div className="mx-6 mb-8">
        <div className="flex bg-white/5 rounded-2xl p-1">
          {(["register", "login"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                mode === m
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              {m === "register" ? t.signUp : t.signIn}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, x: mode === "register" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={submit}
            className="flex flex-col gap-4"
          >
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  {t.name}
                </label>
                <input
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePh}
                  className="ios-input"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                {t.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPh}
                className="ios-input"
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                {t.pass}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passPh}
                  className="ios-input pr-12"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 cursor-pointer"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  {t.passConfirm}
                </label>
                <input
                  type="password"
                  value={passConfirm}
                  onChange={(e) => setPassConfirm(e.target.value)}
                  placeholder={t.passConfirmPh}
                  className="ios-input"
                  autoComplete="new-password"
                />
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xs text-zinc-600 text-center">{t.demoHint}</p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> {t.creating}
                </>
              ) : mode === "register" ? (
                t.btnSignUp
              ) : (
                t.btnSignIn
              )}
            </button>
          </motion.form>
        </AnimatePresence>
      </div>

      {/* Bottom switch */}
      <div className="px-6 pb-safe pb-12 pt-6 text-center">
        <p className="text-sm text-zinc-500">
          {mode === "register" ? t.hasAccount : t.noAccount}
          <button
            onClick={() => switchMode(mode === "register" ? "login" : "register")}
            className="text-lime-400 font-semibold cursor-pointer"
          >
            {mode === "register" ? t.switchSignIn : t.switchSignUp}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
