"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import {
  User,
  Settings,
  Database,
  Sparkles,
  RefreshCw,
  Save,
  Check,
  Shield,
  Info,
} from "lucide-react";
import { UserProfile, Event, AppNotification, ThemeInspiration } from "@/lib/types";

interface SettingsClientProps {
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
  supabaseConfigured: boolean;
  geminiConfigured: boolean;
}

export function SettingsClient({
  profile: initialProfile,
  events,
  notifications,
  themes,
  supabaseConfigured,
  geminiConfigured,
}: SettingsClientProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [displayName, setDisplayName] = useState(initialProfile.displayName);
  const [email, setEmail] = useState(initialProfile.email);
  const [defaultCurrency, setDefaultCurrency] = useState(initialProfile.defaultCurrency);
  const [timezone, setTimezone] = useState(initialProfile.timezone);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          email,
          defaultCurrency,
          timezone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemo = async () => {
    if (confirm("Reset Planora to official showcase demo seed? All custom additions will be reverted.")) {
      setIsResetting(true);
      try {
        await fetch("/api/reset-demo", { method: "POST" });
        alert("Showcase demo seed restored!");
        window.location.reload();
      } catch (err) {
        console.error(err);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <AppShell
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-[#E9E3D8]">
          <h1 className="font-serif text-3xl text-[#1C2921] font-normal">
            Account & Workspace Settings
          </h1>
          <p className="font-serif italic text-sm text-[#72756D] mt-1">
            Manage your personal profile, preferred currency, and cloud configurations.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9E3D8] shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C6A56B] shadow-sm flex-shrink-0">
              <Image
                src={profile.avatarUrl || "/images/ronit-avatar.jpg"}
                alt={displayName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div>
              <h2 className="font-serif text-xl text-[#1C2921]">{displayName}</h2>
              <p className="text-xs text-[#72756D]">{email}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8F1E5] text-[#28523D] mt-1.5">
                Creator & Event Host
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Default Currency</label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
                >
                  <option value="INR">INR (₹) — Indian Rupee</option>
                  <option value="USD">USD ($) — US Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                  <option value="AED">AED — UAE Dirham</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E9E3D8]">
              {savedSuccess ? (
                <span className="text-xs text-[#28523D] font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" /> Profile preferences saved!
                </span>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-medium shadow-sm transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Infrastructure & Diagnostics */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9E3D8] shadow-card space-y-4">
          <h2 className="font-serif text-xl text-[#1C2921]">System Health & Integrations</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Supabase Status */}
            <div className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E9E3D8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[#28523D]" />
                <div>
                  <p className="font-semibold text-[#1C2921]">Database Layer</p>
                  <p className="text-[#72756D] text-[11px]">
                    {supabaseConfigured ? "Supabase PostgreSQL Connected" : "Local Durable Store Active"}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800">
                Healthy
              </span>
            </div>

            {/* Gemini Status */}
            <div className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E9E3D8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#C6A56B]" />
                <div>
                  <p className="font-semibold text-[#1C2921]">Gemini AI Engine</p>
                  <p className="text-[#72756D] text-[11px]">
                    {geminiConfigured ? "Google GenAI SDK Connected" : "Deterministic Planner Active"}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Showcase Demo Seed Maintenance */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9E3D8] shadow-card flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-medium text-[#1C2921]">
              Showcase Demo Data
            </h3>
            <p className="text-xs text-[#72756D] mt-1">
              Reset the database back to the exact initial showcase state seen in the design reference.
            </p>
          </div>

          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-600 text-amber-800 hover:bg-amber-50 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
            <span>{isResetting ? "Resetting..." : "Reset Demo Data"}</span>
          </button>
        </div>

        {/* Creator Attribution */}
        <div className="p-6 rounded-3xl bg-[#173B2D] text-[#FAF7F1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-lg font-normal">Planora — Smart Event Planning</h4>
            <p className="font-serif italic text-xs text-[#C6A56B] mt-0.5">
              Plan beautifully. Celebrate effortlessly.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#FAF7F1]/80">Designed & Developed by</span>
            <p className="font-serif text-sm font-semibold text-[#E5D4B5]">Ronit Dhawan</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
