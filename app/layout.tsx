import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Provider";

import ConditionalNavbar from "./Components/ConditionalNavbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import ConditionalFooter from "./Components/ConditionalFooter";
import SmoothScroll from "./Components/SmoothScroll";
import GoogleTagManager from "./Components/GoogleTagManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moniruzzaman-dev.vercel.app"),
  title: "Moniruzzaman | Web & Software Development Portfolio",
  description: "Moniruzzaman — High-performance web applications, full-stack digital products, and modern UI/UX.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://moniruzzaman-dev.vercel.app",
  },
  openGraph: {
    title: "Moniruzzaman | Web & Software Development Portfolio",
    description: "Moniruzzaman — High-performance web applications, full-stack digital products, and modern UI/UX.",
    url: "https://moniruzzaman-dev.vercel.app",
    siteName: "Moniruzzaman",
    images: [{ url: "/logo.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moniruzzaman | Web & Software Development Portfolio",
    description: "Moniruzzaman — High-performance web applications, full-stack digital products, and modern UI/UX.",
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KHZLV9JM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <GoogleTagManager />

        <Providers>
          <SmoothScroll />
          <SpeedInsights />
          <Analytics />
          <ConditionalNavbar />
          {children}
          {modal}
          <ConditionalFooter />
        </Providers>
      </body>
    </html>
  );
}
