import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BrandHeader from "@/components/BrandHeader";
import JobsProvider from "@/components/JobsProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leasey · Content Dashboard",
  description: "Tablero de contenido de marketing para Leasey.AI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JobsProvider>
          <BrandHeader />
          <main className="flex-1 w-full max-w-6xl mx-auto px-5 py-8">{children}</main>
          <footer className="w-full max-w-6xl mx-auto px-5 py-6 text-xs text-slate border-t border-line mt-8">
            Leasey.AI Content System · phase 1 (GSC and WordPress not connected yet) · drafts are not auto-published
          </footer>
        </JobsProvider>
      </body>
    </html>
  );
}
