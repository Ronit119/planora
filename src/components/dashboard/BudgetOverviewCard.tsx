"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BudgetCategory } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

interface BudgetOverviewCardProps {
  eventId: string;
  totalBudget: number;
  categories: BudgetCategory[];
  currency?: string;
}

export function BudgetOverviewCard({
  eventId,
  totalBudget = 2800000,
  categories = [],
  currency = "INR",
}: BudgetOverviewCardProps) {
  // If no categories provided, fallback to default breakdown
  const displayCats = categories.length > 0 ? categories : [
    { id: "1", eventId, name: "Venue", allocatedAmount: 980000, percentage: 35, color: "#3B7A57", createdAt: "" },
    { id: "2", eventId, name: "Catering", allocatedAmount: 700000, percentage: 25, color: "#FAF7F1", createdAt: "" },
    { id: "3", eventId, name: "Decor", allocatedAmount: 420000, percentage: 15, color: "#9DAE91", createdAt: "" },
    { id: "4", eventId, name: "Photography", allocatedAmount: 280000, percentage: 10, color: "#C6A56B", createdAt: "" },
    { id: "5", eventId, name: "Entertainment", allocatedAmount: 196000, percentage: 7, color: "#4A6B53", createdAt: "" },
    { id: "6", eventId, name: "Other", allocatedAmount: 224000, percentage: 8, color: "#D8E2D2", createdAt: "" },
  ];

  // Calculate SVG stroke dashes for the donut chart
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-[#1C3E2F] text-[#FAF7F1] rounded-3xl p-5 sm:p-6 border border-[#28523D] shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F1]/10">
        <h3 className="font-serif text-lg font-normal tracking-wide text-[#FAF7F1]">
          Budget Overview
        </h3>
        <Link
          href={`/events/${eventId}/budget`}
          className="text-xs text-[#E5D4B5] hover:text-white flex items-center gap-1 transition-colors group font-medium"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Donut Chart & Category Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mt-5">
        {/* SVG Donut Chart */}
        <div className="sm:col-span-5 flex justify-center items-center">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-[#28523D]"
                strokeWidth="18"
                fill="transparent"
              />
              {/* Segments */}
              {displayCats.map((cat, idx) => {
                const pct = cat.percentage || (totalBudget > 0 ? (cat.allocatedAmount / totalBudget) * 100 : 0);
                const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += pct;

                return (
                  <circle
                    key={cat.id || idx}
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={cat.color || "#C6A56B"}
                    strokeWidth="18"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 ease-out hover:opacity-80 cursor-pointer"
                  />
                );
              })}
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <span className="font-serif text-sm font-semibold tracking-tight text-[#FAF7F1]">
                {formatCurrency(totalBudget, currency)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#FAF7F1]/70 mt-0.5 font-sans">
                Total Budget
              </span>
            </div>
          </div>
        </div>

        {/* Categories List Legend */}
        <div className="sm:col-span-7 space-y-2">
          {displayCats.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between text-xs py-0.5 group hover:bg-[#FAF7F1]/5 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color || "#C6A56B" }}
                />
                <span className="text-[#FAF7F1]/90 font-medium truncate">{cat.name}</span>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-[#FAF7F1]/60 text-[11px]">
                  {cat.percentage !== undefined ? `${cat.percentage}%` : ""}
                </span>
                <span className="font-medium text-[#FAF7F1] text-xs">
                  {formatCurrency(cat.allocatedAmount, currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
