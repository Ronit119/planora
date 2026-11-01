-- ==============================================================================
-- PLANORA DATABASE SCHEMA MIGRATION
-- Project: PLANORA — Smart Event Planning
-- Creator: Ronit Dhawan
-- Description: Complete production schema with RLS, triggers, indexes & constraints
-- ==============================================================================

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL DEFAULT 'Ronit Dhawan',
    avatar_url TEXT,
    default_currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. EVENTS
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('wedding', 'birthday', 'community', 'corporate', 'other')),
    event_date DATE NOT NULL,
    start_time TIME,
    location TEXT NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1),
    budget NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (budget >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    description TEXT,
    cover_image TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'planning' CHECK (status IN ('draft', 'planning', 'confirmed', 'completed')),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    selected_theme_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);

-- 3. EVENT PREFERENCES
CREATE TABLE IF NOT EXISTS public.event_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    theme_preference TEXT,
    dining_style TEXT,
    cultural_traditions TEXT[],
    indoor_outdoor VARCHAR(20) DEFAULT 'mixed',
    special_requirements TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_preferences_event_id ON public.event_preferences(event_id);

-- 4. BUDGET CATEGORIES
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    allocated_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (allocated_amount >= 0),
    color VARCHAR(20) NOT NULL DEFAULT '#28523D',
    percentage NUMERIC(5, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budget_categories_event_id ON public.budget_categories(event_id);

-- 5. EXPENSES
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.budget_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partially_paid', 'paid')),
    payment_date DATE,
    vendor_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON public.expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON public.expenses(category_id);

-- 6. VENDORS
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    location TEXT,
    website TEXT,
    quoted_amount NUMERIC(15, 2) DEFAULT 0.00 CHECK (quoted_amount >= 0),
    contract_amount NUMERIC(15, 2) DEFAULT 0.00 CHECK (contract_amount >= 0),
    advance_paid NUMERIC(15, 2) DEFAULT 0.00 CHECK (advance_paid >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'Shortlisted' CHECK (status IN ('Researching', 'Shortlisted', 'Contacted', 'Negotiating', 'Booked', 'Completed', 'Cancelled')),
    image TEXT,
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_event_id ON public.vendors(event_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(status);

-- 7. TASKS & TIMELINE
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT,
    due_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'blocked')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    is_milestone BOOLEAN NOT NULL DEFAULT FALSE,
    is_day_of BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_to TEXT,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_event_id ON public.tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- 8. GUESTS
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    group_tag VARCHAR(30) NOT NULL DEFAULT 'friends' CHECK (group_tag IN ('family', 'vip', 'friends', 'colleagues', 'other')),
    rsvp_status VARCHAR(30) NOT NULL DEFAULT 'awaiting' CHECK (rsvp_status IN ('attending', 'declined', 'invited', 'awaiting')),
    dietary_preference VARCHAR(30) NOT NULL DEFAULT 'none',
    plus_one_count INTEGER NOT NULL DEFAULT 0 CHECK (plus_one_count >= 0),
    table_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guests_event_id ON public.guests(event_id);

-- 9. THEMES & INSPIRATION
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    style TEXT NOT NULL,
    description TEXT NOT NULL,
    palette TEXT[] NOT NULL,
    images TEXT[] NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'all',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. AI CONVERSATIONS & COPILOT MESSAGES
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    suggestion_title TEXT,
    proposed_modifications JSONB,
    is_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_event_id ON public.ai_messages(event_id);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'system' CHECK (type IN ('deadline', 'budget', 'vendor', 'system')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- 12. AUDIT EVENTS
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-tenant isolation: Users can strictly only read and mutate their own data
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Own user can select & update
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Events: Own user can manage
CREATE POLICY "Users can manage own events" ON public.events
    FOR ALL USING (auth.uid() = user_id);

-- Event Preferences: Inherits event ownership
CREATE POLICY "Users manage event preferences" ON public.event_preferences
    FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_preferences.event_id AND events.user_id = auth.uid()));

-- Budget Categories: Inherits event ownership
CREATE POLICY "Users manage budget categories" ON public.budget_categories
    FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = budget_categories.event_id AND events.user_id = auth.uid()));

-- Expenses: Inherits event ownership
CREATE POLICY "Users manage expenses" ON public.expenses
    FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = expenses.event_id AND events.user_id = auth.uid()));

-- Vendors: Inherits event ownership
CREATE POLICY "Users manage vendors" ON public.vendors
    FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = vendors.event_id AND events.user_id = auth.uid()));

-- Tasks: Inherits event ownership
CREATE POLICY "Users manage tasks" ON public.tasks
    FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = tasks.event_id AND events.user_id = auth.uid()));

-- Guests: Inherits event ownership
CREATE POLICY "Users manage guests" ON public.guests
    FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = guests.event_id AND events.user_id = auth.uid()));

-- Themes: Read-only for authenticated users
CREATE POLICY "Themes are viewable by all" ON public.themes
    FOR SELECT TO authenticated USING (true);

-- AI Messages: Inherits event ownership
CREATE POLICY "Users manage AI messages" ON public.ai_messages
    FOR ALL USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = ai_messages.event_id AND events.user_id = auth.uid()));

-- Notifications: User only
CREATE POLICY "Users manage notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);
