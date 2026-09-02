import { LucideIcon } from "lucide-react";

export interface NavLink {
  name: string;
  id: string;
}

export interface Project {
  _id: string;
  title: string;
  category?: 'custom' | 'wix';
  subtitle?: string;
  desc?: string;
  description?: string;
  tech: string | string[];
  live?: string;
  liveUrl?: string;
  github?: string;
  githubUrl?: string;
  thumbnail?: string;
  img?: string;
  images?: string[]; // Array of image URLs for gallery
  ChallengesSolutions?: string;
  EstimateTime?: string;
  is_featured?: boolean;
  isFeatured?: boolean;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  description?: string;
  tag?: string;
  color?: string;
  order?: number;
  createdAt?: string;
}

export interface Experience {
  _id: string;
  type?: 'experience' | 'education';
  position: string;
  role?: string;
  company: string;
  timeline?: string;
  location?: string;
  tag?: string;
  icon?: string;
  isLive?: boolean;
  details?: string;
  highlights?: string[];
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  technologies?: string[];
  createdAt?: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SkillSet {
  frontend: string[];
  backend: string[];
  tools: string[];
}
