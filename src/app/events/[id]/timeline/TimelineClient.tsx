"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Calendar, Clock, CheckCircle, Printer } from "lucide-react";
import { Event, Task, UserProfile, AppNotification, ThemeInspiration } from "@/lib/types";

interface TimelineClientProps {
  event: Event;
  tasks: Task[];
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
}

export function TimelineClient({
  event,
  tasks,
  profile,
  events,
  notifications,
  themes,
}: TimelineClientProps) {
  const milestones = tasks.filter((t) => t.isMilestone);

  const dayOfSchedule = [
    { time: "14:00", activity: "Bridal suite setup & personal styling team arrivals", scope: "Suites" },
    { time: "16:00", activity: "Master decor inspection & mandap floral canopy check", scope: "Courtyard Lawn" },
    { time: "17:30", activity: "Live musicians soundcheck, lighting and candle fixtures lit", scope: "Pavilion" },
    { time: "18:30", activity: "Guest arrivals, boat transfers across lake & welcome drinks", scope: "Lake Pier" },
    { time: "19:45", activity: "Keynote ceremonial entrance & vows exchange", scope: "Mandap" },
    { time: "20:30", activity: "Gourmet multi-course banquet & celebration toasts", scope: "Royal Banquet Hall" },
    { time: "22:30", activity: "Live acoustic performance & dessert lounge", scope: "Lakeside Terrace" },
  ];

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3D8]">
          <div>
            <h1 className="font-serif text-3xl text-[#1C2921] font-normal">
              Planning Timeline & Run of Show
            </h1>
            <p className="font-serif italic text-sm text-[#72756D] mt-1">
              Complete chronological roadmap and minute-by-minute day-of schedule for {event.title}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] text-xs font-medium text-[#1C2921] transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#72756D]" />
            <span>Export Schedule</span>
          </button>
        </div>

        {/* Section 1: Pre-Event Milestone Journey */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9E3D8] shadow-card">
          <h2 className="font-serif text-xl text-[#1C2921] mb-1">
            Pre-Event Milestones Roadmap
          </h2>
          <p className="text-xs text-[#72756D] mb-6">
            Key planning gates leading up to {event.eventDate}
          </p>

          <div className="relative border-l-2 border-[#C6A56B]/40 ml-4 pl-6 space-y-6">
            {milestones.length === 0 ? (
              <p className="text-xs text-[#72756D]">No milestones defined yet.</p>
            ) : (
              milestones.map((m) => {
                const isDone = m.status === "completed";
                return (
                  <div key={m.id} className="relative group">
                    <div
                      className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                        isDone
                          ? "bg-[#28523D] border-[#28523D] text-[#FAF7F1]"
                          : "bg-[#FFFDF9] border-[#C6A56B] text-[#C6A56B]"
                      }`}
                    >
                      {isDone ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-[#C6A56B]" />}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E9E3D8] hover:border-[#C6A56B] transition-colors">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif text-base font-medium text-[#1C2921]">
                          {m.title}
                        </h3>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                            isDone ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isDone ? "Completed" : "Scheduled"}
                        </span>
                      </div>
                      <p className="text-xs text-[#72756D] mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#C6A56B]" /> Target Date: {m.dueDate}
                      </p>
                      {m.notes && <p className="text-xs text-[#72756D] mt-2 italic">{m.notes}</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 2: Day-Of Minute-by-Minute Run of Show */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#E9E3D8] shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-[#C6A56B]" />
            <h2 className="font-serif text-xl text-[#1C2921]">Day-Of Run of Show (Minute-by-Minute)</h2>
          </div>
          <p className="text-xs text-[#72756D] mb-6">
            Synchronized master timeline for bridal party, venue managers, caterers and photographers
          </p>

          <div className="divide-y divide-[#E9E3D8]/60">
            {dayOfSchedule.map((item, idx) => (
              <div
                key={idx}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#FAF7F1] px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-serif text-base font-semibold text-[#173B2D] w-16">
                    {item.time}
                  </span>
                  <span className="text-sm font-medium text-[#1C2921]">{item.activity}</span>
                </div>
                <span className="text-xs text-[#72756D] px-2.5 py-0.5 rounded-full bg-[#E5D4B5]/40 text-[#173B2D] sm:self-center self-start">
                  {item.scope}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
