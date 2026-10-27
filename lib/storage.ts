import type { QuizData } from "@/lib/questions";

const KEY = "quizlab:quizzes";
const BACKUP_KEY = "quizlab:quizzes:backup";

function isQuiz(value: unknown): value is QuizData {
  if (typeof value !== "object" || value === null) return false;
  const quiz = value as QuizData;
  return (
    typeof quiz.id === "string" &&
    typeof quiz.title === "string" &&
    Array.isArray(quiz.questions) &&
    quiz.questions.every(
      (q) =>
        typeof q.text === "string" &&
        Array.isArray(q.options) &&
        typeof q.correctIndex === "number" &&
        q.options[q.correctIndex] !== undefined,
    )
  );
}

export type Attempt = {
  id: string;
  quizId: string;
  quizTitle: string;
  student: string;
  score: number;
  total: number;
  at: number;
};

const ATTEMPTS_KEY = "quizlab:attempts";

export function loadAttempts(): Attempt[] {
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(
          (a): a is Attempt =>
            typeof a === "object" &&
            a !== null &&
            typeof a.student === "string" &&
            typeof a.quizTitle === "string" &&
            typeof a.score === "number" &&
            typeof a.total === "number",
        )
      : [];
  } catch {
    return [];
  }
}

export function saveAttempts(attempts: Attempt[]): void {
  try {
    window.localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    // хранилище недоступно
  }
}

export type LoadedQuizzes = {
  quizzes: QuizData[];
  // сообщение для интерфейса, если данные не удалось прочитать целиком
  problem: string | null;
};

// Чтение из localStorage: единственное место, где восстанавливается список тестов.
// Пустое хранилище даёт пустой список, повреждённые данные уходят в резервную копию.
export function loadQuizzesDetailed(): LoadedQuizzes {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return { quizzes: [], problem: "Хранилище браузера недоступно: тесты не сохранятся." };
  }
  if (!raw) return { quizzes: [], problem: null };

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("not an array");
    const quizzes = parsed.filter(isQuiz);
    return {
      quizzes,
      problem:
        quizzes.length < parsed.length
          ? "Часть сохранённых тестов повреждена и была пропущена."
          : null,
    };
  } catch {
    try {
      window.localStorage.setItem(BACKUP_KEY, raw);
    } catch {
      // резервную копию сделать не удалось, продолжаем с пустым списком
    }
    return {
      quizzes: [],
      problem: "Сохранённые тесты повреждены. Копия данных оставлена в браузере, список начат заново.",
    };
  }
}

export function loadQuizzes(): QuizData[] {
  return loadQuizzesDetailed().quizzes;
}

// Запись в localStorage: единственное место сохранения тестов.
// Возвращает false, если браузер отказал (квота, приватный режим).
export function saveQuizzes(quizzes: QuizData[]): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(quizzes));
    return true;
  } catch {
    return false;
  }
}
