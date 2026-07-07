"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scan, Menu, X, LayoutDashboard } from "lucide-react";
import { getUser } from "@/lib/auth";
import { useLang, setLang } from "@/lib/i18n";

const T = {
  ru: {
    links: [
      ["#how", "Как это работает"],
      ["#analysis", "Анализ"],
      ["#workouts", "Тренировки"],
      ["#progress", "Прогресс"],
      ["#pricing", "Тарифы"],
    ],
    login: "Войти",
    start: "Начать бесплатно",
    dashboard: "Личный кабинет",
  },
  en: {
    links: [
      ["#how", "How it works"],
      ["#analysis", "Analysis"],
      ["#workouts", "Workouts"],
      ["#progress", "Progress"],
      ["#pricing", "Pricing"],
    ],
    login: "Log in",
    start: "Start free",
    dashboard: "Dashboard",
  },
} as const;

function LangSwitch() {
  const lang = useLang();
  return (
    <div className="flex items-center rounded-full border border-white/15 overflow-hidden text-xs font-bold">
      {(["ru", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 uppercase transition-colors cursor-pointer ${
            lang === l ? "bg-lime-400 text-black" : "text-zinc-400 hover:text-white"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const lang = useLang();
  const t = T[lang];

  useEffect(() => {
    setLoggedIn(!!getUser());
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "py-5 bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-500">
            <Scan size={18} className="text-black" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            BodyVision <span className="text-gradient-accent">AI</span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-8 text-sm text-zinc-400">
          {t.links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="hover:text-white transition-colors duration-200">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <LangSwitch />
          {loggedIn ? (
            <a href="/dashboard" className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full">
              <LayoutDashboard size={15} /> {t.dashboard}
            </a>
          ) : (
            <>
              <a href="/register" className="text-sm text-zinc-300 hover:text-white transition-colors px-4 py-2">
                {t.login}
              </a>
              <a href="/register" className="btn-primary text-sm px-5 py-2.5 rounded-full">
                {t.start}
              </a>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-3">
          <LangSwitch />
          <button className="text-zinc-300" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden glass mx-4 mt-3 rounded-2xl p-6 flex flex-col gap-4"
        >
          {t.links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="text-zinc-300 hover:text-white transition-colors">
              {label}
            </a>
          ))}
          <a
            href={loggedIn ? "/dashboard" : "/register"}
            className="btn-primary text-center text-sm px-5 py-3 rounded-full mt-2"
          >
            {loggedIn ? t.dashboard : t.start}
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
