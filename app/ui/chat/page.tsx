"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";

export default function ChatPage() {
    const [input, setInput] = useState("");

    const { 
        messages,
        sendMessage,
        status,
        error,
        stop
    } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/chat",
        }),        
    });

    const isLoading = status === "submitted" || status === "streaming";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        
        const currentInput = input;
        setInput("");
        sendMessage({ text: currentInput });
    };

    const getMessageContent = (message: UIMessage): string => {
        return message.parts
            .map((part) => {
                if (part.type === "text") {
                    return part.text;
                }
                return "";
            })
            .join("");
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-4xl mx-auto space-y-4"> 
                    { isLoading && messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="text-slate-500 dark:text-slate-400">Thinking...</p>
                            </div>
                        </div>
                    ) : messages.length > 0 ? (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div 
                                    key={message.id}
                                    className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-700 ${
                                        message.role === "user" 
                                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" 
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                            message.role === "user"
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-600 dark:bg-slate-500 text-white"
                                        }`}>
                                            {message.role === "user" ? "U" : "AI"}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                                {message.role === "user" ? "You" : "Assistant"}
                                            </p>
                                            <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                                                {getMessageContent(message)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full py-12">
                            <p className="text-slate-400 dark:text-slate-500 text-center">
                                Start a conversation...
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {error && (
                <div className="border-t border-red-200 dark:border-red-900 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-red-600 dark:text-red-400 font-medium">{error.message}</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-3 sm:gap-4">
                            <input
                                type="text"
                                placeholder="Ask something..."
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            {
                                isLoading ? (
                                    <button
                                        type="button"
                                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
                                        onClick={stop}
                                    >
                                        Stop
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md"
                                        disabled={isLoading || !input.trim()}
                                    >
                                        Send
                                    </button>
                                )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
