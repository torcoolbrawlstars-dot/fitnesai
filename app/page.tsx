"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, ChevronRight, Globe } from "lucide-react";
import {
  getLang,
  setLangSilent,
  hasSeenOnboarding,
  markOnboardingDone,
  type Lang,
} from "@/lib/i18n";
import { getUser } from "@/lib/auth";

/* ─── Тексты онбординга ─── */
const ONBOARDING = {
  ru: [
    {
      icon: "🤳",
      title: "Сфотографируй тело",
      desc: "Загрузи фото — AI мгновенно определит % жира, мышечную массу и осанку",
    },
    {
      icon: "🧠",
      title: "AI составит план",
      desc: "Персональная программа тренировок и питания на основе анализа твоего тела",
    },
    {
      icon: "📈",
      title: "Следи за прогрессом",
      desc: "Графики, достижения и история — всё в одном месте, прямо на телефоне",
    },
  ],
  en: [
    {
      icon: "🤳",
      title: "Photograph your body",
      desc: "Upload a photo — AI instantly measures body fat %, muscle mass and posture",
    },
    {
      icon: "🧠",
      title: "AI builds your plan",
      desc: "Personal workout & nutrition program based on your body analysis",
    },
    {
      icon: "📈",
      title: "Track your progress",
      desc: "Charts, achievements and history — all in one place, right on your phone",
    },
  ],
};

type Step = "splash" | "lang" | "onboarding" | "auth";

export default function SplashPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("splash");
  const [lang, setLangState] = useState<Lang>("ru");
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1); // 1 = вперёд, -1 = назад

  /* Сразу перенаправить если уже залогинен */
  useEffect(() => {
    const timer = setTimeout(() => {
      const user = getUser();
      if (user) {
        router.replace("/dashboard");
        return;
      }
      if (hasSeenOnboarding()) {
        setStep("lang");
        return;
      }
      setStep("lang");
    }, 1600);
    return () => clearTimeout(timer);
  }, [router]);

  const pickLang = (l: Lang) => {
    setLangState(l);
    setLangSilent(l);
    setStep("onboarding");
    setSlide(0);
  };

  const goNext = () => {
    const slides = ONBOARDING[lang];
    if (slide < slides.length - 1) {
      setDir(1);
      setSlide((s) => s + 1);
    } else {
      markOnboardingDone();
      setStep("auth");
    }
  };

  const goBack = () => {
    if (slide > 0) {
      setDir(-1);
      setSlide((s) => s - 1);
    } else {
      setStep("lang");
    }
  };

  const slides = ONBOARDING[lang];
  const isLast = slide === slides.length - 1;
  const nextLabel = lang === "ru" ? (isLast ? "Начать" : "Далее") : (isLast ? "Start" : "Next");
  const skipLabel = lang === "ru" ? "Пропустить" : "Skip";

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-40%" : "40%", opacity: 0 }),
  };

  return (
    <div className="relative min-h-screen min-h-dvh bg-[#090909] overflow-hidden flex flex-col items-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-lime-400/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-lime-400/5 rounded-full blur-[120px]" />
      </div>

      <AnimatePresence mode="wait">

        {/* ───── SPLASH ───── */}
        {step === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col items-center justify-center gap-6 w-full px-5"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-400 flex items-center justify-center shadow-2xl shadow-lime-400/20"
            >
              <Scan size={44} className="text-black" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight">
                BodyVision <span className="text-gradient-accent">AI</span>
              </h1>
              <p className="text-zinc-500 mt-2 text-sm">AI-тренер в твоём кармане</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex gap-1.5 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-lime-400"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ───── LANGUAGE PICKER ───── */}
        {step === "lang" && (
          <motion.div
            key="lang"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center gap-8 w-full px-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-400 flex items-center justify-center">
              <Globe size={28} className="text-black" />
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Choose language</h2>
              <p className="text-2xl font-bold tracking-tight text-zinc-500">Выберите язык</p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <motion.button

                onClick={() => pickLang("ru")}
                className="ios-card flex items-center gap-4 p-5 cursor-pointer active:opacity-80 transition-opacity"
              >
                <span className="text-4xl">🇷🇺</span>
                <div className="text-left">
                  <div className="font-semibold text-base">Русский</div>
                  <div className="text-sm text-zinc-500">Russian</div>
                </div>
              </motion.button>

              <motion.button

                onClick={() => pickLang("en")}
                className="ios-card flex items-center gap-4 p-5 cursor-pointer active:opacity-80 transition-opacity"
              >
                <span className="text-4xl">🇺🇸</span>
                <div className="text-left">
                  <div className="font-semibold text-base">English</div>
                  <div className="text-sm text-zinc-500">Английский</div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ───── ONBOARDING SLIDES ───── */}
        {step === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col w-full pt-safe"
          >
            {/* Skip */}
            <div className="flex justify-end px-6 py-3">
              <button
                onClick={() => { markOnboardingDone(); setStep("auth"); }}
                className="text-sm text-zinc-500 py-1 px-2 cursor-pointer"
              >
                {skipLabel}
              </button>
            </div>

            {/* Slide content */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 overflow-hidden">
              <AnimatePresence custom={dir} mode="wait">
                <motion.div
                  key={slide}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-col items-center text-center gap-6"
                >
                  <div className="text-8xl mb-2 float">{slides[slide].icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-3">
                      {slides[slide].title}
                    </h2>
                    <p className="text-zinc-400 text-base leading-relaxed max-w-xs">
                      {slides[slide].desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 py-6">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > slide ? 1 : -1); setSlide(i); }}
                  className={`onboarding-dot ${i === slide ? "active" : ""}`}
                />
              ))}
            </div>

            {/* Nav buttons */}
            <div className="px-5 pb-safe pb-10 flex items-center gap-3">
              {slide > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={goBack}
                  className="btn-secondary flex items-center justify-center w-14 h-14 rounded-2xl cursor-pointer shrink-0"
                >
                  <ChevronRight size={20} className="rotate-180 text-zinc-300" />
                </motion.button>
              )}
              <motion.button

                onClick={goNext}
                className="btn-primary flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl text-sm font-bold uppercase tracking-wider cursor-pointer"
              >
                {nextLabel}
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ───── AUTH CHOICE ───── */}
        {step === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex flex-col items-center justify-end gap-0 w-full"
          >
            {/* Hero top */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 pt-safe pt-12 text-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-400 flex items-center justify-center shadow-xl shadow-black/40">
                <Scan size={36} className="text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  BodyVision <span className="text-gradient-accent">AI</span>
                </h1>
                <p className="text-zinc-400 text-base max-w-xs mx-auto leading-relaxed">
                  {lang === "ru"
                    ? "Твой персональный AI-тренер. Анализ тела по фото за секунды."
                    : "Your personal AI trainer. Body analysis from a photo in seconds."}
                </p>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {(lang === "ru"
                  ? ["🔥 Анализ жира", "💪 Программа тренировок", "🥗 План питания"]
                  : ["🔥 Fat analysis", "💪 Workout plan", "🥗 Nutrition plan"]
                ).map((f) => (
                  <span
                    key={f}
                    className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA block */}
            <div className="w-full px-5 pb-safe pb-10 flex flex-col gap-3">
              <motion.button

                onClick={() => router.push("/register")}
                className="btn-primary w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wider cursor-pointer"
              >
                {lang === "ru" ? "Создать аккаунт" : "Create account"}
              </motion.button>
              <motion.button

                onClick={() => router.push("/register?mode=login")}
                className="btn-secondary w-full h-14 rounded-2xl text-sm font-semibold text-zinc-300 cursor-pointer"
              >
                {lang === "ru" ? "Уже есть аккаунт? Войти" : "Already have account? Sign in"}
              </motion.button>
              <p className="text-center text-xs text-zinc-600 mt-1">
                {lang === "ru"
                  ? "Нажимая, вы соглашаетесь с условиями использования"
                  : "By continuing you agree to the Terms of Service"}
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
