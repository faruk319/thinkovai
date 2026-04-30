import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thinkovai — AI-Powered Mind Maps",
  description:
    "Turn any idea into a visual mind map instantly. AI-powered mind mapping tool for students, professionals, and creators.",
  keywords: [
    "mind map",
    "AI",
    "brainstorming",
    "visual thinking",
    "study tool",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans selection:bg-zinc-200">
        {children}
      </body>
    </html>
  );
}
