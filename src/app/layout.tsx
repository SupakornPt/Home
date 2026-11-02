import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HOME | Premium real estate",
  description:
    "Browse homes with interactive 3D previews, filters, and seller contact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`min-h-dvh font-sans text-on-surface antialiased ${inter.className}`}
      >
        {children}
      </body>
    </html>
  );
}
