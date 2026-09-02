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
  title: "PixelNest Studio | Web & Software Development Studio (Founder: Moniruzzaman)",
  description: "PixelNest Studio — High-performance web applications, full-stack digital products, and modern UI/UX engineered by Moniruzzaman.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://pexelneststudio.vercel.app",
  },
  openGraph: {
    title: "PixelNest Studio | Web & Software Development Studio (Founder: Moniruzzaman)",
    description: "PixelNest Studio — High-performance web applications, full-stack digital products, and modern UI/UX engineered by Moniruzzaman.",
    url: "https://pexelneststudio.vercel.app",
    siteName: "PixelNest Studio",
    images: [{ url: "/logo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelNest Studio | Web & Software Development Studio (Founder: Moniruzzaman)",
    description: "PixelNest Studio — High-performance web applications, full-stack digital products, and modern UI/UX engineered by Moniruzzaman.",
    images: ["/logo.png"],
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
