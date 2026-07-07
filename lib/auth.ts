"use client";

/* Тестовая (mock) авторизация на localStorage — без бэкенда */

export type Plan = "free" | "pro" | "premium";

export interface User {
  name: string;
  email: string;
  plan: Plan;
  registeredAt: string;
}

export type GoalMode = "auto" | "lose" | "gain" | "both";

export interface Profile {
  height: number;
  weight: number;
  gender: "male" | "female";
  age: number;
  location: "home" | "gym";
  goalMode?: GoalMode;
}

export interface FullResult {
  valid: boolean;
  reason?: string;
  goal?: string;
  bodyFat: number;
  muscle: number;
  posture: number;
  symmetry: string;
  score: number;
  zones: { name: string; rating: string }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  workout: { day: string; focus: string; exercises: { name: string; sets: string }[] }[];
  nutrition: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    meals: string[];
    tips: string[];
  };
}

export interface AnalysisRecord {
  id: string;
  date: string;
  bodyFat: number;
  muscle: number;
  posture: number;
  score: number;
  full?: FullResult;
  source?: string;
}

const USER_KEY = "bv_user";
const HISTORY_KEY = "bv_history";
const PROFILE_KEY = "bv_profile";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function register(name: string, email: string): User {
  /* новая регистрация = чистый аккаунт: старые анализы и анкета удаляются */
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(PROFILE_KEY);
  const user: User = {
    name,
    email,
    plan: "free",
    registeredAt: new Date().toISOString(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function setPlan(plan: Plan): User | null {
  const user = getUser();
  if (!user) return null;
  const updated = { ...user, plan };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function setProfile(profile: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function updateProfile(patch: Partial<Profile>): Profile | null {
  const p = getProfile();
  if (!p) return null;
  const updated = { ...p, ...patch };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}

export function addAnalysisFull(full: FullResult, source: string): AnalysisRecord {
  const prev = getHistory();
  const rec: AnalysisRecord = {
    id: Math.random().toString(36).slice(2, 9),
    date: new Date().toISOString(),
    bodyFat: full.bodyFat,
    muscle: full.muscle,
    posture: full.posture,
    score: full.score,
    full,
    source,
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([rec, ...prev]));
  return rec;
}

export function getHistory(): AnalysisRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as AnalysisRecord[]) : [];
  } catch {
    return [];
  }
}

export function addAnalysis(): AnalysisRecord {
  const prev = getHistory();
  const last = prev[0];
  /* каждый новый анализ показывает лёгкий прогресс */
  const rec: AnalysisRecord = {
    id: Math.random().toString(36).slice(2, 9),
    date: new Date().toISOString(),
    bodyFat: Math.max(10, +(last ? last.bodyFat - (0.4 + Math.random() * 0.8) : 18).toFixed(1)),
    muscle: Math.min(90, +(last ? last.muscle + (0.3 + Math.random() * 0.7) : 73).toFixed(1)),
    posture: Math.min(100, Math.round(last ? last.posture + 1 + Math.random() * 2 : 78)),
    score: Math.min(100, Math.round(last ? last.score + 1 + Math.random() * 2 : 88)),
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([rec, ...prev]));
  return rec;
}
