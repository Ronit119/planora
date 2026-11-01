import { NextResponse } from "next/server";
import { repository } from "@/lib/db/repository";
import { z } from "zod";

const TaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  category: z.string().default("General"),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["not_started", "in_progress", "completed", "blocked"]).default("not_started"),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  isMilestone: z.boolean().default(false),
  isDayOf: z.boolean().default(false),
  notes: z.string().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tasks = repository.getTasks(id);
    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = TaskSchema.parse(body);

    const task = repository.createTask({
      eventId: id,
      ...validated,
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { taskId, ...updates } = body;
    if (!taskId) {
      return NextResponse.json({ success: false, error: "taskId required" }, { status: 400 });
    }
    const updated = repository.updateTask(taskId, updates);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");
    if (!taskId) {
      return NextResponse.json({ success: false, error: "taskId query required" }, { status: 400 });
    }
    const deleted = repository.deleteTask(taskId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
