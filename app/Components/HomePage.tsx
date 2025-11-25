"use client";
import { Layout, Mail, Phone, Send, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import Background from "./Background";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ChatWidget from "./ChatWidget";
import { useEffect, useState } from "react";
import Projects from "./Projects";
import AcademicJourney from "./AcademicJourney";
import ContactSection from "./ContactSection";

export default function HomePage() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-500 relative ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      <main>
        <Background />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <Projects projects={projects} />
        <AcademicJourney />
        <ContactSection />
      </main>
      <ChatWidget />
    </div>
  );
}
