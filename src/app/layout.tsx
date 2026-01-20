import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ivan Galaviz | Portfolio",
  description: "Software Engineer | Space Dreamer",
  metadataBase: new URL("https://ivanovishado.github.io"),
  openGraph: {
    title: "Ivan Galaviz | Portfolio",
    description: "Software Engineer | Space Dreamer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ivan Galaviz | Portfolio",
    description: "Software Engineer | Space Dreamer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <MotionConfig
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          reducedMotion="user"
        >
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
