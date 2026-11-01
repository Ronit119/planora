"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  CheckSquare,
  Plus,
  Search,
  Check,
  Trash2,
  Calendar,
  AlertCircle,
  X,
  Flag,
} from "lucide-react";
import { Event, Task, TaskStatus, TaskPriority, UserProfile, AppNotification, ThemeInspiration } from "@/lib/types";

interface TaskManagerClientProps {
  event: Event;
  tasks: Task[];
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
}

export function TaskManagerClient({
  event,
  tasks: initialTasks,
  profile,
  events,
  notifications,
  themes,
}: TaskManagerClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("2025-03-01");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [isMilestone, setIsMilestone] = useState(false);
  const [notes, setNotes] = useState("");

  const refreshTasks = async () => {
    try {
      const res = await fetch(`/api/events/${event.id}/tasks`);
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: TaskStatus) => {
    const newStatus: TaskStatus = currentStatus === "completed" ? "not_started" : "completed";
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await fetch(`/api/events/${event.id}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      refreshTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const res = await fetch(`/api/events/${event.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          dueDate,
          priority,
          isMilestone,
          status: "not_started",
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setTitle("");
        setNotes("");
        setIsMilestone(false);
        refreshTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Delete this planning task?")) {
      try {
        await fetch(`/api/events/${event.id}/tasks?taskId=${taskId}`, {
          method: "DELETE",
        });
        refreshTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchesQuery && matchesStatus && matchesPriority;
  });

  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <AppShell
      currentEventId={event.id}
      profile={profile}
      events={events}
      notifications={notifications}
      themes={themes}
      eventTitle={event.title}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3D8]">
          <div>
            <h1 className="font-serif text-3xl text-[#1C2921] font-normal">
              Planning Checklist & Milestones
            </h1>
            <p className="font-serif italic text-sm text-[#72756D] mt-1">
              {completedCount} of {tasks.length} tasks completed for {event.title}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#72756D]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E9E3D8] bg-[#FAF7F1] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E9E3D8] bg-[#FAF7F1] focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Task List Table */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-card">
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-[#72756D] text-sm">
                No tasks match your search filters.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isDone = task.status === "completed";

                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isDone
                        ? "bg-[#FAF7F1]/60 border-[#E9E3D8]/60"
                        : "bg-[#FFFDF9] border-[#E9E3D8] hover:border-[#C6A56B]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={() => handleToggleTask(task.id, task.status)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 ${
                          isDone
                            ? "bg-[#28523D] border-[#28523D] text-white"
                            : "border-[#C6A56B] bg-white hover:border-[#173B2D]"
                        }`}
                        aria-label={`Toggle task ${task.title}`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[2.5]" />}
                      </button>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-medium leading-snug truncate ${
                              isDone ? "line-through text-[#72756D]" : "text-[#1C2921]"
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.isMilestone && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E5D4B5]/60 text-[#173B2D]">
                              Milestone
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#72756D] mt-1">
                          <span>{task.category || "General"}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#C6A56B]" /> Due {task.dueDate}
                          </span>
                          {task.notes && (
                            <>
                              <span>•</span>
                              <span className="italic truncate max-w-xs">{task.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          task.priority === "critical"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "high"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-[#E8F1E5] text-[#28523D]"
                        }`}
                      >
                        {task.priority}
                      </span>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-[#72756D] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create Task */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-dropdown">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
              <h3 className="font-serif text-lg text-[#1C2921]">Create Planning Task</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-[#72756D]" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule bridal hair & makeup trial"
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Decor, Catering, Attire"
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="milestone"
                  checked={isMilestone}
                  onChange={(e) => setIsMilestone(e.target.checked)}
                  className="rounded border-[#E9E3D8] text-[#173B2D]"
                />
                <label htmlFor="milestone" className="text-[#1C2921] font-medium cursor-pointer">
                  Mark as key planning milestone (shown on dashboard)
                </label>
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional context or vendor references..."
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E3D8]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E9E3D8] text-[#1C2921]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B2D] text-white font-medium"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
