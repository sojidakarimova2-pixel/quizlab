"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const EVENT = "quizlab-theme";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("quizlab:theme", next);
    } catch {
      // тема сменится, но не запомнится
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
      className="ml-2 flex h-8 items-center gap-2 border border-line px-3 text-xs font-semibold uppercase tracking-wider text-muted transition hover:border-accent hover:text-foreground"
    >
      <span aria-hidden>{theme === "dark" ? "☾" : "☀"}</span>
      <span className="hidden sm:inline">{theme === "dark" ? "Тёмная" : "Светлая"}</span>
    </button>
  );
}
