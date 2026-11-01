"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Task } from "@/lib/types";

interface PlanningTimelineCardProps {
  eventId: string;
  tasks: Task[];
}

export function PlanningTimelineCard({ eventId, tasks = [] }: PlanningTimelineCardProps) {
  // Filter for milestones or use the top 5 timeline items
  const milestones = tasks.filter((t) => t.isMilestone).slice(0, 5);

  const displayItems = milestones.length > 0 ? milestones : tasks.slice(0, 5);

  return (
    <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#E9E3D8] shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
        <h3 className="font-serif text-lg font-normal tracking-wide text-[#1C2921]">
          Planning Timeline
        </h3>
        <Link
          href={`/events/${eventId}/timeline`}
          className="text-xs text-[#28523D] hover:text-[#173B2D] flex items-center gap-1 transition-colors group font-medium"
        >
          <span>View Timeline</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Timeline Steps Track */}
      <div className="relative mt-4 space-y-4">
        {/* Connecting Vertical Line */}
        <div className="absolute top-3 bottom-3 left-3 w-0.5 bg-[#E9E3D8] -z-0" />

        {displayItems.map((item, idx) => {
          const isCompleted = item.status === "completed";
          const isInProgress = item.status === "in_progress";

          return (
            <div key={item.id || idx} className="relative z-10 flex items-start gap-3.5 group">
              {/* Status Circle Node */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-[#28523D] flex items-center justify-center text-[#FAF7F1] shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                ) : isInProgress ? (
                  <div className="w-6 h-6 rounded-full border-2 border-[#C6A56B] bg-[#FFFDF9] flex items-center justify-center shadow-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C6A56B] animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-dashed border-[#A88344]/50 bg-[#FFFDF9]" />
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <div>
                  <h4
                    className={`text-xs sm:text-sm font-medium leading-tight ${
                      isCompleted ? "text-[#1C2921]" : isInProgress ? "text-[#1C2921] font-semibold" : "text-[#72756D]"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#72756D] mt-0.5">
                    {isCompleted ? (
                      <span className="text-[#28523D]">Completed</span>
                    ) : isInProgress ? (
                      <span>In Progress • Due {item.dueDate}</span>
                    ) : (
                      <span>Due {item.dueDate}</span>
                    )}
                  </p>
                </div>

                {/* In Progress Badge on right matching reference */}
                {isInProgress && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F1E5] text-[#28523D] border border-[#28523D]/20 flex-shrink-0">
                    In Progress
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
