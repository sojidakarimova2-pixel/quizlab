import type { Metadata } from "next";
import { Manrope, Roboto_Condensed } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "QuizLab",
  description: "Приложение для викторин",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${manrope.variable} ${robotoCondensed.variable} h-full antialiased`}
    >
      <head>
        {/* ставит сохранённую тему до первой отрисовки, чтобы страница не мигала */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("quizlab:theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
