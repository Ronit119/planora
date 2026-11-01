import fs from "fs";
import path from "path";
import {
  Event,
  BudgetCategory,
  Expense,
  Vendor,
  Task,
  Guest,
  ThemeInspiration,
  AppNotification,
  UserProfile,
  AICopilotMessage,
} from "../types";
import {
  DEFAULT_USER_PROFILE,
  SEED_THEMES,
  SHOWCASE_EVENT,
  OTHER_EVENTS,
  SHOWCASE_BUDGET_CATEGORIES,
  SHOWCASE_EXPENSES,
  SHOWCASE_VENDORS,
  SHOWCASE_TASKS,
  SHOWCASE_GUESTS,
  SHOWCASE_NOTIFICATIONS,
} from "./seed";
import { calculateReadinessScore } from "../readiness";

interface PlanoraStoreData {
  profile: UserProfile;
  events: Event[];
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  vendors: Vendor[];
  tasks: Task[];
  guests: Guest[];
  themes: ThemeInspiration[];
  notifications: AppNotification[];
  aiMessages: AICopilotMessage[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "planora-store.json");

function getDefaultStore(): PlanoraStoreData {
  return {
    profile: { ...DEFAULT_USER_PROFILE },
    events: [SHOWCASE_EVENT, ...OTHER_EVENTS],
    budgetCategories: [...SHOWCASE_BUDGET_CATEGORIES],
    expenses: [...SHOWCASE_EXPENSES],
    vendors: [...SHOWCASE_VENDORS],
    tasks: [...SHOWCASE_TASKS],
    guests: [...SHOWCASE_GUESTS],
    themes: [...SEED_THEMES],
    notifications: [...SHOWCASE_NOTIFICATIONS],
    aiMessages: [
      {
        id: "msg-showcase-ai",
        eventId: SHOWCASE_EVENT.id,
        role: "assistant",
        content: "Consider seasonal florals and local artisans in Udaipur for a similar luxury look at a lower cost.",
        suggestionTitle: "You can save ~₹1,20,000 on decor",
        proposedModifications: [
          {
            categoryName: "Decor",
            fromAmount: 420000,
            toAmount: 300000,
            reason: "Source indigenous seasonal marigolds, tuberoses, and local Rajasthani brasswork.",
          },
        ],
        isApplied: false,
        createdAt: "2025-02-01T12:00:00Z",
      },
    ],
  };
}

class PlanoraRepository {
  private data: PlanoraStoreData;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): PlanoraStoreData {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.events)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Could not read local store, initializing defaults", err);
    }

    const initial = getDefaultStore();
    this.saveToDisk(initial);
    return initial;
  }

  private saveToDisk(data: PlanoraStoreData) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tmpFile = `${STORE_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
      fs.renameSync(tmpFile, STORE_FILE);
    } catch (err) {
      console.error("Failed to write planora store to disk:", err);
    }
  }

  private sync() {
    this.saveToDisk(this.data);
  }

  // --- Profile ---
  getProfile(): UserProfile {
    return { ...this.data.profile };
  }

  updateProfile(partial: Partial<UserProfile>): UserProfile {
    this.data.profile = {
      ...this.data.profile,
      ...partial,
    };
    this.sync();
    return { ...this.data.profile };
  }

  // --- Events ---
  getEvents(): Event[] {
    return [...this.data.events];
  }

  getEvent(id: string): Event | undefined {
    return this.data.events.find((e) => e.id === id);
  }

  createEvent(event: Omit<Event, "id" | "createdAt" | "updatedAt"> & { id?: string }): Event {
    const id = event.id || `event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const newEvent: Event = {
      ...event,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.data.events.unshift(newEvent);
    this.data.profile.createdEventsCount = this.data.events.length;
    this.sync();
    return newEvent;
  }

  updateEvent(id: string, partial: Partial<Event>): Event | undefined {
    const index = this.data.events.findIndex((e) => e.id === id);
    if (index === -1) return undefined;

    this.data.events[index] = {
      ...this.data.events[index],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    this.sync();
    return { ...this.data.events[index] };
  }

  deleteEvent(id: string): boolean {
    const index = this.data.events.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.data.events.splice(index, 1);
    this.data.budgetCategories = this.data.budgetCategories.filter((b) => b.eventId !== id);
    this.data.expenses = this.data.expenses.filter((e) => e.eventId !== id);
    this.data.vendors = this.data.vendors.filter((v) => v.eventId !== id);
    this.data.tasks = this.data.tasks.filter((t) => t.eventId !== id);
    this.data.guests = this.data.guests.filter((g) => g.eventId !== id);
    this.data.aiMessages = this.data.aiMessages.filter((m) => m.eventId !== id);
    this.data.profile.createdEventsCount = this.data.events.length;
    this.sync();
    return true;
  }

  // --- Budget Categories ---
  getBudgetCategories(eventId: string): BudgetCategory[] {
    return this.data.budgetCategories.filter((b) => b.eventId === eventId);
  }

  createBudgetCategory(cat: Omit<BudgetCategory, "id" | "createdAt">): BudgetCategory {
    const id = `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCat: BudgetCategory = {
      ...cat,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.budgetCategories.push(newCat);
    this.recalculateCategoryPercentages(cat.eventId);
    this.sync();
    return newCat;
  }

  updateBudgetCategory(id: string, partial: Partial<BudgetCategory>): BudgetCategory | undefined {
    const index = this.data.budgetCategories.findIndex((b) => b.id === id);
    if (index === -1) return undefined;

    this.data.budgetCategories[index] = {
      ...this.data.budgetCategories[index],
      ...partial,
    };
    this.recalculateCategoryPercentages(this.data.budgetCategories[index].eventId);
    this.sync();
    return { ...this.data.budgetCategories[index] };
  }

  deleteBudgetCategory(id: string): boolean {
    const cat = this.data.budgetCategories.find((b) => b.id === id);
    if (!cat) return false;

    const eventId = cat.eventId;
    this.data.budgetCategories = this.data.budgetCategories.filter((b) => b.id !== id);
    // Dissociate expenses linked to this category
    this.data.expenses = this.data.expenses.map((e) =>
      e.categoryId === id ? { ...e, categoryId: "" } : e
    );
    this.recalculateCategoryPercentages(eventId);
    this.sync();
    return true;
  }

  private recalculateCategoryPercentages(eventId: string) {
    const event = this.getEvent(eventId);
    const cats = this.data.budgetCategories.filter((b) => b.eventId === eventId);
    const totalBudget = event?.budget || cats.reduce((s, c) => s + c.allocatedAmount, 0) || 1;

    for (const c of cats) {
      c.percentage = Math.round((c.allocatedAmount / totalBudget) * 100);
    }
  }

  // --- Expenses ---
  getExpenses(eventId: string): Expense[] {
    return this.data.expenses.filter((e) => e.eventId === eventId);
  }

  createExpense(expense: Omit<Expense, "id" | "createdAt">): Expense {
    const id = `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newExp: Expense = {
      ...expense,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.expenses.unshift(newExp);
    this.sync();
    return newExp;
  }

  updateExpense(id: string, partial: Partial<Expense>): Expense | undefined {
    const index = this.data.expenses.findIndex((e) => e.id === id);
    if (index === -1) return undefined;

    this.data.expenses[index] = {
      ...this.data.expenses[index],
      ...partial,
    };
    this.sync();
    return { ...this.data.expenses[index] };
  }

  deleteExpense(id: string): boolean {
    const index = this.data.expenses.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.data.expenses.splice(index, 1);
    this.sync();
    return true;
  }

  // --- Vendors ---
  getVendors(eventId: string): Vendor[] {
    return this.data.vendors.filter((v) => v.eventId === eventId);
  }

  createVendor(vendor: Omit<Vendor, "id" | "createdAt">): Vendor {
    const id = `vendor-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newVendor: Vendor = {
      ...vendor,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.vendors.push(newVendor);
    this.sync();
    return newVendor;
  }

  updateVendor(id: string, partial: Partial<Vendor>): Vendor | undefined {
    const index = this.data.vendors.findIndex((v) => v.id === id);
    if (index === -1) return undefined;

    this.data.vendors[index] = {
      ...this.data.vendors[index],
      ...partial,
    };
    this.sync();
    return { ...this.data.vendors[index] };
  }

  deleteVendor(id: string): boolean {
    const index = this.data.vendors.findIndex((v) => v.id === id);
    if (index === -1) return false;

    this.data.vendors.splice(index, 1);
    this.sync();
    return true;
  }

  // --- Tasks ---
  getTasks(eventId: string): Task[] {
    return this.data.tasks.filter((t) => t.eventId === eventId);
  }

  createTask(task: Omit<Task, "id" | "createdAt">): Task {
    const id = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newTask: Task = {
      ...task,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.tasks.push(newTask);
    this.sync();
    return newTask;
  }

  updateTask(id: string, partial: Partial<Task>): Task | undefined {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return undefined;

    if (partial.status === "completed" && !this.data.tasks[index].completedAt) {
      partial.completedAt = new Date().toISOString();
    } else if (partial.status && partial.status !== "completed") {
      partial.completedAt = undefined;
    }

    this.data.tasks[index] = {
      ...this.data.tasks[index],
      ...partial,
    };
    this.sync();
    return { ...this.data.tasks[index] };
  }

  deleteTask(id: string): boolean {
    const index = this.data.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.data.tasks.splice(index, 1);
    this.sync();
    return true;
  }

  // --- Guests ---
  getGuests(eventId: string): Guest[] {
    return this.data.guests.filter((g) => g.eventId === eventId);
  }

  createGuest(guest: Omit<Guest, "id" | "createdAt">): Guest {
    const id = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newGuest: Guest = {
      ...guest,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.guests.push(newGuest);
    this.sync();
    return newGuest;
  }

  updateGuest(id: string, partial: Partial<Guest>): Guest | undefined {
    const index = this.data.guests.findIndex((g) => g.id === id);
    if (index === -1) return undefined;

    this.data.guests[index] = {
      ...this.data.guests[index],
      ...partial,
    };
    this.sync();
    return { ...this.data.guests[index] };
  }

  deleteGuest(id: string): boolean {
    const index = this.data.guests.findIndex((g) => g.id === id);
    if (index === -1) return false;

    this.data.guests.splice(index, 1);
    this.sync();
    return true;
  }

  // --- Themes ---
  getThemes(): ThemeInspiration[] {
    return [...this.data.themes];
  }

  getTheme(id: string): ThemeInspiration | undefined {
    return this.data.themes.find((t) => t.id === id);
  }

  // --- Notifications ---
  getNotifications(): AppNotification[] {
    return [...this.data.notifications];
  }

  markNotificationRead(id: string): boolean {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (!notif) return false;
    notif.isRead = true;
    this.sync();
    return true;
  }

  markAllNotificationsRead(): boolean {
    for (const n of this.data.notifications) {
      n.isRead = true;
    }
    this.sync();
    return true;
  }

  createNotification(notif: Omit<AppNotification, "id" | "createdAt">): AppNotification {
    const id = `notif-${Date.now()}`;
    const newNotif: AppNotification = {
      ...notif,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    this.sync();
    return newNotif;
  }

  // --- AI Messages & Copilot ---
  getAIMessages(eventId: string): AICopilotMessage[] {
    return this.data.aiMessages.filter((m) => m.eventId === eventId);
  }

  createAIMessage(msg: Omit<AICopilotMessage, "id" | "createdAt">): AICopilotMessage {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newMsg: AICopilotMessage = {
      ...msg,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.aiMessages.push(newMsg);
    this.sync();
    return newMsg;
  }

  applyAIMessageProposal(messageId: string): { success: boolean; message: string } {
    const msg = this.data.aiMessages.find((m) => m.id === messageId);
    if (!msg || !msg.proposedModifications || msg.proposedModifications.length === 0) {
      return { success: false, message: "No proposed modifications found." };
    }
    if (msg.isApplied) {
      return { success: false, message: "This proposal has already been applied." };
    }

    const eventId = msg.eventId;
    for (const mod of msg.proposedModifications) {
      const cat = this.data.budgetCategories.find(
        (c) => c.eventId === eventId && c.name.toLowerCase() === mod.categoryName.toLowerCase()
      );
      if (cat) {
        cat.allocatedAmount = mod.toAmount;
      } else {
        // Create new category if not found
        this.createBudgetCategory({
          eventId,
          name: mod.categoryName,
          allocatedAmount: mod.toAmount,
          color: "#28523D",
        });
      }
    }

    this.recalculateCategoryPercentages(eventId);
    msg.isApplied = true;
    this.sync();
    return { success: true, message: "Budget adjustments successfully applied." };
  }

  // --- Aggregated Event Overview ---
  getEventOverview(eventId: string) {
    const event = this.getEvent(eventId);
    if (!event) return null;

    const categories = this.getBudgetCategories(eventId);
    const expenses = this.getExpenses(eventId);
    const vendors = this.getVendors(eventId);
    const tasks = this.getTasks(eventId);
    const guests = this.getGuests(eventId);
    const selectedTheme = event.selectedThemeId
      ? this.getTheme(event.selectedThemeId) || this.getThemes()[0]
      : this.getThemes()[0];

    const plannedBudget = event.budget;
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const remainingBudget = plannedBudget - totalExpenses;
    const remainingPercentage = plannedBudget > 0 ? ((remainingBudget / plannedBudget) * 100).toFixed(1) : "0";

    const readiness = calculateReadinessScore({
      tasks,
      vendors,
      budget: plannedBudget,
      categories,
      expenses,
      guests,
    });

    return {
      event,
      categories,
      expenses,
      vendors,
      tasks,
      guests,
      selectedTheme,
      metrics: {
        totalEvents: this.data.events.length,
        ongoingEvents: this.data.events.filter((e) => e.status === "planning").length,
        upcomingEvents: this.data.events.filter((e) => e.status === "confirmed" || e.status === "draft").length,
        plannedBudget,
        totalExpenses,
        remainingBudget,
        remainingPercentage,
        readinessScore: readiness.score,
        readinessBreakdown: readiness,
      },
    };
  }

  resetToDemoSeed() {
    this.data = getDefaultStore();
    this.sync();
    return true;
  }
}

// Global Singleton
const globalForRepo = globalThis as unknown as { planoraRepo: PlanoraRepository | undefined };

export const repository = globalForRepo.planoraRepo ?? new PlanoraRepository();

if (process.env.NODE_ENV !== "production") {
  globalForRepo.planoraRepo = repository;
}
