"use client";

import { useState, useEffect } from "react";

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  facebook?: string;
  instagram?: string;
  location: string;
  bio: string;
  title: string;
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "Moniruzzaman",
  email: "alvinmonir411@gmail.com",
  phone: "+8801340571927",
  whatsapp: "+8801340571927",
  github: "https://github.com/alvinmonir411",
  linkedin: "https://www.linkedin.com/in/moniruzzaman13663/",
  facebook: "https://www.facebook.com/pexelneststudio/",
  instagram: "https://www.instagram.com/pixelneststudio.official/",
  location: "Dhaka & Rangpur, Bangladesh (UTC+6)",
  bio: "Engineering high-performance, scalable web apps with Next.js, React, and TypeScript. Turning complex challenges into elegant, accessible, and hyper-responsive digital experiences.",
  title: "Front-End & MERN Full-Stack Developer",
};

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Failed to load profile data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, refetch: fetchProfile };
}
