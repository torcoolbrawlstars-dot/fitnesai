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

/* язык подтягивается после гидратации, чтобы не ломать SSR */
export function useLang(): Lang {
  const [lang, set] = useState<Lang>("ru");
  useEffect(() => set(getLang()), []);
  return lang;
}
