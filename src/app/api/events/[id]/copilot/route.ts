import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { getAICopilotResponse } from "@/lib/ai/gemini";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const messages = repository.getAIMessages(id);
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Valid message required" }, { status: 400 });
    }

    const event = repository.getEvent(id);
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    // Save user message
    repository.createAIMessage({
      eventId: id,
      role: "user",
      content: message,
    });

    const categories = repository.getBudgetCategories(id);
    const expenses = repository.getExpenses(id);
    const vendors = repository.getVendors(id);
    const tasks = repository.getTasks(id);

    // Get AI response
    const aiResponse = await getAICopilotResponse({
      userMessage: message,
      event,
      categories,
      expenses,
      vendors,
      tasks,
    });

    // Save AI response
    const savedAIMessage = repository.createAIMessage({
      eventId: id,
      role: "assistant",
      content: aiResponse.content,
      suggestionTitle: aiResponse.suggestionTitle,
      proposedModifications: aiResponse.proposedModifications,
      isApplied: false,
    });

    return NextResponse.json({ success: true, data: savedAIMessage });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { messageId } = body;
    if (!messageId) {
      return NextResponse.json({ success: false, error: "messageId required" }, { status: 400 });
    }

    const result = repository.applyAIMessageProposal(messageId);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
