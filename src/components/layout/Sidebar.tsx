"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Coins,
  Store,
  CheckSquare,
  Sparkles,
  Settings,
  X,
} from "lucide-react";
import { PlanoraLogo } from "../ui/PlanoraLogo";
import { SHOWCASE_EVENT_ID } from "@/lib/db/seed";

interface SidebarProps {
  currentEventId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentEventId = SHOWCASE_EVENT_ID, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard" || pathname === "/",
    },
    {
      label: "My Events",
      href: "/events",
      icon: Calendar,
      isActive: pathname === "/events",
    },
    {
      label: "Create Event",
      href: "/events/new",
      icon: PlusCircle,
      isActive: pathname === "/events/new",
    },
    {
      label: "Budget",
      href: `/events/${currentEventId}/budget`,
      icon: Coins,
      isActive: pathname.includes("/budget"),
    },
    {
      label: "Vendors",
      href: `/events/${currentEventId}/vendors`,
      icon: Store,
      isActive: pathname.includes("/vendors"),
    },
    {
      label: "Timeline",
      href: `/events/${currentEventId}/timeline`,
      icon: CheckSquare,
      isActive: pathname.includes("/timeline") || pathname.includes("/tasks"),
    },
    {
      label: "AI Copilot",
      href: `/events/${currentEventId}/copilot`,
      icon: Sparkles,
      isActive: pathname.includes("/copilot"),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[220px] bg-[#173B2D] text-[#FAF7F1] border-r border-[#28523D] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header & Logo */}
        <div className="flex items-center justify-between p-5 pb-6">
          <PlanoraLogo />
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#E5D4B5] hover:text-white rounded-lg hover:bg-[#28523D]/50"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  item.isActive
                    ? "bg-[#C6A56B] text-[#173B2D] shadow-sm font-semibold"
                    : "text-[#FAF7F1]/80 hover:text-white hover:bg-[#28523D]/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 flex-shrink-0 ${
                    item.isActive ? "text-[#173B2D]" : "text-[#C6A56B]"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Destination Arch Illustration matching design reference */}
        <div className="p-3 pt-0 mt-auto">
          <div className="relative overflow-hidden rounded-2xl border border-[#C6A56B]/30 bg-gradient-to-b from-[#28523D] to-[#122b21] group shadow-inner">
            <div className="relative h-36 w-full overflow-hidden">
              <Image
                src="/images/sidebar-arch-crop.jpg"
                alt="Palace lake pavilion"
                fill
                className="object-cover object-bottom opacity-90 transition-transform duration-700 group-hover:scale-105"
                sizes="220px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#173B2D] via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-3 pt-1 text-center relative z-10">
              <p className="font-serif italic text-xs text-[#FAF7F1] leading-relaxed drop-shadow-sm">
                Plan, Organize, <br />
                Celebrate with Planora
              </p>
              <div className="w-10 h-0.5 bg-[#C6A56B] mx-auto mt-2 rounded-full opacity-70" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
