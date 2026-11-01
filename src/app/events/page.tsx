import React from "react";
import Link from "next/link";
import Image from "next/image";
import { repository } from "@/lib/db/repository";
import { AppShell } from "@/components/layout/AppShell";
import { PlusCircle, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export const revalidate = 0;

export default async function EventsListPage() {
  const profile = repository.getProfile();
  const events = repository.getEvents();
  const notifications = repository.getNotifications();
  const themes = repository.getThemes();

  return (
    <AppShell
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3D8]">
          <div>
            <h1 className="font-serif text-3xl text-[#1C2921] font-normal">My Events</h1>
            <p className="font-serif italic text-sm text-[#72756D] mt-1">
              Organize, track, and curate all your celebrations in one luxury workspace.
            </p>
          </div>

          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-medium shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#E9E3D8] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#E9E3D8]">
                <Image
                  src={evt.coverImage || "/images/hero-mandap-crop.jpg"}
                  alt={evt.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      evt.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : evt.status === "planning"
                        ? "bg-[#C6A56B]/90 text-[#173B2D]"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-normal text-[#1C2921] group-hover:text-[#173B2D] transition-colors leading-snug">
                    {evt.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-[#72756D]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C6A56B]" />
                      <span>{evt.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C6A56B]" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#C6A56B]" />
                      <span>{evt.guestCount} Guests</span>
                    </div>
                  </div>

                  <p className="font-serif italic text-xs text-[#72756D] mt-3 line-clamp-2">
                    {evt.description || "A curated Planora celebration."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E9E3D8] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#72756D]">Budget</span>
                    <p className="font-serif text-sm font-semibold text-[#173B2D]">
                      {formatCurrency(evt.budget, evt.currency)}
                    </p>
                  </div>

                  <Link
                    href={`/events/${evt.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F1] border border-[#E9E3D8] hover:border-[#C6A56B] text-xs font-medium text-[#1C2921] hover:bg-[#F4EFEA] transition-colors"
                  >
                    <span>Manage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
