export type Question = {
  topic: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizData = {
  id: string;
  title: string;
  questions: Question[];
};

export const questions: Question[] = [
  {
    topic: "космос",
    text: "Какая планета Солнечной системы самая большая?",
    options: ["Земля", "Юпитер", "Сатурн", "Марс"],
    correctIndex: 1,
    explanation: "Юпитер больше всех остальных планет вместе взятых.",
  },
  {
    topic: "химия",
    text: "Какова химическая формула воды?",
    options: ["H₂O", "CO₂", "O₂", "NaCl"],
    correctIndex: 0,
    explanation: "Молекула воды состоит из двух атомов водорода и одного кислорода.",
  },
  {
    topic: "математика",
    text: "Сколько будет 12 × 12?",
    options: ["124", "134", "144", "154"],
    correctIndex: 2,
    explanation: "12 × 12 = 144, это квадрат числа двенадцать.",
  },
  {
    topic: "математика",
    text: "Чему примерно равно число π?",
    options: ["2,71", "3,14", "1,61", "4,13"],
    correctIndex: 1,
    explanation: "π ≈ 3,14159: это отношение длины окружности к её диаметру.",
  },
  {
    topic: "физика",
    text: "Кто сформулировал закон всемирного тяготения?",
    options: ["Эйнштейн", "Галилей", "Кеплер", "Ньютон"],
    correctIndex: 3,
    explanation: "Исаак Ньютон опубликовал закон тяготения в 1687 году.",
  },
  {
    topic: "код",
    text: "Какая технология отвечает за оформление веб-страниц?",
    options: ["HTML", "SQL", "CSS", "Python"],
    correctIndex: 2,
    explanation: "CSS задаёт цвета, шрифты, отступы и анимации.",
  },
  {
    topic: "природа",
    text: "Какой природный материал самый твёрдый?",
    options: ["Алмаз", "Золото", "Железо", "Кварц"],
    correctIndex: 0,
    explanation: "Алмаз получает высшую оценку 10 по шкале твёрдости Мооса.",
  },
  {
    topic: "физика",
    text: "Какова примерная скорость света в вакууме?",
    options: ["3 000 км/с", "300 000 км/с", "30 000 км/с", "3 000 000 км/с"],
    correctIndex: 1,
    explanation: "Свет проходит около 300 000 километров за секунду.",
  },
  {
    topic: "код",
    text: "Сколько бит в одном байте?",
    options: ["4", "6", "8", "16"],
    correctIndex: 2,
    explanation: "Один байт равен восьми битам.",
  },
  {
    topic: "природа",
    text: "Какой газ преобладает в атмосфере Земли?",
    options: ["Кислород", "Азот", "Углекислый газ", "Аргон"],
    correctIndex: 1,
    explanation: "Азота в воздухе около 78%, кислорода около 21%.",
  },
];

export const defaultQuiz: QuizData = {
  id: "default",
  title: "QuizLab: наука, числа и код",
  questions,
};
