import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flash Autolike Bot | Instant Free Fire Profile Likes",
  description: "Boost your Free Fire profile likes automatically with instant delivery rates and transparent proof.",
  keywords: ["free fire autolike", "free fire profile likes", "autolike bot", "free fire likes", "flash autolike"],
  authors: [{ name: "Flash Bot Team" }],
  openGraph: {
    title: "Flash Autolike Bot | Instant Free Fire Likes",
    description: "Get instant and automatic profile likes delivered daily to your Free Fire account.",
    siteName: "Flash Autolike Bot",
    locale: "en_US",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B0B0F] text-[#F3F4F6] selection:bg-[#FF2E93]/20 selection:text-white`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
