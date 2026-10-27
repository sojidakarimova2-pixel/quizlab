"use client";

import { useState } from "react";
import Landing from "@/components/Landing";
import Mascot, { type Mood } from "@/components/Mascot";
import Result from "@/components/Result";
import type { QuizData } from "@/lib/questions";

type Phase = "landing" | "quiz" | "result";

const letters = ["A", "B", "C", "D", "E", "F"];

export default function Player({
  quiz,
  autoStart = false,
  onHome,
  onFinish,
}: {
  quiz: QuizData;
  autoStart?: boolean;
  onHome: () => void;
  onFinish?: (score: number, total: number) => void;
}) {
  const [phase, setPhase] = useState<Phase>(autoStart ? "quiz" : "landing");
  const [index, setIndex] = useState(0);
  // выбор ученика по каждому вопросу: переход к следующему вопросу его не стирает
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.questions.map(() => null));

  const questions = quiz.questions;
  const total = questions.length;
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;
  const selected = answers[index] ?? null;

  function start() {
    setIndex(0);
    setAnswers(questions.map(() => null));
    setPhase("quiz");
    window.scrollTo({ top: 0 });
  }

  function goHome() {
    window.scrollTo({ top: 0 });
    onHome();
  }

  if (phase === "landing") return <Landing onStart={start} />;

  if (phase === "result") {
    return <Result score={score} total={total} onRestart={start} onHome={goHome} />;
  }

  const question = questions[index];
  const answered = selected !== null;
  const isCorrect = selected === question.correctIndex;
  const mood: Mood = !answered ? "neutral" : isCorrect ? "happy" : "sad";
  const isLast = index + 1 === total;

  function choose(optionIndex: number) {
    if (answered) return;
    setAnswers((prev) => prev.map((a, i) => (i === index ? optionIndex : a)));
  }

  function next() {
    if (isLast) {
      onFinish?.(score, total);
      setPhase("result");
    } else {
      setIndex(index + 1);
    }
  }

  function back() {
    if (index > 0) setIndex(index - 1);
  }

  return (
    <main className="flex flex-1 items-center justify-center p-3 sm:p-6">
      <section className="animate-pop flex w-full max-w-xl flex-col gap-5 border border-line bg-surface p-6 sm:p-10">
        <div className="flex items-end justify-between gap-3">
          <span className="flex items-baseline gap-2 font-display font-extrabold">
            <span className="text-6xl leading-none">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-xl text-line">/ {total}</span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Баллы{" "}
            <span key={score} className="animate-pop inline-block font-display text-3xl text-accent">
              {score}
            </span>
          </span>
        </div>

        <div className="h-px bg-line">
          <div
            className="h-0.5 -translate-y-px bg-accent transition-all duration-700 ease-out"
            style={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>

        <div className="flex justify-center">
          <Mascot key={`${index}-${mood}`} mood={mood} size={104} />
        </div>

        <div key={index} className="flex flex-col gap-5">
          <span className="animate-pop w-fit text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            {question.topic}
          </span>
          <h2 className="animate-fade-up font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
            {question.text}
          </h2>
          <ul className="flex flex-col gap-3">
            {question.options.map((option, i) => {
              const correct = i === question.correctIndex;
              const chosen = i === selected;
              let style = "border-line bg-background/40 hover:border-accent";
              let badge = "border border-line text-accent";
              let motion = "";
              if (answered && correct) {
                style = "border-emerald-500 bg-emerald-500/15";
                badge = "bg-emerald-500 text-white";
                motion = "animate-pop";
              } else if (answered && chosen) {
                style = "border-rose-500 bg-rose-500/15";
                badge = "bg-rose-500 text-white";
                motion = "animate-shake";
              } else if (answered) {
                style = "border-line bg-background/40 opacity-50";
              }

              return (
                <li
                  key={i}
                  className="animate-fade-up"
                  style={{ animationDelay: `${150 + i * 90}ms` }}
                >
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => choose(i)}
                    className={`flex w-full items-center gap-3 border px-4 py-3 text-left text-base font-medium transition disabled:cursor-default ${style} ${motion}`}
                  >
                    <span
                      aria-hidden
                      className={`flex size-9 shrink-0 items-center justify-center font-display text-lg font-bold transition-colors ${badge}`}
                    >
                      {letters[i]}
                    </span>
                    <span className="flex-1">{option}</span>
                    {answered && correct && (
                      <span aria-hidden className="text-ok">
                        ✓
                      </span>
                    )}
                    {answered && chosen && !correct && (
                      <span aria-hidden className="text-bad">
                        ✕
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {answered && (
          <div className="animate-fade-up flex flex-col gap-4">
            <p
              className={`border-l-4 px-5 py-3 text-base ${
                isCorrect
                  ? "border-emerald-500 bg-emerald-500/10 text-ok"
                  : "border-rose-500 bg-rose-500/10 text-bad"
              }`}
            >
              <span className="font-bold">
                {isCorrect
                  ? "Верно! "
                  : `Неверно. Правильный ответ: ${question.options[question.correctIndex]}. `}
              </span>
              {question.explanation}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          {index > 0 ? (
            <button
              type="button"
              onClick={back}
              className="border border-line px-6 py-3 text-sm font-bold uppercase tracking-wider transition hover:border-accent"
            >
              ← Назад
            </button>
          ) : (
            <span />
          )}
          {answered && (
            <button
              type="button"
              onClick={next}
              className="animate-fade-up bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:brightness-110"
            >
              {isLast ? "Показать результат" : "Далее →"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
