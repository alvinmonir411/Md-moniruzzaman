"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectDetailView from "@/app/Components/ProjectDetailView";
import { Project } from "@/app/types";
import { Loader2 } from "lucide-react";

export default function ProjectModalPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          router.back();
        }
      } catch (error) {
        console.error("Failed to fetch project:", error);
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (params.projectId) {
      fetchProject();
    }
  }, [params.projectId, router]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClose}
        aria-label="Close modal backdrop"
      />

      {/* Modal Container with Spring Pop Animation */}
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700/60 shadow-2xl shadow-indigo-950/60 transition-all duration-300 transform animate-in fade-in zoom-in-95 no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[420px] bg-slate-900/90 rounded-3xl p-8 space-y-4">
            <Loader2 className="animate-spin text-indigo-400" size={42} />
            <p className="text-sm font-mono text-slate-400 animate-pulse">Loading case study...</p>
          </div>
        ) : project ? (
          <ProjectDetailView project={project} isModal={true} />
        ) : null}
      </div>
    </div>
  );
}
