"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lightbulb, ArrowRight, RefreshCw, Check } from "lucide-react";

interface AICopilotCardProps {
  eventId: string;
  initialSuggestionTitle?: string;
  initialSuggestionBody?: string;
}

export function AICopilotCard({
  eventId,
  initialSuggestionTitle = "You can save ~₹1,20,000 on decor",
  initialSuggestionBody = "Consider seasonal florals and local artisans in Udaipur for a similar luxury look at a lower cost.",
}: AICopilotCardProps) {
  const router = useRouter();
  const [suggestionTitle, setSuggestionTitle] = useState(initialSuggestionTitle);
  const [suggestionBody, setSuggestionBody] = useState(initialSuggestionBody);
  const [isLoading, setIsLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleMoreSuggestions = async () => {
    setIsLoading(true);
    try {
      const prompts = [
        "Suggest a budget saving strategy for photography and catering",
        "How can we optimize transportation and welcome gifts for guests?",
        "What are alternative acoustic entertainment options for our reception?",
      ];
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

      const res = await fetch(`/api/events/${eventId}/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: randomPrompt }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSuggestionTitle(data.data.suggestionTitle || "AI Strategic Recommendation");
        setSuggestionBody(data.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#E9E3D8] shadow-card flex flex-col justify-between">
      {/* Top Emerald Header matching screenshot */}
      <div className="bg-gradient-to-r from-[#173B2D] to-[#28523D] px-5 py-3.5 text-[#FAF7F1] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C6A56B]" />
          <h3 className="font-serif text-base font-normal tracking-wide text-[#FAF7F1]">
            AI Copilot
          </h3>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-wide bg-[#C6A56B]/20 text-[#FAF7F1] border border-[#C6A56B]/40">
          Powered by Planora AI
        </span>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-[#72756D] font-sans">
            A personalized suggestion for your event:
          </p>

          <div className="mt-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#B45309] flex-shrink-0 mt-0.5 shadow-xs">
              <Lightbulb className="w-4 h-4 text-[#D97706]" />
            </div>

            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-[#1C2921] leading-tight">
                {suggestionTitle}
              </h4>
              <p className="text-xs text-[#72756D] mt-1.5 leading-relaxed">
                {suggestionBody}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-3 border-t border-[#E9E3D8]/60">
          <button
            onClick={() => router.push(`/events/${eventId}/copilot`)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173B2D] text-[#FAF7F1] text-xs font-medium hover:bg-[#28523D] transition-colors shadow-xs group"
          >
            <span>Explore Alternatives</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={handleMoreSuggestions}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F1] border border-[#E9E3D8] hover:border-[#C6A56B] text-[#1C2921] text-xs font-medium hover:bg-[#F4EFEA] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#72756D] ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Analyzing..." : "More Suggestions"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
