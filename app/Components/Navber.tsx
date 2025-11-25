"use client";

import React, { useState, useEffect } from "react";
import { Code2, Moon, Sun, Menu, X } from "lucide-react";
import { NavLink } from "../types";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../lib/store";
import { toggleTheme } from "../lib/features/theme/themeSlice";

interface NavBarProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET || "13663";
const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 1. Prevent the default navigation instantly
    e.preventDefault();

    // 2. Prompt for verification
    const userAttempt = prompt(
      "Please enter the secret key to access admin area:"
    );

    if (userAttempt === ADMIN_SECRET_KEY) {
      // 3. If correct, manually navigate to the internal route
      window.location.href = "/addSkils";
    } else if (userAttempt !== null) {
      // Show error only if the user didn't click cancel
      alert("Unauthorized access. Access denied.");
    }
  };
  const navLinks: NavLink[] = [
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
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
          {/* Logo */}
          <Link
            href={"/addSkils"}
            onClick={handleLogoClick}
            className="flex-shrink-0 font-bold text-2xl tracking-tighter flex items-center gap-2"
          >
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>

            <span className={isDark ? "text-white" : "text-slate-900"}>
              AM<span className="text-indigo-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative group px-3 py-2 text-sm font-medium transition-colors ${
                    isDark
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              <div
                className={`h-6 w-px ${
                  isDark ? "bg-slate-700" : "bg-slate-300"
                }`}
              ></div>
              <button
                onClick={() => handleToggle()}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isDark
                    ? "bg-slate-800 hover:bg-indigo-600 text-yellow-400"
                    : "bg-gray-100 hover:bg-indigo-100 text-indigo-600 shadow-sm"
                }`}
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
                isDark
                  ? "bg-slate-800 text-yellow-400"
                  : "bg-gray-100 text-indigo-600"
              }`}
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
            isDark
              ? "bg-slate-900 border-b border-slate-800"
              : "bg-white border-b border-gray-200"
          }`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  scrollToSection(link.id);
                  setIsMenuOpen(false);
                }}
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
    </nav>
  );
};

export default NavBar;
