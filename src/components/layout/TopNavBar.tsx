"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown, Check, Menu, RefreshCw, User, LogOut, ExternalLink } from "lucide-react";
import { AppNotification, UserProfile } from "@/lib/types";

interface TopNavBarProps {
  profile?: UserProfile;
  notifications?: AppNotification[];
  onOpenSearch: () => void;
  onToggleMobileMenu?: () => void;
}

export function TopNavBar({
  profile = {
    id: "user-ronit-dhawan",
    email: "ronit@planora.com",
    displayName: "Ronit Dhawan",
    avatarUrl: "/images/ronit-avatar.jpg",
    defaultCurrency: "INR",
    timezone: "Asia/Kolkata",
  },
  notifications = [],
  onOpenSearch,
  onToggleMobileMenu,
}: TopNavBarProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifList, setNotifList] = useState<AppNotification[]>(notifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifList(notifications);
  }, [notifications]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifList.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifList((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifList((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDemo = async () => {
    if (confirm("Reset Planora to official showcase demo data?")) {
      await fetch("/api/reset-demo", { method: "POST" });
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-[#FAF7F1]/90 backdrop-blur-md border-b border-[#E9E3D8]">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-[#1C2921] hover:bg-[#E9E3D8]/50 rounded-xl transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-serif text-lg text-[#173B2D] font-normal">Planora</span>
      </div>

      {/* Global Search Bar matching exact visual reference */}
      <div className="flex-1 max-w-xl mx-2 md:mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-4 py-2 bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] rounded-full text-left text-sm text-[#72756D] shadow-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#C6A56B]/30"
          aria-label="Open search"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-[#72756D] group-hover:text-[#173B2D] transition-colors flex-shrink-0" />
            <span className="truncate">Search events, vendors, tasks, or ideas...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-sans font-medium text-[#72756D] bg-[#FAF7F1] border border-[#E9E3D8] rounded-md shadow-xs">
            ⌘ K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 text-[#1C2921] hover:text-[#173B2D] hover:bg-[#E9E3D8]/50 rounded-full transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5 text-[#1C2921]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A56B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C6A56B]"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFDF9] rounded-2xl shadow-dropdown border border-[#E9E3D8] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between p-4 border-b border-[#E9E3D8] bg-[#FAF7F1]">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base font-medium text-[#1C2921]">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#C6A56B]/20 text-[#173B2D]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#28523D] hover:text-[#173B2D] font-medium flex items-center gap-1 hover:underline"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E9E3D8]/50">
                {notifList.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[#72756D]">
                    No notifications right now.
                  </div>
                ) : (
                  notifList.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleMarkRead(notif.id)}
                      className={`p-3.5 transition-colors cursor-pointer hover:bg-[#FAF7F1] flex gap-3 ${
                        !notif.isRead ? "bg-[#FAF7F1]/60" : ""
                      }`}
                    >
                      <div className="mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            !notif.isRead ? "bg-[#C6A56B]" : "bg-transparent"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#1C2921]">{notif.title}</p>
                          <span className="text-[10px] text-[#72756D]">
                            {new Date(notif.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#72756D] mt-0.5 leading-relaxed">{notif.message}</p>
                        {notif.linkUrl && (
                          <Link
                            href={notif.linkUrl}
                            className="inline-flex items-center gap-1 text-[11px] text-[#28523D] hover:text-[#173B2D] font-medium mt-1.5"
                          >
                            Open item <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#E9E3D8]/50 transition-colors focus:outline-none"
            aria-label="User profile menu"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#C6A56B] shadow-xs flex-shrink-0">
              <Image
                src={profile.avatarUrl || "/images/ronit-avatar.jpg"}
                alt={profile.displayName}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="hidden sm:inline-block font-sans text-sm font-medium text-[#1C2921]">
              {profile.displayName}
            </span>
            <ChevronDown className="w-4 h-4 text-[#72756D]" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#FFFDF9] rounded-2xl shadow-dropdown border border-[#E9E3D8] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-[#E9E3D8] bg-[#FAF7F1]">
                <p className="font-serif text-sm font-medium text-[#1C2921]">{profile.displayName}</p>
                <p className="text-xs text-[#72756D] truncate mt-0.5">{profile.email}</p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#28523D] text-[#FAF7F1]">
                  Pro Event Planner
                </div>
              </div>

              <div className="p-2 space-y-1 text-xs text-[#1C2921]">
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FAF7F1] transition-colors"
                >
                  <User className="w-4 h-4 text-[#72756D]" />
                  <span>Profile & Preferences</span>
                </Link>

                <Link
                  href="/events"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FAF7F1] transition-colors"
                >
                  <Search className="w-4 h-4 text-[#72756D]" />
                  <span>All Events ({profile.createdEventsCount || 4})</span>
                </Link>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleResetDemo();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#FAF7F1] text-left transition-colors text-amber-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset Demo Showcase Data</span>
                </button>

                <div className="border-t border-[#E9E3D8] my-1 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>

              <div className="p-2.5 bg-[#FAF7F1] border-t border-[#E9E3D8] text-center">
                <span className="text-[10px] text-[#72756D]">
                  Designed & Developed by{" "}
                  <strong className="text-[#173B2D]">Ronit Dhawan</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
