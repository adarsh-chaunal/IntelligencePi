"use client";

import { useState } from "react";

export default function IntelligencePage() {
    const [chatPrompt, setChatPrompt] = useState("");

    const [intelligence, setIntelligence] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const gptResponse = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!chatPrompt.trim()) return;
        
        setIsLoading(true);
        setError(null);
        const currentPrompt = chatPrompt;
        setChatPrompt("");

        try{
            const response = await fetch("/api/intelligence", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: currentPrompt }),
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            setIntelligence(data.text);
        }
        catch (error) {
            console.error("Error fetching GPT response:", error); 
            setChatPrompt(currentPrompt);
            error instanceof Error
            ? setError(error.message)
            : setError("Something went wrong. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }



    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-4xl mx-auto space-y-4"> 
                    { isLoading ? (
                        <div className="flex items-center justify-center h-full py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="text-slate-500 dark:text-slate-400">Thinking...</p>
                            </div>
                        </div>
                    ) : intelligence ? (
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                                <p className="text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                                    {intelligence}
                                </p>
                            </div>
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
                            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <form
                        onSubmit={gptResponse}>
                        <div className="flex gap-3 sm:gap-4">
                            <input
                                type="text"
                                placeholder="Ask something..."
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                value={chatPrompt}
                                onChange={(e) => setChatPrompt(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md"
                                disabled={isLoading || !chatPrompt.trim()}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Thinking...
                                    </span>
                                ) : (
                                    "Send"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}