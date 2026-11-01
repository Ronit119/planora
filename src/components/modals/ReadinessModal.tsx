"use client";

import React from "react";
import { X, Award, CheckCircle, Store, Coins, Users, Calendar } from "lucide-react";
import { ReadinessBreakdown } from "@/lib/types";

interface ReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: ReadinessBreakdown;
  eventTitle: string;
}

export function ReadinessModal({
  isOpen,
  onClose,
  breakdown,
  eventTitle,
}: ReadinessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#FFFDF9] rounded-3xl border border-[#E9E3D8] shadow-dropdown overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E9E3D8] bg-[#FAF7F1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E5D4B5]/60 flex items-center justify-center text-[#A88344]">
              <Award className="w-4 h-4 text-[#C6A56B]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-normal text-[#1C2921]">
                Event Readiness Score
              </h3>
              <p className="text-xs text-[#72756D]">{eventTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#72756D] hover:text-[#1C2921] rounded-full hover:bg-[#E9E3D8]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Score Summary */}
        <div className="p-6 text-center border-b border-[#E9E3D8] bg-gradient-to-b from-[#FAF7F1]/50 to-[#FFFDF9]">
          <div className="font-serif text-5xl font-normal text-[#173B2D]">
            {breakdown.score}%
          </div>
          <p className="text-xs font-medium text-[#28523D] mt-2">
            {breakdown.score >= 80
              ? "Exceptional progress! You are on track for a flawless celebration."
              : breakdown.score >= 50
              ? "Good foundation. Focus on booking remaining vendors and finalizing guest count."
              : "Early planning phase. Complete critical milestones to raise readiness."}
          </p>
        </div>

        {/* 5 Dimensions Breakdown */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Dimension 1: Tasks */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#1C2921] mb-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#28523D]" /> Critical Tasks (35%)
              </span>
              <span>
                {breakdown.tasksScore} / 35 pts ({breakdown.details.tasksCompleted}/{breakdown.details.tasksTotal})
              </span>
            </div>
            <div className="w-full bg-[#E9E3D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#28523D] h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.tasksScore / 35) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimension 2: Vendors */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#1C2921] mb-1">
              <span className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-[#C6A56B]" /> Vendor Readiness (25%)
              </span>
              <span>
                {breakdown.vendorsScore} / 25 pts ({breakdown.details.vendorsBooked}/{breakdown.details.vendorsTotal} booked)
              </span>
            </div>
            <div className="w-full bg-[#E9E3D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C6A56B] h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.vendorsScore / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimension 3: Budget Health */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#1C2921] mb-1">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#28523D]" /> Budget Health & Tracking (20%)
              </span>
              <span>
                {breakdown.budgetScore} / 20 pts ({breakdown.details.budgetTrackedPercentage}% tracked)
              </span>
            </div>
            <div className="w-full bg-[#E9E3D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#28523D] h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.budgetScore / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimension 4: Guests */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#1C2921] mb-1">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C6A56B]" /> Guest RSVPs (10%)
              </span>
              <span>
                {breakdown.guestsScore} / 10 pts ({breakdown.details.guestsConfirmed}/{breakdown.details.guestsTotal} confirmed)
              </span>
            </div>
            <div className="w-full bg-[#E9E3D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C6A56B] h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.guestsScore / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Dimension 5: Schedule */}
          <div>
            <div className="flex justify-between text-xs font-medium text-[#1C2921] mb-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#28523D]" /> Timeline Milestones (10%)
              </span>
              <span>
                {breakdown.scheduleScore} / 10 pts ({breakdown.details.milestonesPassed} passed)
              </span>
            </div>
            <div className="w-full bg-[#E9E3D8] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#28523D] h-full rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.scheduleScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F1] border-t border-[#E9E3D8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#173B2D] text-[#FAF7F1] text-xs font-medium hover:bg-[#28523D] transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
}
