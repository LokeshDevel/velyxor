import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { Navbar } from "@/components/ui/Navbar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    "Improve your typing speed with beautiful challenges, real-time stats, competitive leaderboards, and immersive game modes.",

  keywords: [
    "typing test",
    "typing game",
    "WPM test",
    "keyboard practice",
    "typing speed",
    "Velyxor",
  ],

  authors: [{ name: "Lokesh Tamma" }],

  creator: "Lokesh Tamma",

  metadataBase: new URL("https://velyxor.dpdns.org"),

  openGraph: {
    title: "Velyxor — Type. Compete. Dominate.",
    description:
      "Challenge yourself, improve your typing speed, and dominate the leaderboard.",
    url: "https://velyxor.dpdns.org",
    siteName: "Velyxor",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Velyxor",
    description:
      "Modern typing challenges with beautiful UI and real-time statistics.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}


