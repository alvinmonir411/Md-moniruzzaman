import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Provider";

import ConditionalNavbar from "./Components/ConditionalNavbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ConditionalFooter from "./Components/ConditionalFooter";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pexelneststudio.vercel.app"),
  title: "Moniruzzaman.dev | Front-End & Full-Stack Developer",
  description: "Moniruzzaman.dev - Front-End & MERN Full-Stack Developer Portfolio",
  alternates: {
    canonical: "https://pexelneststudio.vercel.app",
  },
  openGraph: {
    title: "Moniruzzaman.dev | Front-End & Full-Stack Developer",
    description: "Moniruzzaman.dev - Front-End & MERN Full-Stack Developer Portfolio",
    url: "https://pexelneststudio.vercel.app",
    siteName: "Moniruzzaman Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moniruzzaman.dev | Front-End & Full-Stack Developer",
    description: "Moniruzzaman.dev - Front-End & MERN Full-Stack Developer Portfolio",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SpeedInsights />
          <ConditionalNavbar />
          {children}
          {modal}
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
