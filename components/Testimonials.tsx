"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    eyebrow: "Отзывы",
    title: "Истории реальных трансформаций",
    prev: "Предыдущий отзыв",
    next: "Следующий отзыв",
    items: [
      { name: "Дмитрий К.", role: "−9% жира за 3 месяца", initials: "ДК", text: "Скептически относился к AI-тренерам, но анализ по фото оказался точнее замеров в фитнес-клубе. Спина реально была слабым местом — через 10 недель подтягиваюсь 15 раз." },
      { name: "Анна С.", role: "Исправила осанку за 2 месяца", initials: "АС", text: "Работаю за компьютером по 10 часов. AI сразу увидел проблемы с осанкой и дал упражнения на каждый день. Спина перестала болеть, а на фото После я себя не узнала." },
      { name: "Марк В.", role: "+6 кг мышц за 4 месяца", initials: "МВ", text: "Тренировался годами без системы. BodyVision показал, что ноги отстают, и перестроил программу. Сравнение До / После мотивирует лучше любого тренера." },
      { name: "Елена Р.", role: "−12 кг за 5 месяцев", initials: "ЕР", text: "Занимаюсь только дома. План питания и тренировки без оборудования — именно то, что нужно. Каждый месяц вижу цифры прогресса, и это невероятно затягивает." },
    ],
  },
  en: {
    eyebrow: "Reviews",
    title: "Real transformation stories",
    prev: "Previous review",
    next: "Next review",
    items: [
      { name: "Dmitry K.", role: "−9% body fat in 3 months", initials: "DK", text: "I was skeptical about AI coaches, but the photo analysis turned out more accurate than gym measurements. My back really was the weak spot — after 10 weeks I do 15 pull-ups." },
      { name: "Anna S.", role: "Fixed posture in 2 months", initials: "AS", text: "I work at a computer 10 hours a day. The AI immediately spotted my posture issues and gave daily exercises. My back stopped hurting, and I did not recognize myself in the After photo." },
      { name: "Mark V.", role: "+6 kg of muscle in 4 months", initials: "MV", text: "I trained for years without a system. BodyVision showed my legs were lagging and rebuilt the program. The Before / After comparison motivates better than any coach." },
      { name: "Elena R.", role: "−12 kg in 5 months", initials: "ER", text: "I train only at home. A nutrition plan and no-equipment workouts are exactly what I needed. Every month I see my progress numbers and it is incredibly addictive." },
    ],
  },
} as const;

const colors = ["from-zinc-400 to-zinc-600", "from-lime-400 to-lime-600", "from-zinc-300 to-zinc-500", "from-lime-300 to-lime-500"];

export default function Testimonials() {
  const t = T[useLang()];
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + t.items.length) % t.items.length);
  };

  const item = t.items[index];

  return (
    <section id="testimonials" className="relative py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} />

        <div className="relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            >
              <Quote size={72} className="absolute -top-2 right-6 text-lime-400/10" />
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-lime-400 text-lime-400" />
                ))}
              </div>
              <blockquote className="text-lg sm:text-xl text-zinc-200 leading-relaxed mb-8">
                “{item.text}”
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <span className={`grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br ${colors[index]} font-semibold text-black text-sm`}>
                  {item.initials}
                </span>
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gradient-accent font-medium">{item.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => go(-1)} aria-label={t.prev} className="btn-secondary grid place-items-center w-11 h-11 rounded-full text-zinc-300 cursor-pointer">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {t.items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                  aria-label={`${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === index ? "w-8 bg-lime-400" : "w-2 bg-white/15 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button onClick={() => go(1)} aria-label={t.next} className="btn-secondary grid place-items-center w-11 h-11 rounded-full text-zinc-300 cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
