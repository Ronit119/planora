"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { FeaturedHero } from "@/components/dashboard/FeaturedHero";
import { MetricCards } from "@/components/dashboard/MetricCards";
import { BudgetOverviewCard } from "@/components/dashboard/BudgetOverviewCard";
import { PlanningTimelineCard } from "@/components/dashboard/PlanningTimelineCard";
import { VendorChecklistCard } from "@/components/dashboard/VendorChecklistCard";
import { ThemeInspirationCard } from "@/components/dashboard/ThemeInspirationCard";
import { AICopilotCard } from "@/components/dashboard/AICopilotCard";
import { UpcomingDeadlinesCard } from "@/components/dashboard/UpcomingDeadlinesCard";
import { ReadinessModal } from "@/components/modals/ReadinessModal";
import {
  UserProfile,
  Event,
  AppNotification,
  ThemeInspiration,
  VendorStatus,
} from "@/lib/types";

interface DashboardClientProps {
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
  initialOverview: any;
}

export function DashboardClient({
  profile,
  events,
  notifications,
  themes,
  initialOverview,
}: DashboardClientProps) {
  const [overview, setOverview] = useState(initialOverview);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState(false);

  const event = overview?.event || events[0];
  const metrics = overview?.metrics;

  const refreshOverview = async () => {
    try {
      const res = await fetch(`/api/events/${event.id}/overview`);
      const data = await res.json();
      if (data.success && data.data) {
        setOverview(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskToggle = async (taskId: string, newStatus: string) => {
    try {
      await fetch(`/api/events/${event.id}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      refreshOverview();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVendorStatusChange = async (vendorId: string, newStatus: VendorStatus) => {
    try {
      await fetch(`/api/events/${event.id}/vendors`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, status: newStatus }),
      });
      refreshOverview();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (confirm("Remove this vendor from your checklist?")) {
      try {
        await fetch(`/api/events/${event.id}/vendors?vendorId=${vendorId}`, {
          method: "DELETE",
        });
        refreshOverview();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AppShell
      currentEventId={event.id}
      profile={profile}
      notifications={notifications}
      events={events}
      tasks={overview.tasks}
      vendors={overview.vendors}
      themes={themes}
      readinessBreakdown={metrics?.readinessBreakdown}
      eventTitle={event.title}
    >
      <div className="space-y-6">
        {/* ROW 1: Welcome Header + Featured Event Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Welcome Text Section */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center">
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1C2921] font-normal tracking-tight leading-[1.15]">
              Welcome back, <br />
              <span className="font-medium text-[#173B2D]">{profile.displayName}</span>
            </h1>
            <p className="font-serif italic text-sm text-[#72756D] mt-2.5">
              Your events, budgets and plans — all in one place.
            </p>
          </div>

          {/* Featured Event Hero Card */}
          <div className="lg:col-span-8 xl:col-span-8">
            <FeaturedHero event={event} onEdit={refreshOverview} />
          </div>
        </div>

        {/* ROW 2: 5 Metric Cards */}
        <div>
          <MetricCards
            eventId={event.id}
            totalEvents={metrics?.totalEvents || events.length}
            ongoingEvents={metrics?.ongoingEvents || 2}
            upcomingEvents={metrics?.upcomingEvents || 2}
            plannedBudget={metrics?.plannedBudget || event.budget}
            totalExpenses={metrics?.totalExpenses || 0}
            remainingBudget={metrics?.remainingBudget || event.budget}
            remainingPercentage={metrics?.remainingPercentage || "37.5"}
            readinessScore={metrics?.readinessScore || 82}
            currency={event.currency}
            onOpenReadinessModal={() => setIsReadinessModalOpen(true)}
          />
        </div>

        {/* ROW 3: Middle Row (Budget Overview, Planning Timeline, Vendor Checklist) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <BudgetOverviewCard
            eventId={event.id}
            totalBudget={metrics?.plannedBudget || event.budget}
            categories={overview.categories}
            currency={event.currency}
          />

          <PlanningTimelineCard
            eventId={event.id}
            tasks={overview.tasks}
          />

          <VendorChecklistCard
            eventId={event.id}
            vendors={overview.vendors}
            onStatusChange={handleVendorStatusChange}
            onDeleteVendor={handleDeleteVendor}
          />
        </div>

        {/* ROW 4: Bottom Row (Theme Inspiration, AI Copilot, Upcoming Deadlines) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <ThemeInspirationCard
            eventId={event.id}
            themes={themes}
            selectedThemeId={event.selectedThemeId}
          />

          <AICopilotCard
            eventId={event.id}
          />

          <UpcomingDeadlinesCard
            eventId={event.id}
            tasks={overview.tasks}
            onTaskToggle={handleTaskToggle}
          />
        </div>
      </div>

      {/* Interactive Readiness Modal */}
      {metrics?.readinessBreakdown && (
        <ReadinessModal
          isOpen={isReadinessModalOpen}
          onClose={() => setIsReadinessModalOpen(false)}
          breakdown={metrics.readinessBreakdown}
          eventTitle={event.title}
        />
      )}
    </AppShell>
  );
}
