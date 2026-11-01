"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavBar } from "./TopNavBar";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { ReadinessModal } from "../modals/ReadinessModal";
import { Event, Task, Vendor, ThemeInspiration, AppNotification, UserProfile, ReadinessBreakdown } from "@/lib/types";

interface AppShellProps {
  children: React.ReactNode;
  currentEventId?: string;
  profile?: UserProfile;
  notifications?: AppNotification[];
  events?: Event[];
  tasks?: Task[];
  vendors?: Vendor[];
  themes?: ThemeInspiration[];
  readinessBreakdown?: ReadinessBreakdown;
  eventTitle?: string;
}

export function AppShell({
  children,
  currentEventId = "event-our-wedding-celebration",
  profile,
  notifications = [],
  events = [],
  tasks = [],
  vendors = [],
  themes = [],
  readinessBreakdown,
  eventTitle = "Our Wedding Celebration",
}: AppShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C2921]">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentEventId={currentEventId}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area (offset by 220px on desktop) */}
      <div className="lg:pl-[220px] flex flex-col min-h-screen">
        <TopNavBar
          profile={profile}
          notifications={notifications}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        events={events}
        tasks={tasks}
        vendors={vendors}
        themes={themes}
      />

      {/* Readiness Score Breakdown Modal */}
      {readinessBreakdown && (
        <ReadinessModal
          isOpen={isReadinessOpen}
          onClose={() => setIsReadinessOpen(false)}
          breakdown={readinessBreakdown}
          eventTitle={eventTitle}
        />
      )}
    </div>
  );
}
