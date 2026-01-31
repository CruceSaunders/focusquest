import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusQuest - Gamified Pomodoro Timer",
  description: "Level up by staying focused. A gamified Pomodoro timer where you earn XP, gold, and evolve your pet companion!",
  keywords: ["pomodoro", "timer", "productivity", "gamification", "focus", "study", "work"],
  authors: [{ name: "FocusQuest" }],
  openGraph: {
    title: "FocusQuest - Gamified Pomodoro Timer",
    description: "Level up by staying focused. Earn XP, gold, and evolve your pet!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
