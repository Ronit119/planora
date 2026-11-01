import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Planora — Smart Event Planning",
  description: "Plan beautifully. Celebrate effortlessly. Production-grade AI event planning SaaS created by Ronit Dhawan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#FAF7F1] text-[#1C2921] selection:bg-[#E5D4B5] selection:text-[#173B2D]">
        {children}
      </body>
    </html>
  );
}
