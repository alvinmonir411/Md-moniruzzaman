"use client";

import { useState, useEffect } from "react";

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  location: string;
  bio: string;
  title: string;
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "Moniruzzaman",
  email: "alvinmonir411@gmail.com",
  phone: "+8801979915165",
  whatsapp: "+8801979915165",
  github: "https://github.com/alvinmonir411",
  linkedin: "https://www.linkedin.com/in/moniruzzaman13663/",
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
