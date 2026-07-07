"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, Crown, Sparkles, ImagePlus } from "lucide-react";
import Link from "next/link";
import type { Profile, FullResult, User } from "@/lib/auth";
import { coachChat, type ChatMessage } from "@/lib/gemini";
import type { Lang } from "@/lib/i18n";

const CHAT_KEY = "bv_chat";

const T = {
  ru: {
    title: "AI-коуч",
    online: "на связи 24/7",
    hello: "Привет! Я ваш AI-коуч. Спросите меня, как улучшить форму, что есть, как тренироваться или как избавиться от слабых мест — я знаю ваш последний анализ.",
    placeholder: "Спросите про тренировки, питание…",
    error: "Не получилось ответить. Попробуйте ещё раз.",
    lockTitle: "AI-коуч доступен на Premium",
    lockText: "Личный тренер в чате 24/7: отвечает на вопросы о тренировках, питании и вашем прогрессе с учётом анализа тела.",
    lockBtn: "Перейти на Premium",
  },
  en: {
    title: "AI Coach",
    online: "online 24/7",
    hello: "Hi! I am your AI coach. Ask me how to improve your shape, what to eat, how to train or how to fix weak spots — I know your latest analysis.",
    placeholder: "Ask about workouts, nutrition…",
    error: "Could not reply. Please try again.",
    lockTitle: "AI Coach is available on Premium",
    lockText: "A personal coach in chat 24/7: answers questions about workouts, nutrition and your progress based on your body analysis.",
    lockBtn: "Upgrade to Premium",
  },
} as const;

export default function CoachChat({
  user,
  profile,
  latest,
  lang,
}: {
  user: User;
  profile: Profile;
  latest?: FullResult;
  lang: Lang;
}) {
  const t = T[lang];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const premium = true; // Temporary unlocked for all plans during testing

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, sending]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => setImage(ev.target?.result as string);
    r.readAsDataURL(file);
    e.target.value = "";
  };

  const send = async () => {
    const text = input.trim();
    if ((!text && !image) || sending) return;
    setError(false);
    setInput("");
    const imgData = image;
    setImage(null);
    const next: ChatMessage[] = [...messages, { role: "user", text, image: imgData || undefined }];
    setMessages(next);
    setSending(true);
    try {
      const reply = await coachChat(next, profile, latest, lang);
      const withReply: ChatMessage[] = [...next, { role: "model", text: reply }];
      setMessages(withReply);
      localStorage.setItem(CHAT_KEY, JSON.stringify(withReply.slice(-40)));
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t.title}
        className="fixed bottom-28 right-6 z-50 grid place-items-center w-14 h-14 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 text-black shadow-2xl shadow-lime-400/40 active:scale-95 transition-transform cursor-pointer"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-28 right-6 z-50 w-[min(24rem,calc(100vw-3rem))] h-[32rem] rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/70 flex flex-col overflow-hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.03]">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-lime-300 to-lime-500">
                  <Sparkles size={16} className="text-black" />
                </span>
                <div>
                  <div className="font-semibold text-sm">{t.title}</div>
                  <div className="text-[11px] text-lime-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                    {t.online}
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 grid place-items-center rounded-full bg-white/5 text-zinc-400 active:opacity-80 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {premium ? (
              <>
                <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-white/5 border border-white/5 px-4 py-3 text-sm text-zinc-300">
                    {t.hello}
                  </div>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                        m.role === "user"
                          ? "ml-auto rounded-tr-md bg-lime-400/15 border border-lime-400/25 text-lime-100"
                          : "rounded-tl-md bg-white/5 border border-white/5 text-zinc-300"
                      }`}
                    >
                      {m.image && <img src={m.image} alt="upload" className="max-w-full rounded-xl mb-2 border border-white/10" />}
                      {m.text}
                    </div>
                  ))}
                  {sending && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm px-2">
                      <Loader2 size={14} className="animate-spin" /> …
                    </div>
                  )}
                  {error && <div className="text-xs text-zinc-500 px-2">{t.error}</div>}
                </div>

                <div className="p-3 border-t border-white/5">
                  {image && (
                    <div className="relative inline-block ml-3 mb-2">
                      <img src={image} className="h-16 w-16 object-cover rounded-xl border border-white/10" />
                      <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 w-6 h-6 grid place-items-center bg-[#0d0d0d] rounded-full border border-white/20 text-white cursor-pointer active:scale-95"><X size={12} /></button>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-white/5 text-zinc-400 active:opacity-80 transition-colors cursor-pointer"
                    >
                      <ImagePlus size={18} />
                    </button>
                    <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} />
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && send()}
                      placeholder={t.placeholder}
                      className="flex-1 rounded-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-lime-400/50 transition-colors placeholder:text-zinc-600"
                    />
                    <button
                      onClick={send}
                      disabled={sending || (!input.trim() && !image)}
                      aria-label="Send"
                      className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 text-black disabled:opacity-40 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <span className="grid place-items-center w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/25">
                  <Crown size={24} className="text-lime-300" />
                </span>
                <h3 className="font-semibold">{t.lockTitle}</h3>
                <p className="text-sm text-zinc-400">{t.lockText}</p>
                <Link href="/plans" className="btn-primary text-sm px-6 py-3 rounded-full">
                  {t.lockBtn}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
