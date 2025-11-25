import { LucideIcon } from "lucide-react";

export interface NavLink {
  name: string;
  id: string;
}

export interface Project {
  img: string;
  _id: string;
  title: string;
  description: string;
  tech: string;
  liveUrl: string;
  githubUrl: string;
  ChallengesSolutions: String;
  EstimateTime: string;
  isfetured: boolean;
  createdAt: string;
}

export interface SkillSet {
  frontend: string[];
  backend: string[];
  tools: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  desc: string;
  color: string;
}
