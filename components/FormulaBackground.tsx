type Kind = "formula" | "code" | "word";

type Item = {
  text: string;
  kind: Kind;
  top: number;
  left: number;
  rotate: number;
  size: number;
};

const items: Item[] = [
  { text: "E = mc²", kind: "formula", top: 5, left: 4, rotate: -8, size: 34 },
  { text: "const answer = 42;", kind: "code", top: 7, left: 36, rotate: 3, size: 16 },
  { text: "Эврика!", kind: "word", top: 6, left: 72, rotate: 6, size: 15 },
  { text: "a² + b² = c²", kind: "formula", top: 16, left: 58, rotate: -4, size: 26 },
  { text: "console.log(\"QuizLab\");", kind: "code", top: 18, left: 3, rotate: 5, size: 15 },
  { text: "∫ x dx = x²/2 + C", kind: "formula", top: 26, left: 76, rotate: 7, size: 24 },
  { text: "Гипотеза", kind: "word", top: 29, left: 14, rotate: -6, size: 14 },
  { text: "π ≈ 3,14159", kind: "formula", top: 36, left: 2, rotate: 4, size: 28 },
  { text: "if (correct) score++;", kind: "code", top: 38, left: 70, rotate: -5, size: 16 },
  { text: "sin²x + cos²x = 1", kind: "formula", top: 47, left: 84, rotate: 2, size: 22 },
  { text: "F = ma", kind: "formula", top: 48, left: 1, rotate: -10, size: 28 },
  { text: "Знание — сила", kind: "word", top: 59, left: 70, rotate: -3, size: 14 },
  { text: "SELECT * FROM quiz;", kind: "code", top: 62, left: 8, rotate: 5, size: 16 },
  { text: "Σ n = n(n + 1) / 2", kind: "formula", top: 71, left: 42, rotate: -2, size: 24 },
  { text: "<Quiz />", kind: "code", top: 78, left: 72, rotate: 6, size: 17 },
  { text: "e^(iπ) + 1 = 0", kind: "formula", top: 80, left: 4, rotate: -6, size: 30 },
  { text: "Эксперимент", kind: "word", top: 84, left: 50, rotate: 4, size: 14 },
  { text: "for (let i = 0; i < n; i++) {}", kind: "code", top: 89, left: 2, rotate: -3, size: 14 },
  { text: "ΔS ≥ 0", kind: "formula", top: 88, left: 78, rotate: -7, size: 30 },
  { text: "def solve(x): return x ** 2", kind: "code", top: 94, left: 42, rotate: 2, size: 14 },
  { text: "v = s / t", kind: "formula", top: 13, left: 24, rotate: 8, size: 22 },
  { text: "√(x² + y²)", kind: "formula", top: 76, left: 24, rotate: -5, size: 22 },
  { text: "Теория", kind: "word", top: 22, left: 40, rotate: -4, size: 13 },
];

const kindClass: Record<Kind, string> = {
  formula: "font-serif italic",
  code: "font-mono",
  word: "font-bold uppercase tracking-[0.25em]",
};

export default function FormulaBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      {items.map((item, i) => (
        <span
          key={item.text}
          className={`animate-drift absolute whitespace-nowrap text-foreground/10 ${kindClass[item.kind]}`}
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: item.size,
            transform: `rotate(${item.rotate}deg)`,
            animationDuration: `${7 + (i % 4) * 2}s`,
            animationDelay: `-${(i * 1.7) % 9}s`,
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
