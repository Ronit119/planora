"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Sparkles,
  Send,
  Check,
  X,
  ArrowRight,
  Lightbulb,
  Coins,
  Loader2,
  Calendar,
  Store,
} from "lucide-react";
import { Event, AICopilotMessage, BudgetCategory, UserProfile, AppNotification, ThemeInspiration } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

interface CopilotWorkspaceClientProps {
  event: Event;
  initialMessages: AICopilotMessage[];
  categories: BudgetCategory[];
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
}

export function CopilotWorkspaceClient({
  event,
  initialMessages = [],
  categories,
  profile,
  events,
  notifications,
  themes,
}: CopilotWorkspaceClientProps) {
  const [messages, setMessages] = useState<AICopilotMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const promptSuggestions = [
    "Reduce decor allocation by ₹50,000 and move to catering",
    "What critical deadlines are coming up this week?",
    "How can I save ~₹1,20,000 on decor in Udaipur?",
    "Suggest a timetable for guest boat transfers and reception",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    setInputMessage("");
    setIsSending(true);

    // Optimistically add user message
    const tempUserMsg: AICopilotMessage = {
      id: `temp-${Date.now()}`,
      eventId: event.id,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await fetch(`/api/events/${event.id}/copilot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleApplyProposal = async (messageId: string) => {
    setApplyingId(messageId);
    try {
      const res = await fetch(`/api/events/${event.id}/copilot`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isApplied: true } : m))
        );
      } else {
        alert(data.error || "Failed to apply proposal");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <AppShell
      currentEventId={event.id}
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
      eventTitle={event.title}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E9E3D8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#173B2D] to-[#28523D] flex items-center justify-center text-[#C6A56B] shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#1C2921] font-normal leading-tight">
                AI Event Copilot
              </h1>
              <p className="text-xs text-[#72756D]">
                Context-aware strategic assistant for {event.title}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F1E5] text-[#28523D] border border-[#28523D]/20">
            Event Context Loaded
          </span>
        </div>

        {/* Prompt Suggestions */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-[#72756D] font-medium mr-1">Suggested inquiries:</span>
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#FAF7F1] border border-[#E9E3D8] hover:border-[#C6A56B] text-[#1C2921] transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation Box */}
        <div className="bg-[#FFFDF9] rounded-3xl border border-[#E9E3D8] shadow-card flex flex-col h-[520px] overflow-hidden">
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#72756D]">
                <Sparkles className="w-8 h-8 text-[#C6A56B] mb-2" />
                <p className="font-serif text-base text-[#1C2921]">
                  How can I help curate "{event.title}" today?
                </p>
                <p className="text-xs mt-1 max-w-sm">
                  Ask me to evaluate vendor costs, reallocate budget between decor and catering, or draft guest timelines.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-[#173B2D] text-[#C6A56B] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                        isUser
                          ? "bg-[#173B2D] text-[#FAF7F1] rounded-br-none"
                          : "bg-[#FAF7F1] border border-[#E9E3D8] text-[#1C2921] rounded-bl-none shadow-xs"
                      }`}
                    >
                      {msg.suggestionTitle && (
                        <div className="flex items-center gap-1.5 font-semibold text-[#173B2D] mb-1.5 text-sm">
                          <Lightbulb className="w-4 h-4 text-[#D97706]" />
                          <span>{msg.suggestionTitle}</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {/* Proposed Modifications Before-and-After Card */}
                      {msg.proposedModifications && msg.proposedModifications.length > 0 && (
                        <div className="mt-3.5 p-3.5 rounded-xl bg-[#FFFDF9] border border-[#C6A56B]/60 shadow-xs">
                          <span className="font-semibold text-[11px] text-[#173B2D] uppercase tracking-wider block mb-2">
                            Proposed Budget Adjustment:
                          </span>

                          <div className="space-y-2">
                            {msg.proposedModifications.map((mod, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-xs py-1 border-b border-[#E9E3D8]/60 last:border-0"
                              >
                                <span className="font-medium text-[#1C2921]">
                                  {mod.categoryName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[#72756D] line-through">
                                    {formatCurrency(mod.fromAmount, event.currency)}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-[#C6A56B]" />
                                  <span className="font-semibold text-[#28523D]">
                                    {formatCurrency(mod.toAmount, event.currency)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#E9E3D8] flex items-center justify-between">
                            <span className="text-[10px] text-[#72756D]">
                              {msg.isApplied
                                ? "Modifications applied to live budget ledger"
                                : "Requires your confirmation"}
                            </span>

                            {msg.isApplied ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#28523D]">
                                <Check className="w-3.5 h-3.5" /> Applied to Budget
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApplyProposal(msg.id)}
                                disabled={applyingId === msg.id}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-medium transition-colors shadow-xs"
                              >
                                {applyingId === msg.id ? (
                                  <>
                                    <Loader2 className="w-3 h-3 animate-spin" /> Applying...
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3 h-3" /> Apply Changes
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {isSending && (
              <div className="flex items-center gap-3 text-xs text-[#72756D]">
                <div className="w-8 h-8 rounded-full bg-[#173B2D] text-[#C6A56B] flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <span>Planora AI is analyzing event context & formulating recommendations...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#FAF7F1] border-t border-[#E9E3D8] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask anything about budgets, vendors, or event arrangements..."
              className="flex-1 px-4 py-2.5 rounded-full border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FFFDF9] text-xs text-[#1C2921]"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isSending}
              className="w-9 h-9 rounded-full bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] flex items-center justify-center transition-colors disabled:opacity-50 flex-shrink-0 shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
