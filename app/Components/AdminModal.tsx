"use client";

import React, { useState, useEffect } from "react";
import { X, Lock, Sparkles, ShieldCheck } from "lucide-react";

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (key: string) => boolean;
    isDark: boolean;
}

const AdminModal: React.FC<AdminModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isDark,
}) => {
    const [secretKey, setSecretKey] = useState("");
    const [error, setError] = useState("");
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSecretKey("");
            setError("");
            setIsShaking(false);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!secretKey.trim()) {
            setError("Please enter a secret key");
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            return;
        }

        const isSuccess = onSubmit(secretKey);
        if (!isSuccess) {
            setError("❌ Unauthorized access. Access denied.");
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setSecretKey("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] min-h-screen flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className={`relative w-full max-w-md transform transition-all duration-300 animate-scale-in ${isShaking ? "animate-shake" : ""
                    }`}
            >
                {/* Animated Glow Background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-75 animate-pulse" />

                {/* Modal Content */}
                <div
                    className={`relative rounded-2xl shadow-2xl overflow-hidden ${isDark
                        ? "bg-slate-900 border border-slate-700"
                        : "bg-white border border-gray-200"
                        }`}
                >
                    {/* Header with gradient */}
                    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
                        {/* Sparkle decorations */}
                        <Sparkles className="absolute top-4 right-16 w-5 h-5 text-yellow-300 animate-pulse" />
                        <Sparkles className="absolute bottom-4 left-16 w-4 h-4 text-yellow-200 animate-pulse delay-300" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        <div className="flex items-center justify-center mb-2">
                            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white text-center">
                            Admin Access
                        </h2>
                        <p className="text-indigo-100 text-center mt-2 text-sm">
                            Enter your secret key to continue
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="secretKey"
                                className={`block text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"
                                    }`}
                            >
                                Secret Key
                            </label>
                            <div className="relative">
                                <Lock
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? "text-slate-400" : "text-slate-500"
                                        }`}
                                />
                                <input
                                    id="secretKey"
                                    type="password"
                                    value={secretKey}
                                    onChange={(e) => {
                                        setSecretKey(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="Enter secret key..."
                                    autoFocus
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${error
                                        ? "border-red-500 bg-red-50/50"
                                        : isDark
                                            ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                                            : "bg-gray-50 border-gray-300 text-slate-900 placeholder-slate-400"
                                        }`}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
                                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isDark
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Access
                            </button>
                        </div>
                    </form>

                    {/* Bottom decoration */}
                    <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                </div>
            </div>
        </div>
    );
};

export default AdminModal;
