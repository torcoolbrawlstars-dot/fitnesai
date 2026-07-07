"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scan, ArrowRight, Ruler, Scale, Cake, Home, Dumbbell } from "lucide-react";
import { getUser, getProfile, setProfile } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import Link from "next/link";

const T = {
  ru: {
    title: "Расскажите о себе",
    sub: "AI использует эти данные, чтобы точнее проанализировать фото и подобрать тренировки и питание именно под вас.",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    where: "Где тренируетесь?",
    home: "Дома",
    gym: "В зале",
    height: "Рост",
    weight: "Вес",
    age: "Возраст",
    next: "Продолжить",
    note: "Данные хранятся только в вашем браузере и передаются AI только при анализе фото.",
    errGender: "Выберите пол",
    errLocation: "Выберите, где будете тренироваться",
    errHeight: "Укажите рост от 100 до 250 см",
    errWeight: "Укажите вес от 30 до 300 кг",
    errAge: "Укажите возраст от 10 до 100 лет",
  },
  en: {
    title: "Tell us about yourself",
    sub: "The AI uses this data to analyze your photo more accurately and tailor workouts and nutrition to you.",
    gender: "Gender",
    male: "Male",
    female: "Female",
    where: "Where do you train?",
    home: "At home",
    gym: "In the gym",
    height: "Height",
    weight: "Weight",
    age: "Age",
    next: "Continue",
    note: "Data is stored only in your browser and sent to the AI only during photo analysis.",
    errGender: "Choose your gender",
    errLocation: "Choose where you will train",
    errHeight: "Enter a height from 100 to 250 cm",
    errWeight: "Enter a weight from 30 to 300 kg",
    errAge: "Enter an age from 10 to 100",
  },
} as const;

export default function ProfilePage() {
  const router = useRouter();
  const t = T[useLang()];
  const [ready, setReady] = useState(false);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [location, setLocation] = useState<"home" | "gym" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getUser()) {
      router.replace("/register");
      return;
    }
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = +height, w = +weight, a = +age;
    if (!gender) return setError(t.errGender);
    if (!location) return setError(t.errLocation);
    if (!h || h < 100 || h > 250) return setError(t.errHeight);
    if (!w || w < 30 || w > 300) return setError(t.errWeight);
    if (!a || a < 10 || a > 100) return setError(t.errAge);
    const prev = getProfile();
    setProfile({ height: h, weight: w, age: a, gender, location, goalMode: prev?.goalMode ?? "auto" });
    router.push("/dashboard");
  };

  if (!ready) return null;

  const inputCls =
    "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-lime-400/60 transition-colors placeholder:text-zinc-600";
  const pill = (active: boolean) =>
    `flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
      active
        ? "border-lime-400/60 bg-lime-400/10 text-lime-300"
        : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"
    }`;

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

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.gender}</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setGender("male")} className={pill(gender === "male")}>
                {t.male}
              </button>
              <button type="button" onClick={() => setGender("female")} className={pill(gender === "female")}>
                {t.female}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">{t.where}</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setLocation("home")} className={pill(location === "home")}>
                <Home size={15} /> {t.home}
              </button>
              <button type="button" onClick={() => setLocation("gym")} className={pill(location === "gym")}>
                <Dumbbell size={15} /> {t.gym}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs uppercase tracking-wider text-zinc-500 mb-2">
                <Ruler size={11} /> {t.height}
              </label>
              <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="178" inputMode="numeric" className={inputCls} />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs uppercase tracking-wider text-zinc-500 mb-2">
                <Scale size={11} /> {t.weight}
              </label>
              <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="75" inputMode="numeric" className={inputCls} />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs uppercase tracking-wider text-zinc-500 mb-2">
                <Cake size={11} /> {t.age}
              </label>
              <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" inputMode="numeric" className={inputCls} />
            </div>
          </div>

          {error && <p className="text-sm text-zinc-200 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">{error}</p>}

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full cursor-pointer">
            {t.next} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-xs text-zinc-500 mt-6 text-center">{t.note}</p>
      </motion.div>
    </main>
  );
}
