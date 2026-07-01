import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audit Digital Express — Agency-Grade Website Audits in Seconds",
  description:
    "Enter any business website and generate a polished, downloadable performance report with color-coded metrics and actionable recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}