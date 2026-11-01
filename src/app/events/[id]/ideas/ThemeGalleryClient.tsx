"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import { Palette, Check, Sparkles } from "lucide-react";
import { Event, ThemeInspiration, UserProfile, AppNotification } from "@/lib/types";

interface ThemeGalleryClientProps {
  event: Event;
  themes: ThemeInspiration[];
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
}

export function ThemeGalleryClient({
  event,
  themes,
  profile,
  events,
  notifications,
}: ThemeGalleryClientProps) {
  const [selectedThemeId, setSelectedThemeId] = useState(
    event.selectedThemeId || themes[0]?.id
  );
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleApplyTheme = async (themeId: string) => {
    setSavingId(themeId);
    try {
      await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedThemeId: themeId }),
      });
      setSelectedThemeId(themeId);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
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
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-[#E9E3D8]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5D4B5]/50 text-[#173B2D] border border-[#C6A56B]/40 mb-2">
            <Palette className="w-3.5 h-3.5 text-[#C6A56B]" />
            <span>Theme & Moodboard Inspiration</span>
          </div>
          <h1 className="font-serif text-3xl text-[#1C2921] font-normal">
            Curated Themes for {event.title}
          </h1>
          <p className="font-serif italic text-sm text-[#72756D] mt-1">
            Choose an aesthetic identity to align your decor, floral arrangements, invitations and attire.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            const isSaving = savingId === theme.id;

            return (
              <div
                key={theme.id}
                className={`bg-[#FFFDF9] rounded-3xl overflow-hidden border p-6 shadow-card transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-[#173B2D] ring-2 ring-[#173B2D]/20 shadow-card-hover"
                    : "border-[#E9E3D8] hover:border-[#C6A56B]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-[#1C2921]">
                        {theme.title}
                      </h3>
                      <p className="text-xs text-[#C6A56B] font-medium">{theme.style}</p>
                    </div>

                    {isSelected && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#28523D] text-[#FAF7F1] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active Theme
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#72756D] leading-relaxed mb-4">
                    {theme.description}
                  </p>

                  {/* 4-photo collage */}
                  <div className="grid grid-cols-4 gap-2 h-36 mb-4">
                    <div className="col-span-2 relative rounded-xl overflow-hidden bg-[#E9E3D8]">
                      <Image
                        src={theme.images[0] || "/images/theme-table-crop.jpg"}
                        alt={theme.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="col-span-1 relative rounded-xl overflow-hidden bg-[#E9E3D8]">
                      <Image
                        src={theme.images[1] || "/images/theme-mandap-crop.jpg"}
                        alt="Decor"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 15vw"
                      />
                    </div>
                    <div className="col-span-1 grid grid-rows-2 gap-2">
                      <div className="relative rounded-xl overflow-hidden bg-[#E9E3D8]">
                        <Image
                          src={theme.images[2] || "/images/theme-palace-crop.jpg"}
                          alt="Architecture"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 15vw"
                        />
                      </div>
                      <div className="relative rounded-xl overflow-hidden bg-[#E9E3D8]">
                        <Image
                          src={theme.images[3] || "/images/theme-lanterns-crop.jpg"}
                          alt="Lighting"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 15vw"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Palette Swatches */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] text-[#72756D] font-medium mr-1">Palette:</span>
                    {theme.palette.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span
                          className="w-5 h-5 rounded-full border border-white shadow-xs inline-block"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E9E3D8] flex items-center justify-between">
                  <span className="text-[11px] text-[#72756D]">
                    {isSelected ? "Saved to event settings" : "Ready to apply"}
                  </span>

                  <button
                    onClick={() => handleApplyTheme(theme.id)}
                    disabled={isSelected || isSaving}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#FAF7F1] text-[#72756D] border border-[#E9E3D8] cursor-default"
                        : "bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] shadow-xs"
                    }`}
                  >
                    {isSaving ? "Applying..." : isSelected ? "Currently Applied" : "Apply to Event"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
