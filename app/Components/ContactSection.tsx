"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../lib/store";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Send,
  User,
  MessageSquare,
  Zap, // Added Zap icon for flair
} from "lucide-react";

// --- CUSTOM COLOR DEFINITION ---
const PRIMARY_ACCENT_CLASS = "text-indigo-500";
const PRIMARY_BG_CLASS = "bg-indigo-500/10";
const PRIMARY_SHADOW_CLASS = "shadow-indigo-500/20";
const PRIMARY_BTN_SHADOW = "shadow-[0_0_25px_rgba(99,102,241,0.6)]"; // Stronger button shadow

const ContactSection = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  const sharedCardClasses = `p-10 rounded-3xl border transition-all duration-500 hover:scale-[1.005] hover:shadow-2xl h-fit`;

  // Custom styling for links inside the Info Card
  const infoLinkClasses = `text-lg font-medium transition-colors duration-300 ${
    isDark
      ? "text-slate-300 hover:text-indigo-400"
      : "text-slate-700 hover:text-indigo-700"
  }`;

  return (
    <section
      id="contact"
      className={`py-32 relative z-10 ${isDark ? "" : "bg-gray-50/50"}`} // Subtle background change
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-24 text-center">
          <div
            className={`inline-block px-5 py-2 mb-4 rounded-full text-sm font-bold uppercase tracking-wider ${PRIMARY_BG_CLASS} ${PRIMARY_ACCENT_CLASS}`}
          >
            Let’s Connect
          </div>

          <h2
            className={`text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Get In <span className={PRIMARY_ACCENT_CLASS}>Touch</span>
          </h2>

          <p
            className={`text-xl max-w-3xl mx-auto ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Whether you want to collaborate, build something meaningful, or just
            say hi — I’m always open to conversations.
          </p>
        </div>

        {/* Info + Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Card - Left */}
          <div
            className={`${sharedCardClasses} ${
              isDark
                ? `bg-slate-900 border-slate-700 shadow-xl shadow-indigo-900/15 hover:shadow-indigo-900/30`
                : `bg-white border-gray-100 shadow-xl ${PRIMARY_SHADOW_CLASS} hover:shadow-indigo-100/80`
            }`}
          >
            <h3
              className={`text-3xl font-extrabold mb-8 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <Zap size={28} className="inline mr-2 align-text-bottom" /> My
              Details
            </h3>

            <div className="space-y-8">
              {/* Name/Title */}
              <div className="flex items-start gap-4">
                <User
                  size={24}
                  className={`flex-shrink-0 mt-1 ${PRIMARY_ACCENT_CLASS}`}
                />
                <div>
                  <p
                    className={`text-sm font-light uppercase ${
                      isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    Title
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      isDark ? "text-slate-200" : "text-slate-900"
                    }`}
                  >
                    Alvin Monir — Front-End Developer
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone
                  size={24}
                  className={`flex-shrink-0 mt-1 ${PRIMARY_ACCENT_CLASS}`}
                />
                <div>
                  <p
                    className={`text-sm font-light uppercase ${
                      isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    Call Me
                  </p>
                  <a href="tel:+8801979915165" className={infoLinkClasses}>
                    +8801979915165
                  </a>
                </div>
              </div>

              {/* Mail */}
              <div className="flex items-start gap-4">
                <Mail
                  size={24}
                  className={`flex-shrink-0 mt-1 ${PRIMARY_ACCENT_CLASS}`}
                />
                <div>
                  <p
                    className={`text-sm font-light uppercase ${
                      isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:alvinmonir411@gmail.com"
                    className={infoLinkClasses}
                  >
                    alvinmonir411@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <MapPin
                  size={24}
                  className={`flex-shrink-0 mt-1 ${PRIMARY_ACCENT_CLASS}`}
                />
                <div>
                  <p
                    className={`text-sm font-light uppercase ${
                      isDark ? "text-slate-500" : "text-slate-500"
                    }`}
                  >
                    Location
                  </p>
                  <p
                    className={`text-lg font-medium ${
                      isDark ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="mt-10 pt-8 border-t border-dashed border-gray-200 dark:border-slate-700">
              <h4
                className={`text-xl font-bold mb-4 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Connect Online
              </h4>
              <div className="flex space-x-6">
                <a
                  href="https://alvin-monir-protfolio.vercel.app"
                  target="_blank"
                  aria-label="Portfolio Website"
                  className={`p-3 rounded-full ${PRIMARY_BG_CLASS} ${PRIMARY_ACCENT_CLASS} hover:bg-indigo-600 hover:text-white transition duration-300`}
                >
                  <Globe size={20} />
                </a>
                <a
                  href="https://github.com/alvinmonir411"
                  target="_blank"
                  aria-label="GitHub Profile"
                  className={`p-3 rounded-full ${PRIMARY_BG_CLASS} ${PRIMARY_ACCENT_CLASS} hover:bg-indigo-600 hover:text-white transition duration-300`}
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/in/alvin-monir"
                  target="_blank"
                  aria-label="LinkedIn Profile"
                  className={`p-3 rounded-full ${PRIMARY_BG_CLASS} ${PRIMARY_ACCENT_CLASS} hover:bg-indigo-600 hover:text-white transition duration-300`}
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form - Right */}
          <div
            className={`${sharedCardClasses} ${
              isDark
                ? `bg-slate-900 border-slate-700 shadow-xl shadow-indigo-900/15 hover:shadow-indigo-900/30`
                : `bg-white border-gray-100 shadow-xl ${PRIMARY_SHADOW_CLASS} hover:shadow-indigo-100/80`
            }`}
          >
            <h3
              className={`text-3xl font-extrabold mb-8 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Send a Message
            </h3>

            <form
              action="https://formspree.io/f/xwpkkvrz"
              method="POST"
              className="space-y-8"
            >
              {/* Name */}
              <div className="relative">
                <User
                  className={`absolute left-4 top-3 h-5 w-5 ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your Name"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:font-light ${
                    isDark
                      ? "bg-slate-800 border border-slate-700 text-slate-200 focus:border-indigo-500"
                      : "bg-gray-50 border border-gray-300 text-slate-800 focus:border-indigo-500"
                  }`}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-3 h-5 w-5 ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your Email"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:font-light ${
                    isDark
                      ? "bg-slate-800 border border-slate-700 text-slate-200 focus:border-indigo-500"
                      : "bg-gray-50 border border-gray-300 text-slate-800 focus:border-indigo-500"
                  }`}
                />
              </div>

              {/* Message */}
              <div className="relative">
                <MessageSquare
                  className={`absolute left-4 top-4 h-5 w-5 ${
                    isDark ? "text-slate-500" : "text-slate-500"
                  }`}
                />
                <textarea
                  name="message"
                  required
                  rows={6} // Increased rows slightly for better visual balance
                  placeholder="Write your message..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none resize-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:font-light ${
                    isDark
                      ? "bg-slate-800 border border-slate-700 text-slate-200 focus:border-indigo-500"
                      : "bg-gray-50 border border-gray-300 text-slate-800 focus:border-indigo-500"
                  }`}
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-bold transition-all transform hover:scale-[1.01] 
                  bg-indigo-600 text-white ${PRIMARY_BTN_SHADOW} hover:shadow-indigo-700/80`}
              >
                Send Message <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
