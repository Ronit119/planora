"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Coins, Wallet, Leaf, Award } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface MetricCardsProps {
  eventId: string;
  totalEvents: number;
  ongoingEvents: number;
  upcomingEvents: number;
  plannedBudget: number;
  totalExpenses: number;
  remainingBudget: number;
  remainingPercentage: string;
  readinessScore: number;
  currency?: string;
  onOpenReadinessModal: () => void;
}

export function MetricCards({
  eventId,
  totalEvents = 4,
  ongoingEvents = 2,
  upcomingEvents = 2,
  plannedBudget = 2800000,
  totalExpenses = 1750000,
  remainingBudget = 1050000,
  remainingPercentage = "37.5",
  readinessScore = 82,
  currency = "INR",
  onOpenReadinessModal,
}: MetricCardsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Events */}
      <div
        onClick={() => router.push("/events")}
        className="cursor-pointer bg-[#FFFDF9] rounded-2xl p-4 sm:p-4.5 border border-[#E9E3D8] shadow-card hover:shadow-card-hover hover:border-[#C6A56B] transition-all duration-200 group flex flex-col justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] group-hover:scale-105 transition-transform flex-shrink-0">
            <Calendar className="w-4 h-4 text-[#C6A56B]" />
          </div>
          <span className="text-xs font-sans text-[#72756D] font-medium truncate">Total Events</span>
        </div>

        <div className="mt-3">
          <div className="font-serif text-2xl sm:text-3xl text-[#1C2921] font-normal leading-none">
            {totalEvents}
          </div>
          <div className="text-[11px] text-[#72756D] mt-2 font-sans truncate">
            {ongoingEvents} ongoing • {upcomingEvents} upcoming
          </div>
        </div>
      </div>

      {/* 2. Planned Budget */}
      <div
        onClick={() => router.push(`/events/${eventId}/budget`)}
        className="cursor-pointer bg-[#FFFDF9] rounded-2xl p-4 sm:p-4.5 border border-[#E9E3D8] shadow-card hover:shadow-card-hover hover:border-[#C6A56B] transition-all duration-200 group flex flex-col justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] group-hover:scale-105 transition-transform flex-shrink-0">
            <Coins className="w-4 h-4 text-[#C6A56B]" />
          </div>
          <span className="text-xs font-sans text-[#72756D] font-medium truncate">Planned Budget</span>
        </div>

        <div className="mt-3">
          <div className="font-serif text-xl sm:text-2xl text-[#1C2921] font-normal leading-none tracking-tight">
            {formatCurrency(plannedBudget, currency)}
          </div>
          <div className="text-[11px] text-[#72756D] mt-2 font-sans truncate">
            Target event budget
          </div>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div
        onClick={() => router.push(`/events/${eventId}/budget`)}
        className="cursor-pointer bg-[#FFFDF9] rounded-2xl p-4 sm:p-4.5 border border-[#E9E3D8] shadow-card hover:shadow-card-hover hover:border-[#C6A56B] transition-all duration-200 group flex flex-col justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] group-hover:scale-105 transition-transform flex-shrink-0">
            <Wallet className="w-4 h-4 text-[#C6A56B]" />
          </div>
          <span className="text-xs font-sans text-[#72756D] font-medium truncate">Total Expenses</span>
        </div>

        <div className="mt-3">
          <div className="font-serif text-xl sm:text-2xl text-[#1C2921] font-normal leading-none tracking-tight">
            {formatCurrency(totalExpenses, currency)}
          </div>
          <div className="text-[11px] text-[#72756D] mt-2 font-sans truncate">
            {plannedBudget > 0 ? `${Math.round((totalExpenses / plannedBudget) * 100)}% committed` : "Active ledger"}
          </div>
        </div>
      </div>

      {/* 4. Remaining Budget */}
      <div
        onClick={() => router.push(`/events/${eventId}/budget`)}
        className="cursor-pointer bg-[#FFFDF9] rounded-2xl p-4 sm:p-4.5 border border-[#E9E3D8] shadow-card hover:shadow-card-hover hover:border-[#C6A56B] transition-all duration-200 group flex flex-col justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#9DAE91]/30 flex items-center justify-center text-[#28523D] group-hover:scale-105 transition-transform flex-shrink-0">
            <Leaf className="w-4 h-4 text-[#28523D]" />
          </div>
          <span className="text-xs font-sans text-[#72756D] font-medium truncate">Remaining Budget</span>
        </div>

        <div className="mt-3">
          <div className="font-serif text-xl sm:text-2xl text-[#1C2921] font-normal leading-none tracking-tight">
            {formatCurrency(remainingBudget, currency)}
          </div>
          <div className="mt-2 flex items-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F1E5] text-[#28523D]">
              ↑ {remainingPercentage}% left
            </span>
          </div>
        </div>
      </div>

      {/* 5. Readiness Score */}
      <div
        onClick={onOpenReadinessModal}
        className="cursor-pointer bg-[#FFFDF9] rounded-2xl p-4 sm:p-4.5 border border-[#E9E3D8] shadow-card hover:shadow-card-hover hover:border-[#C6A56B] transition-all duration-200 group flex flex-col justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#E5D4B5]/40 flex items-center justify-center text-[#A88344] group-hover:scale-105 transition-transform flex-shrink-0">
            <Award className="w-4 h-4 text-[#C6A56B]" />
          </div>
          <span className="text-xs font-sans text-[#72756D] font-medium truncate">Readiness Score</span>
        </div>

        <div className="mt-3">
          <div className="font-serif text-2xl sm:text-3xl text-[#1C2921] font-normal leading-none">
            {readinessScore}%
          </div>
          <div className="w-full bg-[#E9E3D8] h-1.5 rounded-full overflow-hidden mt-2.5">
            <div
              className="bg-[#28523D] h-full rounded-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
          <p className="text-[10px] text-[#72756D] mt-2 font-sans truncate">
            {readinessScore >= 80 ? "On track for a successful event!" : "Action items pending"}
          </p>
        </div>
      </div>
    </div>
  );
}
