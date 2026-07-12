import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Velyxor — Type. Compete. Dominate.",
  description:
    "Master Every Keystroke. Real-time stats, neon visuals, and endless game modes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a1a] text-white font-[family-name:var(--font-inter)]">
        <ParticleBackground />
        <Navbar />
        <div className="pt-16 relative z-10 flex-1">{children}</div>
      </body>
    </html>
  );
}
