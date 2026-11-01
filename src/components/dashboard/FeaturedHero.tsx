"use client";

import React from "react";
import Image from "next/image";
import Link from "next/navigation";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ArrowRight, Edit3 } from "lucide-react";
import { Event } from "@/lib/types";

interface FeaturedHeroProps {
  event: Event;
  onEdit?: () => void;
}

export function FeaturedHero({ event, onEdit }: FeaturedHeroProps) {
  const router = useRouter();

  // Format date nicely e.g. "Apr 26, 2025"
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(event.eventDate);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return event.eventDate;
    }
  }, [event.eventDate]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card transition-all duration-300 hover:shadow-card-hover">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">
        {/* Left Mandap Panoramic Photography */}
        <div className="relative md:col-span-5 lg:col-span-6 min-h-[200px] md:min-h-[220px] overflow-hidden">
          <Image
            src={event.coverImage || "/images/hero-mandap-crop.jpg"}
            alt={event.title}
            fill
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-[#FFFDF9]/60 md:to-[#FFFDF9] hidden md:block" />
        </div>

        {/* Right Event Narrative & Actions matching exact screenshot */}
        <div className="relative md:col-span-7 lg:col-span-6 p-5 sm:p-7 flex flex-col justify-center">
          {/* Badge */}
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase bg-[#E5D4B5]/50 text-[#173B2D] border border-[#C6A56B]/40 shadow-xs">
              FEATURED EVENT
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-2xl sm:text-3xl text-[#1C2921] font-normal leading-tight tracking-tight">
            {event.title}
          </h2>

          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#72756D] mt-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C6A56B]" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C6A56B]" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#C6A56B]" />
              <span>{event.guestCount} Guests</span>
            </div>
          </div>

          {/* Subtitle / Description */}
          <p className="font-serif italic text-xs sm:text-sm text-[#72756D] mt-2.5 leading-relaxed">
            {event.description || "A timeless celebration of love, culture and togetherness."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => router.push(`/events/${event.id}`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#173B2D] text-[#FAF7F1] text-xs sm:text-sm font-medium hover:bg-[#28523D] transition-all duration-200 shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#173B2D]/40"
            >
              <span>View Event</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onEdit || (() => router.push(`/events/${event.id}/budget`))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F1] border border-[#E9E3D8] hover:border-[#C6A56B] text-[#1C2921] text-xs sm:text-sm font-medium hover:bg-[#F4EFEA] transition-all duration-200 shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#72756D]" />
              <span>Edit Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
