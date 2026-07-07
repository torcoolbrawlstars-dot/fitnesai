"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan, LogOut, Camera, Loader2, Trophy, Flame, Star, Zap,
  CalendarDays, History, Crown, ArrowUpRight, UploadCloud,
  CheckCircle2, AlertTriangle, Dumbbell, UtensilsCrossed,
  User as UserIcon, Lock, Settings, ChevronRight, BarChart2,
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
import TabBar, { type TabId } from "@/components/TabBar";

const PLAN_LABEL = { free: "Free", pro: "Pro", premium: "Premium" } as const;
const FREE_INTERVAL_MS = 60 * 24 * 3600 * 1000;

const T = {
  ru: {
    home: "дом", gym: "зал", years: "лет", upgrade: "Улучшить",
    hi: "Привет,",
    emptyHint: "Перейди на вкладку Сканирование — загрузи фото и получи AI-анализ",
    countHint: (n: number) => `Выполнено анализов: ${n}. Отличный результат! 💪`,
    modes: { auto: "Авто (AI решит)", lose: "Похудение", gain: "Набор массы", both: "Оба сразу" },
    modeTitle: "Режим программы",
    modeNote: "применится при следующем анализе",
    uploadHint: "Нажми для загрузки фото",
    uploadSub: "Лучше — в полный рост при хорошем освещении",
    analysisTitle: "AI-анализ по фотографии",
    analysisHint: (age: number) => `AI учтёт твой пол, возраст (${age}), рост и вес`,
    freeLimit: (d: string) => `Лимит Free: 1 анализ раз в 2 месяца. Следующий — ${d}.`,
    unlock: "Открыть безлимит",
    analyzing: "AI анализирует…",
    analyzeBtn: "Анализировать",
    stages: ["Отправляем в Gemini…", "AI оценивает мышцы и жир…", "Составляем программу…"],
    invalidDefault: "AI не смог распознать тело. Попробуй другое фото.",
    netError: "Ошибка сети. Попробуй ещё раз.",
    resultTitle: "Результат анализа",
    goal: "Цель",
    metrics: { fat: "Жир", muscle: "Мышцы", posture: "Осанка", symmetry: "Симметрия", score: "Score" },
    strengths: "Сильные стороны", weaknesses: "Над чем работать", recs: "Рекомендации AI",
    workout: "Программа тренировок",
    nutrition: "Питание",
    nutritionFor: (g: string, a: number) => `для ${g}, ${a} лет`,
    man: "мужчина", woman: "женщина",
    kcal: "Калории", protein: "Белки", fats: "Жиры", carbs: "Углеводы",
    menu: "Меню на день", tips: "Советы",
    freeMoreTitle: "Полный отчёт — на Pro",
    freeMoreText: "Персональные тренировки и питание открываются на платных тарифах.",
    freeMoreBtn: "Открыть",
    chart: "Прогресс",
    chartEmpty: "Сделай минимум 2 анализа, чтобы увидеть динамику",
    fatSeries: "Жир %", muscleSeries: "Мышцы %",
    achievements: "Достижения",
    achList: ["Первый анализ", "7 дней подряд", "−1% жира", "Score 90+", "5 анализов"],
    calendar: "Расписание",
    calendarEmpty: "Появится после первого анализа",
    rest: "Отдых",
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    dayPrefixes: ["пон", "вт", "ср", "чет", "пят", "суб", "вос"],
    history: "История",
    historyEmpty: "Пока пусто. Загрузи фото и сделай первый анализ!",
    plan: "Тариф",
    editProfile: "Редактировать профиль",
    logout: "Выйти",
    noResult: "Нет данных",
    scanTabTitle: "Сканирование тела",
    trainingTabTitle: "Программа",
    trainingReadyTitle: "Программа готова!",
    trainingReadyDesc: "Перейдите во вкладку Тренировки",
    trainingEmptyTitle: "Нет программы",
    trainingEmptyDesc: "Сделайте сканирование тела, чтобы ИИ составил план",
    homeTabTitle: "Обзор",
    progressTabTitle: "Прогресс",
    profileTabTitle: "Профиль",
  },
  en: {
    home: "home", gym: "gym", years: "y.o.", upgrade: "Upgrade",
    hi: "Hi,",
    emptyHint: "Go to the Scan tab — upload a photo and get your AI analysis",
    countHint: (n: number) => `Analyses done: ${n}. Keep it up! 💪`,
    modes: { auto: "Auto (AI decides)", lose: "Weight loss", gain: "Muscle gain", both: "Both" },
    modeTitle: "Program mode",
    modeNote: "applies to the next analysis",
    uploadHint: "Tap to upload a photo",
    uploadSub: "Best: full-body shot in good lighting",
    analysisTitle: "AI photo analysis",
    analysisHint: (age: number) => `AI will consider your gender, age (${age}), height and weight`,
    freeLimit: (d: string) => `Free limit: 1 analysis every 2 months. Next — ${d}.`,
    unlock: "Unlock unlimited",
    analyzing: "AI is analyzing…",
    analyzeBtn: "Analyze",
    stages: ["Sending to Gemini…", "AI scoring muscles & fat…", "Building your program…"],
    invalidDefault: "AI couldn't detect a body. Try a different photo.",
    netError: "Network error. Please try again.",
    resultTitle: "Analysis result",
    goal: "Goal",
    metrics: { fat: "Fat", muscle: "Muscle", posture: "Posture", symmetry: "Symmetry", score: "Score" },
    strengths: "Strengths", weaknesses: "To work on", recs: "AI recommendations",
    workout: "Workout program",
    nutrition: "Nutrition",
    nutritionFor: (g: string, a: number) => `for ${g}, ${a} y.o.`,
    man: "male", woman: "female",
    kcal: "Calories", protein: "Protein", fats: "Fats", carbs: "Carbs",
    menu: "Daily menu", tips: "Tips",
    freeMoreTitle: "Full report — on Pro",
    freeMoreText: "Personal workouts and nutrition unlock on paid plans.",
    freeMoreBtn: "Unlock",
    chart: "Progress",
    chartEmpty: "Complete at least 2 analyses to see dynamics",
    fatSeries: "Fat %", muscleSeries: "Muscle %",
    achievements: "Achievements",
    achList: ["First analysis", "7-day streak", "−1% fat", "Score 90+", "5 analyses"],
    calendar: "Schedule",
    calendarEmpty: "Appears after first analysis",
    rest: "Rest",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    dayPrefixes: ["пон", "вт", "ср", "чет", "пят", "суб", "вос"],
    history: "History",
    historyEmpty: "Empty. Upload a photo and run your first analysis!",
    plan: "Plan",
    editProfile: "Edit profile",
    logout: "Sign out",
    noResult: "No data",
    scanTabTitle: "Body Scan",
    trainingTabTitle: "Program",
    trainingReadyTitle: "Program is ready!",
    trainingReadyDesc: "Go to the Training tab",
    trainingEmptyTitle: "No program",
    trainingEmptyDesc: "Complete a body scan for AI to build your plan",
    homeTabTitle: "Overview",
    progressTabTitle: "Progress",
    profileTabTitle: "Profile",
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

/* ─── Sub-screens ─── */

function HomeTab({ user, profile, history, t, lang, router }: {
  user: User; profile: Profile; history: AnalysisRecord[];
  t: (typeof T)[keyof typeof T]; lang: "ru" | "en"; router: ReturnType<typeof useRouter>;
}) {
  const latest = history[0]?.full;
  const isFree = user.plan === "free";

  return (
    <div className="flex-1 overflow-y-auto pb-tab">
      {/* iOS Large Title */}
      <div className="px-5 pt-safe pt-16 pb-4">
        <p className="text-sm text-zinc-500 font-medium">{t.hi}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient-accent">{user.name}</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {history.length === 0 ? t.emptyHint : t.countHint(history.length)}
        </p>
      </div>

      {/* Plan badge + upgrade */}
      {isFree && (
        <div className="mx-5 mb-4">
          <div className="ios-card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-lime-400" />
              <span className="text-sm font-semibold">Free план</span>
            </div>
            <Link
              href="/plans"
              className="btn-primary text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
            >
              {t.upgrade} <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      )}

      {/* Latest result summary */}
      {latest ? (
        <div className="mx-5 mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">{t.resultTitle}</p>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              [t.metrics.fat, `${latest.bodyFat}%`],
              [t.metrics.muscle, `${latest.muscle}%`],
              [t.metrics.score, `${latest.score}/100`],
            ].map(([k, v]) => (
              <div key={k} className="metric-badge">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{k}</div>
                <div className="text-base font-bold text-gradient-accent">{v}</div>
              </div>
            ))}
          </div>

          {/* Quick recommendations */}
          {!isFree && latest.recommendations.slice(0, 2).map((r) => (
            <div key={r} className="flex items-start gap-2.5 text-sm text-zinc-300 ios-card mb-2">
              <CheckCircle2 size={14} className="text-lime-400 mt-0.5 shrink-0" /> {r}
            </div>
          ))}

          {isFree && (
            <div className="ios-card border border-lime-400/20 text-center py-5">
              <Lock size={18} className="text-lime-400 mx-auto mb-2" />
              <p className="text-sm font-semibold mb-1">{t.freeMoreTitle}</p>
              <p className="text-xs text-zinc-500 mb-3">{t.freeMoreText}</p>
              <Link href="/plans" className="btn-primary text-xs px-4 py-2 rounded-full inline-flex items-center gap-1">
                {t.freeMoreBtn} <ArrowUpRight size={11} />
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="mx-5 mb-4">
          <div className="ios-card text-center py-10">
            <div className="text-5xl mb-3">📸</div>
            <p className="text-sm font-semibold text-zinc-300 mb-1">
              {lang === "ru" ? "Нет данных анализа" : "No analysis yet"}
            </p>
            <p className="text-xs text-zinc-500">
              {lang === "ru" ? "Перейди на вкладку «Сканирование»" : "Go to the Scan tab"}
            </p>
          </div>
        </div>
      )}

      {/* Calendar */}
      {latest && (() => {
        const today = new Date().getDay();
        const todayIdx = today === 0 ? 6 : today - 1;
        const schedule = t.days.map((_, i) => {
          const w = latest.workout.find(
            (d) =>
              d.day.toLowerCase().startsWith(t.dayPrefixes[i]) ||
              d.day.toLowerCase().startsWith(["mon","tue","wed","thu","fri","sat","sun"][i])
          );
          return w ? w.focus : t.rest;
        });
        return (
          <div className="mx-5 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              <CalendarDays size={11} className="inline mr-1" />{t.calendar}
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {t.days.map((d, i) => (
                <div
                  key={d}
                  className={`rounded-xl border p-1.5 text-center ${
                    i === todayIdx ? "border-lime-400/50 bg-lime-400/10" : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <span className={`text-[10px] font-semibold block mb-1 ${i === todayIdx ? "text-lime-300" : "text-zinc-500"}`}>{d}</span>
                  <span className="text-[9px] text-zinc-500 leading-tight">{schedule[i].slice(0, 8)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function ScanTab({ user, profile, history, setHistory, t, lang }: {
  user: User; profile: Profile; history: AnalysisRecord[]; setHistory: (h: AnalysisRecord[]) => void;
  t: (typeof T)[keyof typeof T]; lang: "ru" | "en";
}) {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiNote, setApiNote] = useState<string | null>(null);
  const [invalidReason, setInvalidReason] = useState<string | null>(null);
  const [modeOpen, setModeOpen] = useState(false);
  const [profile_, setProfileState] = useState(profile);
  const fileRef = useRef<HTMLInputElement>(null);
  const isFree = user.plan === "free";

  const lastTs = history[0] ? new Date(history[0].date).getTime() : 0;
  const freeLimitReached = isFree && lastTs > 0 && Date.now() - lastTs < FREE_INTERVAL_MS;
  const nextFreeDate = new Date(lastTs + FREE_INTERVAL_MS).toLocaleDateString(
    lang === "en" ? "en-US" : "ru-RU",
    { day: "numeric", month: "long" }
  );

  const onFile = (f: File | undefined) => {
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
    setInvalidReason(null);
  };

  const runAnalysis = async () => {
    if (scanning || !photo || freeLimitReached) return;
    setScanning(true);
    setProgress(0);
    setApiNote(null);
    setInvalidReason(null);
    const ticker = setInterval(() => setProgress((p) => (p >= 92 ? 92 : p + 2)), 350);
    try {
      const data = await analyzePhoto(photo, profile_, lang);
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

  return (
    <div className="flex-1 overflow-y-auto pb-tab">
      <div className="px-5 pt-safe pt-16 pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">{t.scanTabTitle}</h1>
        <p className="text-sm text-zinc-500">{t.analysisHint(profile_.age)}</p>
      </div>

      {/* Mode selector */}
      <div className="mx-5 mb-4 relative">
        <button
          onClick={() => setModeOpen((o) => !o)}
          className="ios-card w-full flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Flame size={15} className="text-lime-400" />
            <span className="text-sm font-semibold">{t.modes[profile_.goalMode ?? "auto"]}</span>
          </div>
          <ChevronRight size={16} className={`text-zinc-500 transition-transform ${modeOpen ? "rotate-90" : ""}`} />
        </button>
        <AnimatePresence>
          {modeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="absolute left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-[#111] shadow-2xl z-30 overflow-hidden"
            >
              {(Object.keys(t.modes) as GoalMode[]).map((id) => {
                const active = (profile_.goalMode ?? "auto") === id;
                const locked = isFree && id !== "auto";
                return (
                  <button
                    key={id}
                    onClick={() => {
                      if (locked) { router.push("/plans"); return; }
                      const upd = updateProfile({ goalMode: id });
                      if (upd) setProfileState(upd);
                      setModeOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 text-sm cursor-pointer ${
                      active ? "bg-lime-400/15 text-lime-300 font-semibold" :
                      locked ? "text-zinc-600" : "text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    {t.modes[id]}
                    {active ? <span>✓</span> : locked ? <Lock size={13} /> : null}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Photo upload */}
      <div className="mx-5 mb-4">
        <button
          onClick={() => fileRef.current?.click()}
          className="relative w-full h-64 rounded-3xl border-2 border-dashed border-white/15 hover:border-lime-400/50 transition-colors overflow-hidden flex flex-col items-center justify-center cursor-pointer bg-white/[0.02]"
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 text-zinc-500 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <UploadCloud size={26} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-400">{t.uploadHint}</p>
                <p className="text-xs text-zinc-600 mt-1">{t.uploadSub}</p>
              </div>
            </div>
          )}
          {photo && scanning && (
            <span className="scanline absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-lime-400 to-transparent shadow-[0_0_24px_4px_rgba(163,230,53,0.5)]" />
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </button>

        {photo && !scanning && (
          <button
            onClick={() => { setPhoto(null); setInvalidReason(null); }}
            className="mt-2 w-full text-center text-xs text-zinc-600 cursor-pointer py-1"
          >
            {lang === "ru" ? "Удалить фото" : "Remove photo"}
          </button>
        )}
      </div>

      {/* Analyze button / free limit */}
      <div className="mx-5 mb-4">
        {freeLimitReached ? (
          <div className="ios-card text-center py-5">
            <p className="text-sm text-zinc-300 mb-3">{t.freeLimit(nextFreeDate)}</p>
            <Link href="/plans" className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-3 rounded-full">
              {t.unlock} <ArrowUpRight size={14} />
            </Link>
          </div>
        ) : (
          <button
            onClick={runAnalysis}
            disabled={scanning || !photo}
            className="btn-primary w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {scanning ? (
              <><Loader2 size={18} className="animate-spin" /> {t.analyzing}</>
            ) : (
              <><Scan size={18} /> {t.analyzeBtn}</>
            )}
          </button>
        )}
      </div>

      {/* Progress bar */}
      {scanning && (
        <div className="mx-5 mb-4">
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-lime-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 text-center">
            {progress < 30 ? t.stages[0] : progress < 65 ? t.stages[1] : t.stages[2]}
          </p>
        </div>
      )}

      {/* Errors */}
      {invalidReason && (
        <div className="mx-5 mb-4 ios-card flex items-start gap-3 text-sm text-zinc-200 border border-white/15">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" /> {invalidReason}
        </div>
      )}
      {apiNote && <p className="mx-5 text-xs text-zinc-500 mb-4">{apiNote}</p>}

      {/* Latest result — full */}
      {history[0]?.full && (
        <ScanResult latest={history[0].full} t={t} isFree={isFree} profile={profile_} lang={lang} />
      )}
    </div>
  );
}

function ScanResult({ latest, t, isFree, profile, lang }: {
  latest: NonNullable<AnalysisRecord["full"]>;
  t: (typeof T)[keyof typeof T]; isFree: boolean;
  profile: Profile; lang: "ru" | "en";
}) {
  const genderLabel = profile.gender === "female" ? t.woman : t.man;
  return (
    <div className="mx-5 mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
        <CheckCircle2 size={11} className="inline mr-1 text-lime-400" />{t.resultTitle}
      </p>

      {/* Metrics */}
      <div className={`grid ${isFree ? "grid-cols-3" : "grid-cols-3"} gap-2 mb-4`}>
        {(isFree
          ? [[t.metrics.fat, `${latest.bodyFat}%`], [t.metrics.muscle, `${latest.muscle}%`], [t.metrics.score, `${latest.score}/100`]]
          : [[t.metrics.fat, `${latest.bodyFat}%`], [t.metrics.muscle, `${latest.muscle}%`], [t.metrics.posture, `${latest.posture}/100`], [t.metrics.symmetry, latest.symmetry], [t.metrics.score, `${latest.score}/100`]]
        ).map(([k, v]) => (
          <div key={k} className="metric-badge">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{k}</div>
            <div className="text-base font-bold text-gradient-accent">{v}</div>
          </div>
        ))}
      </div>

      {/* Recs */}
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">{t.recs}</p>
        {(isFree ? latest.recommendations.slice(0, 2) : latest.recommendations).map((r) => (
          <div key={r} className="flex items-start gap-2.5 text-sm text-zinc-300 mb-2">
            <CheckCircle2 size={14} className="text-lime-400 mt-0.5 shrink-0" /> {r}
          </div>
        ))}
      </div>

      {isFree ? (
        <div className="ios-card border border-lime-400/20 text-center py-6">
          <Lock size={18} className="text-lime-400 mx-auto mb-2" />
          <p className="text-sm font-semibold mb-1">{t.freeMoreTitle}</p>
          <p className="text-xs text-zinc-500 mb-3">{t.freeMoreText}</p>
          <Link href="/plans" className="btn-primary text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1">
            {t.freeMoreBtn} <ArrowUpRight size={11} />
          </Link>
        </div>
      ) : (
        <>
          {/* Zones */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              {lang === "ru" ? "Зоны тела" : "Body zones"}
            </p>
            <div className="flex flex-col gap-2">
              {latest.zones.map((z) => (
                <div key={z.name} className="flex items-center justify-between ios-card py-3">
                  <span className="text-sm text-zinc-300">{z.name}</span>
                  <span className={`text-xs font-semibold ${ratingTone(z.rating)}`}>{z.rating}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths / Weaknesses */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="ios-card">
              <p className="text-xs text-lime-400 font-semibold mb-2">{t.strengths}</p>
              {latest.strengths.map((s) => (
                <div key={s} className="flex items-start gap-1.5 text-xs text-zinc-300 mb-1.5">
                  <CheckCircle2 size={11} className="text-lime-400 mt-0.5 shrink-0" /> {s}
                </div>
              ))}
            </div>
            <div className="ios-card">
              <p className="text-xs text-zinc-500 font-semibold mb-2">{t.weaknesses}</p>
              {latest.weaknesses.map((s) => (
                <div key={s} className="flex items-start gap-1.5 text-xs text-zinc-400 mb-1.5">
                  <AlertTriangle size={11} className="mt-0.5 shrink-0 text-amber-400" /> {s}
                </div>
              ))}
            </div>
          </div>

          {/* Workout Link */}
          <div className="ios-card bg-lime-400/10 border border-lime-400/20 text-center py-5">
            <Dumbbell size={18} className="text-lime-400 mx-auto mb-2" />
            <p className="text-sm font-semibold mb-1 text-lime-400">{t.trainingReadyTitle}</p>
            <p className="text-xs text-zinc-400 mb-0">{t.trainingReadyDesc}</p>
          </div>
        </>
      )}
    </div>
  );
}

function TrainingTab({ history, user, profile, t, lang, router }: {
  history: AnalysisRecord[]; user: User; profile: Profile;
  t: (typeof T)[keyof typeof T]; lang: "ru" | "en";
  router: ReturnType<typeof useRouter>;
}) {
  const latest = history[0]?.full;
  const isFree = user.plan === "free";
  const genderLabel = profile.gender === "female" ? t.woman : t.man;

  return (
    <div className="flex-1 overflow-y-auto pb-tab">
      <div className="px-5 pt-safe pt-16 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">{t.trainingTabTitle}</h1>
      </div>

      {!latest ? (
        <div className="mx-5 mb-4 ios-card text-center py-10">
          <Dumbbell size={32} className="text-zinc-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-300 mb-1">{t.trainingEmptyTitle}</p>
          <p className="text-xs text-zinc-500">{t.trainingEmptyDesc}</p>
        </div>
      ) : isFree ? (
        <div className="mx-5 mb-4 ios-card border border-lime-400/20 text-center py-6">
          <Lock size={18} className="text-lime-400 mx-auto mb-2" />
          <p className="text-sm font-semibold mb-1">{t.freeMoreTitle}</p>
          <p className="text-xs text-zinc-500 mb-3">{t.freeMoreText}</p>
          <button onClick={() => router.push("/plans")} className="btn-primary text-xs px-5 py-2.5 rounded-full inline-flex items-center gap-1 cursor-pointer">
            {t.freeMoreBtn} <ArrowUpRight size={11} />
          </button>
        </div>
      ) : (
        <div className="mx-5">
          {/* Workout */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              <Dumbbell size={10} className="inline mr-1" />{t.workout}
            </p>
            {latest.workout.map((d) => (
              <div key={d.day} className="ios-card mb-2">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">{d.day}</div>
                <div className="font-semibold text-sm mb-2">{d.focus}</div>
                {d.exercises.map((e) => (
                  <div key={e.name} className="flex justify-between gap-3 text-xs text-zinc-400 mb-1">
                    <span>{e.name}</span>
                    <span className="font-mono text-lime-300/80 shrink-0">{e.sets}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Nutrition */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              <UtensilsCrossed size={10} className="inline mr-1" />{t.nutrition}{" "}
              <span className="normal-case text-zinc-600 font-normal">({t.nutritionFor(genderLabel, profile.age)})</span>
            </p>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                [t.kcal, `${latest.nutrition.calories}`],
                [t.protein, `${latest.nutrition.protein}g`],
                [t.fats, `${latest.nutrition.fats}g`],
                [t.carbs, `${latest.nutrition.carbs}g`],
              ].map(([k, v]) => (
                <div key={k} className="metric-badge">
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 mb-1">{k}</div>
                  <div className="text-sm font-bold">{v}</div>
                </div>
              ))}
            </div>
            <div className="ios-card mb-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">{t.menu}</p>
              {latest.nutrition.meals.map((m) => (
                <p key={m} className="text-sm text-zinc-300 mb-1">{m}</p>
              ))}
            </div>
            <div className="ios-card">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">{t.tips}</p>
              {latest.nutrition.tips.map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-sm text-zinc-300 mb-1.5">
                  <CheckCircle2 size={13} className="text-lime-400 mt-0.5 shrink-0" /> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressTab({ history, t, lang }: {
  history: AnalysisRecord[]; t: (typeof T)[keyof typeof T]; lang: "ru" | "en";
}) {
  const chartData = [...history].reverse().map((h, i) => ({ name: `#${i + 1}`, fat: h.bodyFat, muscle: h.muscle }));

  return (
    <div className="flex-1 overflow-y-auto pb-tab">
      <div className="px-5 pt-safe pt-16 pb-4">
        <h1 className="text-3xl font-bold tracking-tight">{t.progressTabTitle}</h1>
      </div>

      {/* Chart */}
      <div className="mx-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          <BarChart2 size={11} className="inline mr-1" />{t.chart}
        </p>
        <div className="ios-card">
          {chartData.length < 2 ? (
            <div className="h-44 flex items-center justify-center text-sm text-zinc-500 text-center px-4">
              {t.chartEmpty}
            </div>
          ) : (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dFat" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a1a1aa" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#a1a1aa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dMuscle" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a3e635" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#a3e635" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "rgba(15,15,15,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#f4f4f5", fontSize: 12 }} />
                  <Area type="monotone" dataKey="fat" name={t.fatSeries} stroke="#a1a1aa" strokeWidth={2} fill="url(#dFat)" />
                  <Area type="monotone" dataKey="muscle" name={t.muscleSeries} stroke="#a3e635" strokeWidth={2} fill="url(#dMuscle)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="mx-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          <Trophy size={11} className="inline mr-1" />{t.achievements}
        </p>
        <div className="flex flex-col gap-2">
          {t.achList.map((title, i) => {
            const Icon = achIcons[i];
            const unlocked = history.length >= achUnlocks[i];
            return (
              <div
                key={title}
                className={`ios-card flex items-center gap-3 ${!unlocked ? "opacity-40" : ""}`}
              >
                <span className={`grid place-items-center w-9 h-9 rounded-xl ${unlocked ? "bg-lime-400/15" : "bg-white/5"}`}>
                  <Icon size={15} className={unlocked ? "text-lime-300" : "text-zinc-500"} />
                </span>
                <span className="text-sm flex-1">{title}</span>
                {unlocked && <Star size={13} className="fill-lime-400 text-lime-400" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div className="mx-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
          <History size={11} className="inline mr-1" />{t.history}
        </p>
        {history.length === 0 ? (
          <div className="ios-card text-center py-8">
            <p className="text-sm text-zinc-500">{t.historyEmpty}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((h) => (
              <div key={h.id} className="ios-card">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-zinc-500">
                    {new Date(h.date).toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                  <span className="text-xs font-semibold text-gradient-accent">Score {h.score}</span>
                </div>
                <div className="flex gap-4 text-xs text-zinc-400">
                  <span>{t.metrics.fat} {h.bodyFat}%</span>
                  <span>{t.metrics.muscle} {h.muscle}%</span>
                  <span>{t.metrics.posture} {h.posture}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileTab({ user, profile, t, lang, router, exit }: {
  user: User; profile: Profile; t: (typeof T)[keyof typeof T]; lang: "ru" | "en";
  router: ReturnType<typeof useRouter>; exit: () => void;
}) {
  const isFree = user.plan === "free";
  return (
    <div className="flex-1 overflow-y-auto pb-tab">
      <div className="px-5 pt-safe pt-16 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t.profileTabTitle}</h1>
      </div>

      {/* Avatar + name */}
      <div className="mx-5 mb-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-600 flex items-center justify-center mb-3 text-3xl">
          {profile.gender === "female" ? "👩" : "👨"}
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-sm text-zinc-500">{user.email}</p>
        <span className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
          isFree ? "border-white/15 text-zinc-400" : "border-lime-400/40 bg-lime-400/10 text-lime-300"
        }`}>
          {!isFree && <Crown size={11} />} {PLAN_LABEL[user.plan]}
        </span>
      </div>

      {/* Stats */}
      <div className="mx-5 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            [lang === "ru" ? "Рост" : "Height", `${profile.height} см`],
            [lang === "ru" ? "Вес" : "Weight", `${profile.weight} кг`],
            [lang === "ru" ? "Возраст" : "Age", `${profile.age} ${t.years}`],
          ].map(([k, v]) => (
            <div key={k} className="metric-badge">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{k}</div>
              <div className="text-sm font-bold">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mx-5 mb-4 flex flex-col gap-2">
        {isFree && (
          <button
            onClick={() => router.push("/plans")}
            className="btn-primary w-full h-12 rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            {t.upgrade} <ArrowUpRight size={16} />
          </button>
        )}
        <button
          onClick={() => router.push("/profile")}
          className="ios-card flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
              <UserIcon size={15} className="text-zinc-400" />
            </div>
            <span className="text-sm">{t.editProfile}</span>
          </div>
          <ChevronRight size={16} className="text-zinc-600" />
        </button>
        <button
          onClick={() => router.push("/plans")}
          className="ios-card flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
              <Settings size={15} className="text-zinc-400" />
            </div>
            <span className="text-sm">{t.plan}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">{PLAN_LABEL[user.plan]}</span>
            <ChevronRight size={16} className="text-zinc-600" />
          </div>
        </button>
        <button
          onClick={exit}
          className="ios-card flex items-center gap-3 cursor-pointer text-red-400"
        >
          <div className="w-8 h-8 rounded-xl bg-red-400/10 flex items-center justify-center">
            <LogOut size={15} className="text-red-400" />
          </div>
          <span className="text-sm">{t.logout}</span>
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */

export default function DashboardPage() {
  const router = useRouter();
  const lang = useLang();
  const t = T[lang];
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfileState] = useState<Profile | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("home");

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace("/register"); return; }
    if (!getProfile()) { router.replace("/profile"); return; }
    setUser(u);
    setProfileState(getProfile());
    setHistory(getHistory());
  }, [router]);

  const exit = () => { logout(); router.push("/"); };

  if (!user || !profile) return null;

  const latest = history[0]?.full;
  const isFree = user.plan === "free";

  const tabVariants = {
    enter: { opacity: 0, y: 12 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  return (
    <div className="relative min-h-screen min-h-dvh bg-[#090909] flex flex-col overflow-hidden">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-white/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-32 w-64 h-64 bg-lime-400/4 rounded-full blur-[100px]" />
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex-1 flex flex-col relative z-10 overflow-hidden"
        >
          {activeTab === "home" && (
            <HomeTab user={user} profile={profile} history={history} t={t} lang={lang} router={router} />
          )}
          {activeTab === "scan" && (
            <ScanTab user={user} profile={profile} history={history} setHistory={setHistory} t={t} lang={lang} />
          )}
          {activeTab === "training" && (
            <TrainingTab history={history} user={user} profile={profile} t={t} lang={lang} router={router} />
          )}
          {activeTab === "progress" && (
            <ProgressTab history={history} t={t} lang={lang} />
          )}
          {activeTab === "profile" && (
            <ProfileTab user={user} profile={profile} t={t} lang={lang} router={router} exit={exit} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Tab Bar */}
      <TabBar active={activeTab} onChange={setActiveTab} lang={lang} />

      {/* AI Coach */}
      <CoachChat user={user} profile={profile} latest={latest} lang={lang} />
    </div>
  );
}
