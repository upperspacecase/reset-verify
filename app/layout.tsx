import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reset Verify: ID + live selfie check before an MFA reset",
  description:
    "Before you reset their MFA, send one link: government ID plus live selfie, verified in under 60 seconds, logged. Pay per check. No contract, no sales call.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased text-ink">{children}</body>
    </html>
  );
}
