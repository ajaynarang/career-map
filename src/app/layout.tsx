import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
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
  title: "PCM Career Map — Complete Career Guidance",
  description:
    "Interactive career guidance for PCM students. Explore engineering, science, finance, design & defence paths across India, USA & Germany. Exams, universities, fees, action plans.",
  keywords: [
    "career guidance",
    "PCM",
    "JEE",
    "SAT",
    "IIT",
    "engineering",
    "Germany university",
    "USA college",
    "career map",
    "after 12th",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
