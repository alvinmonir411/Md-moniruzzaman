"use client";

import React, { useState, useEffect } from "react";
import { Mail, Clock, Trash2, Check, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/lib/store";
import { Message } from "@/app/types";

export default function MessagesPage() {
    const isDark = useSelector((state: RootState) => state.theme.isDark);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/messages");
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await fetch("/api/messages", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: id, isRead: true }),
            });

            if (res.ok) {
                setMessages(
                    messages.map((msg) =>
                        msg._id === id ? { ...msg, isRead: true } : msg
                    )
                );
                if (selectedMessage?._id === id) {
                    setSelectedMessage({ ...selectedMessage, isRead: true });
                }
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/messages?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setMessages(messages.filter((msg) => msg._id !== id));
                if (selectedMessage?._id === id) {
                    setSelectedMessage(null);
                }
            }
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1
                    className={`text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"
                        }`}
                >
                    Messages
                </h1>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                    Contact form submissions
                </p>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                /* Messages List */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="lg:col-span-1 space-y-3">
                        {messages.length === 0 ? (
                            <div
                                className={`rounded-2xl p-8 text-center ${isDark
                                        ? "bg-slate-900 border border-slate-800"
                                        : "bg-white border border-gray-200"
                                    }`}
                            >
                                <Mail
                                    size={48}
                                    className={`mx-auto mb-4 ${isDark ? "text-slate-700" : "text-slate-300"
                                        }`}
                                />
                                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                                    No messages yet
                                </p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message._id}
                                    onClick={() => setSelectedMessage(message)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all ${selectedMessage?._id === message._id
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                            : isDark
                                                ? "bg-slate-900 border border-slate-800 hover:border-slate-700"
                                                : "bg-white border border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {!message.isRead && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                            )}
                                            <span className="font-semibold">{message.name}</span>
                                        </div>
                                        <Clock size={14} className="opacity-60" />
                                    </div>
                                    <p className="text-sm opacity-80 truncate">
                                        {message.subject}
                                    </p>
                                    <p className="text-xs opacity-60 mt-1">
                                        {formatDate(message.createdAt)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2">
                        {selectedMessage ? (
                            <div
                                className={`rounded-2xl p-6 ${isDark
                                        ? "bg-slate-900 border border-slate-800"
                                        : "bg-white border border-gray-200"
                                    } shadow-lg`}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2
                                            className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"
                                                }`}
                                        >
                                            {selectedMessage.subject}
                                        </h2>
                                        <div
                                            className={`flex items-center gap-4 text-sm ${isDark ? "text-slate-400" : "text-slate-600"
                                                }`}
                                        >
                                            <span>{selectedMessage.name}</span>
                                            <span>•</span>
                                            <span>{selectedMessage.email}</span>
                                            <span>•</span>
                                            <span>{formatDate(selectedMessage.createdAt)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedMessage._id)}
                                        className={`p-2 rounded-lg transition-colors ${isDark
                                                ? "hover:bg-red-900/30 text-red-400"
                                                : "hover:bg-red-50 text-red-600"
                                            }`}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div
                                    className={`p-4 rounded-xl ${isDark ? "bg-slate-800" : "bg-gray-50"
                                        } mb-6`}
                                >
                                    <p
                                        className={`whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-slate-700"
                                            }`}
                                    >
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    {!selectedMessage.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(selectedMessage._id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${isDark
                                                    ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                                }`}
                                        >
                                            <Check size={18} />
                                            Mark as Read
                                        </button>
                                    )}
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${isDark
                                                ? "bg-indigo-900/30 text-indigo-400 hover:bg-indigo-900/50"
                                                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                                            }`}
                                    >
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`rounded-2xl p-12 text-center ${isDark
                                        ? "bg-slate-900 border border-slate-800"
                                        : "bg-white border border-gray-200"
                                    }`}
                            >
                                <Mail
                                    size={64}
                                    className={`mx-auto mb-4 ${isDark ? "text-slate-700" : "text-slate-300"
                                        }`}
                                />
                                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                                    Select a message to view details
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
