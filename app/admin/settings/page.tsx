"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Palette,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Globe,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Save,
  MessageSquare,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/lib/store";
import { toggleTheme } from "@/app/lib/features/theme/themeSlice";
import { ProfileData, DEFAULT_PROFILE } from "@/app/hooks/useProfile";

export default function SettingsPage() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const dispatch = useDispatch<AppDispatch>();

  // Profile / Social Settings State
  const [profileForm, setProfileForm] = useState<ProfileData>(DEFAULT_PROFILE);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState<"idle" | "success" | "error">("idle");
  const [profileStatusMessage, setProfileStatusMessage] = useState("");

  // CV Upload State
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvStatus, setCvStatus] = useState<"idle" | "success" | "error">("idle");
  const [cvStatusMessage, setCvStatusMessage] = useState("");
  const [cvInfo, setCvInfo] = useState<{ exists: boolean; updatedAt?: string; size?: number }>({
    exists: false,
  });

  useEffect(() => {
    fetchProfile();
    fetchCvInfo();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfileForm((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Failed to load profile data", e);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchCvInfo = async () => {
    try {
      const res = await fetch("/api/resume");
      const data = await res.json();
      setCvInfo(data);
    } catch (e) {
      console.error("Failed to fetch CV info", e);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileStatus("idle");
    setProfileStatusMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile settings");
      }

      setProfileStatus("success");
      setProfileStatusMessage("Profile & social links saved to database! Changes are live across your portfolio.");
      setTimeout(() => setProfileStatus("idle"), 5000);
    } catch (error: any) {
      console.error("Failed to save profile:", error);
      setProfileStatus("error");
      setProfileStatusMessage(error.message || "Failed to update settings");
      setTimeout(() => setProfileStatus("idle"), 5000);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;

    setCvUploading(true);
    setCvStatus("idle");
    setCvStatusMessage("");

    try {
      const formData = new FormData();
      formData.append("resume", cvFile);

      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload CV");
      }

      setCvStatus("success");
      setCvStatusMessage("CV uploaded successfully! The 'Download CV' button on your portfolio is now updated.");
      setCvFile(null);
      await fetchCvInfo();
      setTimeout(() => setCvStatus("idle"), 5000);
    } catch (error: any) {
      console.error(error);
      setCvStatus("error");
      setCvStatusMessage(error.message || "Failed to upload CV. Please ensure it is a valid PDF.");
      setTimeout(() => setCvStatus("idle"), 5000);
    } finally {
      setCvUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Settings & Social Profiles
        </h1>
        <p className={isDark ? "text-slate-400" : "text-slate-600"}>
          Manage your live social links (GitHub, LinkedIn, WhatsApp), contact details, and CV
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1: Contact & Social Profiles Form (Full-width) */}
        <div
          className={`rounded-2xl p-6 lg:col-span-2 ${
            isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-gray-200"
          } shadow-lg relative`}
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-md">
                <Globe size={22} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  Contact & Social Profiles
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Edit your GitHub, WhatsApp, LinkedIn, email, and bio. Changes sync directly to Neon DB.
                </p>
              </div>
            </div>

            <button
              onClick={handleProfileSave}
              disabled={profileSaving || profileLoading}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {profileSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>Save All Links</span>
            </button>
          </div>

          {/* Profile Status Alert */}
          {profileStatus === "success" && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm animate-fade-in">
              <CheckCircle2 size={20} className="flex-shrink-0" />
              <span>{profileStatusMessage}</span>
            </div>
          )}

          {profileStatus === "error" && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center gap-3 text-sm animate-fade-in">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span>{profileStatusMessage}</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    placeholder="e.g. Moniruzzaman"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              {/* Title / Role */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Professional Headline / Role
                </label>
                <input
                  type="text"
                  value={profileForm.title}
                  onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                  required
                  placeholder="e.g. Front-End & MERN Full-Stack Developer"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                  }`}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Contact Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3 text-indigo-400" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    required
                    placeholder="alvinmonir411@gmail.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  WhatsApp Number (with country code)
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-3 text-emerald-400" />
                  <input
                    type="text"
                    value={profileForm.whatsapp}
                    onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                    placeholder="+8801340571927"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              {/* GitHub URL */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  GitHub Profile Link
                </label>
                <div className="relative">
                  <Github size={18} className="absolute left-3.5 top-3 text-purple-400" />
                  <input
                    type="url"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    placeholder="https://github.com/alvinmonir411"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  LinkedIn Profile Link
                </label>
                <div className="relative">
                  <Linkedin size={18} className="absolute left-3.5 top-3 text-blue-400" />
                  <input
                    type="url"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    placeholder="https://www.linkedin.com/in/moniruzzaman13663/"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              {/* Facebook Page URL */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Facebook Page / Profile Link
                </label>
                <div className="relative">
                  <Facebook size={18} className="absolute left-3.5 top-3 text-blue-500" />
                  <input
                    type="url"
                    value={profileForm.facebook || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, facebook: e.target.value })}
                    placeholder="https://www.facebook.com/pexelneststudio/"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              {/* Instagram URL */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Instagram Profile Link
                </label>
                <div className="relative">
                  <Instagram size={18} className="absolute left-3.5 top-3 text-pink-400" />
                  <input
                    type="url"
                    value={profileForm.instagram || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                    placeholder="https://www.instagram.com/pixelneststudio.official/"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Location / Base
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-3 text-rose-400" />
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="Dhaka & Rangpur, Bangladesh (UTC+6)"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>

              {/* Phone / Call */}
              <div className="space-y-2">
                <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-3 text-cyan-400" />
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+8801340571927"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className={`text-xs font-mono uppercase font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Short Bio / Engineering Philosophy
              </label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Write a brief intro about yourself..."
                className={`w-full p-4 rounded-xl border text-sm outline-none transition-all resize-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600"
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={profileSaving || profileLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {profileSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving Profile to Neon Database...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Profile & Social Links</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Section 2: CV / Resume Management */}
        <div
          className={`rounded-2xl p-6 lg:col-span-2 ${
            isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-gray-200"
          } shadow-lg relative overflow-hidden`}
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-md">
                <FileText size={22} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  CV / Resume Management
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Upload your updated PDF resume. It will be immediately available to recruiters via &quot;Download CV&quot;.
                </p>
              </div>
            </div>

            {cvInfo.exists && (
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition"
              >
                <ExternalLink size={14} />
                <span>View Current PDF</span>
              </a>
            )}
          </div>

          {/* Status Alert */}
          {cvStatus === "success" && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm animate-fade-in">
              <CheckCircle2 size={20} className="flex-shrink-0" />
              <span>{cvStatusMessage}</span>
            </div>
          )}

          {cvStatus === "error" && (
            <div className="mb-4 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center gap-3 text-sm animate-fade-in">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span>{cvStatusMessage}</span>
            </div>
          )}

          <form onSubmit={handleCvUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* File Input Box */}
              <div className="md:col-span-2">
                <label
                  htmlFor="cv-upload-input"
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    cvFile
                      ? "border-indigo-500 bg-indigo-500/10"
                      : isDark
                      ? "border-slate-700 bg-slate-800/50 hover:border-indigo-500 hover:bg-slate-800"
                      : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
                  }`}
                >
                  <Upload size={28} className={cvFile ? "text-indigo-400" : "text-slate-400"} />
                  <div className="text-center">
                    <span className="text-sm font-semibold text-indigo-400">
                      {cvFile ? cvFile.name : "Click to select or drop a new PDF CV"}
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cvFile
                        ? `${(cvFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload`
                        : "Accepted format: .pdf (Max: 10MB)"}
                    </p>
                  </div>
                  <input
                    id="cv-upload-input"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCvFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Action & Current Info */}
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                    isDark ? "bg-slate-800/60 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="font-semibold text-indigo-400">Current CV Status:</div>
                  <div>
                    Status: <span className="font-mono text-emerald-400">Active (/resume.pdf)</span>
                  </div>
                  {cvInfo.updatedAt && (
                    <div>
                      Last Modified:{" "}
                      <span className="font-mono text-slate-400">
                        {new Date(cvInfo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!cvFile || cvUploading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {cvUploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Uploading Resume...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Upload & Replace CV</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Section 3: Visual Theme */}
        <div
          className={`rounded-2xl p-6 lg:col-span-2 ${
            isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-gray-200"
          } shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
              <Palette className="text-white" size={20} />
            </div>
            <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              Visual Theme
            </h2>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className={`font-medium block ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                Dark / Light Mode
              </span>
              <p className="text-xs text-slate-400">Toggle portfolio administrative UI mode</p>
            </div>
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isDark ? "bg-indigo-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  isDark ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
