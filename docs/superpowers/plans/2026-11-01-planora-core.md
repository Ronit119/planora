# Planora — Production Architecture & Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build PLANORA by Ronit Dhawan — a world-class, production-ready, fully functional AI event planning platform with exact visual fidelity to the luxury design reference, real Supabase PostgreSQL schema, official Google Gemini AI integration, persistent budget/vendor/task/guest management, context-aware AI Copilot, deterministic readiness scoring, and automated Playwright E2E verification.

**Architecture:** Next.js App Router (TypeScript, Tailwind CSS, shadcn/ui, Recharts) with hybrid resilient data architecture: connects directly to Supabase with PostgreSQL RLS migrations when configured, with a durable local filesystem persistence engine (`.data/planora-store.json`) ensuring full zero-dependency offline persistence, immediate page-refresh survival, and seamless developer onboarding. Server-side Gemini AI integration with `@google/genai` structured outputs, Zod validation, and contextual budget diff proposals.

**Tech Stack:** Next.js 15+ (App Router), React 19, TypeScript (strict), Tailwind CSS 3.4+, Lucide Icons, Recharts, Zod, React Hook Form, @google/genai, @supabase/ssr, @supabase/supabase-js, Vitest, Playwright.

---

## Global Constraints
- Target visual fidelity: exact match to `Planora_Design_Reference_Ronit_Dhawan.png`.
- Color tokens: Primary deep green `#173B2D`, Secondary forest green `#28523D`, Warm ivory `#FAF7F1`, Champagne gold `#C6A56B`, Sage green `#9DAE91`, Dark text `#1C2921`, Muted text `#72756D`, White card surface `#FFFDF9`, Border `#E9E3D8`.
- Typography: Fraunces (editorial serif headings), Inter / DM Sans (modern UI sans).
- Zero ghost buttons: every button, menu, dialog, and control must be functional or clearly informational.
- Financial integrity: precise currency formatting (INR `₹15,00,000`, USD, EUR, GBP), money-safe integer/decimal calculations, no cross-currency additions without conversion.
- Persistence: all changes persist across reloads, navigation, and re-login.

---

## Task Decomposition

### Phase 1: Project Scaffolding & Design Foundation
- [ ] Initialize Next.js 15+ project with TypeScript, Tailwind CSS, ESLint, Lucide Icons, and configure fonts (`Fraunces` and `Inter`).
- [ ] Configure Tailwind theme tokens matching Planora design specifications (colors, shadows, radii, fonts).
- [ ] Install dependencies: `lucide-react`, `recharts`, `zod`, `clsx`, `tailwind-merge`, `@google/genai`, `@supabase/supabase-js`, `@supabase/ssr`, `canvas-confetti`, `jspdf`, `html2canvas`.
- [ ] Curate and place high-fidelity visual assets in `/public/images/`:
  - Featured event hero mandap banner (`hero-wedding.jpg`)
  - Palace lakeside sunset arch illustration (`sidebar-arch.jpg`)
  - Vendor avatars & venues (`venue-courtyard.jpg`, `catering-saffron.jpg`, `decor-bloom.jpg`, `photo-lenscraft.jpg`)
  - Theme inspiration moodboard photos (`theme-1.jpg`, `theme-2.jpg`, `theme-3.jpg`, `theme-4.jpg`)
  - User avatar (`ronit-avatar.jpg` / fallback initials)
  - Planora golden leaf SVG logo.

### Phase 2: Design Tokens & Layout App Shell
- [ ] Build `Sidebar` component matching exact reference:
  - Planora leaf logo + serif brand typography
  - Navigation items with active state pill (champagne gold background `#C6A56B`)
  - Bottom arch window featuring palace lake twilight illustration + "Plan, Organize, Celebrate with Planora" tagline.
  - Mobile responsive drawer toggle.
- [ ] Build `TopNavBar` component:
  - Global search pill with shortcut badge `⌘ K`
  - Notification bell with unread indicator dot & functional dropdown
  - User profile avatar, "Ronit Dhawan" display name, dropdown menu with profile links & logout.
- [ ] Build `GlobalSearchModal` with quick navigation to events, tasks, vendors, and ideas.
- [ ] Build `NotificationDrawer` with real unread counts, mark-as-read, and navigation to relevant items.

### Phase 3: Resilient Data Layer & Supabase Schema
- [ ] Create PostgreSQL schema migrations in `supabase/migrations/20261101000000_planora_schema.sql`:
  - `profiles`, `events`, `event_preferences`, `event_plan_versions`, `budget_categories`, `expenses`, `vendors`, `tasks`, `event_schedule_items`, `guests`, `themes`, `event_selected_themes`, `ai_conversations`, `ai_messages`, `notifications`, `audit_events`.
  - Check constraints, foreign keys with CASCADE, indexes, and Row Level Security (RLS) policies.
- [ ] Build typed data repository (`src/lib/db/`):
  - Repository interface for all entities.
  - Supabase client provider (`@supabase/ssr` / server & browser clients).
  - Durable local disk persistence provider (`.data/planora-store.json`) with atomic writes, ensuring 100% offline capability and zero-friction developer setup.
  - Demo seed generator providing the exact showcase state seen in the design reference (opt-in or initial demo state).

### Phase 4: Exact Dashboard Recreation
- [ ] Implement Welcome Banner:
  - "Welcome back, Ronit Dhawan" (Fraunces serif) + "Your events, budgets and plans — all in one place."
- [ ] Implement Featured Event Hero Card:
  - Opulent floral mandap banner, "FEATURED EVENT" badge, "Our Wedding Celebration", date, location, guest count, description.
  - "View Event →" and "Edit Plan" buttons.
- [ ] Implement 5 Metric Cards:
  - Total Events, Planned Budget, Total Expenses, Remaining Budget (with `% left` pill), Readiness Score (with progress bar).
- [ ] Implement Budget Overview Card (Forest green panel):
  - Custom SVG / Recharts Donut chart with total in center.
  - Category breakdown with percentages and formatted amounts.
  - "View Details →" link.
- [ ] Implement Planning Timeline Card:
  - Vertical milestone progress with completed (green check), in-progress (gold ring + badge), and upcoming (dashed circle) states.
  - "View Timeline →" link.
- [ ] Implement Vendor Checklist Card:
  - Vendor rows with photos, category, booking status pill (Booked, Contacted, Shortlisted), three-dot action dropdown.
  - "Manage Vendors →" link.
- [ ] Implement Theme Inspiration Card:
  - 4-photo moodboard collage.
  - 5-color palette swatches.
  - "Royal Garden Elegance" • "Classic • Romantic • Regal".
  - Interactive carousel arrow button cycling themes.
- [ ] Implement AI Copilot Card:
  - Forest green gradient container, "Powered by Planora AI" badge.
  - "You can save ~₹1,20,000 on decor" suggestion.
  - "Explore Alternatives →" and "More Suggestions" buttons.
- [ ] Implement Upcoming Deadlines Card:
  - Interactive task checkboxes, due dates, countdown pills ("5 days left", etc.).
  - "View All →" link.

### Phase 5: Event Creation Wizard (5-Step)
- [ ] Build multi-step wizard at `/events/new`:
  - Step 1: Event Type (Wedding, Birthday, Community).
  - Step 2: Basic Information (Name, Date, Location, Timezone, Guests).
  - Step 3: Financial Planning (Budget, Currency, Flexibility, Priorities).
  - Step 4: Personalization (Themes, Dining, Cultural specifics, Dietary, Special instructions).
  - Step 5: AI Review & Generation.
- [ ] Step validation with Zod, form state preservation, draft saving.
- [ ] AI plan generation triggering with live progress indicator and structured output display.

### Phase 6: Subsystems (Budget, Vendors, Tasks, Timeline, Guests, Themes, Settings)
- [ ] Budget Manager (`/events/[id]/budget`):
  - Add/Edit/Delete Category allocations.
  - Add/Edit/Delete Expense records with payment status and dates.
  - Dynamic allocation donut chart and actual-vs-planned bar chart.
  - Over-budget alerts and money-safe currency formatting.
- [ ] Vendor Manager (`/events/[id]/vendors`):
  - Full CRUD, category filters, booking status badges, payment tracking, contact details.
- [ ] Tasks & Timeline (`/events/[id]/tasks` & `/events/[id]/timeline`):
  - Task list with search, filter by status/priority/category, inline completion toggle.
  - Vertical timeline and day-of itinerary schedule.
- [ ] Guest Management (`/events/[id]/guests`):
  - Guest CRUD, RSVP tracking, dietary preferences, plus-one counts, summary cards.
  - CSV export and CSV import with schema validation.
- [ ] Theme Inspiration (`/events/[id]/ideas`):
  - Curated luxury themes with high-res imagery and palette swatches.
  - One-click "Apply Theme to Event".
- [ ] Account Settings (`/settings`):
  - Profile editing (Name, avatar, default currency, timezone), database & AI connection diagnostics, demo data reset.

### Phase 7: Gemini AI Engine & Contextual Copilot
- [ ] Server-side AI service using `@google/genai`:
  - Structured output schemas with Zod validation.
  - Event plan generation with concepts, budget allocations, timeline milestones, and vendor checklists.
  - Context-aware AI Copilot: takes full event context (budget, expenses, vendors, tasks), answers questions, and generates structured modification proposals.
- [ ] Interactive Copilot UI (`/events/[id]/copilot` and floating widget):
  - Displays proposed budget adjustments (e.g., "Reduce Decor by ₹30,000, Increase Catering by ₹30,000").
  - "Apply Changes" and "Cancel" controls.
  - Server-side atomic execution of confirmed proposals.

### Phase 8: Exports, Readiness Scoring & Polish
- [ ] Deterministic Readiness Scoring Engine:
  - Transparent formula: Tasks (35%), Vendors (25%), Budget (20%), Guests (10%), Schedule (10%).
  - Readiness breakdown modal on metric card click.
- [ ] Reports & Exports:
  - Printable/PDF Event Overview and Budget Report.
  - Task checklist PDF and Guest list CSV.
- [ ] Public Landing Page (`/`):
  - Editorial hero, feature showcase, category highlights, live interactive preview CTA.
- [ ] Authentication flows (`/login`, `/signup`, `/forgot-password`).

### Phase 9: Automated Testing & Verification
- [ ] Unit tests (Vitest) for financial calculations, readiness score, and validation.
- [ ] Playwright E2E browser test executing the complete 36-step Ronit acceptance journey.
- [ ] Zero-ghost-button interactive audit.
- [ ] Production build (`npm run build`) verification and environment template (`.env.example`).
