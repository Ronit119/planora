import { describe, it, expect, beforeEach } from "vitest";
import { repository } from "../src/lib/db/repository";

describe("Planora Data Repository & State Persistence", () => {
  beforeEach(() => {
    repository.resetToDemoSeed();
  });

  it("loads default showcase event for Ronit Dhawan", () => {
    const profile = repository.getProfile();
    expect(profile.displayName).toBe("Ronit Dhawan");

    const events = repository.getEvents();
    expect(events.length).toBeGreaterThanOrEqual(1);

    const showcase = events.find((e) => e.title === "Our Wedding Celebration");
    expect(showcase).toBeDefined();
    expect(showcase?.location).toBe("Udaipur, Rajasthan");
    expect(showcase?.budget).toBe(2800000);
  });

  it("creates and mutates events, categories, and expenses", () => {
    const newEvent = repository.createEvent({
      userId: "test-user",
      title: "Test Gala 2026",
      eventType: "community",
      eventDate: "2026-10-10",
      location: "New Delhi",
      timezone: "Asia/Kolkata",
      guestCount: 150,
      budget: 500000,
      currency: "INR",
      description: "Test description",
      status: "planning",
    });

    expect(newEvent.id).toBeDefined();

    const cat = repository.createBudgetCategory({
      eventId: newEvent.id,
      name: "AV & Production",
      allocatedAmount: 200000,
      color: "#28523D",
    });

    const exp = repository.createExpense({
      eventId: newEvent.id,
      categoryId: cat.id,
      title: "Audio Mixer Deposit",
      amount: 45000,
      paymentStatus: "paid",
    });

    const overview = repository.getEventOverview(newEvent.id);
    expect(overview).toBeDefined();
    expect(overview?.expenses.length).toBe(1);
    expect(overview?.metrics.totalExpenses).toBe(45000);
    expect(overview?.metrics.remainingBudget).toBe(455000);
  });

  it("applies AI Copilot budget reallocation proposal to live records", () => {
    const events = repository.getEvents();
    const event = events[0];

    const aiMsg = repository.createAIMessage({
      eventId: event.id,
      role: "assistant",
      content: "Reduce decor by 30k",
      proposedModifications: [
        {
          categoryName: "Decor",
          fromAmount: 420000,
          toAmount: 390000,
          reason: "Savings test",
        },
      ],
      isApplied: false,
    });

    const res = repository.applyAIMessageProposal(aiMsg.id);
    expect(res.success).toBe(true);

    const decorCat = repository
      .getBudgetCategories(event.id)
      .find((c) => c.name.toLowerCase() === "decor");
    expect(decorCat?.allocatedAmount).toBe(390000);
  });
});
