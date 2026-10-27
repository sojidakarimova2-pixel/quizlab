"use client";

import { useState } from "react";
import { defaultQuiz, type Question, type QuizData } from "@/lib/questions";
import { loadAttempts, loadQuizzesDetailed, saveAttempts, saveQuizzes } from "@/lib/storage";
import type { ReactNode } from "react";

type Nav = "tests" | "create" | "results";

const navItems: { id: Nav; label: string }[] = [
  { id: "tests", label: "Мои тесты" },
  { id: "create", label: "Создать тест" },
  { id: "results", label: "Прохождение" },
];

const letters = ["A", "B", "C", "D", "E", "F"];
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

const field =
  "w-full border border-line bg-background/40 px-4 py-3 text-base outline-none transition placeholder:text-line focus:border-accent";
const label = "text-xs font-semibold uppercase tracking-[0.2em] text-muted";
const primary =
  "bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:brightness-110";
const secondary =
  "border border-line px-6 py-3 text-sm font-bold uppercase tracking-wider transition hover:border-accent";

function emptyQuestion(): Question {
  return { topic: "", text: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" };
}

function emptyQuiz(): QuizData {
  return { id: `quiz-${Date.now()}`, title: "", questions: [emptyQuestion()] };
}

function validate(quiz: QuizData): string | null {
  if (!quiz.title.trim()) return "Укажите название теста.";
  if (quiz.questions.length === 0) return "Добавьте хотя бы один вопрос.";
  for (const [i, q] of quiz.questions.entries()) {
    const n = i + 1;
    if (!q.text.trim()) return `Вопрос ${n}: введите текст вопроса.`;
    const options = q.options.map((o) => o.trim());
    if (options.some((o) => !o)) return `Вопрос ${n}: заполните все варианты или удалите лишние.`;
    if (new Set(options).size !== options.length) return `Вопрос ${n}: варианты не должны повторяться.`;
  }
  return null;
}

export default function Builder({ onPlay }: { onPlay: (quiz: QuizData) => void }) {
  // компонент монтируется только после переключения режима, поэтому чтение хранилища безопасно
  const [loaded] = useState(() => loadQuizzesDetailed());
  const [quizzes, setQuizzes] = useState<QuizData[]>(loaded.quizzes);
  const [notice, setNotice] = useState<string | null>(loaded.problem);
  const [draft, setDraft] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<"tests" | "results">("tests");
  const [attempts, setAttempts] = useState(() => loadAttempts());

  const isNew = draft !== null && !quizzes.some((q) => q.id === draft.id);
  const active: Nav = draft ? (isNew ? "create" : "tests") : section;

  function go(nav: Nav) {
    setError(null);
    if (nav === "create") {
      setDraft(emptyQuiz());
      return;
    }
    setDraft(null);
    setSection(nav);
  }

  function frame(content: ReactNode) {
    return (
      <main className="flex flex-1 justify-center p-3 sm:p-6">
        <div className="animate-pop flex w-full max-w-5xl flex-col gap-4">
          <h1 className="font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">
            Режим <span className="text-accent">преподавателя</span>
          </h1>
          <div className="border border-line bg-surface">
            <div className="border-b border-line px-6 py-4 font-display text-xl font-bold uppercase">
              QuizLab Studio
            </div>
            <div className="flex flex-col sm:flex-row">
              <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-line p-3 sm:w-56 sm:flex-col sm:border-b-0 sm:border-r sm:p-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.id)}
                    className={`whitespace-nowrap border-l-2 px-4 py-3 text-left text-sm font-bold uppercase tracking-wider transition ${
                      active === item.id
                        ? "border-accent text-foreground"
                        : "border-transparent text-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
              <section className="flex min-w-0 flex-1 flex-col gap-6 p-6 sm:p-10">
                {notice && (
                  <p
                    role="alert"
                    className="animate-fade-up border-l-4 border-amber-500 bg-amber-500/10 px-5 py-3 text-sm text-warn"
                  >
                    {notice}
                  </p>
                )}
                {content}
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  }

  function clearAttempts() {
    if (!window.confirm("Очистить все результаты?")) return;
    setAttempts([]);
    saveAttempts([]);
  }

  function commit(next: QuizData[]) {
    setQuizzes(next);
    setNotice(
      saveQuizzes(next)
        ? null
        : "Не удалось сохранить тесты в браузере. Они останутся только до закрытия страницы.",
    );
  }

  function save() {
    if (!draft) return;
    const problem = validate(draft);
    if (problem) {
      setError(problem);
      return;
    }
    const clean: QuizData = {
      ...draft,
      title: draft.title.trim(),
      questions: draft.questions.map((q) => ({
        ...q,
        topic: q.topic.trim(),
        text: q.text.trim(),
        options: q.options.map((o) => o.trim()),
        explanation: q.explanation.trim(),
      })),
    };
    const exists = quizzes.some((q) => q.id === clean.id);
    commit(exists ? quizzes.map((q) => (q.id === clean.id ? clean : q)) : [...quizzes, clean]);
    setDraft(null);
    setError(null);
  }

  function remove(id: string) {
    if (!window.confirm("Удалить этот тест?")) return;
    commit(quizzes.filter((q) => q.id !== id));
  }

  function patchQuestion(index: number, patch: Partial<Question>) {
    if (!draft) return;
    setDraft({
      ...draft,
      questions: draft.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    });
  }

  function patchOption(qi: number, oi: number, value: string) {
    if (!draft) return;
    patchQuestion(qi, { options: draft.questions[qi].options.map((o, i) => (i === oi ? value : o)) });
  }

  function addOption(qi: number) {
    if (!draft) return;
    patchQuestion(qi, { options: [...draft.questions[qi].options, ""] });
  }

  function removeOption(qi: number, oi: number) {
    if (!draft) return;
    const q = draft.questions[qi];
    const correctIndex =
      q.correctIndex === oi ? 0 : q.correctIndex > oi ? q.correctIndex - 1 : q.correctIndex;
    patchQuestion(qi, { options: q.options.filter((_, i) => i !== oi), correctIndex });
  }

  function removeQuestion(qi: number) {
    if (!draft) return;
    setDraft({ ...draft, questions: draft.questions.filter((_, i) => i !== qi) });
  }

  if (draft) {
    return frame(
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              {isNew ? "Создать тест" : "Редактирование"}
            </span>
            <label className="flex flex-col gap-2">
              <span className={label}>Название теста</span>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Например, География"
                className={`${field} font-display text-2xl font-bold uppercase`}
              />
            </label>
          </div>

          {draft.questions.map((q, qi) => (
            <fieldset key={qi} className="animate-fade-up flex flex-col gap-4 border border-line p-5">
              <legend className="px-2 font-display text-2xl font-extrabold">
                {String(qi + 1).padStart(2, "0")}
              </legend>
              <label className="flex flex-col gap-2">
                <span className={label}>Тема (необязательно)</span>
                <input
                  value={q.topic}
                  onChange={(e) => patchQuestion(qi, { topic: e.target.value })}
                  placeholder="география"
                  className={field}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className={label}>Вопрос</span>
                <textarea
                  value={q.text}
                  onChange={(e) => patchQuestion(qi, { text: e.target.value })}
                  rows={2}
                  className={field}
                />
              </label>
              <div className="flex flex-col gap-2">
                <span className={label}>Варианты · отметьте верный</span>
                {q.options.map((option, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <label
                      className={`flex size-11 shrink-0 cursor-pointer items-center justify-center border font-display text-lg font-bold transition ${
                        q.correctIndex === oi
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-line text-accent hover:border-accent"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correctIndex === oi}
                        onChange={() => patchQuestion(qi, { correctIndex: oi })}
                        className="sr-only"
                        aria-label={`Вариант ${letters[oi]} верный`}
                      />
                      {letters[oi]}
                    </label>
                    <input
                      value={option}
                      onChange={(e) => patchOption(qi, oi, e.target.value)}
                      aria-label={`Вариант ${letters[oi]}`}
                      className={field}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(qi, oi)}
                      disabled={q.options.length <= MIN_OPTIONS}
                      aria-label={`Удалить вариант ${letters[oi]}`}
                      className="size-11 shrink-0 border border-line text-muted transition hover:border-rose-500 hover:text-bad disabled:opacity-30 disabled:hover:border-line disabled:hover:text-muted"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {q.options.length < MAX_OPTIONS && (
                  <button
                    type="button"
                    onClick={() => addOption(qi)}
                    className="w-fit text-xs font-semibold uppercase tracking-wider text-muted transition hover:text-accent"
                  >
                    + Добавить вариант
                  </button>
                )}
              </div>
              <label className="flex flex-col gap-2">
                <span className={label}>Пояснение после ответа</span>
                <textarea
                  value={q.explanation}
                  onChange={(e) => patchQuestion(qi, { explanation: e.target.value })}
                  rows={2}
                  className={field}
                />
              </label>
              <button
                type="button"
                onClick={() => removeQuestion(qi)}
                className="w-fit text-xs font-semibold uppercase tracking-wider text-muted transition hover:text-bad"
              >
                Удалить вопрос
              </button>
            </fieldset>
          ))}

          <button
            type="button"
            onClick={() => setDraft({ ...draft, questions: [...draft.questions, emptyQuestion()] })}
            className={`${secondary} w-fit`}
          >
            + Добавить вопрос
          </button>

          {error && (
            <p role="alert" className="border-l-4 border-rose-500 bg-rose-500/10 px-5 py-3 text-bad">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={save} className={primary}>
              Сохранить тест
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(null);
                setError(null);
              }}
              className={secondary}
            >
              Отмена
            </button>
          </div>
        </div>,
    );
  }

  if (section === "results") {
    const sorted = [...attempts].sort((a, b) => b.at - a.at);
    return frame(
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Прохождение
            </span>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-none">
              Результаты учеников
            </h2>
          </div>
          {sorted.length > 0 && (
            <button type="button" onClick={clearAttempts} className={secondary}>
              Очистить
            </button>
          )}
        </div>
        <div className="h-px bg-line">
          <div className="h-0.5 w-16 -translate-y-px bg-accent" />
        </div>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted">
            Пока никто не прошёл ваши тесты. Результаты учеников появятся здесь.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs font-semibold uppercase tracking-wider text-muted">
                  <th className="py-3 pr-4">Ученик</th>
                  <th className="py-3 pr-4">Тест</th>
                  <th className="py-3 pr-4">Баллы</th>
                  <th className="py-3">Дата</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => (
                  <tr key={a.id} className="animate-fade-up border-b border-line">
                    <td className="py-3 pr-4 font-semibold">{a.student}</td>
                    <td className="py-3 pr-4">{a.quizTitle}</td>
                    <td className="py-3 pr-4 font-display text-xl font-bold text-accent">
                      {a.score} / {a.total}
                    </td>
                    <td className="py-3 text-muted">{new Date(a.at).toLocaleString("ru-RU")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>,
    );
  }

  const rows = [{ quiz: defaultQuiz, builtin: true }, ...quizzes.map((quiz) => ({ quiz, builtin: false }))];

  return frame(
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Конструктор
            </span>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-none">Мои тесты</h2>
          </div>
          <button type="button" onClick={() => go("create")} className={primary}>
            + Создать тест
          </button>
        </div>

        <div className="h-px bg-line">
          <div className="h-0.5 w-16 -translate-y-px bg-accent" />
        </div>

        <ul className="flex flex-col gap-3">
          {rows.map(({ quiz, builtin }, i) => (
            <li
              key={quiz.id}
              className="animate-fade-up flex flex-wrap items-center justify-between gap-4 border border-line bg-background/40 p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-bold uppercase">{quiz.title}</h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  {quiz.questions.length} вопросов{builtin ? " · встроенный" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => onPlay(quiz)}
                  className="bg-accent px-5 py-2.5 text-white transition hover:brightness-110"
                >
                  Предпросмотр →
                </button>
                {!builtin && (
                  <>
                    <button
                      type="button"
                      onClick={() => setDraft(structuredClone(quiz))}
                      className="border border-line px-5 py-2.5 transition hover:border-accent"
                    >
                      Изменить
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(quiz.id)}
                      className="border border-line px-5 py-2.5 text-muted transition hover:border-rose-500 hover:text-bad"
                    >
                      Удалить
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>

        {quizzes.length === 0 && (
          <p className="text-sm text-muted">
            Своих тестов пока нет. Создайте первый: они хранятся в этом браузере.
          </p>
        )}
      </div>,
  );
}
