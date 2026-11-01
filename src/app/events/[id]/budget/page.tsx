import React from "react";
import { notFound } from "next/navigation";
import { repository } from "@/lib/db/repository";
import { BudgetManagerClient } from "./BudgetManagerClient";

export const revalidate = 0;

export default async function BudgetPage({
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

  return (
    <BudgetManagerClient
      event={overview.event}
      categories={overview.categories}
      expenses={overview.expenses}
      metrics={overview.metrics}
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
    />
  );
}
