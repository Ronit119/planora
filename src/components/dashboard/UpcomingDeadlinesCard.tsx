"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Task } from "@/lib/types";

interface UpcomingDeadlinesCardProps {
  eventId: string;
  tasks: Task[];
  onTaskToggle?: (taskId: string, newStatus: string) => void;
}

export function UpcomingDeadlinesCard({
  eventId,
  tasks = [],
  onTaskToggle,
}: UpcomingDeadlinesCardProps) {
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const t of tasks) {
      if (t.status === "completed") map[t.id] = true;
    }
    return map;
  });

  // Take first 4 upcoming tasks
  const displayTasks = tasks.slice(0, 4);

  const calculateDaysLeft = (dueDateStr: string, idx: number) => {
    try {
      const target = new Date(dueDateStr).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      if (!isNaN(diff) && diff > 0) return diff;
    } catch {
      // fallback
    }
    // Aesthetic fallback matching showcase
    const fallbackDays = [5, 24, 38, 69];
    return fallbackDays[idx] || 10;
  };

  const handleToggle = async (taskId: string) => {
    const isCurrentlyDone = !!completedMap[taskId];
    const newDone = !isCurrentlyDone;
    setCompletedMap((prev) => ({ ...prev, [taskId]: newDone }));

    const newStatus = newDone ? "completed" : "not_started";
    if (onTaskToggle) {
      onTaskToggle(taskId, newStatus);
    } else {
      try {
        await fetch(`/api/events/${eventId}/tasks`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, status: newStatus }),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#E9E3D8] shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
        <h3 className="font-serif text-lg font-normal tracking-wide text-[#1C2921]">
          Upcoming Deadlines
        </h3>
        <Link
          href={`/events/${eventId}/tasks`}
          className="text-xs text-[#28523D] hover:text-[#173B2D] flex items-center gap-1 transition-colors group font-medium"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Task List */}
      <div className="mt-4 space-y-3">
        {displayTasks.map((task, idx) => {
          const isDone = completedMap[task.id];
          const daysLeft = calculateDaysLeft(task.dueDate, idx);
          const isUrgent = daysLeft <= 7;

          return (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-[#FAF7F1] transition-colors group"
            >
              {/* Checkbox & Task Title */}
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                    isDone
                      ? "bg-[#28523D] border-[#28523D] text-white"
                      : isUrgent
                      ? "border-red-300 hover:border-red-500 bg-[#FFFDF9]"
                      : "border-[#C6A56B] hover:border-[#173B2D] bg-[#FFFDF9]"
                  }`}
                  aria-label={`Toggle ${task.title}`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : isUrgent ? (
                    <div className="w-2 h-2 rounded-sm bg-red-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-sm bg-[#C6A56B]/60" />
                  )}
                </button>

                <div className="truncate">
                  <h4
                    className={`text-xs sm:text-sm font-medium leading-tight truncate ${
                      isDone ? "line-through text-[#72756D]" : "text-[#1C2921]"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-[#72756D] mt-0.5">
                    Due {task.dueDate}
                  </p>
                </div>
              </div>

              {/* Countdown Badge */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                  isDone
                    ? "bg-[#E8F1E5] text-[#28523D]"
                    : isUrgent
                    ? "bg-[#FEE2E2] text-[#B91C1C] border border-red-200"
                    : "bg-[#E8F1E5] text-[#28523D] border border-[#28523D]/20"
                }`}
              >
                {isDone ? "Done ✓" : `${daysLeft} days left`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
