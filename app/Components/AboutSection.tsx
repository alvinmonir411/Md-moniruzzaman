"use client";

import React from "react";
import { User, Code, Coffee, Award, Heart, Zap } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";

interface AboutSectionProps {
  isDark: boolean;
}

const AboutSection = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  return (
    <section id="about" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20">
          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            About Me
          </h2>
          <div
            className={`h-1 w-20 rounded bg-gradient-to-r from-indigo-500 to-purple-500`}
          ></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Styled Image */}
          <div className="space-y-8">
            <div className="relative group">
              {/* Decorative Background Blur */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>

              {/* Main Image Container */}
              <div
                className={`relative p-2 rounded-[2.5rem] border transition-all duration-300 ${
                  isDark
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-gray-100 shadow-2xl"
                }`}
              >
                <div className="relative aspect-[3/4] md:aspect-square rounded-[2rem] overflow-hidden">
                  {/* THE IMAGE */}
                  <img
                    src="/My_picture.png" // Make sure to put your image in the public folder
                    alt="Alvin Monir"
                    className="object-cover w-full h-full object-[center_20%] transition-transform duration-700 group-hover:scale-110 filter brightness-110 contrast-[1.05]"
                  />

                  {/* Professional Overlay Gradient (Bottom) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-6 rounded-2xl border text-center transition-all hover:-translate-y-1 ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-white border-gray-100 shadow-lg"
                }`}
              >
                <Coffee className="w-8 h-8 mx-auto mb-3 text-amber-500" />
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Always
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Learning
                </div>
              </div>
              <div
                className={`p-6 rounded-2xl border text-center transition-all hover:-translate-y-1 ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-white border-gray-100 shadow-lg"
                }`}
              >
                <Award className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                <div
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  100%
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Committed
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="space-y-8 pt-4">
            <div
              className={`prose lg:prose-lg ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              <h3
                className={`text-3xl font-bold mb-6 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Developer by profession,
                <br />
                <span className="text-indigo-500">Problem Solver</span> by
                passion.
              </h3>
              <p className="leading-relaxed mb-6 text-lg">
                I'm Alvin, a Front-End Developer based in Dhaka. I don't just
                write code; I build immersive web experiences. My background in
                modern JavaScript frameworks allows me to create applications
                that are fast, responsive, and user-friendly.
              </p>
              <p className="leading-relaxed text-lg">
                Currently focused on mastering <strong>Next.js</strong> and{" "}
                <strong>System Architecture</strong> to deliver scalable
                solutions for complex problems.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Frontend Architecture",
                  desc: "React, Next.js, Redux, Tailwind",
                  icon: Code,
                  color: "text-indigo-500",
                  bg: "bg-indigo-500/10",
                },
                {
                  title: "UI/UX Implementation",
                  desc: "Pixel-perfect Figma to Code",
                  icon: Heart,
                  color: "text-pink-500",
                  bg: "bg-pink-500/10",
                },
                {
                  title: "Backend Integration",
                  desc: "Node.js, Firebase, MongoDB",
                  icon: Zap,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 border border-transparent ${
                    isDark
                      ? "hover:bg-slate-800 hover:border-slate-700"
                      : "hover:bg-white hover:shadow-lg hover:border-gray-100"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h5
                      className={`font-bold text-lg ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </h5>
                    <p
                      className={`text-sm mt-1 ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
