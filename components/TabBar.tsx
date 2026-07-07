"use client";

import { motion } from "framer-motion";
import { Home, Scan, Dumbbell, BarChart2, User } from "lucide-react";

export type TabId = "home" | "scan" | "training" | "progress" | "profile";

interface Tab {
  id: TabId;
  icon: React.ElementType;
  labelRu: string;
  labelEn: string;
}

const TABS: Tab[] = [
  { id: "home", icon: Home, labelRu: "Главная", labelEn: "Home" },
  { id: "scan", icon: Scan, labelRu: "Сканирование", labelEn: "Scan" },
  { id: "training", icon: Dumbbell, labelRu: "Тренировки", labelEn: "Training" },
  { id: "progress", icon: BarChart2, labelRu: "Прогресс", labelEn: "Progress" },
  { id: "profile", icon: User, labelRu: "Профиль", labelEn: "Profile" },
];

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
  lang?: "ru" | "en";
}

export default function TabBar({ active, onChange, lang = "ru" }: Props) {
  return (
    <nav className="tab-bar">
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        const Icon = tab.icon;
        const label = lang === "ru" ? tab.labelRu : tab.labelEn;

        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-1 px-3 cursor-pointer relative"
          >
            {/* Active pill */}
            {isActive && (
              <motion.div
                layoutId="tab-active-pill"
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-lime-400"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <motion.div
              animate={{
                scale: isActive ? 1.08 : 1,
                y: isActive ? -1 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Icon
                size={24}
                className={`transition-colors duration-200 ${
                  isActive ? "text-lime-400" : "text-zinc-600"
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            </motion.div>

            <span
              className={`text-[10px] font-medium tracking-tight transition-colors duration-200 ${
                isActive ? "text-lime-400" : "text-zinc-600"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
