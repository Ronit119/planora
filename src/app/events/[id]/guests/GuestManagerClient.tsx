"use client";

import React, { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Users,
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Utensils,
  X,
} from "lucide-react";
import { Event, Guest, RSVPStatus, DietaryPreference, UserProfile, AppNotification, ThemeInspiration } from "@/lib/types";

interface GuestManagerClientProps {
  event: Event;
  guests: Guest[];
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
}

export function GuestManagerClient({
  event,
  guests: initialGuests,
  profile,
  events,
  notifications,
  themes,
}: GuestManagerClientProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [groupTag, setGroupTag] = useState<"family" | "vip" | "friends" | "colleagues">("family");
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>("awaiting");
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>("vegetarian");
  const [plusOneCount, setPlusOneCount] = useState(0);
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");

  const refreshGuests = async () => {
    try {
      const res = await fetch(`/api/events/${event.id}/guests`);
      const data = await res.json();
      if (data.success) setGuests(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch(`/api/events/${event.id}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          groupTag,
          rsvpStatus,
          dietaryPreference,
          plusOneCount: Number(plusOneCount),
          tableNumber,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setName("");
        setEmail("");
        setPhone("");
        setNotes("");
        setTableNumber("");
        refreshGuests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (guestId: string, newRsvp: RSVPStatus) => {
    try {
      await fetch(`/api/events/${event.id}/guests`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, rsvpStatus: newRsvp }),
      });
      refreshGuests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (confirm("Remove this guest from list?")) {
      try {
        await fetch(`/api/events/${event.id}/guests?guestId=${guestId}`, {
          method: "DELETE",
        });
        refreshGuests();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Group", "RSVP", "Dietary", "Plus Ones", "Table", "Notes"];
    const rows = guests.map((g) => [
      `"${g.name}"`,
      `"${g.email || ""}"`,
      `"${g.phone || ""}"`,
      `"${g.groupTag}"`,
      `"${g.rsvpStatus}"`,
      `"${g.dietaryPreference}"`,
      g.plusOneCount,
      `"${g.tableNumber || ""}"`,
      `"${g.notes || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `planora_guest_list_${event.title.toLowerCase().replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (loadEvt) => {
      const text = loadEvt.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      if (lines.length <= 1) return;

      const newGuestsToImport: any[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",").map((s) => s.replace(/(^"|"$)/g, "").trim());
        if (parts[0]) {
          newGuestsToImport.push({
            name: parts[0],
            email: parts[1] || "",
            phone: parts[2] || "",
            groupTag: parts[3] || "friends",
            rsvpStatus: parts[4] || "awaiting",
            dietaryPreference: parts[5] || "none",
            plusOneCount: Number(parts[6]) || 0,
            tableNumber: parts[7] || "",
          });
        }
      }

      if (newGuestsToImport.length > 0) {
        await fetch(`/api/events/${event.id}/guests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newGuestsToImport),
        });
        refreshGuests();
        alert(`Successfully imported ${newGuestsToImport.length} guests!`);
      }
    };
    reader.readAsText(file);
  };

  const attendingCount = guests.filter((g) => g.rsvpStatus === "attending").length;
  const totalHeadcount = guests.reduce((sum, g) => (g.rsvpStatus === "attending" ? sum + 1 + g.plusOneCount : sum), 0);
  const declinedCount = guests.filter((g) => g.rsvpStatus === "declined").length;
  const awaitingCount = guests.filter((g) => g.rsvpStatus === "awaiting" || g.rsvpStatus === "invited").length;

  const filteredGuests = guests.filter((g) => {
    const matchesQuery =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRsvp = rsvpFilter === "all" || g.rsvpStatus === rsvpFilter;
    const matchesGroup = groupFilter === "all" || g.groupTag === groupFilter;
    return matchesQuery && matchesRsvp && matchesGroup;
  });

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
              Guest List & RSVP Concierge
            </h1>
            <p className="font-serif italic text-sm text-[#72756D] mt-1">
              Track invitations, attendance, seating and dietary needs for {event.title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportCSV}
              accept=".csv"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] text-xs font-medium text-[#1C2921] transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#72756D]" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] text-xs font-medium text-[#1C2921] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#72756D]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-medium shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card">
            <span className="text-[11px] text-[#72756D] font-medium uppercase tracking-wider">Total Headcount</span>
            <p className="font-serif text-2xl text-[#1C2921] mt-1">{totalHeadcount}</p>
            <span className="text-[10px] text-[#72756D]">Including plus-ones</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card">
            <span className="text-[11px] text-[#28523D] font-medium uppercase tracking-wider">Attending</span>
            <p className="font-serif text-2xl text-[#28523D] mt-1">{attendingCount}</p>
            <span className="text-[10px] text-[#28523D]">Confirmed RSVPs</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card">
            <span className="text-[11px] text-[#A88344] font-medium uppercase tracking-wider">Awaiting Response</span>
            <p className="font-serif text-2xl text-[#A88344] mt-1">{awaitingCount}</p>
            <span className="text-[10px] text-[#72756D]">Invited / Pending</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card">
            <span className="text-[11px] text-red-700 font-medium uppercase tracking-wider">Declined</span>
            <p className="font-serif text-2xl text-red-700 mt-1">{declinedCount}</p>
            <span className="text-[10px] text-[#72756D]">Unable to attend</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#72756D]" />
            <input
              type="text"
              placeholder="Search guests by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E9E3D8] bg-[#FAF7F1] focus:outline-none"
            >
              <option value="all">All RSVP States</option>
              <option value="attending">Attending</option>
              <option value="awaiting">Awaiting</option>
              <option value="declined">Declined</option>
            </select>

            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E9E3D8] bg-[#FAF7F1] focus:outline-none"
            >
              <option value="all">All Groups</option>
              <option value="family">Family</option>
              <option value="vip">VIP</option>
              <option value="friends">Friends</option>
              <option value="colleagues">Colleagues</option>
            </select>
          </div>
        </div>

        {/* Guests Table */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E9E3D8] text-[#72756D]">
                <th className="py-2.5 px-3 font-semibold">Guest Name</th>
                <th className="py-2.5 px-3 font-semibold">Group</th>
                <th className="py-2.5 px-3 font-semibold">RSVP Status</th>
                <th className="py-2.5 px-3 font-semibold">Dietary</th>
                <th className="py-2.5 px-3 font-semibold">Plus-Ones</th>
                <th className="py-2.5 px-3 font-semibold">Table</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E3D8]/50">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#72756D]">
                    No guests found.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-[#FAF7F1] transition-colors">
                    <td className="py-3 px-3 font-medium text-[#1C2921]">
                      {guest.name}
                      {guest.email && (
                        <p className="text-[10px] text-[#72756D]">{guest.email}</p>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] bg-[#E5D4B5]/40 text-[#173B2D] font-medium">
                        {guest.groupTag}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={guest.rsvpStatus}
                        onChange={(e) => handleStatusChange(guest.id, e.target.value as any)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${
                          guest.rsvpStatus === "attending"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : guest.rsvpStatus === "declined"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="attending">Attending</option>
                        <option value="awaiting">Awaiting</option>
                        <option value="declined">Declined</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-[#72756D] capitalize">
                      {guest.dietaryPreference !== "none" ? guest.dietaryPreference : "—"}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1C2921]">
                      +{guest.plusOneCount}
                    </td>
                    <td className="py-3 px-3 text-[#72756D]">
                      {guest.tableNumber || "Unassigned"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="p-1 text-[#72756D] hover:text-red-600 rounded-md transition-colors"
                        title="Remove guest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Guest */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-dropdown">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
              <h3 className="font-serif text-lg text-[#1C2921]">Add Guest</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-[#72756D]" />
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika & Arjun Kapoor"
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Group Tag</label>
                  <select
                    value={groupTag}
                    onChange={(e) => setGroupTag(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  >
                    <option value="family">Family</option>
                    <option value="vip">VIP</option>
                    <option value="friends">Friends</option>
                    <option value="colleagues">Colleagues</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Dietary Preference</label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  >
                    <option value="none">None (Standard)</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="jain">Jain</option>
                    <option value="halal">Halal</option>
                    <option value="gluten_free">Gluten Free</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Plus Ones</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={plusOneCount}
                    onChange={(e) => setPlusOneCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Table Assignment</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 4 / Royal Table"
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>
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
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
