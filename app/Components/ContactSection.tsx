"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Send,
  User,
  Zap,
  Copy,
  Check,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useProfile } from "../hooks/useProfile";

const ContactSection: React.FC = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const { profile } = useProfile();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email || "alvinmonir411@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(profile.phone || profile.whatsapp || "+8801979915165");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      // 1. Save directly to Neon Database via /api/messages
      const dbPromise = fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // 2. Also forward asynchronously to Formspree for instant email delivery
      const formspreePromise = fetch("https://formspree.io/f/xwpkkvrz", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).catch((err) => console.error("Formspree forward error:", err));

      const [dbRes] = await Promise.all([dbPromise, formspreePromise]);

      if (!dbRes.ok) {
        throw new Error("Failed to store message in database");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (error: any) {
      console.error("Failed to submit contact form:", error);
      setStatus("error");
      setErrorMessage("Something went wrong while sending your message. Please try again or email directly.");
    }
  };

  const whatsappClean = (profile.whatsapp || "+8801979915165").replace(/[^0-9]/g, "");

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDark
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
            }`}
          >
            <Zap size={14} />
            Let&apos;s Collaborate
          </div>

          <h2
            className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">Touch</span>
          </h2>

          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Have a project in mind, seeking a high-caliber developer, or just want to connect? My inbox is always open.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Side: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className={`p-8 rounded-3xl border transition-all duration-300 ${
                isDark
                  ? "bg-slate-900/80 border-slate-800 shadow-xl"
                  : "bg-white border-slate-200 shadow-lg"
              }`}
            >
              <h3 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
                Direct Channels
              </h3>

              <div className="space-y-5">
                {/* Email Box */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700/80 hover:border-indigo-500/50"
                      : "bg-slate-50 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-mono text-slate-400 uppercase">Email Address</p>
                      <a
                        href={`mailto:${profile.email}`}
                        className={`text-sm font-semibold truncate hover:underline ${
                          isDark ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={copyEmail}
                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-700/40 transition flex-shrink-0 cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>

                {/* Phone / WhatsApp Box */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700/80 hover:border-emerald-500/50"
                      : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Phone size={18} />
                    </div>
                    <div className="truncate">
                      <p className="text-[11px] font-mono text-slate-400 uppercase">WhatsApp & Phone</p>
                      <a
                        href={`https://wa.me/${whatsappClean}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-sm font-semibold truncate hover:underline ${
                          isDark ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        {profile.whatsapp || profile.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={copyPhone}
                    className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-700/40 transition flex-shrink-0 cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedPhone ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>

                {/* Location Box */}
                <div
                  className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    isDark ? "bg-slate-800/50 border-slate-700/80" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-slate-400 uppercase">Based In</p>
                    <p className={`text-sm font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {profile.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Profiles Grid */}
              <div className="mt-8 pt-6 border-t border-slate-800/60">
                <p className="text-xs font-mono uppercase text-slate-400 mb-4">Professional Networks</p>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href={profile.github || "https://github.com/alvinmonir411"}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-1 ${
                      isDark
                        ? "bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Github size={20} />
                    <span className="text-xs font-medium">GitHub</span>
                  </a>

                  <a
                    href={profile.linkedin || "https://www.linkedin.com/in/moniruzzaman13663/"}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-1 ${
                      isDark
                        ? "bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Linkedin size={20} />
                    <span className="text-xs font-medium">LinkedIn</span>
                  </a>

                  <a
                    href={`https://wa.me/${whatsappClean}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-1 ${
                      isDark
                        ? "bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200 hover:text-white"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Phone size={20} />
                    <span className="text-xs font-medium">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div
              className={`p-8 sm:p-10 rounded-3xl border transition-all duration-300 ${
                isDark
                  ? "bg-slate-900/80 border-slate-800 shadow-2xl"
                  : "bg-white border-slate-200 shadow-xl"
              }`}
            >
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                Send a Message
              </h3>
              <p className={`text-sm mb-8 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Drop your thoughts, proposals, or questions. I usually respond within 24 hours.
              </p>

              {/* Status Alert Banner */}
              {status === "success" && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 animate-fade-in shadow-lg">
                  <CheckCircle2 size={22} className="flex-shrink-0 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                    <p className="text-xs text-emerald-300/90">
                      Thank you for reaching out. Your message is received in my database & email inbox.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center gap-3 animate-fade-in">
                  <AlertCircle size={22} className="flex-shrink-0 text-rose-400" />
                  <p className="text-xs">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className={`text-xs font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-3.5 text-slate-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="John Doe"
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          isDark
                            ? "bg-slate-800/60 border-slate-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className={`text-xs font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      Your Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-3.5 text-slate-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="john@example.com"
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                          isDark
                            ? "bg-slate-800/60 border-slate-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className={`text-xs font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Subject / Project Type
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Job Opportunity"
                    className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800/60 border-slate-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    }`}
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className={`text-xs font-mono uppercase ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder={`Hi ${profile.name || "Moniruzzaman"}, I have an opportunity / project that I'd love to discuss...`}
                      className={`w-full p-4 rounded-2xl border text-sm outline-none transition-all resize-none ${
                        isDark
                          ? "bg-slate-800/60 border-slate-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Submit button with loader state */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base transition-all duration-300 shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.65)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message Directly</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
