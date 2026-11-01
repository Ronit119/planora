"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, ArrowRight, Check } from "lucide-react";
import { ThemeInspiration } from "@/lib/types";

interface ThemeInspirationCardProps {
  eventId: string;
  themes: ThemeInspiration[];
  selectedThemeId?: string;
  onThemeSelect?: (themeId: string) => void;
}

export function ThemeInspirationCard({
  eventId,
  themes = [],
  selectedThemeId = "royal-garden-elegance",
  onThemeSelect,
}: ThemeInspirationCardProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = themes.findIndex((t) => t.id === selectedThemeId);
    return idx !== -1 ? idx : 0;
  });

  const [saved, setSaved] = useState(false);

  const currentTheme = themes[currentIndex] || {
    id: "royal-garden-elegance",
    title: "Royal Garden Elegance",
    style: "Classic • Romantic • Regal",
    description: "Curated ideas based on your style, location and budget.",
    palette: ["#173B2D", "#9DAE91", "#C6A56B", "#F3D5C5", "#FAF7F1"],
    images: [
      "/images/theme-table-crop.jpg",
      "/images/theme-mandap-crop.jpg",
      "/images/theme-palace-crop.jpg",
      "/images/theme-lanterns-crop.jpg",
    ],
  };

  const handleNext = () => {
    if (themes.length <= 1) return;
    const nextIdx = (currentIndex + 1) % themes.length;
    setCurrentIndex(nextIdx);
    setSaved(false);
    if (onThemeSelect) {
      onThemeSelect(themes[nextIdx].id);
    }
  };

  const handleSaveTheme = async () => {
    try {
      await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedThemeId: currentTheme.id }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#E9E3D8] shadow-card flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-[#C6A56B]" />
          <h3 className="font-serif text-lg font-normal tracking-wide text-[#1C2921]">
            Theme Inspiration
          </h3>
        </div>
        <p className="font-serif italic text-xs text-[#72756D] mt-1">
          Curated ideas based on your style, location and budget.
        </p>
      </div>

      {/* 4-Photo Moodboard Collage */}
      <div className="grid grid-cols-4 gap-2 mt-3.5 h-28 sm:h-32">
        <div className="col-span-2 relative rounded-xl overflow-hidden bg-[#E9E3D8] border border-[#E9E3D8]/60">
          <Image
            src={currentTheme.images[0] || "/images/theme-table-crop.jpg"}
            alt={currentTheme.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>

        <div className="col-span-1 relative rounded-xl overflow-hidden bg-[#E9E3D8] border border-[#E9E3D8]/60">
          <Image
            src={currentTheme.images[1] || "/images/theme-mandap-crop.jpg"}
            alt="Floral decor"
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 25vw, 15vw"
          />
        </div>

        <div className="col-span-1 grid grid-rows-2 gap-2">
          <div className="relative rounded-xl overflow-hidden bg-[#E9E3D8] border border-[#E9E3D8]/60">
            <Image
              src={currentTheme.images[2] || "/images/theme-palace-crop.jpg"}
              alt="Venue architecture"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 15vw"
            />
          </div>
          <div className="relative rounded-xl overflow-hidden bg-[#E9E3D8] border border-[#E9E3D8]/60">
            <Image
              src={currentTheme.images[3] || "/images/theme-lanterns-crop.jpg"}
              alt="Lighting mood"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 15vw"
            />
          </div>
        </div>
      </div>

      {/* Palette Swatches & Carousel Action */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E9E3D8]/70">
        <div>
          {/* Swatches */}
          <div className="flex items-center gap-1.5 mb-2">
            {currentTheme.palette.map((color, idx) => (
              <span
                key={idx}
                className="w-4 h-4 rounded-full border border-white shadow-xs inline-block transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div>
            <h4 className="font-serif text-sm font-medium text-[#1C2921] leading-tight">
              {currentTheme.title}
            </h4>
            <p className="text-[11px] text-[#72756D]">{currentTheme.style}</p>
          </div>
        </div>

        {/* Carousel Arrow Button & Save Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveTheme}
            className="text-[11px] px-2.5 py-1 rounded-full border border-[#C6A56B] text-[#173B2D] hover:bg-[#FAF7F1] transition-colors"
          >
            {saved ? "Saved ✓" : "Apply"}
          </button>

          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full border border-[#E9E3D8] bg-[#FFFDF9] hover:bg-[#FAF7F1] flex items-center justify-center text-[#1C2921] shadow-xs transition-transform hover:scale-105 active:scale-95"
            aria-label="Next theme"
            title="Next theme"
          >
            <ArrowRight className="w-4 h-4 text-[#1C2921]" />
          </button>
        </div>
      </div>
    </div>
  );
}
