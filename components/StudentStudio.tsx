"use client";

import { useState } from "react";
import Player from "@/components/Player";
import { defaultQuiz, type QuizData } from "@/lib/questions";
import { loadAttempts, loadQuizzes, saveAttempts } from "@/lib/storage";

type View = "home" | "tests" | "play";

function TestList({ onPick }: { onPick: (quiz: QuizData, student: string) => void }) {
  // список открывается кликом, уже после гидрации, поэтому читать хранилище безопасно
  const [quizzes] = useState<QuizData[]>(() => [defaultQuiz, ...loadQuizzes()]);
  const [name, setName] = useState("");

  return (
    <main className="flex flex-1 justify-center p-3 sm:p-6">
      <section className="animate-pop flex w-full max-w-3xl flex-col gap-8 border border-line bg-surface p-6 sm:p-10">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Режим ученика
          </span>
          <h1 className="font-display text-5xl font-extrabold uppercase leading-none">
            Тесты <span className="text-accent">учителя</span>
          </h1>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Ваше имя (увидит учитель)
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Анна"
            className="w-full border border-line bg-background/40 px-4 py-3 text-base outline-none transition placeholder:text-line focus:border-accent"
          />
        </label>

        <ul className="flex flex-col gap-3">
          {quizzes.map((quiz, i) => (
            <li
              key={quiz.id}
              className="animate-fade-up flex flex-wrap items-center justify-between gap-4 border border-line bg-background/40 p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-bold uppercase">{quiz.title}</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  {quiz.questions.length} вопросов
                </p>
              </div>
              <button
                type="button"
                onClick={() => onPick(quiz, name.trim() || "Ученик")}
                className="bg-accent px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:brightness-110"
              >
                Пройти →
              </button>
            </li>
          ))}
        </ul>

        {quizzes.length === 1 && (
          <p className="text-sm text-muted">Учитель пока не добавил своих тестов.</p>
        )}
      </section>
    </main>
  );
}

export default function StudentStudio({ preview }: { preview: QuizData | null }) {
  const [view, setView] = useState<View>(preview ? "play" : "tests");
  const [quiz, setQuiz] = useState<QuizData>(preview ?? defaultQuiz);
  const [student, setStudent] = useState<string | null>(null);
  const [run, setRun] = useState(0);

  function pick(next: QuizData, name: string) {
    setQuiz(next);
    setStudent(name);
    setRun((r) => r + 1);
    setView("play");
    window.scrollTo({ top: 0 });
  }

  function open(next: View) {
    setStudent(null);
    setView(next);
    setRun((r) => r + 1);
  }

  function finish(score: number, total: number) {
    if (student === null) return;
    saveAttempts([
      ...loadAttempts(),
      {
        id: `attempt-${Date.now()}`,
        quizId: quiz.id,
        quizTitle: quiz.title,
        student,
        score,
        total,
        at: Date.now(),
      },
    ]);
  }

  const tabs: { id: View; label: string }[] = [
    { id: "tests", label: "Тесты учителя" },
    { id: "home", label: "Викторина" },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-line">
        <div className="mx-auto flex h-10 w-full max-w-6xl px-6 sm:px-10">
          {tabs.map((tab) => {
            const active = view === tab.id || (view === "play" && tab.id === "tests" && student !== null);
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => open(tab.id)}
                className={`relative pr-8 text-xs font-semibold uppercase tracking-wider transition ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
                {active && <span className="absolute bottom-0 left-0 h-0.5 w-8 bg-accent" />}
              </button>
            );
          })}
        </div>
      </div>

      {view === "tests" && <TestList onPick={pick} />}
      {view === "home" && (
        <Player key={run} quiz={defaultQuiz} onHome={() => open("home")} />
      )}
      {view === "play" && (
        <Player
          key={run}
          quiz={quiz}
          autoStart
          onHome={() => open(student !== null ? "tests" : "home")}
          onFinish={finish}
        />
      )}
    </div>
  );
}
