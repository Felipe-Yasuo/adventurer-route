import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fantasy",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  icons: { icon: "/ui/logo/logo.png" },
  title: "Adventurer Route",
  description:
    "Turn your daily tasks into epic quests. Level up, earn XP, collect items and conquer your goals in this RPG-inspired productivity app.",
  keywords: ["productivity", "RPG", "gamification", "tasks", "quests", "XP", "level up"],
  authors: [{ name: "Felipe Yasuo" }],
  openGraph: {
    title: "Adventurer Route",
    description:
      "Turn your daily tasks into epic quests. Level up, earn XP, collect items and conquer your goals.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adventurer Route",
    description:
      "Turn your daily tasks into epic quests. Level up, earn XP, collect items and conquer your goals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${newsreader.variable} ${manrope.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
