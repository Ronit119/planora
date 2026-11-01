import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { repository } from "@/lib/db/repository";
import { AppShell } from "@/components/layout/AppShell";
import {
  Calendar,
  MapPin,
  Users,
  Coins,
  Store,
  CheckSquare,
  Sparkles,
  Palette,
  ArrowRight,
  Printer,
  Trash2,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export const revalidate = 0;

export default async function EventHubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const overview = repository.getEventOverview(id);
  if (!overview) {
    notFound();
  }

  const profile = repository.getProfile();
  const events = repository.getEvents();
  const notifications = repository.getNotifications();
  const themes = repository.getThemes();

  const { event, categories, vendors, tasks, guests, metrics } = overview;

  return (
    <AppShell
      currentEventId={event.id}
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
      readinessBreakdown={metrics.readinessBreakdown}
      eventTitle={event.title}
    >
      <div className="space-y-6">
        {/* Banner with cover photo */}
        <div className="relative rounded-3xl overflow-hidden min-h-[220px] bg-[#173B2D] text-[#FAF7F1] flex flex-col justify-end p-6 sm:p-8 shadow-card">
          <Image
            src={event.coverImage || "/images/hero-mandap-crop.jpg"}
            alt={event.title}
            fill
            className="object-cover opacity-35"
            priority
          />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#C6A56B] text-[#173B2D] mb-3">
              {event.eventType.toUpperCase()}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#FAF7F1]/90 mt-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#C6A56B]" /> {event.eventDate}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C6A56B]" /> {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#C6A56B]" /> {event.guestCount} Guests
              </span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href={`/events/${event.id}/budget`}
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] mb-2 group-hover:scale-110 transition-transform">
              <Coins className="w-5 h-5 text-[#C6A56B]" />
            </div>
            <span className="text-xs font-medium text-[#1C2921]">Budget</span>
            <span className="text-[10px] text-[#72756D] mt-0.5">
              {formatCurrency(metrics.plannedBudget, event.currency)}
            </span>
          </Link>

          <Link
            href={`/events/${event.id}/vendors`}
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] mb-2 group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5 text-[#C6A56B]" />
            </div>
            <span className="text-xs font-medium text-[#1C2921]">Vendors</span>
            <span className="text-[10px] text-[#72756D] mt-0.5">{vendors.length} Total</span>
          </Link>

          <Link
            href={`/events/${event.id}/tasks`}
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] mb-2 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5 text-[#C6A56B]" />
            </div>
            <span className="text-xs font-medium text-[#1C2921]">Tasks</span>
            <span className="text-[10px] text-[#72756D] mt-0.5">
              {metrics.readinessBreakdown.details.tasksCompleted}/{tasks.length} Done
            </span>
          </Link>

          <Link
            href={`/events/${event.id}/timeline`}
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] mb-2 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-[#C6A56B]" />
            </div>
            <span className="text-xs font-medium text-[#1C2921]">Timeline</span>
            <span className="text-[10px] text-[#72756D] mt-0.5">Milestones</span>
          </Link>

          <Link
            href={`/events/${event.id}/guests`}
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-[#C6A56B]" />
            </div>
            <span className="text-xs font-medium text-[#1C2921]">Guests</span>
            <span className="text-[10px] text-[#72756D] mt-0.5">{guests.length} Registered</span>
          </Link>

          <Link
            href={`/events/${event.id}/copilot`}
            className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col items-center text-center group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] mb-2 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-[#C6A56B]" />
            </div>
            <span className="text-xs font-medium text-[#1C2921]">AI Copilot</span>
            <span className="text-[10px] text-[#28523D] font-semibold mt-0.5">Online</span>
          </Link>
        </div>

        {/* Readiness Overview Panel */}
        <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="font-serif text-xl font-normal text-[#1C2921]">Event Readiness Health</h3>
            <p className="text-xs text-[#72756D] mt-1">
              Deterministic readiness score computed across critical tasks, vendor bookings, budget tracking, and RSVPs.
            </p>
            <div className="w-full bg-[#E9E3D8] h-2.5 rounded-full overflow-hidden mt-4">
              <div
                className="bg-[#28523D] h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.readinessScore}%` }}
              />
            </div>
          </div>

          <div className="text-center sm:text-right flex-shrink-0">
            <span className="font-serif text-4xl text-[#173B2D] font-normal">
              {metrics.readinessScore}%
            </span>
            <p className="text-xs text-[#28523D] font-medium mt-1">Readiness Score</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
