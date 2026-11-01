export type EventType = "wedding" | "birthday" | "community" | "corporate" | "other";

export type EventStatus = "draft" | "planning" | "confirmed" | "completed";

export interface Event {
  id: string;
  userId: string;
  title: string;
  eventType: EventType;
  eventDate: string; // ISO date YYYY-MM-DD
  startTime?: string;
  location: string;
  timezone: string;
  guestCount: number;
  budget: number;
  currency: string; // "INR", "USD", "EUR", "GBP"
  description: string;
  coverImage?: string;
  status: EventStatus;
  isFeatured?: boolean;
  selectedThemeId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  eventId: string;
  name: string;
  allocatedAmount: number;
  color: string;
  percentage?: number;
  createdAt: string;
}

export type PaymentStatus = "pending" | "partially_paid" | "paid";

export interface Expense {
  id: string;
  eventId: string;
  categoryId: string;
  categoryName?: string;
  title: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  vendorId?: string;
  notes?: string;
  createdAt: string;
}

export type VendorCategory =
  | "Venue"
  | "Catering"
  | "Decor"
  | "Photography"
  | "Entertainment"
  | "Attire"
  | "Logistics"
  | "Stationery"
  | "Other";

export type VendorStatus =
  | "Researching"
  | "Shortlisted"
  | "Contacted"
  | "Negotiating"
  | "Booked"
  | "Completed"
  | "Cancelled";

export interface Vendor {
  id: string;
  eventId: string;
  name: string;
  category: VendorCategory;
  contactPerson?: string;
  phone?: string;
  email?: string;
  location?: string;
  website?: string;
  quotedAmount: number;
  contractAmount: number;
  advancePaid: number;
  status: VendorStatus;
  image?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

export type TaskStatus = "not_started" | "in_progress" | "completed" | "blocked";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  eventId: string;
  title: string;
  category?: string;
  dueDate: string; // ISO date YYYY-MM-DD
  status: TaskStatus;
  priority: TaskPriority;
  isMilestone?: boolean;
  isDayOf?: boolean;
  notes?: string;
  completedAt?: string;
  createdAt: string;
}

export type RSVPStatus = "attending" | "declined" | "invited" | "awaiting";
export type DietaryPreference =
  | "none"
  | "vegetarian"
  | "vegan"
  | "jain"
  | "halal"
  | "gluten_free"
  | "nut_allergy"
  | "other";

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  groupTag: "family" | "vip" | "friends" | "colleagues" | "other";
  rsvpStatus: RSVPStatus;
  dietaryPreference: DietaryPreference;
  plusOneCount: number;
  tableNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface ThemeInspiration {
  id: string;
  title: string;
  style: string;
  description: string;
  palette: string[]; // hex codes
  images: string[];
  category: EventType | "all";
}

export interface BudgetModificationProposal {
  categoryName: string;
  fromAmount: number;
  toAmount: number;
  reason: string;
}

export interface AICopilotMessage {
  id: string;
  eventId: string;
  role: "user" | "assistant" | "system";
  content: string;
  suggestionTitle?: string;
  proposedModifications?: BudgetModificationProposal[];
  isApplied?: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "deadline" | "budget" | "vendor" | "system";
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  defaultCurrency: string;
  timezone: string;
  createdEventsCount?: number;
}

export interface ReadinessBreakdown {
  score: number; // 0 - 100
  tasksScore: number; // out of 35
  vendorsScore: number; // out of 25
  budgetScore: number; // out of 20
  guestsScore: number; // out of 10
  scheduleScore: number; // out of 10
  details: {
    tasksCompleted: number;
    tasksTotal: number;
    vendorsBooked: number;
    vendorsTotal: number;
    budgetTrackedPercentage: number;
    guestsConfirmed: number;
    guestsTotal: number;
    milestonesPassed: number;
  };
}
