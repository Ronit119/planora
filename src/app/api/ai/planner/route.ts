import { NextResponse } from "next/server";
import { generateAIEventPlan } from "@/lib/ai/gemini";
import { repository } from "@/lib/db/repository";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      eventType,
      eventDate,
      location,
      guestCount,
      budget,
      currency = "INR",
      saveToDatabase = true,
      personalization,
    } = body;

    if (!title || !eventType || !eventDate || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required event fields" },
        { status: 400 }
      );
    }

    const aiPlan = await generateAIEventPlan({
      title,
      eventType,
      eventDate,
      location,
      guestCount: Number(guestCount) || 100,
      budget: Number(budget) || 1000000,
      currency,
      personalization,
    });

    if (!saveToDatabase) {
      return NextResponse.json({ success: true, data: { plan: aiPlan } });
    }

    // Persist event into repository
    const profile = repository.getProfile();
    const event = repository.createEvent({
      userId: profile.id,
      title,
      eventType,
      eventDate,
      location,
      timezone: "Asia/Kolkata",
      guestCount: Number(guestCount) || 100,
      budget: Number(budget) || 1000000,
      currency,
      description: aiPlan.concept,
      coverImage: "/images/hero-mandap-crop.jpg",
      status: "planning",
      selectedThemeId: "royal-garden-elegance",
    });

    // Populate budget categories
    for (const alloc of aiPlan.budgetAllocations) {
      repository.createBudgetCategory({
        eventId: event.id,
        name: alloc.category,
        allocatedAmount: alloc.amount,
        color: alloc.color || "#28523D",
      });
    }

    // Populate timeline milestones
    for (const milestone of aiPlan.timelineMilestones) {
      repository.createTask({
        eventId: event.id,
        title: milestone.title,
        category: milestone.category,
        dueDate: milestone.dueDate,
        status: "not_started",
        priority: milestone.priority,
        isMilestone: true,
      });
    }

    // Populate recommended vendor placeholders
    for (const vendor of aiPlan.recommendedVendors) {
      repository.createVendor({
        eventId: event.id,
        name: `${vendor.category} Specialist`,
        category: vendor.category as any,
        quotedAmount: vendor.estimatedCost,
        contractAmount: 0,
        advancePaid: 0,
        status: "Shortlisted",
        notes: vendor.serviceScope,
        image: "/images/vendor-royal-courtyard-crop.jpg",
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          event,
          plan: aiPlan,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("AI Planner API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
