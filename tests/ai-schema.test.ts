import { describe, it, expect } from "vitest";
import { AIEventPlanSchema, AICopilotResponseSchema, generateAIEventPlan } from "../src/lib/ai/gemini";

describe("AI Event Planning & Copilot Schemas", () => {
  it("validates structured AI Event Plan", async () => {
    const plan = await generateAIEventPlan({
      title: "Royal Wedding Celebration",
      eventType: "wedding",
      eventDate: "2025-04-26",
      location: "Jaipur, Rajasthan",
      guestCount: 250,
      budget: 1500000,
      currency: "INR",
    });

    const validated = AIEventPlanSchema.safeParse(plan);
    expect(validated.success).toBe(true);
    expect(plan.themeName).toBeDefined();
    expect(plan.budgetAllocations.length).toBeGreaterThan(0);

    // Verify budget allocation reconciliation
    const sumAlloc = plan.budgetAllocations.reduce((sum, b) => sum + b.amount, 0);
    expect(sumAlloc).toBe(1500000);
  });

  it("validates AI Copilot response schema with modification proposal", () => {
    const sampleResponse = {
      content: "You can save ~₹1,20,000 on decor by utilizing local artisan florists.",
      suggestionTitle: "You can save ~₹1,20,000 on decor",
      proposedModifications: [
        {
          categoryName: "Decor",
          fromAmount: 420000,
          toAmount: 300000,
          reason: "Seasonal indigenous marigolds and local brassware.",
        },
      ],
    };

    const validated = AICopilotResponseSchema.safeParse(sampleResponse);
    expect(validated.success).toBe(true);
  });
});
