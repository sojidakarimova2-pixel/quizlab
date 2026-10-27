import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export type Mode = "student" | "teacher";

const modes: { id: Mode; label: string }[] = [
  { id: "student", label: "Ученик" },
  { id: "teacher", label: "Преподаватель" },
];

export default function ModeSwitch({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
        <span className="flex items-center gap-3 font-display text-sm font-bold uppercase tracking-wide">
          <Image src="/logo.svg" alt="" width={240} height={260} unoptimized className="h-8 w-auto" />
          QuizLab Studio
        </span>
        <div className="flex h-full items-center">
        <div role="tablist" aria-label="Режим" className="flex h-full">
          {modes.map((m) => {
            const active = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChange(m.id)}
                className={`relative px-5 text-xs font-semibold uppercase tracking-wider transition ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {m.label}
                {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-accent" />}
              </button>
            );
          })}
        </div>
        <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
