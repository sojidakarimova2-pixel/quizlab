"use client";

import { useId, type CSSProperties } from "react";

export type Mood = "neutral" | "happy" | "sad";

const confettiColors = ["#d4491c", "#ffc857", "#ff7aa8", "#34d399", "#a78bfa"];

const confetti = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const distance = 70 + (i % 3) * 22;
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    color: confettiColors[i % confettiColors.length],
    delay: (i % 4) * 40,
  };
});

const faceColors: Record<Mood, [string, string]> = {
  neutral: ["#ffe9a8", "#ffc857"],
  happy: ["#ffe9a8", "#ffc857"],
  sad: ["#dcebf8", "#9fc3e6"],
};

export default function Mascot({ mood, size = 120 }: { mood: Mood; size?: number }) {
  const gradientId = `face-${useId().replace(/:/g, "")}`;
  const [from, to] = faceColors[mood];
  const motion =
    mood === "happy" ? "animate-jump" : mood === "sad" ? "animate-shake" : "animate-float";

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {mood === "happy" &&
        confetti.map((piece, i) => (
          <span
            key={i}
            aria-hidden
            className="animate-confetti absolute left-1/2 top-1/2 size-2.5 rounded-sm"
            style={
              {
                "--x": `${piece.x}px`,
                "--y": `${piece.y}px`,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}ms`,
              } as CSSProperties
            }
          />
        ))}

      <div className={`size-full ${motion}`}>
        <div className={`size-full ${mood === "sad" ? "animate-droop" : ""}`}>
          <svg viewBox="0 0 120 120" role="img" aria-label={labels[mood]} className="size-full">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={from} />
                <stop offset="1" stopColor={to} />
              </linearGradient>
            </defs>

            <path
              d="M17 62 Q60 -30 103 62"
              fill="none"
              stroke="#d4491c"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="60" cy="66" r="44" fill={`url(#${gradientId})`} />
            <circle cx="15" cy="66" r="11" fill="#d4491c" />
            <circle cx="105" cy="66" r="11" fill="#d4491c" />

            <ellipse
              cx="36"
              cy="79"
              rx={mood === "happy" ? 8 : 7}
              ry={mood === "happy" ? 5.5 : 5}
              fill="#ff8fa3"
              opacity={mood === "sad" ? 0.25 : 0.6}
            />
            <ellipse
              cx="84"
              cy="79"
              rx={mood === "happy" ? 8 : 7}
              ry={mood === "happy" ? 5.5 : 5}
              fill="#ff8fa3"
              opacity={mood === "sad" ? 0.25 : 0.6}
            />

            {mood === "happy" ? (
              <g fill="none" stroke="#3a2a22" strokeWidth="5" strokeLinecap="round">
                <path d="M37 64 Q45 52 53 64" />
                <path d="M67 64 Q75 52 83 64" />
              </g>
            ) : (
              <g fill="#3a2a22">
                <g className="animate-blink origin-center [transform-box:fill-box]">
                  <circle cx="45" cy="62" r="6" />
                  <circle cx="46.8" cy="60" r="1.8" fill="#fff" />
                </g>
                <g className="animate-blink origin-center [transform-box:fill-box]">
                  <circle cx="75" cy="62" r="6" />
                  <circle cx="76.8" cy="60" r="1.8" fill="#fff" />
                </g>
              </g>
            )}

            {mood === "sad" && (
              <g fill="none" stroke="#3a2a22" strokeWidth="3.5" strokeLinecap="round">
                <path d="M36 50 L53 44" />
                <path d="M84 50 L67 44" />
              </g>
            )}

            {mood === "happy" && (
              <>
                <path d="M42 76 Q60 104 78 76 Z" fill="#7a2d2d" strokeLinejoin="round" />
                <ellipse cx="60" cy="86" rx="7" ry="4" fill="#ff8fa3" />
              </>
            )}
            {mood === "neutral" && (
              <path
                d="M50 82 Q60 88 70 82"
                fill="none"
                stroke="#5b3a29"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}
            {mood === "sad" && (
              <path
                d="M46 91 Q60 76 74 91"
                fill="none"
                stroke="#5b3a29"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}

            {mood === "sad" && (
              <>
                <ellipse cx="41" cy="74" rx="3" ry="4.5" fill="#6cc4ff" className="animate-tear" />
                <ellipse
                  cx="79"
                  cy="74"
                  rx="3"
                  ry="4.5"
                  fill="#6cc4ff"
                  className="animate-tear"
                  style={{ animationDelay: "0.7s" }}
                />
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

const labels: Record<Mood, string> = {
  neutral: "Талисман думает",
  happy: "Талисман улыбается",
  sad: "Талисман грустит",
};
