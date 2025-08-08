import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z.ai Blog - Modern Blog Platform",
  description: "A modern blog platform built with Next.js, Prisma, and shadcn/ui",
  keywords: ["blog", "Next.js", "TypeScript", "Prisma", "shadcn/ui", "React"],
  authors: [{ name: "Z.ai Team" }],
  openGraph: {
    title: "Z.ai Blog",
    description: "A modern blog platform",
    url: "https://chat.z.ai",
    siteName: "Z.ai Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z.ai Blog",
    description: "A modern blog platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
