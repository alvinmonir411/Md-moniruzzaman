"use client";

import { useRouter } from "next/navigation";
import AddSkill from "../Actions/Skill/AddSkills/AddSkill";
import { useEffect, useRef } from "react";

const AddSkills = () => {
  const router = useRouter();
  const modalRef = useRef(null);

  const handleClose = () => {
    router.back();
  };

  // Optional: Trap focus inside the modal for accessibility
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    // 1. Full-Screen Backdrop (The actual modal container)
    <div
      className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={handleClose}
      ref={modalRef}
    >
      {/* 2. Modal Content Container */}
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden transform transition-transform duration-300 ease-in-out scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Close Button */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Add New Portfolio Project
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close modal"
          >
            {/* Close Icon (X) */}
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Form Area - Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(95vh-85px)]">
          <p className="text-gray-500 mb-6">
            Please fill in the details for your new skill or project entry.
          </p>

          <form action={AddSkill} className="space-y-6">
            {/* *** CHANGED: Project Thumbnail (File Input) *** */}
            <div>
              <label
                htmlFor="thumbnail-file"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                🌄 Project Thumbnail (Image File)
              </label>
              <input
                id="thumbnail-file"
                type="file"
                name="thumbnail" // Match with the Server Action
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                required
              />
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                🔖 Project Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="E-Commerce Dashboard"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="desc"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                📝 Project Description
              </label>
              <textarea
                id="desc"
                name="desc"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y transition"
                rows={4}
                placeholder="Short description of the project..."
                required
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label
                htmlFor="tech"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                💻 Tech Stack (comma separated)
              </label>
              <input
                id="tech"
                type="text"
                name="tech"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="Next.js, TypeScript, MongoDB, Tailwind CSS"
                required
              />
            </div>

            {/* Live URL & GitHub URL in a two-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live URL */}
              <div>
                <label
                  htmlFor="live-url"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  🌐 Live URL
                </label>
                <input
                  id="live-url"
                  type="text"
                  name="live"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="https://yourproject.com"
                />
              </div>

              {/* GitHub URL */}
              <div>
                <label
                  htmlFor="github-url"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  🔗 GitHub URL
                </label>
                <input
                  id="github-url"
                  type="text"
                  name="github"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="https://github.com/your-repo"
                  required
                />
              </div>
            </div>

            {/* Challenges & Solutions */}
            <div>
              <label
                htmlFor="challenges"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                💡 Challenges & Solutions
              </label>
              <textarea
                id="challenges"
                name="ChallengesSolutions"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-y transition"
                rows={4}
                placeholder="What challenges you faced & how you solved them"
                required
              />
            </div>

            {/* Estimate Time */}
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                ⏳ Estimated Build Time
              </label>
              <input
                id="time"
                type="text"
                name="EstimateTime"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="4 days / 2 weeks etc."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:scale-[1.005]"
            >
              ➕ Add Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSkills;
