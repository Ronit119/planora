import { describe, it, expect } from "vitest";
import { calculateReadinessScore } from "../src/lib/readiness";
import { Task, Vendor, BudgetCategory, Expense, Guest } from "../src/lib/types";

describe("Deterministic Event Readiness Engine", () => {
  it("calculates balanced readiness score within 0 to 100", () => {
    const tasks: Task[] = [
      { id: "1", eventId: "e1", title: "Task 1", dueDate: "2026-12-01", status: "completed", priority: "high", createdAt: "" },
      { id: "2", eventId: "e1", title: "Task 2", dueDate: "2026-12-01", status: "in_progress", priority: "medium", createdAt: "" },
    ];
    const vendors: Vendor[] = [
      { id: "v1", eventId: "e1", name: "Vendor 1", category: "Venue", quotedAmount: 100, contractAmount: 100, advancePaid: 50, status: "Booked", createdAt: "" },
    ];
    const categories: BudgetCategory[] = [
      { id: "c1", eventId: "e1", name: "Venue", allocatedAmount: 100, color: "#28523D", createdAt: "" },
    ];
    const expenses: Expense[] = [
      { id: "exp1", eventId: "e1", categoryId: "c1", title: "Deposit", amount: 50, paymentStatus: "paid", createdAt: "" },
    ];
    const guests: Guest[] = [
      { id: "g1", eventId: "e1", name: "Guest 1", groupTag: "family", rsvpStatus: "attending", dietaryPreference: "none", plusOneCount: 0, createdAt: "" },
    ];

    const result = calculateReadinessScore({
      tasks,
      vendors,
      budget: 100,
      categories,
      expenses,
      guests,
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.tasksScore).toBeGreaterThanOrEqual(0);
    expect(result.vendorsScore).toBe(25); // 100% booked vendors
    expect(result.guestsScore).toBe(10); // 100% confirmed guests
  });

  it("penalizes overdue tasks deterministically", () => {
    const pastDate = "2020-01-01";
    const futureDate = "2028-01-01";

    const tasksOverdue: Task[] = [
      { id: "1", eventId: "e1", title: "Overdue", dueDate: pastDate, status: "not_started", priority: "critical", createdAt: "" },
    ];
    const tasksFuture: Task[] = [
      { id: "2", eventId: "e1", title: "Future", dueDate: futureDate, status: "not_started", priority: "critical", createdAt: "" },
    ];

    const resOverdue = calculateReadinessScore({ tasks: tasksOverdue });
    const resFuture = calculateReadinessScore({ tasks: tasksFuture });

    expect(resOverdue.tasksScore).toBeLessThanOrEqual(resFuture.tasksScore);
  });
});
