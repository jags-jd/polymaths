import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito, Pixelify_Sans, Press_Start_2P } from "next/font/google";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

// Placeholder fonts. Per-game theme fonts arrive with lib/themes (see docs/themes.md).
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Theme fonts (docs/themes.md). Not preloaded: a page only downloads them when
// its theme's CSS variables use them.
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["600", "800", "900"], preload: false });
const pressStart = Press_Start_2P({ variable: "--font-press-start", subsets: ["latin"], weight: "400", preload: false });
const pixelify = Pixelify_Sans({ variable: "--font-pixelify", subsets: ["latin"], weight: ["500", "600", "700"], preload: false });

export const metadata: Metadata = {
  title: "Polymaths",
  description: "Tick off everything there is to do in your favourite games.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${pressStart.variable} ${pixelify.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
