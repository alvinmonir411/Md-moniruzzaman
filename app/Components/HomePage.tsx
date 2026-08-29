"use client";

import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Project } from "../types";
import CanvasBackground from "./CanvasBackground";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import Projects from "./Projects";
import GitHubStats from "./GitHubStats";
import TerminalSection from "./TerminalSection";
import AcademicJourney from "./AcademicJourney";
import ContactSection from "./ContactSection";
import ChatWidget from "./ChatWidget";
import { useEffect, useState } from "react";

export default function HomePage() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // 1. Fetch projects
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error(err));

    // 2. Track real page view (once per visitor session)
    const hasViewed = sessionStorage.getItem("portfolio_viewed");
    if (!hasViewed) {
      fetch("/api/views", { method: "POST" })
        .then(() => {
          sessionStorage.setItem("portfolio_viewed", "true");
        })
        .catch((err) => console.error("View tracking error:", err));
    }
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 relative ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <main>
        <CanvasBackground />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <Projects projects={projects} />
        <GitHubStats />
        <TerminalSection />
        <AcademicJourney />
        <ContactSection />
      </main>
      <ChatWidget />
    </div>
  );
}
