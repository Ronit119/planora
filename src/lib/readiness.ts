import { Task, Vendor, Expense, BudgetCategory, Guest, ReadinessBreakdown } from "./types";

/**
 * Deterministic Event Readiness Scoring Engine
 * 
 * Dimensions:
 * 1. Tasks Completion: 35% weight
 * 2. Vendor Readiness: 25% weight
 * 3. Budget Health & Tracking: 20% weight
 * 4. Guest RSVPs: 10% weight
 * 5. Schedule / Milestones: 10% weight
 */
export function calculateReadinessScore({
  tasks = [],
  vendors = [],
  budget = 0,
  categories = [],
  expenses = [],
  guests = [],
}: {
  tasks?: Task[];
  vendors?: Vendor[];
  budget?: number;
  categories?: BudgetCategory[];
  expenses?: Expense[];
  guests?: Guest[];
}): ReadinessBreakdown {
  const now = new Date();

  // 1. Tasks Score (35 points)
  let tasksScore = 0;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const overdueUncompleted = tasks.filter((t) => {
    if (t.status === "completed") return false;
    const due = new Date(t.dueDate);
    return due.getTime() < now.getTime();
  }).length;

  if (totalTasks > 0) {
    const rawRatio = completedTasks / totalTasks;
    // Overdue penalty: 3 points off per overdue task (up to max 15 points penalty)
    const overduePenalty = Math.min(15, overdueUncompleted * 3);
    tasksScore = Math.max(0, Math.round(rawRatio * 35) - overduePenalty);
  } else {
    // If no tasks created yet, base score is 5 points
    tasksScore = 5;
  }

  // 2. Vendors Score (25 points)
  let vendorsScore = 0;
  const totalVendors = vendors.length;
  // Booked vendors give full weight, Contacted/Negotiating give partial weight
  const bookedVendors = vendors.filter((v) => v.status === "Booked" || v.status === "Completed").length;
  const inProgressVendors = vendors.filter((v) => v.status === "Contacted" || v.status === "Negotiating").length;

  if (totalVendors > 0) {
    const weightedPoints = (bookedVendors * 1.0 + inProgressVendors * 0.4) / totalVendors;
    vendorsScore = Math.round(weightedPoints * 25);
  } else {
    vendorsScore = 4;
  }

  // 3. Budget Health (20 points)
  let budgetScore = 0;
  const totalAllocated = categories.reduce((sum, c) => sum + (c.allocatedAmount || 0), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  if (budget > 0) {
    // Check allocation coverage
    const allocRatio = Math.min(1.0, totalAllocated / budget);
    // Overspending penalty
    const isOverBudget = totalSpent > budget;
    const overSpendRatio = isOverBudget ? (totalSpent - budget) / budget : 0;
    const budgetHealthRatio = isOverBudget ? Math.max(0, 1.0 - overSpendRatio) : 1.0;

    budgetScore = Math.round((allocRatio * 0.6 + budgetHealthRatio * 0.4) * 20);
  } else {
    budgetScore = 3;
  }

  // 4. Guest Readiness (10 points)
  let guestsScore = 0;
  const totalGuests = guests.length;
  const confirmedGuests = guests.filter((g) => g.rsvpStatus === "attending").length;
  const respondedGuests = guests.filter((g) => g.rsvpStatus === "attending" || g.rsvpStatus === "declined").length;

  if (totalGuests > 0) {
    const rsvpRatio = respondedGuests / totalGuests;
    guestsScore = Math.round(rsvpRatio * 10);
  } else {
    guestsScore = 2;
  }

  // 5. Schedule / Milestones (10 points)
  let scheduleScore = 0;
  const milestones = tasks.filter((t) => t.isMilestone);
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.status === "completed").length;

  if (totalMilestones > 0) {
    scheduleScore = Math.round((completedMilestones / totalMilestones) * 10);
  } else {
    scheduleScore = 4;
  }

  const rawTotal = tasksScore + vendorsScore + budgetScore + guestsScore + scheduleScore;
  const finalScore = Math.min(100, Math.max(0, rawTotal));

  return {
    score: finalScore,
    tasksScore,
    vendorsScore,
    budgetScore,
    guestsScore,
    scheduleScore,
    details: {
      tasksCompleted: completedTasks,
      tasksTotal: totalTasks,
      vendorsBooked: bookedVendors,
      vendorsTotal: totalVendors,
      budgetTrackedPercentage: budget > 0 ? Math.round((totalSpent / budget) * 100) : 0,
      guestsConfirmed: confirmedGuests,
      guestsTotal: totalGuests,
      milestonesPassed: completedMilestones,
    },
  };
}
