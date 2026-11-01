import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { Event, BudgetCategory, Vendor, Task, Expense, BudgetModificationProposal } from "../types";

// Schema for AI Event Generation Output
export const AIEventPlanSchema = z.object({
  concept: z.string(),
  themeName: z.string(),
  styleDescription: z.string(),
  colorPalette: z.array(z.string()).min(3),
  budgetAllocations: z.array(
    z.object({
      category: z.string(),
      amount: z.number().positive(),
      percentage: z.number().min(0).max(100),
      color: z.string().optional(),
    })
  ),
  timelineMilestones: z.array(
    z.object({
      title: z.string(),
      dueDate: z.string(),
      category: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
  recommendedVendors: z.array(
    z.object({
      category: z.string(),
      estimatedCost: z.number(),
      serviceScope: z.string(),
    })
  ),
  dayOfSchedule: z.array(
    z.object({
      time: z.string(),
      activity: z.string(),
    })
  ),
  costSavingTips: z.array(z.string()),
  potentialRisks: z.array(z.string()),
});

export type AIEventPlan = z.infer<typeof AIEventPlanSchema>;

// Schema for AI Copilot Response Output
export const AICopilotResponseSchema = z.object({
  content: z.string(),
  suggestionTitle: z.string().optional(),
  proposedModifications: z
    .array(
      z.object({
        categoryName: z.string(),
        fromAmount: z.number(),
        toAmount: z.number(),
        reason: z.string(),
      })
    )
    .optional(),
});

export type AICopilotResponse = z.infer<typeof AICopilotResponseSchema>;

/**
 * Generate full AI Event Plan using Gemini API or intelligent deterministic fallback
 */
export async function generateAIEventPlan({
  eventType,
  title,
  eventDate,
  location,
  guestCount,
  budget,
  currency = "INR",
  personalization,
}: {
  eventType: string;
  title: string;
  eventDate: string;
  location: string;
  guestCount: number;
  budget: number;
  currency?: string;
  personalization?: Record<string, any>;
}): Promise<AIEventPlan> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const prompt = `You are Planora's elite AI Event Planning Architect.
Generate an extraordinary, mathematically consistent, culturally authentic event plan for:
Event: "${title}"
Type: ${eventType}
Date: ${eventDate}
Location: ${location}
Guests: ${guestCount}
Budget: ${currency} ${budget}
Preferences: ${JSON.stringify(personalization || {})}

Return valid JSON adhering to this exact schema:
{
  "concept": "concise editorial overview",
  "themeName": "evocative luxury theme name",
  "styleDescription": "e.g. Classic • Romantic • Regal",
  "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
  "budgetAllocations": [
    { "category": "Venue", "amount": number, "percentage": number, "color": "#28523D" }
  ],
  "timelineMilestones": [
    { "title": "Milestone name", "dueDate": "YYYY-MM-DD", "category": "Category", "priority": "high" }
  ],
  "recommendedVendors": [
    { "category": "Venue", "estimatedCost": number, "serviceScope": "Description" }
  ],
  "dayOfSchedule": [
    { "time": "18:00", "activity": "Welcome Reception" }
  ],
  "costSavingTips": ["tip 1", "tip 2"],
  "potentialRisks": ["risk 1", "risk 2"]
}
Ensure sum of budgetAllocations amounts equals ${budget} exactly.`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const parsed = JSON.parse(text);
      const validated = AIEventPlanSchema.parse(parsed);
      return validated;
    } catch (err) {
      console.warn("Gemini API call failed or timed out, using fallback deterministic planner:", err);
    }
  }

  // High-fidelity deterministic generation engine
  return generateDeterministicPlan({
    eventType,
    title,
    eventDate,
    location,
    guestCount,
    budget,
    currency,
  });
}

/**
 * Context-aware AI Copilot: analyzes current event data, answers questions,
 * and proposes concrete, budget-safe adjustments.
 */
export async function getAICopilotResponse({
  userMessage,
  event,
  categories = [],
  expenses = [],
  vendors = [],
  tasks = [],
}: {
  userMessage: string;
  event: Event;
  categories: BudgetCategory[];
  expenses: Expense[];
  vendors: Vendor[];
  tasks: Task[];
}): Promise<AICopilotResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const currentContext = {
        event: {
          title: event.title,
          type: event.eventType,
          date: event.eventDate,
          location: event.location,
          budget: event.budget,
          currency: event.currency,
        },
        budgetCategories: categories.map((c) => ({
          name: c.name,
          allocated: c.allocatedAmount,
          percentage: c.percentage,
        })),
        totalExpenses: expenses.reduce((s, e) => s + e.amount, 0),
        bookedVendors: vendors.filter((v) => v.status === "Booked").map((v) => v.name),
        pendingTasks: tasks.filter((t) => t.status !== "completed").map((t) => t.title),
      };

      const prompt = `You are Planora's AI Event Copilot assisting the user for "${event.title}".
Current Event State:
${JSON.stringify(currentContext, null, 2)}

User Request: "${userMessage}"

If the user asks to modify budget, reduce expenses, or reallocate funds:
1. Explain your recommendations crisply and with luxury event expertise.
2. In 'proposedModifications', provide the exact mathematical adjustments.
Format as JSON:
{
  "content": "Professional explanation of findings and recommendations",
  "suggestionTitle": "Optional highlight title (e.g. 'Optimized Floral & Catering Reallocation')",
  "proposedModifications": [
    {
      "categoryName": "Decor",
      "fromAmount": 420000,
      "toAmount": 370000,
      "reason": "Transitioning to seasonal botanical arrangements"
    }
  ]
}`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const parsed = JSON.parse(text);
      return AICopilotResponseSchema.parse(parsed);
    } catch (err) {
      console.warn("Gemini Copilot API call error, using deterministic response:", err);
    }
  }

  // Deterministic Context-Aware Copilot
  return generateDeterministicCopilotResponse({
    userMessage,
    event,
    categories,
    expenses,
    tasks,
  });
}

function generateDeterministicPlan({
  eventType,
  title,
  eventDate,
  location,
  guestCount,
  budget,
  currency,
}: {
  eventType: string;
  title: string;
  eventDate: string;
  location: string;
  guestCount: number;
  budget: number;
  currency: string;
}): AIEventPlan {
  // Balanced allocation percentages based on event type
  let ratios: { category: string; pct: number; color: string }[] = [];

  if (eventType === "wedding") {
    ratios = [
      { category: "Venue", pct: 35, color: "#28523D" },
      { category: "Catering", pct: 25, color: "#FAF7F1" },
      { category: "Decor", pct: 15, color: "#9DAE91" },
      { category: "Photography", pct: 10, color: "#C6A56B" },
      { category: "Entertainment", pct: 7, color: "#4A6B53" },
      { category: "Other", pct: 8, color: "#D8E2D2" },
    ];
  } else if (eventType === "birthday") {
    ratios = [
      { category: "Venue & Rooftop", pct: 30, color: "#28523D" },
      { category: "Food & Cocktails", pct: 35, color: "#FAF7F1" },
      { category: "Music & DJ", pct: 15, color: "#C6A56B" },
      { category: "Decor & Lighting", pct: 12, color: "#9DAE91" },
      { category: "Photography", pct: 8, color: "#4A6B53" },
    ];
  } else {
    // Community or corporate
    ratios = [
      { category: "Venue & Facilities", pct: 40, color: "#28523D" },
      { category: "Catering & Refreshments", pct: 25, color: "#FAF7F1" },
      { category: "AV & Production", pct: 20, color: "#C6A56B" },
      { category: "Signage & Materials", pct: 10, color: "#9DAE91" },
      { category: "Contingency", pct: 5, color: "#D8E2D2" },
    ];
  }

  // Exact budget calculation ensuring 100% total reconciliation
  let allocatedSoFar = 0;
  const budgetAllocations = ratios.map((r, i) => {
    let amount = Math.round((budget * r.pct) / 100);
    if (i === ratios.length - 1) {
      amount = budget - allocatedSoFar; // reconcile rounding difference
    } else {
      allocatedSoFar += amount;
    }
    return {
      category: r.category,
      amount,
      percentage: r.pct,
      color: r.color,
    };
  });

  return {
    concept: `An impeccably orchestrated ${eventType} celebration for ${guestCount} guests in ${location}, blending contemporary luxury with timeless hospitality.`,
    themeName: "Royal Garden Elegance",
    styleDescription: "Classic • Romantic • Regal",
    colorPalette: ["#173B2D", "#9DAE91", "#C6A56B", "#F3D5C5", "#FAF7F1"],
    budgetAllocations,
    timelineMilestones: [
      {
        title: "Finalize venue contract & lock event date",
        dueDate: "2025-01-15",
        category: "Venue",
        priority: "critical",
      },
      {
        title: "Curate tasting menu and sign master caterer",
        dueDate: "2025-02-01",
        category: "Catering",
        priority: "high",
      },
      {
        title: "Complete floral and illumination moodboard",
        dueDate: "2025-02-20",
        category: "Decor",
        priority: "high",
      },
      {
        title: "Dispatch bespoke printed invitations & RSVP portal",
        dueDate: "2025-03-05",
        category: "Guests",
        priority: "medium",
      },
      {
        title: "Conduct technical walkthrough and soundcheck",
        dueDate: "2025-04-10",
        category: "Coordination",
        priority: "high",
      },
    ],
    recommendedVendors: [
      { category: "Venue", estimatedCost: budgetAllocations[0].amount, serviceScope: "Heritage grounds, banquet lawn, and bridal suites." },
      { category: "Catering", estimatedCost: budgetAllocations[1].amount, serviceScope: "Bespoke multi-course regional & continental feast." },
      { category: "Decor", estimatedCost: budgetAllocations[2].amount, serviceScope: "Signature floral mandap, ambient candle fixtures, and entryway arch." },
    ],
    dayOfSchedule: [
      { time: "16:00", activity: "Vendor load-in & floral styling inspection" },
      { time: "17:30", activity: "Musicians soundcheck & lantern illumination" },
      { time: "18:30", activity: "Guest arrivals & welcome cocktail reception" },
      { time: "19:45", activity: "Grand entrance & keynote ceremonial moments" },
      { time: "20:30", activity: "Dinner feast & live performances" },
    ],
    costSavingTips: [
      "Select locally harvested seasonal blooms instead of imported florals to save up to 25% on decor.",
      "Consolidate sound and lighting equipment under a single AV vendor for package discounts.",
      "Lock catering headcounts 14 days prior to prevent surplus preparation charges.",
    ],
    potentialRisks: [
      "Weather contingency: ensure the venue provides covered canopy options for open-air spaces.",
      "Vendor delivery overlaps: schedule staggered arrival times to prevent logistics bottleneck.",
    ],
  };
}

function generateDeterministicCopilotResponse({
  userMessage,
  event,
  categories,
  expenses,
  tasks,
}: {
  userMessage: string;
  event: Event;
  categories: BudgetCategory[];
  expenses: Expense[];
  tasks: Task[];
}): AICopilotResponse {
  const lower = userMessage.toLowerCase();

  // Scenario 1: Budget reduction or decor savings
  if (lower.includes("decor") || lower.includes("save") || lower.includes("budget") || lower.includes("reduce")) {
    const decorCat = categories.find((c) => c.name.toLowerCase().includes("decor"));
    const decorAmount = decorCat?.allocatedAmount || 420000;
    const savings = Math.min(120000, Math.round(decorAmount * 0.28));
    const newAmount = decorAmount - savings;

    return {
      content: `By partnering with local artisan florists in ${event.location} and utilizing seasonal marigolds, tuberoses, and brass candelabras, you can achieve an identical luxury royal aesthetic while saving approximately ₹${savings.toLocaleString("en-IN")}.`,
      suggestionTitle: `You can save ~₹${savings.toLocaleString("en-IN")} on decor`,
      proposedModifications: [
        {
          categoryName: decorCat ? decorCat.name : "Decor",
          fromAmount: decorAmount,
          toAmount: newAmount,
          reason: `Optimized seasonal floral arrangements and local heritage craft in ${event.location}.`,
        },
      ],
    };
  }

  // Scenario 2: Upcoming deadlines or tasks
  if (lower.includes("deadline") || lower.includes("task") || lower.includes("week") || lower.includes("todo")) {
    const pending = tasks.filter((t) => t.status !== "completed");
    return {
      content: `You currently have ${pending.length} pending planning tasks. Your highest priority item is "${pending[0]?.title || "Finalize vendor confirmations"}" due on ${pending[0]?.dueDate || "soon"}. I recommend locking this down first to keep the overall schedule on track.`,
      suggestionTitle: "Upcoming Milestone Focus",
    };
  }

  // Scenario 3: General ideas / themes
  return {
    content: `For "${event.title}" in ${event.location}, blending the venue's natural architecture with warm champagne lighting and lush floral accents produces the highest guest satisfaction score while maximizing budget efficiency.`,
    suggestionTitle: "Curated Event Recommendation",
  };
}
