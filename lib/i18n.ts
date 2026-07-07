"use client";

import { useEffect, useState } from "react";

export type Lang = "ru" | "en";

export function getLang(): Lang {
  if (typeof window === "undefined") return "ru";
  return (localStorage.getItem("bv_lang") as Lang) || "ru";
}

export function setLang(l: Lang) {
  localStorage.setItem("bv_lang", l);
  window.location.reload();
}

/** Устанавливает язык БЕЗ перезагрузки страницы (для онбординга) */
export function setLangSilent(l: Lang) {
  localStorage.setItem("bv_lang", l);
}

/** true = онбординг уже был показан */
export function hasSeenOnboarding(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("bv_onboarded") === "1";
}

export function markOnboardingDone() {
  localStorage.setItem("bv_onboarded", "1");
}

/* язык подтягивается после гидратации, чтобы не ломать SSR */
export function useLang(): Lang {
  const [lang, set] = useState<Lang>("ru");
  useEffect(() => set(getLang()), []);
  return lang;
}
