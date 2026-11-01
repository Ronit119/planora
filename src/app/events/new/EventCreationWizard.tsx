"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import {
  Sparkles,
  Heart,
  Cake,
  Users,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Coins,
  Loader2,
  Save,
} from "lucide-react";
import { UserProfile, Event, AppNotification, ThemeInspiration, EventType } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

interface EventCreationWizardProps {
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
}

export function EventCreationWizard({
  profile,
  events,
  notifications,
  themes,
}: EventCreationWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("2025-11-15");
  const [startTime, setStartTime] = useState("18:00");
  const [location, setLocation] = useState("Jaipur, Rajasthan");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [guestCount, setGuestCount] = useState(250);
  const [budget, setBudget] = useState(1500000);
  const [currency, setCurrency] = useState("INR");
  const [budgetFlexibility, setBudgetFlexibility] = useState("moderate");
  const [priority, setPriority] = useState("Venue & Decor");

  // Personalization specifics
  const [stylePreference, setStylePreference] = useState("Traditional Luxury");
  const [ceremonies, setCeremonies] = useState("Mehendi, Sangeet, Wedding, Reception");
  const [cateringStyle, setCateringStyle] = useState("Royal Rajasthani & Continental Live Counters");
  const [specialInstructions, setSpecialInstructions] = useState(
    "Heritage palace ambiance with royal floral mandap and live folk musicians."
  );

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const steps = [
    { number: 1, title: "Event Type" },
    { number: 2, title: "Basic Information" },
    { number: 3, title: "Financial Planning" },
    { number: 4, title: "Personalization" },
    { number: 5, title: "AI Plan & Review" },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      if (!title) {
        setTitle(
          eventType === "wedding"
            ? "Royal Wedding Celebration"
            : eventType === "birthday"
            ? "Grand Birthday Soiree"
            : "Annual Community Gathering"
        );
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!title || !location || !eventDate) {
        alert("Please complete all basic event fields.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (budget <= 0) {
        alert("Please specify a valid budget.");
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setGenerationProgress("Synthesizing luxury event concept with Planora AI...");

    try {
      setTimeout(() => {
        setGenerationProgress("Architecting balanced budget allocations and timelines...");
      }, 1000);

      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          eventType,
          eventDate,
          location,
          guestCount: Number(guestCount),
          budget: Number(budget),
          currency,
          saveToDatabase: true,
          personalization: {
            stylePreference,
            ceremonies,
            cateringStyle,
            priority,
            budgetFlexibility,
            specialInstructions,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedPlan(data.data.plan);
        setCreatedEventId(data.data.event.id);
        setGenerationProgress("Event plan successfully created and saved!");
      } else {
        alert("Failed to generate plan: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenEvent = () => {
    if (createdEventId) {
      router.push(`/events/${createdEventId}`);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <AppShell
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
    >
      <div className="max-w-4xl mx-auto py-4 sm:py-6">
        {/* Wizard Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5D4B5]/50 text-[#173B2D] border border-[#C6A56B]/40 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A56B]" />
            <span>AI Event Planning Wizard</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1C2921] font-normal">
            Create Your Next Extraordinary Event
          </h1>
          <p className="font-serif italic text-sm text-[#72756D] mt-2">
            Planora brings together luxury aesthetic design, precise financials, and AI event coordination.
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E9E3D8] -translate-y-1/2 -z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#173B2D] -translate-y-1/2 -z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    currentStep === s.number
                      ? "bg-[#173B2D] text-[#FAF7F1] ring-4 ring-[#E5D4B5]/60"
                      : currentStep > s.number
                      ? "bg-[#28523D] text-[#FAF7F1]"
                      : "bg-[#FFFDF9] border-2 border-[#E9E3D8] text-[#72756D]"
                  }`}
                >
                  {currentStep > s.number ? <CheckCircle className="w-4 h-4" /> : s.number}
                </div>
                <span
                  className={`text-[11px] font-sans mt-2 hidden sm:block ${
                    currentStep === s.number ? "font-semibold text-[#173B2D]" : "text-[#72756D]"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Container */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-9 border border-[#E9E3D8] shadow-card">
          {/* STEP 1: EVENT TYPE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl text-[#1C2921]">Step 1: Choose Your Event Type</h2>
              <p className="text-xs text-[#72756D]">
                Select the event category to load tailored templates, budget allocations, and planning checklists.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Wedding */}
                <div
                  onClick={() => setEventType("wedding")}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    eventType === "wedding"
                      ? "border-[#173B2D] bg-[#E8F1E5]/40 shadow-sm ring-2 ring-[#173B2D]/20"
                      : "border-[#E9E3D8] hover:border-[#C6A56B] bg-[#FFFDF9]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E5D4B5]/50 flex items-center justify-center text-[#A88344] mb-4">
                    <Heart className="w-6 h-6 text-[#173B2D]" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1C2921] font-medium">Wedding</h3>
                  <p className="text-xs text-[#72756D] mt-2 leading-relaxed">
                    Royal destinations, ceremony timelines, multi-day functions, guest hospitality and bridal suites.
                  </p>
                </div>

                {/* Birthday */}
                <div
                  onClick={() => setEventType("birthday")}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    eventType === "birthday"
                      ? "border-[#173B2D] bg-[#E8F1E5]/40 shadow-sm ring-2 ring-[#173B2D]/20"
                      : "border-[#E9E3D8] hover:border-[#C6A56B] bg-[#FFFDF9]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E5D4B5]/50 flex items-center justify-center text-[#A88344] mb-4">
                    <Cake className="w-6 h-6 text-[#173B2D]" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1C2921] font-medium">Birthday Soiree</h3>
                  <p className="text-xs text-[#72756D] mt-2 leading-relaxed">
                    Milestone celebrations, rooftop dining, live acoustic sets, custom cocktail bars and cakes.
                  </p>
                </div>

                {/* Community */}
                <div
                  onClick={() => setEventType("community")}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    eventType === "community"
                      ? "border-[#173B2D] bg-[#E8F1E5]/40 shadow-sm ring-2 ring-[#173B2D]/20"
                      : "border-[#E9E3D8] hover:border-[#C6A56B] bg-[#FFFDF9]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E5D4B5]/50 flex items-center justify-center text-[#A88344] mb-4">
                    <Users className="w-6 h-6 text-[#173B2D]" />
                  </div>
                  <h3 className="font-serif text-lg text-[#1C2921] font-medium">Community & Gala</h3>
                  <p className="text-xs text-[#72756D] mt-2 leading-relaxed">
                    Conferences, charity galas, cultural showcases, AV production, ticketing and volunteer management.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BASIC INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl text-[#1C2921]">Step 2: Basic Event Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Event Name / Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Royal Wedding Celebration"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Event Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Location / City *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Jaipur, Rajasthan"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Expected Guest Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FINANCIAL PLANNING */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl text-[#1C2921]">Step 3: Financial & Budget Planning</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Planned Total Budget *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1000"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                    />
                  </div>
                  <p className="text-[11px] text-[#28523D] font-medium mt-1">
                    Formatted: {formatCurrency(budget, currency)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  >
                    <option value="INR">INR (₹) — Indian Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                    <option value="AED">AED — UAE Dirham</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Budget Flexibility
                  </label>
                  <select
                    value={budgetFlexibility}
                    onChange={(e) => setBudgetFlexibility(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  >
                    <option value="strict">Strict (Do not exceed)</option>
                    <option value="moderate">Moderate (±10% flexibility)</option>
                    <option value="flexible">Flexible (Quality priority)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Primary Spending Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  >
                    <option value="Venue & Decor">Venue & Grand Decor</option>
                    <option value="Gourmet Catering">Gourmet Catering & Dining</option>
                    <option value="Cinematic Photography">Cinematic Photography & Film</option>
                    <option value="Live Entertainment">Live Music & Entertainment</option>
                    <option value="Balanced">Balanced Across All Categories</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PERSONALIZATION */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl text-[#1C2921]">Step 4: Personalization & Experience</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Theme / Aesthetic Preference
                  </label>
                  <input
                    type="text"
                    value={stylePreference}
                    onChange={(e) => setStylePreference(e.target.value)}
                    placeholder="e.g. Royal Garden Elegance / Modern Minimalist"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  />
                </div>

                {eventType === "wedding" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                      Functions & Ceremonies
                    </label>
                    <input
                      type="text"
                      value={ceremonies}
                      onChange={(e) => setCeremonies(e.target.value)}
                      placeholder="e.g. Haldi, Mehendi, Sangeet, Wedding, Reception"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Catering & Beverage Style
                  </label>
                  <input
                    type="text"
                    value={cateringStyle}
                    onChange={(e) => setCateringStyle(e.target.value)}
                    placeholder="e.g. Multi-course plated dinner / Live regional chaat counters"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C2921] mb-1">
                    Special Instructions & Cultural Vision
                  </label>
                  <textarea
                    rows={3}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Provide any cultural traditions, accessibility guidelines, or distinct moments..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none text-sm text-[#1C2921] bg-[#FAF7F1]/30 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: AI PLANNING & REVIEW */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h2 className="font-serif text-2xl text-[#1C2921]">Step 5: Review & AI Generation</h2>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-[#FAF7F1] border border-[#E9E3D8] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1C2921]">{title}</h3>
                    <p className="text-xs text-[#72756D]">
                      {location} • {eventDate} • {guestCount} Guests
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-xl font-semibold text-[#173B2D]">
                      {formatCurrency(budget, currency)}
                    </span>
                    <p className="text-[11px] text-[#72756D]">Planned Budget</p>
                  </div>
                </div>

                <div className="text-xs text-[#72756D] border-t border-[#E9E3D8] pt-2 flex flex-wrap gap-x-6 gap-y-1">
                  <span>
                    <strong>Type:</strong> {eventType.toUpperCase()}
                  </span>
                  <span>
                    <strong>Style:</strong> {stylePreference}
                  </span>
                  <span>
                    <strong>Priority:</strong> {priority}
                  </span>
                </div>
              </div>

              {/* Progress / Status banner */}
              {isGenerating && (
                <div className="p-5 rounded-2xl bg-[#E8F1E5] border border-[#28523D]/30 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-[#28523D] animate-spin flex-shrink-0" />
                  <p className="text-xs font-medium text-[#28523D]">{generationProgress}</p>
                </div>
              )}

              {/* Generated Plan Overview */}
              {generatedPlan && (
                <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#C6A56B] space-y-4">
                  <div className="flex items-center gap-2 text-[#C6A56B]">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="font-serif text-base font-medium text-[#173B2D]">
                      AI Plan Generated: {generatedPlan.themeName}
                    </h4>
                  </div>
                  <p className="text-xs text-[#72756D] leading-relaxed">
                    {generatedPlan.concept}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#E9E3D8]">
                    {generatedPlan.budgetAllocations.map((a: any, i: number) => (
                      <div key={i} className="p-2 rounded-xl bg-[#FAF7F1] text-xs">
                        <span className="font-medium text-[#1C2921]">{a.category}</span>
                        <div className="text-[#28523D] font-semibold mt-0.5">
                          {formatCurrency(a.amount, currency)} ({a.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <h5 className="text-xs font-semibold text-[#1C2921] mb-1">Key Cost-Saving Tips:</h5>
                    <ul className="text-xs text-[#72756D] list-disc list-inside space-y-1">
                      {generatedPlan.costSavingTips.map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Primary AI Generation Trigger Button */}
              {!generatedPlan && (
                <button
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#173B2D] to-[#28523D] hover:opacity-95 text-[#FAF7F1] text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#C6A56B]" />
                  <span>{isGenerating ? "Synthesizing Plan..." : "Generate AI Event Plan & Save"}</span>
                </button>
              )}

              {generatedPlan && (
                <button
                  onClick={handleOpenEvent}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Open Event Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#E9E3D8]">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E9E3D8] text-xs font-medium text-[#1C2921] hover:bg-[#FAF7F1] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 && (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#173B2D] hover:bg-[#28523D] text-xs font-medium text-[#FAF7F1] shadow-xs transition-colors"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
