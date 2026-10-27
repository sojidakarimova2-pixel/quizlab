import FormulaBackground from "@/components/FormulaBackground";
import Mascot from "@/components/Mascot";
import Reveal from "@/components/Reveal";

const steps = [
  { title: "Нажмите «Начать»", text: "Никакой регистрации: викторина открывается сразу." },
  { title: "Ответьте на 10 вопросов", text: "У каждого вопроса четыре варианта, правильный только один." },
  { title: "Узнайте результат", text: "В конце вас ждёт итоговый счёт и совет, что повторить." },
];

const features = [
  { icon: "⚡", tag: "быстро", title: "10 вопросов", text: "Короткая викторина по науке, математике и программированию на пару минут." },
  { icon: "💬", tag: "сразу", title: "Мгновенный ответ", text: "Сразу видно, верно ли вы ответили, и почему именно так." },
  { icon: "😊", tag: "эмоции", title: "Эмоции вместо оценок", text: "Талисман радуется правильным ответам и грустит из-за ошибок." },
  { icon: "🏆", tag: "счёт", title: "Баллы и результат", text: "Счёт растёт после каждого ответа, а в конце показывается итог." },
];

const topics = ["Космос", "Математика", "Физика", "Химия", "Программирование", "Природа", "Технологии"];

const heading = "font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl";

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex flex-1 flex-col gap-20 sm:gap-32">
      <section className="relative flex min-h-[calc(100svh-5.5rem)] flex-col overflow-hidden bg-[radial-gradient(ellipse_at_75%_35%,rgb(212_73_28/0.2),transparent_60%)]">
        <FormulaBackground />
        <div
          aria-hidden
          className="animate-ring pointer-events-none absolute left-[72%] top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/15"
        />
        <div
          aria-hidden
          className="animate-ring pointer-events-none absolute left-[72%] top-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10 [animation-delay:-2s]"
        />

        <header className="animate-fade-up relative z-10 mx-auto w-full max-w-6xl px-6 pt-6 sm:px-10">
          <div className="flex items-center justify-between gap-3 pb-5">
            <span className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-wide">
              <span aria-hidden className="size-3 rounded-full bg-accent" />
              QuizLab
            </span>
            <nav className="hidden gap-8 text-xs font-semibold uppercase tracking-wider text-muted sm:flex">
              <a href="#how" className="transition hover:text-foreground">
                Как это работает
              </a>
              <a href="#features" className="transition hover:text-foreground">
                Возможности
              </a>
              <a href="#topics" className="transition hover:text-foreground">
                Темы
              </a>
            </nav>
            <button
              type="button"
              onClick={onStart}
              className="text-xs font-semibold uppercase tracking-wider transition hover:text-accent"
            >
              Играть →
            </button>
          </div>
          <div className="relative h-px bg-line">
            <span className="absolute left-0 top-0 h-0.5 w-16 -translate-y-1/2 bg-accent" />
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center gap-10 px-6 py-16 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start gap-5">
            <span className="animate-fade-up text-xs font-semibold uppercase tracking-[0.3em] text-accent [animation-delay:250ms]">
              Викторина
            </span>
            <h1
              aria-label="QuizLab"
              className="flex font-display text-7xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-9xl md:text-[10rem]"
            >
              {"QuizLab".split("").map((letter, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="animate-pop inline-block"
                  style={{ animationDelay: `${350 + i * 80}ms` }}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <p className="animate-fade-up max-w-md text-base text-muted [animation-delay:950ms]">
              Проверь свои знания и узнай что-то новое
            </p>
            <button
              type="button"
              onClick={onStart}
              className="animate-fade-up animate-glow mt-2 flex items-center gap-6 bg-accent px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground [animation-delay:1100ms]"
            >
              Начать
              <span aria-hidden className="text-xl leading-none">
                →
              </span>
            </button>
          </div>
          <div className="animate-pop self-center [animation-delay:150ms]">
            <Mascot mood="neutral" size={200} />
          </div>
        </div>

        <div className="relative z-10 mx-auto mb-8 w-full max-w-6xl px-6 sm:px-10">
          <div className="h-px bg-line">
            <div className="h-0.5 w-1/4 -translate-y-px bg-accent" />
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-6xl scroll-mt-6 px-6 sm:px-10">
        <Reveal>
          <h2 className={heading}>
            Как это <span className="text-accent">работает</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted">Три простых шага от кнопки до результата.</p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div className="h-full border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-accent">
                <span className="font-display text-5xl font-extrabold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold uppercase">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-6 px-6 sm:px-10">
        <Reveal>
          <h2 className={heading}>
            Почему <span className="text-accent">QuizLab</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted">Всё, что нужно для быстрой и весёлой проверки знаний.</p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 2) * 120}>
              <div className="flex h-full gap-4 border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-accent">
                <span className="flex size-12 shrink-0 items-center justify-center border border-line text-2xl">
                  {feature.icon}
                </span>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    {feature.tag}
                  </span>
                  <h3 className="mt-1 font-display text-2xl font-bold uppercase">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted">{feature.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="topics" className="mx-auto w-full max-w-6xl scroll-mt-6 px-6 sm:px-10">
        <Reveal>
          <h2 className={heading}>
            О чём <span className="text-accent">вопросы</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted">Немного науки, чисел и кода.</p>
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-3">
          {topics.map((topic, i) => (
            <Reveal key={topic} delay={i * 80}>
              <span
                className="animate-float inline-block border border-line bg-surface px-6 py-3 font-display text-lg font-bold uppercase tracking-wide"
                style={{ animationDelay: `${-i * 0.7}s` }}
              >
                {topic}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <Reveal>
          <div className="relative overflow-hidden border border-line bg-[radial-gradient(ellipse_at_80%_20%,rgb(212_73_28/0.25),transparent_60%)] bg-surface px-6 py-16 text-center">
            <h2 className="font-display text-5xl font-extrabold uppercase leading-none sm:text-7xl">
              Готов проверить{" "}
              <span className="inline-block bg-accent px-5 py-1">себя?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">
              Десять вопросов, пара минут и хорошее настроение.
            </p>
            <button
              type="button"
              onClick={onStart}
              className="animate-glow mt-8 bg-accent px-10 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:brightness-110"
            >
              Начать →
            </button>
          </div>
        </Reveal>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-6 pb-8 text-center text-xs uppercase tracking-wider text-muted sm:px-10">
        <span className="border border-line bg-surface px-6 py-3 font-semibold text-foreground">
          10 вопросов · около 2 минут · бесплатно
        </span>
        QuizLab · викторина для любопытных
      </footer>
    </main>
  );
}
