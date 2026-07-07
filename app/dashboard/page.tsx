"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan, LogOut, Camera, Loader2, Trophy, Flame, Star, Zap,
  CalendarDays, History, Crown, ArrowUpRight, UploadCloud,
  CheckCircle2, AlertTriangle, Dumbbell, UtensilsCrossed,
  User as UserIcon, Lock,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import {
  getUser, getHistory, getProfile, addAnalysisFull, updateProfile, logout,
  type User, type Profile, type AnalysisRecord, type GoalMode,
} from "@/lib/auth";
import { analyzePhoto } from "@/lib/gemini";
import { useLang } from "@/lib/i18n";
import CoachChat from "@/components/CoachChat";

const PLAN_LABEL = { free: "Free", pro: "Pro", premium: "Premium" } as const;
const FREE_INTERVAL_MS = 60 * 24 * 3600 * 1000; /* Free: 1 анализ раз в 2 месяца */

const T = {
  ru: {
    home: "дом", gym: "зал", years: "лет", upgrade: "Улучшить",
    hi: "Привет,",
    emptyHint: "Загрузите фото тела — AI проанализирует его и составит программу под ваши параметры.",
    countHint: (n: number) => `Анализов выполнено: ${n}. Так держать!`,
    modes: { auto: "Авто (AI решит)", lose: "Похудение", gain: "Набор массы", both: "Оба сразу" },
    modeTitle: "Режим программы",
    modeNote: "применится при следующем анализе",
    uploadHint: "Нажмите, чтобы загрузить фото тела",
    analysisTitle: "AI-анализ по фотографии",
    analysisHint: (age: number) => `Лучше всего — фото в полный рост, при хорошем освещении, в облегающей одежде или спортивной форме. AI учтёт ваш пол, возраст (${age}), рост и вес.`,
    freeLimit: (d: string) => `Лимит Free: 1 анализ раз в 2 месяца. Следующий — ${d}.`,
    unlock: "Открыть безлимит",
    analyzing: "AI изучает фото…",
    analyzeBtn: "Анализировать фото",
    stages: ["Отправляем фото в Gemini…", "AI оценивает мышцы, жир и осанку…", "Составляем программу и питание…"],
    invalidDefault: "AI не смог распознать тело на фото. Попробуйте другое фото.",
    netError: "Ошибка сети. Попробуйте ещё раз.",
    resultTitle: "Результат последнего анализа",
    goal: "Цель",
    metrics: { fat: "Жир", muscle: "Мышцы", posture: "Осанка", symmetry: "Симметрия", score: "Score" },
    strengths: "Сильные стороны", weaknesses: "Над чем работать", recs: "Рекомендации AI",
    workout: "Персональная программа тренировок",
    nutrition: "Питание",
    nutritionFor: (g: string, a: number) => `(подобрано для: ${g}, ${a} ${a % 10 === 1 && a % 100 !== 11 ? "год" : "лет"})`,
    man: "мужчина", woman: "женщина",
    kcal: "Калории", protein: "Белки", fats: "Жиры", carbs: "Углеводы",
    menu: "Меню на день", tips: "Советы",
    freeMoreTitle: "Полный отчёт — на Pro",
    freeMoreText: "Зоны тела, сильные и слабые стороны, персональные тренировки и план питания открываются на платных тарифах.",
    freeMoreBtn: "Открыть полный отчёт",
    chart: "Динамика показателей",
    chartEmpty: "Сделайте минимум два анализа, чтобы увидеть график прогресса",
    fatSeries: "Жир %", muscleSeries: "Мышцы %",
    achievements: "Достижения",
    achList: ["Первый анализ", "Серия 7 дней", "−1% жира", "Score 90+", "5 анализов"],
    calendar: "Календарь тренировок",
    calendarEmpty: "— появится после первого анализа",
    rest: "Отдых",
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    dayPrefixes: ["пон", "вт", "ср", "чет", "пят", "суб", "вос"],
    history: "История анализов",
    historyEmpty: "Пока пусто — загрузите фото и запустите первый анализ.",
  },
  en: {
    home: "home", gym: "gym", years: "y.o.", upgrade: "Upgrade",
    hi: "Hi,",
    emptyHint: "Upload a body photo — the AI will analyze it and build a program for your parameters.",
    countHint: (n: number) => `Analyses completed: ${n}. Keep it up!`,
    modes: { auto: "Auto (AI decides)", lose: "Weight loss", gain: "Muscle gain", both: "Both at once" },
    modeTitle: "Program mode",
    modeNote: "applies to the next analysis",
    uploadHint: "Click to upload a body photo",
    analysisTitle: "AI photo analysis",
    analysisHint: (age: number) => `Best: a full-body photo in good lighting, in fitted clothes or sportswear. The AI will consider your gender, age (${age}), height and weight.`,
    freeLimit: (d: string) => `Free limit: 1 analysis every 2 months. Next one — ${d}.`,
    unlock: "Unlock unlimited",
    analyzing: "AI is studying the photo…",
    analyzeBtn: "Analyze photo",
    stages: ["Sending photo to Gemini…", "AI is scoring muscle, fat and posture…", "Building your program and nutrition…"],
    invalidDefault: "The AI could not detect a body in the photo. Try another one.",
    netError: "Network error. Please try again.",
    resultTitle: "Latest analysis result",
    goal: "Goal",
    metrics: { fat: "Fat", muscle: "Muscle", posture: "Posture", symmetry: "Symmetry", score: "Score" },
    strengths: "Strengths", weaknesses: "To work on", recs: "AI recommendations",
    workout: "Personal workout program",
    nutrition: "Nutrition",
    nutritionFor: (g: string, a: number) => `(tailored for: ${g}, ${a} y.o.)`,
    man: "male", woman: "female",
    kcal: "Calories", protein: "Protein", fats: "Fats", carbs: "Carbs",
    menu: "Daily menu", tips: "Tips",
    freeMoreTitle: "Full report — on Pro",
    freeMoreText: "Body zones, strengths and weaknesses, personal workouts and a nutrition plan unlock on paid plans.",
    freeMoreBtn: "Unlock full report",
    chart: "Metrics dynamics",
    chartEmpty: "Complete at least two analyses to see the progress chart",
    fatSeries: "Fat %", muscleSeries: "Muscle %",
    achievements: "Achievements",
    achList: ["First analysis", "7-day streak", "−1% fat", "Score 90+", "5 analyses"],
    calendar: "Workout calendar",
    calendarEmpty: "— appears after your first analysis",
    rest: "Rest",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    dayPrefixes: ["пон", "вт", "ср", "чет", "пят", "суб", "вос"],
    history: "Analysis history",
    historyEmpty: "Empty so far — upload a photo and run your first analysis.",
  },
} as const;

const achIcons = [Camera, Flame, Zap, Star, Trophy];
const achUnlocks = [1, 2, 2, 3, 5];

const ratingTone = (r: string) =>
  /отличн|хорош|excellent|good|strong/i.test(r)
    ? "text-lime-300"
    : /средн|average|medium/i.test(r)
    ? "text-zinc-400"
    : "text-zinc-500";

export default function DashboardPage() {
  const router = useRouter();
  const lang = useLang();
  const t = T[lang];
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiNote, setApiNote] = useState<string | null>(null);
  const [invalidReason, setInvalidReason] = useState<string | null>(null);
  const [modeOpen, setModeOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/register");
      return;
    }
    if (!getProfile()) {
      router.replace("/profile");
      return;
    }
    setUser(u);
    setProfileState(getProfile());
    setHistory(getHistory());
  }, [router]);

  const onFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
    setInvalidReason(null);
  };

  /* Free: 1 анализ раз в 2 месяца */
  const lastTs = history[0] ? new Date(history[0].date).getTime() : 0;
  const freeLimitReached =
    user?.plan === "free" && lastTs > 0 && Date.now() - lastTs < FREE_INTERVAL_MS;
  const nextFreeDate = new Date(lastTs + FREE_INTERVAL_MS).toLocaleDateString(
    lang === "en" ? "en-US" : "ru-RU",
    { day: "numeric", month: "long" }
  );

  const runAnalysis = async () => {
    if (scanning || !photo || !profile || freeLimitReached) return;
    setScanning(true);
    setProgress(0);
    setApiNote(null);
    setInvalidReason(null);

    const ticker = setInterval(() => setProgress((p) => (p >= 92 ? 92 : p + 2)), 350);

    try {
      const data = await analyzePhoto(photo, profile, lang);
      clearInterval(ticker);
      setProgress(100);

      if (!data.result.valid) {
        setInvalidReason(data.result.reason ?? t.invalidDefault);
        return;
      }
      if (data.note) setApiNote(data.note);
      addAnalysisFull(data.result, data.source);
      setHistory(getHistory());
    } catch (e) {
      clearInterval(ticker);
      setInvalidReason(e instanceof Error ? e.message : t.netError);
    } finally {
      setScanning(false);
    }
  };

  const exit = () => {
    logout();
    router.push("/");
  };

  if (!user || !profile) return null;

  const isFree = user.plan === "free";
  const latest = history[0]?.full;
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  const schedule: string[] = latest
    ? t.days.map((_, i) => {
        const w = latest.workout.find(
          (d) =>
            d.day.toLowerCase().startsWith(t.dayPrefixes[i]) ||
            d.day.toLowerCase().startsWith(["mon", "tue", "wed", "thu", "fri", "sat", "sun"][i])
        );
        return w ? w.focus : t.rest;
      })
    : ["—", "—", "—", "—", "—", "—", "—"];

  const chartData = [...history]
    .reverse()
    .map((h, i) => ({ name: `#${i + 1}`, fat: h.bodyFat, muscle: h.muscle }));

  const genderLabel = profile.gender === "female" ? t.woman : t.man;

  return (
    <main className="relative min-h-screen pb-20">
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-white/[0.04] rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -right-40 w-[32rem] h-[32rem] bg-lime-400/5 rounded-full blur-[140px]" />

      {/* header */}
      <header className="glass sticky top-0 z-40 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-500">
              <Scan size={18} className="text-black" />
            </span>
            <span className="text-lg font-semibold hidden sm:block">
              BodyVision <span className="text-gradient-accent">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="btn-secondary hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-300 px-3.5 py-2 rounded-full"
            >
              <UserIcon size={12} />
              {profile.height} · {profile.weight} · {profile.age} {t.years} ·{" "}
              {profile.location === "gym" ? t.gym : t.home}
            </Link>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${
                isFree ? "border-white/15 text-zinc-300" : "border-lime-400/40 bg-lime-400/10 text-lime-300"
              }`}
            >
              {!isFree && <Crown size={12} />}
              {PLAN_LABEL[user.plan]}
            </span>
            {isFree && (
              <Link href="/plans" className="btn-primary text-xs px-4 py-2 rounded-full hidden sm:inline-flex items-center gap-1">
                {t.upgrade} <ArrowUpRight size={13} />
              </Link>
            )}
            <button
              onClick={exit}
              className="btn-secondary grid place-items-center w-9 h-9 rounded-full text-zinc-400 hover:text-white cursor-pointer"
              aria-label="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-6 pt-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t.hi} <span className="text-gradient-accent">{user.name}</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            {history.length === 0 ? t.emptyHint : t.countHint(history.length)}
          </p>
        </motion.div>

        {/* photo upload + analysis */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass relative rounded-3xl p-6 sm:p-8 mt-8"
        >
          {/* табличка выбора режима — правый верхний угол */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setModeOpen((o) => !o)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide rounded-full border border-lime-400/50 bg-lime-400/10 text-lime-300 px-4 py-2 cursor-pointer hover:bg-lime-400/20 transition-colors"
            >
              <Flame size={13} />
              {t.modes[profile.goalMode ?? "auto"]}
              <span className={`transition-transform ${modeOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            <AnimatePresence>
              {modeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/60 overflow-hidden"
                >
                  <div className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-white/5">
                    {t.modeTitle}
                  </div>
                  {(Object.keys(t.modes) as GoalMode[]).map((id) => {
                    const active = (profile.goalMode ?? "auto") === id;
                    const locked = isFree && id !== "auto";
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          if (locked) {
                            router.push("/plans");
                            return;
                          }
                          const updated = updateProfile({ goalMode: id });
                          if (updated) setProfileState(updated);
                          setModeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors cursor-pointer ${
                          active
                            ? "bg-lime-400/15 text-lime-300 font-semibold"
                            : locked
                            ? "text-zinc-600 hover:bg-white/5"
                            : "text-zinc-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {t.modes[id]}
                        {active ? <span>✓</span> : locked ? <Lock size={13} /> : null}
                      </button>
                    );
                  })}
                  <div className="px-4 py-2.5 text-[10px] text-zinc-600 border-t border-white/5">
                    {t.modeNote}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => fileRef.current?.click()}
              className="relative w-full md:w-56 h-56 shrink-0 rounded-2xl border-2 border-dashed border-white/15 hover:border-lime-400/50 transition-colors overflow-hidden grid place-items-center cursor-pointer bg-white/[0.02]"
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <span className="flex flex-col items-center gap-3 text-zinc-500 text-sm px-4 text-center">
                  <UploadCloud size={28} />
                  {t.uploadHint}
                </span>
              )}
              {photo && scanning && (
                <span className="scanline absolute left-2 right-2 h-px bg-gradient-to-r from-transparent via-lime-400 to-transparent shadow-[0_0_24px_4px_rgba(163,230,53,0.5)]" />
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </button>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="font-semibold mb-2 flex items-center gap-2">
                <Camera size={17} className="text-lime-300" /> {t.analysisTitle}
              </h2>
              <p className="text-sm text-zinc-400 mb-5">{t.analysisHint(profile.age)}</p>

              {freeLimitReached ? (
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-sm text-zinc-300">{t.freeLimit(nextFreeDate)}</p>
                  <Link href="/plans" className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full">
                    {t.unlock} <ArrowUpRight size={14} />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={runAnalysis}
                  disabled={scanning || !photo}
                  className="btn-primary self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-full disabled:opacity-40 cursor-pointer"
                >
                  {scanning ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> {t.analyzing}
                    </>
                  ) : (
                    <>
                      <Scan size={18} /> {t.analyzeBtn}
                    </>
                  )}
                </button>
              )}

              {scanning && (
                <div className="mt-5">
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-lime-400 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-zinc-500 font-mono">
                    {progress < 30 ? t.stages[0] : progress < 65 ? t.stages[1] : t.stages[2]}
                  </div>
                </div>
              )}

              {invalidReason && (
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 text-sm text-zinc-200">
                  <AlertTriangle size={17} className="shrink-0 mt-0.5" />
                  {invalidReason}
                </div>
              )}
              {apiNote && <p className="mt-4 text-xs text-zinc-500">{apiNote}</p>}
            </div>
          </div>
        </motion.section>

        {/* latest result */}
        <AnimatePresence>
          {latest && (
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-6 sm:p-8 mt-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-lime-300" /> {t.resultTitle}
                </h2>
                {latest.goal && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider rounded-full border border-lime-400/40 bg-lime-400/10 text-lime-300 px-4 py-1.5">
                    <Flame size={12} /> {t.goal}: {latest.goal}
                  </span>
                )}
              </div>

              {/* key metrics: Free видит только 3 */}
              <div className={`grid grid-cols-2 ${isFree ? "lg:grid-cols-3" : "lg:grid-cols-5"} gap-4 mb-8`}>
                {(isFree
                  ? [
                      [t.metrics.fat, `${latest.bodyFat}%`],
                      [t.metrics.muscle, `${latest.muscle}%`],
                      [t.metrics.score, `${latest.score}/100`],
                    ]
                  : [
                      [t.metrics.fat, `${latest.bodyFat}%`],
                      [t.metrics.muscle, `${latest.muscle}%`],
                      [t.metrics.posture, `${latest.posture}/100`],
                      [t.metrics.symmetry, latest.symmetry],
                      [t.metrics.score, `${latest.score}/100`],
                    ]
                ).map(([k, v]) => (
                  <div key={k} className="glass rounded-2xl p-4 text-center">
                    <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">{k}</div>
                    <div className="text-lg font-bold text-gradient-accent">{v}</div>
                  </div>
                ))}
              </div>

              {/* recommendations: Free — только 2 */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold mb-3">{t.recs}</h3>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {(isFree ? latest.recommendations.slice(0, 2) : latest.recommendations).map((r) => (
                    <div key={r} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <CheckCircle2 size={15} className="text-lime-400 mt-0.5 shrink-0" /> {r}
                    </div>
                  ))}
                </div>
              </div>

              {isFree ? (
                /* Free: остальное под замком */
                <div className="relative rounded-2xl border border-lime-400/25 bg-lime-400/5 p-8 text-center">
                  <span className="grid place-items-center w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/25 mx-auto mb-4">
                    <Lock size={20} className="text-lime-300" />
                  </span>
                  <h3 className="font-semibold mb-2">{t.freeMoreTitle}</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto mb-5">{t.freeMoreText}</p>
                  <Link href="/plans" className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-3 rounded-full">
                    {t.freeMoreBtn} <ArrowUpRight size={14} />
                  </Link>
                </div>
              ) : (
                <>
                  {/* zones */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
                    {latest.zones.map((z) => (
                      <div key={z.name} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3">
                        <span className="text-sm text-zinc-300">{z.name}</span>
                        <span className={`text-xs font-semibold ${ratingTone(z.rating)}`}>{z.rating}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                      <h3 className="text-sm font-semibold mb-3 text-lime-300">{t.strengths}</h3>
                      <ul className="space-y-2">
                        {latest.strengths.map((s) => (
                          <li key={s} className="flex items-start gap-2.5 text-sm text-zinc-300">
                            <CheckCircle2 size={15} className="text-lime-400 mt-0.5 shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                      <h3 className="text-sm font-semibold mb-3 text-zinc-400">{t.weaknesses}</h3>
                      <ul className="space-y-2">
                        {latest.weaknesses.map((s) => (
                          <li key={s} className="flex items-start gap-2.5 text-sm text-zinc-400">
                            <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* workout plan */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <Dumbbell size={15} className="text-lime-300" /> {t.workout}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {latest.workout.map((d) => (
                        <div key={d.day} className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-1">{d.day}</div>
                          <div className="font-semibold text-sm mb-3">{d.focus}</div>
                          <ul className="space-y-1.5">
                            {d.exercises.map((e) => (
                              <li key={e.name} className="flex justify-between gap-3 text-xs text-zinc-400">
                                <span>{e.name}</span>
                                <span className="font-mono text-lime-300/80 shrink-0">{e.sets}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* nutrition */}
                  <div>
                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <UtensilsCrossed size={15} className="text-lime-300" /> {t.nutrition}{" "}
                      <span className="text-zinc-500 font-normal">{t.nutritionFor(genderLabel, profile.age)}</span>
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                      {[
                        [t.kcal, `${latest.nutrition.calories}`],
                        [t.protein, `${latest.nutrition.protein} g`],
                        [t.fats, `${latest.nutrition.fats} g`],
                        [t.carbs, `${latest.nutrition.carbs} g`],
                      ].map(([k, v]) => (
                        <div key={k} className="glass rounded-2xl p-4 text-center">
                          <div className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">{k}</div>
                          <div className="text-lg font-bold">{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                        <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">{t.menu}</h4>
                        <ul className="space-y-2">
                          {latest.nutrition.meals.map((m) => (
                            <li key={m} className="text-sm text-zinc-300">{m}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                        <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">{t.tips}</h4>
                        <ul className="space-y-2">
                          {latest.nutrition.tips.map((tip) => (
                            <li key={tip} className="flex items-start gap-2.5 text-sm text-zinc-300">
                              <CheckCircle2 size={15} className="text-lime-400 mt-0.5 shrink-0" /> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* progress chart */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass rounded-3xl p-6 sm:p-8 lg:col-span-2"
          >
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <Zap size={17} className="text-lime-300" /> {t.chart}
            </h2>
            {chartData.length < 2 ? (
              <div className="h-64 grid place-items-center text-sm text-zinc-500 text-center px-8">
                {t.chartEmpty}
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashFat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a1a1aa" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#a1a1aa" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="dashMuscle" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a3e635" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15,15,15,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 14,
                        color: "#f4f4f5",
                        fontSize: 13,
                      }}
                    />
                    <Area type="monotone" dataKey="fat" name={t.fatSeries} stroke="#a1a1aa" strokeWidth={2.5} fill="url(#dashFat)" />
                    <Area type="monotone" dataKey="muscle" name={t.muscleSeries} stroke="#a3e635" strokeWidth={2.5} fill="url(#dashMuscle)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.section>

          {/* achievements */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-3xl p-6 sm:p-8"
          >
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <Trophy size={17} className="text-lime-300" /> {t.achievements}
            </h2>
            <div className="space-y-3">
              {t.achList.map((title, i) => {
                const Icon = achIcons[i];
                const unlocked = history.length >= achUnlocks[i];
                return (
                  <div
                    key={title}
                    className={`flex items-center gap-3 rounded-2xl border p-3.5 transition-colors ${
                      unlocked ? "border-lime-400/25 bg-lime-400/5" : "border-white/5 bg-white/[0.02] opacity-50"
                    }`}
                  >
                    <span
                      className={`grid place-items-center w-9 h-9 rounded-xl ${
                        unlocked ? "bg-lime-400/15" : "bg-white/5"
                      }`}
                    >
                      <Icon size={16} className={unlocked ? "text-lime-300" : "text-zinc-500"} />
                    </span>
                    <span className="text-sm">{title}</span>
                    {unlocked && <Star size={13} className="ml-auto fill-lime-400 text-lime-400" />}
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* calendar */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="glass rounded-3xl p-6 sm:p-8 lg:col-span-2"
          >
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <CalendarDays size={17} className="text-lime-300" /> {t.calendar}
              {!latest && <span className="text-xs text-zinc-500 font-normal">{t.calendarEmpty}</span>}
            </h2>
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {t.days.map((d, i) => (
                <div
                  key={d}
                  className={`rounded-2xl border p-2 sm:p-3 text-center min-h-24 flex flex-col ${
                    i === todayIdx ? "border-lime-400/50 bg-lime-400/10" : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <span className={`text-xs font-semibold mb-2 ${i === todayIdx ? "text-lime-300" : "text-zinc-500"}`}>
                    {d}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight m-auto">
                    {schedule[i]}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* history */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-3xl p-6 sm:p-8"
          >
            <h2 className="font-semibold mb-6 flex items-center gap-2">
              <History size={17} className="text-lime-300" /> {t.history}
            </h2>
            {history.length === 0 ? (
              <p className="text-sm text-zinc-500">{t.historyEmpty}</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                <AnimatePresence initial={false}>
                  {history.map((h) => (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-zinc-500">
                          {new Date(h.date).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-xs font-semibold text-gradient-accent">Score {h.score}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-zinc-400">
                        <span>{t.metrics.fat} {h.bodyFat}%</span>
                        <span>{t.metrics.muscle} {h.muscle}%</span>
                        <span>{t.metrics.posture} {h.posture}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>
        </div>
      </div>

      {/* AI-коуч (Premium) */}
      <CoachChat user={user} profile={profile} latest={latest} lang={lang} />
    </main>
  );
}
