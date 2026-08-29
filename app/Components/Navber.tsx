"use client";

import React, { useState, useEffect, useRef } from "react";
import { Code2, Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { NavLink } from "../types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/store";
import { toggleTheme } from "../lib/features/theme/themeSlice";
import AdminModal from "./AdminModal";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET || "13663";

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLogoAnimating, setIsLogoAnimating] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const dispatch = useDispatch<AppDispatch>();

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Particle animation effect
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5, // gravity
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles]);

  const handleNavigation = (id: string) => {
    setIsMenuOpen(false);

    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // From subpages like /projects, redirect to home with hash
      router.push(`/#${id}`);
    }
  };

  const createParticles = (x: number, y: number) => {
    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30;
      const velocity = 3 + Math.random() * 4;
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 2,
        life: 60,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles(newParticles);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Trigger animation
    setIsLogoAnimating(true);

    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    setTimeout(() => setIsLogoAnimating(false), 600);

    // If already on homepage, open secret admin modal; otherwise go home
    if (pathname !== "/") {
      router.push("/");
    } else {
      setTimeout(() => {
        setIsModalOpen(true);
      }, 300);
    }
  };

  const handleModalSubmit = (key: string): boolean => {
    if (key === ADMIN_SECRET_KEY) {
      setIsModalOpen(false);
      setTimeout(() => {
        window.location.href = "/admin";
      }, 200);
      return true;
    }
    return false;
  };

  const navLinks: NavLink[] = [
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "GitHub", id: "github" },
    { name: "Experience", id: "experience" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? "bg-slate-900/80 border-b border-slate-800"
            : "bg-white/80 border-b border-gray-200"
          : "bg-transparent"
      } backdrop-blur-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Premium Effects */}
          <div className="relative" ref={logoRef}>
            {/* Particle Overlay */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="fixed w-2 h-2 rounded-full pointer-events-none z-[100]"
                style={{
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  backgroundColor: particle.color,
                  opacity: particle.life / 60,
                  boxShadow: `0 0 10px ${particle.color}`,
                  transform: `scale(${particle.life / 60})`,
                }}
              />
            ))}

            <Link
              href="/"
              onClick={handleLogoClick}
              className={`flex-shrink-0 font-bold text-2xl tracking-tighter flex items-center gap-2 group relative ${
                isLogoAnimating ? "animate-logo-click" : ""
              }`}
            >
              {/* Animated Glow Effect */}
              <div
                className={`absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 ${
                  isLogoAnimating ? "opacity-60 scale-150" : ""
                }`}
              />

              {/* Logo Icon Container */}
              <div
                className={`relative bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 rounded-lg shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                  isLogoAnimating ? "scale-125 rotate-[360deg] shadow-2xl shadow-indigo-500/50" : ""
                }`}
              >
                <Code2 className="w-6 h-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-lg blur-sm" />
              </div>

              {/* Text Logo */}
              <span
                className={`relative font-mono font-black text-lg sm:text-xl tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                } transform transition-all duration-300 group-hover:scale-105`}
              >
                Moniruzzaman
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                  .dev
                </span>
              </span>

              {/* Sparkle Effect on Hover */}
              <Sparkles
                className={`absolute -top-1 -right-1 w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  isLogoAnimating ? "opacity-100 scale-150" : ""
                }`}
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavigation(link.id)}
                  className={`relative group px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}

              <div className={`h-6 w-px ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />

              <button
                onClick={() => handleToggle()}
                className={`p-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isDark
                    ? "bg-slate-800 hover:bg-indigo-600 text-yellow-400"
                    : "bg-gray-100 hover:bg-indigo-100 text-indigo-600 shadow-sm"
                }`}
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => handleToggle()}
              className={`p-2 rounded-full transition-colors ${
                isDark ? "bg-slate-800 text-yellow-400" : "bg-gray-100 text-indigo-600"
              }`}
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md hover:text-indigo-500 focus:outline-none ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden absolute w-full ${
            isDark ? "bg-slate-900 border-b border-slate-800" : "bg-white border-b border-gray-200"
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isDark
                    ? "text-slate-300 hover:text-indigo-500 hover:bg-indigo-500/10"
                    : "text-slate-600 hover:text-indigo-500 hover:bg-indigo-50"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Admin Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        isDark={isDark}
      />
    </nav>
  );
};

export default NavBar;
