"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { ArrowUp } from "lucide-react";

export default function SmoothScroll() {
  const [progress, setProgress] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    // 1. Initialize Lenis with tuned momentum physics
    const lenis = new Lenis({
      lerp: 0.08, // Liquid momentum gliding
      wheelMultiplier: 0.95, // Balanced natural resistance
      touchMultiplier: 1.6, // Natural response for trackpads
      syncTouch: true,
      syncTouchLerp: 0.075,
      infinite: false,
    });

    (window as any).lenis = lenis;

    // 2. Track scroll progress & velocity
    lenis.on("scroll", (e: any) => {
      setProgress(e.progress);
      setShowTopBtn(e.scroll > 400);
    });

    // 3. requestAnimationFrame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    // 4. Smooth Anchor Link Navigation with Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (
        anchor &&
        anchor.hash &&
        anchor.hash.startsWith("#") &&
        anchor.origin === window.location.origin &&
        anchor.pathname === window.location.pathname
      ) {
        const id = anchor.hash.slice(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element, { offset: -80, duration: 1.4 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      delete (window as any).lenis;
      lenis.destroy();
    };
  }, []);

  const scrollToTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Luxury Ambient Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[9999] origin-left shadow-[0_0_15px_rgba(168,85,247,0.8)] pointer-events-none transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* Floating Smooth Scroll-to-Top Pill */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-24 right-7 z-40 p-3 rounded-full backdrop-blur-xl border transition-all duration-500 shadow-2xl flex items-center justify-center cursor-pointer group ${
          showTopBtn
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-6 pointer-events-none"
        } bg-slate-900/80 border-slate-700/80 hover:border-indigo-500/80 hover:bg-slate-800 text-slate-300 hover:text-white hover:scale-110 shadow-indigo-500/10 hover:shadow-indigo-500/30`}
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200 text-indigo-400 group-hover:text-indigo-300" />
      </button>
    </>
  );
}
