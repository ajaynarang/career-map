import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "PCM Career Map — Complete Career Guidance for Class 10-12",
  description:
    "Interactive career guidance for PCM students. Explore engineering, science, finance, architecture, design, defence, aviation & merchant navy across India, USA, Germany, UK, Canada & Australia.",
  keywords: [
    "career guidance", "PCM", "JEE", "SAT", "IELTS", "IIT",
    "engineering", "science", "finance", "architecture", "defence",
    "study abroad", "Germany university", "USA college", "UK university",
    "Canada college", "Australia university", "career map", "after 12th",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
