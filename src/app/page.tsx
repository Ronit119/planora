import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Heart,
  Cake,
  Users,
  Coins,
  Store,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { PlanoraLogo } from "@/components/ui/PlanoraLogo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#1C2921]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FAF7F1]/90 backdrop-blur-md border-b border-[#E9E3D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <PlanoraLogo />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1C2921]">
            <a href="#features" className="hover:text-[#173B2D] transition-colors">
              Platform
            </a>
            <a href="#categories" className="hover:text-[#173B2D] transition-colors">
              Celebrations
            </a>
            <a href="#how-it-works" className="hover:text-[#173B2D] transition-colors">
              How It Works
            </a>
            <Link href="/dashboard" className="hover:text-[#173B2D] transition-colors">
              Live Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-[#173B2D] hover:bg-[#E9E3D8]/50 rounded-full transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/events/new"
              className="px-5 py-2.5 rounded-full bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-semibold shadow-sm transition-all hover:scale-105"
            >
              Start Planning →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5D4B5]/60 text-[#173B2D] border border-[#C6A56B]/50 text-xs font-semibold mb-6 shadow-xs animate-in fade-in duration-300">
            <Sparkles className="w-4 h-4 text-[#C6A56B]" />
            <span>Smart Event Planning Powered by Google Gemini AI</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#1C2921] font-normal tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Plan beautifully. <br />
            <span className="italic font-light text-[#173B2D]">Celebrate effortlessly.</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#72756D] max-w-2xl mx-auto mt-6 leading-relaxed">
            The intelligent SaaS platform for weddings, milestone soirees, and community galas.
            Reconcile budgets, book verified vendors, and orchestrate run-of-show timelines with AI precision.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/events/new"
              className="px-8 py-4 rounded-full bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-sm font-semibold shadow-card-hover transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Create Your Event</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-full bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] text-[#1C2921] text-sm font-medium shadow-card transition-all hover:bg-[#F4EFEA]"
            >
              Explore Live Showcase
            </Link>
          </div>
        </div>

        {/* Hero Interactive App Preview */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-14">
          <div className="relative rounded-3xl overflow-hidden border border-[#C6A56B]/40 shadow-dropdown bg-[#173B2D] p-3 sm:p-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] max-h-[560px]">
              <Image
                src="/images/hero-wedding-hd.jpg"
                alt="Planora Dashboard Preview"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173B2D]/90 via-[#173B2D]/20 to-transparent flex flex-col justify-end p-6 sm:p-12 text-[#FAF7F1]">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C6A56B] mb-2">
                  Featured Experience
                </span>
                <h3 className="font-serif text-2xl sm:text-4xl">
                  Our Wedding Celebration in Udaipur
                </h3>
                <p className="font-serif italic text-xs sm:text-sm text-[#FAF7F1]/80 max-w-lg mt-2">
                  Live budget reconciliation, 220 guest RSVP concierge, and automated floral procurement.
                </p>
                <div className="mt-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C6A56B] text-[#173B2D] text-xs font-bold shadow-sm hover:bg-white transition-colors"
                  >
                    <span>Launch Live Interactive Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-[#FFFDF9] border-y border-[#E9E3D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C6A56B] font-semibold">
              Versatile Planning Intelligence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C2921] font-normal mt-2">
              Every Celebration Engineered to Perfection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wedding */}
            <div className="p-8 rounded-3xl bg-[#FAF7F1] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E5D4B5]/60 flex items-center justify-center text-[#173B2D] mb-6">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#1C2921] font-medium">Destination Weddings</h3>
                <p className="text-xs sm:text-sm text-[#72756D] mt-3 leading-relaxed">
                  Multi-day ceremony tracking, royal heritage mandap concepts, bespoke live chaat menus, and hotel room blocking.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E9E3D8]">
                <Link
                  href="/events/new"
                  className="text-xs font-semibold text-[#173B2D] flex items-center gap-1 hover:underline"
                >
                  Plan a Wedding <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Birthdays */}
            <div className="p-8 rounded-3xl bg-[#FAF7F1] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E5D4B5]/60 flex items-center justify-center text-[#173B2D] mb-6">
                  <Cake className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#1C2921] font-medium">Milestone Birthdays</h3>
                <p className="text-xs sm:text-sm text-[#72756D] mt-3 leading-relaxed">
                  Rooftop celebrations, bespoke cocktail bars, live jazz & DJ contracts, gourmet pastry tastings, and photo corners.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E9E3D8]">
                <Link
                  href="/events/new"
                  className="text-xs font-semibold text-[#173B2D] flex items-center gap-1 hover:underline"
                >
                  Plan a Birthday <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Community & Galas */}
            <div className="p-8 rounded-3xl bg-[#FAF7F1] border border-[#E9E3D8] hover:border-[#C6A56B] transition-all hover:shadow-card flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#E5D4B5]/60 flex items-center justify-center text-[#173B2D] mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#1C2921] font-medium">Community Galas</h3>
                <p className="text-xs sm:text-sm text-[#72756D] mt-3 leading-relaxed">
                  Auditorium setups, keynote production timelines, corporate sponsorship management, and volunteer logistics.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#E9E3D8]">
                <Link
                  href="/events/new"
                  className="text-xs font-semibold text-[#173B2D] flex items-center gap-1 hover:underline"
                >
                  Plan a Gala <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#C6A56B] font-semibold">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1C2921] font-normal mt-2">
              Engineered for Discerning Hosts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card">
              <Coins className="w-6 h-6 text-[#C6A56B] mb-3" />
              <h4 className="font-serif text-lg font-medium text-[#1C2921]">Precision Financials</h4>
              <p className="text-xs text-[#72756D] mt-2 leading-relaxed">
                Money-safe integer/decimal calculations, Indian number formatting (₹ Lakhs & Crores), and real-time overspend alerts.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card">
              <Sparkles className="w-6 h-6 text-[#C6A56B] mb-3" />
              <h4 className="font-serif text-lg font-medium text-[#1C2921]">Gemini AI Copilot</h4>
              <p className="text-xs text-[#72756D] mt-2 leading-relaxed">
                Contextual AI that analyzes your live contracts and proposes exact mathematical budget reallocation diffs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card">
              <Award className="w-6 h-6 text-[#C6A56B] mb-3" />
              <h4 className="font-serif text-lg font-medium text-[#1C2921]">Readiness Scoring</h4>
              <p className="text-xs text-[#72756D] mt-2 leading-relaxed">
                Transparent 5-dimension deterministic readiness score calculated across tasks, vendors, budget health and RSVPs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card">
              <ShieldCheck className="w-6 h-6 text-[#C6A56B] mb-3" />
              <h4 className="font-serif text-lg font-medium text-[#1C2921]">PostgreSQL & RLS</h4>
              <p className="text-xs text-[#72756D] mt-2 leading-relaxed">
                Tenant isolation, Row Level Security policies, offline file durability, and zero data loss on refreshes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 bg-[#173B2D] text-[#FAF7F1]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
            Ready to plan your masterpiece?
          </h2>
          <p className="font-serif italic text-sm text-[#C6A56B] mt-4 max-w-lg mx-auto">
            Experience the tranquility of flawless event coordination.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/events/new"
              className="px-8 py-3.5 rounded-full bg-[#C6A56B] hover:bg-white text-[#173B2D] text-sm font-bold shadow-md transition-all hover:scale-105"
            >
              Start Planning for Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#122B21] text-[#FAF7F1] py-8 border-t border-[#28523D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F1]/70">
          <p>© {new Date().getFullYear()} PLANORA. Smart Event Planning. All rights reserved.</p>
          <p>
            Designed & Developed by <strong className="text-[#E5D4B5]">Ronit Dhawan</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
