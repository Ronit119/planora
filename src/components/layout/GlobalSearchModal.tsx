"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Calendar, CheckSquare, Store, Palette, ArrowRight } from "lucide-react";
import { Event, Task, Vendor, ThemeInspiration } from "@/lib/types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  events?: Event[];
  tasks?: Task[];
  vendors?: Vendor[];
  themes?: ThemeInspiration[];
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  events = [],
  tasks = [],
  vendors = [],
  themes = [],
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or toggle
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        events: events.slice(0, 3),
        tasks: tasks.slice(0, 4),
        vendors: vendors.slice(0, 4),
        themes: themes.slice(0, 2),
      };
    }
    return {
      events: events.filter(
        (e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
      ),
      tasks: tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.category && t.category.toLowerCase().includes(q))
      ),
      vendors: vendors.filter(
        (v) => v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q)
      ),
      themes: themes.filter(
        (th) => th.title.toLowerCase().includes(q) || th.style.toLowerCase().includes(q)
      ),
    };
  }, [query, events, tasks, vendors, themes]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  const totalResults =
    filtered.events.length + filtered.tasks.length + filtered.vendors.length + filtered.themes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#FFFDF9] rounded-3xl border border-[#E9E3D8] shadow-dropdown overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-[#E9E3D8] bg-[#FAF7F1]">
          <Search className="w-5 h-5 text-[#72756D]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, vendors, tasks, or inspiration..."
            className="flex-1 bg-transparent text-sm font-sans text-[#1C2921] placeholder-[#72756D] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-[#72756D] hover:text-[#1C2921] rounded-full hover:bg-[#E9E3D8]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-xs text-[#72756D] bg-[#FFFDF9] border border-[#E9E3D8] rounded-md shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {totalResults === 0 ? (
            <div className="py-12 text-center text-[#72756D] text-sm">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Events */}
              {filtered.events.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#72756D] uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Events
                  </h4>
                  <div className="space-y-1">
                    {filtered.events.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => navigateTo(`/events/${evt.id}`)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF7F1] text-left transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#1C2921] group-hover:text-[#173B2D]">
                            {evt.title}
                          </p>
                          <p className="text-xs text-[#72756D]">
                            {evt.location} • {evt.eventDate}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#72756D] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {filtered.tasks.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#72756D] uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5" /> Tasks & Milestones
                  </h4>
                  <div className="space-y-1">
                    {filtered.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => navigateTo(`/events/${task.eventId}/tasks`)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF7F1] text-left transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#1C2921] group-hover:text-[#173B2D]">
                            {task.title}
                          </p>
                          <p className="text-xs text-[#72756D]">
                            Due: {task.dueDate} • Priority: {task.priority}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in_progress"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendors */}
              {filtered.vendors.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#72756D] uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <Store className="w-3.5 h-3.5" /> Vendors
                  </h4>
                  <div className="space-y-1">
                    {filtered.vendors.map((vendor) => (
                      <button
                        key={vendor.id}
                        onClick={() => navigateTo(`/events/${vendor.eventId}/vendors`)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF7F1] text-left transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#1C2921] group-hover:text-[#173B2D]">
                            {vendor.name}
                          </p>
                          <p className="text-xs text-[#72756D]">
                            {vendor.category} • Status: {vendor.status}
                          </p>
                        </div>
                        <span className="text-xs text-[#28523D] font-medium">
                          ₹{vendor.quotedAmount.toLocaleString("en-IN")}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Themes */}
              {filtered.themes.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-[#72756D] uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5" /> Themes & Inspiration
                  </h4>
                  <div className="space-y-1">
                    {filtered.themes.map((th) => (
                      <button
                        key={th.id}
                        onClick={() => navigateTo(`/events/event-our-wedding-celebration/ideas`)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF7F1] text-left transition-colors group"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#1C2921] group-hover:text-[#173B2D]">
                            {th.title}
                          </p>
                          <p className="text-xs text-[#72756D]">{th.style}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {th.palette.slice(0, 3).map((col, idx) => (
                            <span
                              key={idx}
                              className="w-3 h-3 rounded-full border border-white"
                              style={{ backgroundColor: col }}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
