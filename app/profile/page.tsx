"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getUser, getProfile, setProfile } from "@/lib/auth";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    step1: "О тебе",
    step2: "Параметры",
    step3: "Тренировки",
    title1: "Кто ты?",
    title2: "Твои параметры",
    title3: "Где тренируешься?",
    sub1: "Это помогает AI точнее анализировать твоё тело",
    sub2: "AI учтёт рост, вес и возраст при анализе",
    sub3: "AI подберёт упражнения под твои условия",
    male: "Мужской",
    female: "Женский",
    height: "Рост (см)",
    heightPh: "178",
    weight: "Вес (кг)",
    weightPh: "75",
    age: "Возраст",
    agePh: "25",
    home: "Дома",
    homeDesc: "Упражнения с весом тела и гантелями",
    gym: "В зале",
    gymDesc: "Полный набор тренажёров и свободных весов",
    next: "Далее",
    back: "Назад",
    finish: "Начать!",
    errGender: "Выбери пол",
    errHeight: "Рост: 100–250 см",
    errWeight: "Вес: 30–300 кг",
    errAge: "Возраст: 10–100 лет",
    errLocation: "Выбери место тренировок",
    of: "из",
  },
  en: {
    step1: "About you",
    step2: "Parameters",
    step3: "Training",
    title1: "Who are you?",
    title2: "Your parameters",
    title3: "Where do you train?",
    sub1: "This helps AI analyze your body more accurately",
    sub2: "AI will consider height, weight and age during analysis",
    sub3: "AI will pick exercises suited to your environment",
    male: "Male",
    female: "Female",
    height: "Height (cm)",
    heightPh: "178",
    weight: "Weight (kg)",
    weightPh: "175",
    age: "Age",
    agePh: "25",
    home: "At home",
    homeDesc: "Bodyweight exercises and dumbbells",
    gym: "In the gym",
    gymDesc: "Full range of machines and free weights",
    next: "Next",
    back: "Back",
    finish: "Let's go!",
    errGender: "Select your gender",
    errHeight: "Height: 100–250 cm",
    errWeight: "Weight: 30–300 kg",
    errAge: "Age: 10–100",
    errLocation: "Select where you train",
    of: "of",
  },
} as const;

export default function ProfilePage() {
  const router = useRouter();
  const lang = useLang();
  const t = T[lang];

  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0); // 0, 1, 2
  const [dir, setDir] = useState(1);

  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState<"home" | "gym" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getUser()) { router.replace("/register"); return; }
    const p = getProfile();
    if (p) {
      setHeight(String(p.height));
      setWeight(String(p.weight));
      setAge(String(p.age));
      setGender(p.gender);
      setLocation(p.location ?? null);
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;

  const goNext = () => {
    setError("");
    if (step === 0) {
      if (!gender) return setError(t.errGender);
    } else if (step === 1) {
      const h = +height, w = +weight, a = +age;
      if (!h || h < 100 || h > 250) return setError(t.errHeight);
      if (!w || w < 30 || w > 300) return setError(t.errWeight);
      if (!a || a < 10 || a > 100) return setError(t.errAge);
    } else {
      if (!location) return setError(t.errLocation);
      const prev = getProfile();
      setProfile({
        height: +height,
        weight: +weight,
        age: +age,
        gender: gender!,
        location,
        goalMode: prev?.goalMode ?? "auto",
      });
      router.push("/dashboard");
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setError("");
    if (step === 0) { router.back(); return; }
    setDir(-1);
    setStep((s) => s - 1);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-40%" : "40%", opacity: 0 }),
  };

  const steps = [t.step1, t.step2, t.step3];
  const titles = [t.title1, t.title2, t.title3];
  const subs = [t.sub1, t.sub2, t.sub3];

  return (
    <div className="min-h-screen min-h-dvh bg-[#090909] flex flex-col">
      {/* iOS Nav */}
      <div className="flex items-center justify-between px-4 pt-safe pt-14 pb-2">
        <button onClick={goBack} className="flex items-center gap-1 text-lime-400 py-2 pr-3 cursor-pointer">
          <ChevronLeft size={22} />
          <span className="text-base font-medium">{t.back}</span>
        </button>
        <span className="text-sm text-zinc-500 font-medium">
          {step + 1} {t.of} {steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mx-6 mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-zinc-300 to-lime-400 rounded-full"
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>

      {/* Title */}
      <div className="px-6 pt-8 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step + "-title"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            <h1 className="text-2xl font-bold tracking-tight mb-1">{titles[step]}</h1>
            <p className="text-sm text-zinc-500">{subs[step]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 overflow-hidden">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Step 0: Gender */}
            {step === 0 && (
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => setGender("male")}
                  className={`ios-pill justify-start gap-5 py-5 ${gender === "male" ? "active" : ""}`}
                >
                  <span className="text-4xl">👨</span>
                  <div className="text-left">
                    <div className="font-semibold text-base text-white">{t.male}</div>
                  </div>
                  {gender === "male" && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5l3 3 7-7" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setGender("female")}
                  className={`ios-pill justify-start gap-5 py-5 ${gender === "female" ? "active" : ""}`}
                >
                  <span className="text-4xl">👩</span>
                  <div className="text-left">
                    <div className="font-semibold text-base text-white">{t.female}</div>
                  </div>
                  {gender === "female" && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5l3 3 7-7" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            )}

            {/* Step 1: Params */}
            {step === 1 && (
              <div className="flex flex-col gap-5 mt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    {t.height}
                  </label>
                  <input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={t.heightPh}
                    inputMode="numeric"
                    className="ios-input text-center text-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    {t.weight}
                  </label>
                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={t.weightPh}
                    inputMode="numeric"
                    className="ios-input text-center text-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    {t.age}
                  </label>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder={t.agePh}
                    inputMode="numeric"
                    className="ios-input text-center text-xl font-bold"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={() => setLocation("home")}
                  className={`ios-pill justify-start gap-5 py-5 ${location === "home" ? "active" : ""}`}
                >
                  <span className="text-4xl">🏠</span>
                  <div className="text-left">
                    <div className="font-semibold text-base text-white">{t.home}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{t.homeDesc}</div>
                  </div>
                  {location === "home" && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center shrink-0">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5l3 3 7-7" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
                <button
                  onClick={() => setLocation("gym")}
                  className={`ios-pill justify-start gap-5 py-5 ${location === "gym" ? "active" : ""}`}
                >
                  <span className="text-4xl">🏋️</span>
                  <div className="text-left">
                    <div className="font-semibold text-base text-white">{t.gym}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{t.gymDesc}</div>
                  </div>
                  {location === "gym" && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center shrink-0">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5l3 3 7-7" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom button */}
      <div className="px-6 pb-safe pb-12 pt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goNext}
          className="btn-primary w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          {step === 2 ? t.finish : t.next}
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
