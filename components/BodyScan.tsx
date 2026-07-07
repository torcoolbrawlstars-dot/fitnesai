"use client";

import { motion } from "framer-motion";

/* Stylized human figure with AI scan overlay, muscle highlight points and data callouts */
export default function BodyScan() {
  const points = [
    { cx: 150, cy: 118, label: "Плечи", value: "Strong", side: "left" as const },
    { cx: 150, cy: 175, label: "Грудь", value: "Medium", side: "right" as const },
    { cx: 150, cy: 235, label: "Кор", value: "Average", side: "left" as const },
    { cx: 128, cy: 350, label: "Ноги", value: "Excellent", side: "right" as const },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto float">
      {/* ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-zinc-600/25 via-zinc-600/20 to-transparent blur-3xl rounded-full scale-110" />

      <div className="glass relative rounded-[2rem] p-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60" />

        {/* scan line */}
        <div className="scanline absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-lime-400 to-transparent shadow-[0_0_24px_4px_rgba(255,255,255,0.5)]" />

        <div className="flex items-center justify-between mb-2 relative">
          <span className="text-xs font-mono text-zinc-300/80 tracking-widest uppercase">
            AI Body Scan
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
            Live
          </span>
        </div>

        <svg viewBox="0 0 300 460" className="relative w-full h-auto" role="img" aria-label="AI-сканирование тела">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="100%" stopColor="#a1a1aa" />
            </linearGradient>
            <radialGradient id="dotGrad">
              <stop offset="0%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#71717a" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* silhouette */}
          <g stroke="url(#bodyGrad)" strokeWidth="2.5" fill="rgba(255,255,255,0.06)" strokeLinecap="round" strokeLinejoin="round">
            {/* head */}
            <circle cx="150" cy="55" r="24" />
            {/* torso */}
            <path d="M150 82 C120 88 104 100 102 120 C100 142 112 158 116 178 C120 198 118 220 118 240 C118 252 128 262 150 262 C172 262 182 252 182 240 C182 220 180 198 184 178 C188 158 200 142 198 120 C196 100 180 88 150 82 Z" />
            {/* left arm */}
            <path d="M104 118 C88 128 80 150 76 176 C72 200 70 224 72 246 C73 256 84 258 88 248 C94 228 96 204 100 184 C104 166 110 148 112 136" />
            {/* right arm */}
            <path d="M196 118 C212 128 220 150 224 176 C228 200 230 224 228 246 C227 256 216 258 212 248 C206 228 204 204 200 184 C196 166 190 148 188 136" />
            {/* left leg */}
            <path d="M126 262 C122 292 120 322 122 352 C124 382 126 406 128 428 C129 438 142 438 143 428 C145 400 146 370 146 340 C146 316 148 290 148 268" />
            {/* right leg */}
            <path d="M174 262 C178 292 180 322 178 352 C176 382 174 406 172 428 C171 438 158 438 157 428 C155 400 154 370 154 340 C154 316 152 290 152 268" />
          </g>

          {/* muscle points + callouts */}
          {points.map((p, i) => (
            <g key={p.label}>
              <circle className="pulse-dot" cx={p.cx} cy={p.cy} r="14" fill="url(#dotGrad)" style={{ animationDelay: `${i * 0.5}s` }} />
              <circle cx={p.cx} cy={p.cy} r="4" fill="#f4f4f5" />
              <line
                x1={p.cx} y1={p.cy}
                x2={p.side === "left" ? 44 : 256} y2={p.cy}
                stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="3 3"
              />
              <text
                x={p.side === "left" ? 8 : 260} y={p.cy - 6}
                fill="#a1a1aa" fontSize="11" fontFamily="monospace"
              >
                {p.label}
              </text>
              <text
                x={p.side === "left" ? 8 : 260} y={p.cy + 10}
                fill="#e4e4e7" fontSize="12" fontWeight="600" fontFamily="monospace"
              >
                {p.value}
              </text>
            </g>
          ))}
        </svg>

        {/* bottom stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="relative grid grid-cols-3 gap-3 mt-4"
        >
          {[
            { k: "Body Fat", v: "18%" },
            { k: "Muscle", v: "73%" },
            { k: "Score", v: "88/100" },
          ].map((s) => (
            <div key={s.k} className="glass rounded-xl px-3 py-2.5 text-center">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">{s.k}</div>
              <div className="text-sm font-semibold text-gradient-accent">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
