"use client";

import { motion } from "framer-motion";

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <span className="inline-block glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-lime-300 mb-5">
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight uppercase italic text-gradient">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-zinc-400 text-lg leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}
