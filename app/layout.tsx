import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitFlow",
  description: "Gerencie sua academia de forma simples e eficiente.",
  generator: "luizmellodev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-base md:text-lg`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
