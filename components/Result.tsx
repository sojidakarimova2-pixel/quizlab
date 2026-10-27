"use client";

import { useEffect, useState } from "react";
import Mascot, { type Mood } from "@/components/Mascot";

function verdict(score: number, total: number): { mood: Mood; text: string } {
  const share = score / total;
  if (share >= 0.9) return { mood: "happy", text: "Блестяще! Вы настоящий учёный!" };
  if (share >= 0.7) return { mood: "happy", text: "Отличный результат!" };
  if (share >= 0.5) return { mood: "neutral", text: "Неплохо, но есть куда расти." };
  return { mood: "sad", text: "Не страшно, попробуйте ещё раз!" };
}

export default function Result({
  score,
  total,
  onRestart,
  onHome,
}: {
  score: number;
  total: number;
  onRestart: () => void;
  onHome: () => void;
}) {
  const [shown, setShown] = useState(0);
  const { mood, text } = verdict(score, total);

  useEffect(() => {
    if (score === 0) return;
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setShown(current);
      if (current >= score) clearInterval(timer);
    }, 130);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <main className="flex flex-1 items-center justify-center p-3 sm:p-6">
      <section className="animate-pop flex w-full max-w-xl flex-col items-center gap-5 border border-line bg-surface p-8 text-center sm:p-12">
        <span className="animate-fade-up text-xs font-semibold uppercase tracking-[0.3em] text-accent [animation-delay:150ms]">
          Результат
        </span>
        <Mascot mood={mood} size={140} />
        <p className="animate-fade-up font-display text-8xl font-extrabold leading-none [animation-delay:350ms] sm:text-9xl">
          {String(shown).padStart(2, "0")} <span className="text-4xl text-line">/ {total}</span>
        </p>
        <div className="h-px w-full bg-line">
          <div
            className="h-0.5 -translate-y-px bg-accent transition-all duration-300"
            style={{ width: `${(shown / total) * 100}%` }}
          />
        </div>
        <p className="animate-fade-up text-sm font-semibold uppercase tracking-wider text-muted [animation-delay:450ms]">
          Правильных: <span className="text-ok">{score} из {total}</span>. Ошибок:{" "}
          <span className="text-bad">{total - score}</span>.
        </p>
        <h2 className="animate-fade-up font-display text-3xl font-bold uppercase [animation-delay:550ms]">
          {text}
        </h2>
        <div className="animate-fade-up mt-2 flex flex-wrap justify-center gap-3 [animation-delay:750ms]">
          <button
            type="button"
            onClick={onRestart}
            className="bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            Пройти ещё раз
          </button>
          <button
            type="button"
            onClick={onHome}
            className="border border-line px-8 py-3 text-sm font-bold uppercase tracking-wider transition hover:border-accent"
          >
            На главную
          </button>
        </div>
      </section>
    </main>
  );
}
