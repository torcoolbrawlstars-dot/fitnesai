"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    eyebrow: "Дашборд прогресса",
    title: "Каждое изменение — под контролем",
    subtitle: "Вес, процент жира, мышечная масса, сила и выносливость — в живых интерактивных графиках.",
    week: "Нед",
    series: [
      { key: "weight", label: "Вес (кг)" },
      { key: "fat", label: "Жир (%)" },
      { key: "muscle", label: "Мышцы (кг)" },
      { key: "strength", label: "Сила" },
      { key: "endurance", label: "Выносливость" },
    ],
    stats: [
      ["Вес", "−3 кг", "82 → 79"],
      ["Жир", "−7%", "24% → 17%"],
      ["Мышцы", "+5 кг", "61 → 66"],
      ["Сила", "+58%", "за 6 недель"],
    ],
  },
  en: {
    eyebrow: "Progress dashboard",
    title: "Every change under control",
    subtitle: "Weight, body fat, muscle mass, strength and endurance — in live interactive charts.",
    week: "Wk",
    series: [
      { key: "weight", label: "Weight (kg)" },
      { key: "fat", label: "Fat (%)" },
      { key: "muscle", label: "Muscle (kg)" },
      { key: "strength", label: "Strength" },
      { key: "endurance", label: "Endurance" },
    ],
    stats: [
      ["Weight", "−3 kg", "82 → 79"],
      ["Fat", "−7%", "24% → 17%"],
      ["Muscle", "+5 kg", "61 → 66"],
      ["Strength", "+58%", "in 6 weeks"],
    ],
  },
} as const;

const colors: Record<string, string> = {
  weight: "#e4e4e7",
  fat: "#a1a1aa",
  muscle: "#a3e635",
  strength: "#d9f99d",
  endurance: "#71717a",
};

const raw = [
  [82, 24, 61, 52, 48],
  [81.4, 23, 61.6, 56, 53],
  [80.8, 21.5, 62.4, 61, 59],
  [80.1, 20, 63.2, 67, 64],
  [79.6, 18.5, 64.5, 74, 71],
  [79, 17, 66, 82, 79],
];

export default function ProgressDashboard() {
  const t = T[useLang()];
  const [active, setActive] = useState<string[]>(["fat", "muscle"]);

  const data = raw.map(([weight, fat, muscle, strength, endurance], i) => ({
    week: `${t.week} ${i + 1}`,
    weight, fat, muscle, strength, endurance,
  }));

  const toggle = (key: string) =>
    setActive((a) =>
      a.includes(key) ? (a.length > 1 ? a.filter((k) => k !== key) : a) : [...a, key]
    );

  return (
    <section id="progress" className="relative py-28">
      <div className="absolute -left-40 top-1/3 w-[30rem] h-[30rem] bg-lime-400/5 blur-[140px] rounded-full" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-6 sm:p-10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {t.stats.map(([label, value, sub], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-5"
              >
                <div className="text-xs uppercase tracking-wider text-zinc-500 mb-1.5">{label}</div>
                <div className="text-2xl font-bold text-gradient-accent">{value}</div>
                <div className="text-xs text-zinc-500 mt-1">{sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 mb-6">
            {t.series.map((s) => (
              <button
                key={s.key}
                onClick={() => toggle(s.key)}
                className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                  active.includes(s.key)
                    ? "border-transparent"
                    : "border-white/10 text-zinc-500 hover:text-zinc-300"
                }`}
                style={
                  active.includes(s.key)
                    ? { background: `${colors[s.key]}26`, borderColor: `${colors[s.key]}66`, color: colors[s.key] }
                    : undefined
                }
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  {t.series.map((s) => (
                    <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colors[s.key]} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={colors[s.key]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="week" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
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
                {t.series
                  .filter((s) => active.includes(s.key))
                  .map((s) => (
                    <Area
                      key={s.key}
                      type="monotone"
                      dataKey={s.key}
                      name={s.label}
                      stroke={colors[s.key]}
                      strokeWidth={2.5}
                      fill={`url(#grad-${s.key})`}
                      dot={{ fill: colors[s.key], r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                      animationDuration={1200}
                    />
                  ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
