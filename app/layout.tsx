import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "BodyVision AI — персональный AI-тренер по фотографии",
  description:
    "Загрузите фото своего тела и получите подробный AI-анализ: процент жира, мышечная масса, осанка, симметрия. Персональная программа тренировок и отслеживание прогресса.",
  keywords: [
    "AI тренер",
    "анализ тела по фото",
    "фитнес AI",
    "персональные тренировки",
    "BodyVision",
  ],
  openGraph: {
    title: "BodyVision AI — персональный AI-тренер по фотографии",
    description:
      "AI-анализ тела по фотографии: жир, мышцы, осанка, симметрия. Персональный план тренировок и питания.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
