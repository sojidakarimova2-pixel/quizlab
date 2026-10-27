"use client";

import { useState } from "react";
import Builder from "@/components/Builder";
import ModeSwitch, { type Mode } from "@/components/ModeSwitch";
import StudentStudio from "@/components/StudentStudio";
import type { QuizData } from "@/lib/questions";

export default function Quiz() {
  const [mode, setMode] = useState<Mode>("student");
  // тест, который учитель открыл на предпросмотр: результат не записывается
  const [preview, setPreview] = useState<QuizData | null>(null);
  // новый ключ пересоздаёт студию ученика, поэтому она всегда открывается с начала
  const [run, setRun] = useState(0);

  function changeMode(next: Mode) {
    if (next === mode) return;
    setPreview(null);
    setRun((r) => r + 1);
    setMode(next);
    window.scrollTo({ top: 0 });
  }

  function showPreview(quiz: QuizData) {
    setPreview(quiz);
    setRun((r) => r + 1);
    setMode("student");
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="flex flex-1 flex-col">
      <ModeSwitch mode={mode} onChange={changeMode} />
      {mode === "student" ? (
        <StudentStudio key={run} preview={preview} />
      ) : (
        <Builder onPlay={showPreview} />
      )}
    </div>
  );
}
