"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import {
  Store,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Event, Vendor, VendorCategory, VendorStatus, UserProfile, AppNotification, ThemeInspiration } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

interface VendorManagerClientProps {
  event: Event;
  vendors: Vendor[];
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
}

export function VendorManagerClient({
  event,
  vendors: initialVendors,
  profile,
  events,
  notifications,
  themes,
}: VendorManagerClientProps) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<VendorCategory>("Venue");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(event.location);
  const [website, setWebsite] = useState("");
  const [quotedAmount, setQuotedAmount] = useState<number>(200000);
  const [contractAmount, setContractAmount] = useState<number>(200000);
  const [advancePaid, setAdvancePaid] = useState<number>(50000);
  const [status, setStatus] = useState<VendorStatus>("Shortlisted");
  const [notes, setNotes] = useState("");

  const refreshVendors = async () => {
    try {
      const res = await fetch(`/api/events/${event.id}/vendors`);
      const data = await res.json();
      if (data.success) setVendors(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch(`/api/events/${event.id}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          contactPerson,
          phone,
          email,
          location,
          website,
          quotedAmount: Number(quotedAmount),
          contractAmount: Number(contractAmount),
          advancePaid: Number(advancePaid),
          status,
          notes,
          image: "/images/vendor-royal-courtyard-crop.jpg",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setName("");
        setContactPerson("");
        setPhone("");
        setEmail("");
        setNotes("");
        refreshVendors();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (vendorId: string, newStatus: VendorStatus) => {
    try {
      await fetch(`/api/events/${event.id}/vendors`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, status: newStatus }),
      });
      refreshVendors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (confirm("Delete this vendor record?")) {
      try {
        await fetch(`/api/events/${event.id}/vendors?vendorId=${vendorId}`, {
          method: "DELETE",
        });
        refreshVendors();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredVendors = vendors.filter((v) => {
    const matchesQuery =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.contactPerson && v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || v.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
    return matchesQuery && matchesStatus && matchesCategory;
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
              Vendor Directory & Contracts
            </h1>
            <p className="font-serif italic text-sm text-[#72756D] mt-1">
              Curate, negotiate, and book trusted partners for {event.title}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vendor</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E9E3D8] shadow-card flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#72756D]" />
            <input
              type="text"
              placeholder="Search vendors by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E9E3D8] bg-[#FAF7F1] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Venue">Venue</option>
              <option value="Catering">Catering</option>
              <option value="Decor">Decor</option>
              <option value="Photography">Photography</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Attire">Attire</option>
              <option value="Logistics">Logistics</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-[#E9E3D8] bg-[#FAF7F1] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Contacted">Contacted</option>
              <option value="Negotiating">Negotiating</option>
              <option value="Shortlisted">Shortlisted</option>
            </select>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredVendors.length === 0 ? (
            <div className="col-span-2 py-16 text-center text-[#72756D] bg-[#FFFDF9] rounded-3xl border border-[#E9E3D8]">
              No vendors found matching your criteria.
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-xl overflow-hidden bg-[#E9E3D8] border border-[#E9E3D8] flex-shrink-0">
                        <Image
                          src={vendor.image || "/images/vendor-royal-courtyard-crop.jpg"}
                          alt={vendor.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-medium text-[#1C2921] leading-tight">
                          {vendor.name}
                        </h3>
                        <span className="text-xs text-[#C6A56B] font-medium">{vendor.category}</span>
                      </div>
                    </div>

                    {/* Status Pill Switcher */}
                    <select
                      value={vendor.status}
                      onChange={(e) => handleStatusChange(vendor.id, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                        vendor.status === "Booked"
                          ? "bg-[#E8F1E5] text-[#28523D] border-[#28523D]/30"
                          : vendor.status === "Contacted"
                          ? "bg-[#FEF3C7] text-[#B45309] border-[#B45309]/30"
                          : "bg-[#EEF2F6] text-[#475569] border-[#475569]/30"
                      }`}
                    >
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Negotiating">Negotiating</option>
                      <option value="Booked">Booked</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-4 space-y-1.5 text-xs text-[#72756D] border-t border-[#E9E3D8]/60 pt-3">
                    {vendor.contactPerson && (
                      <p>
                        <strong>Contact:</strong> {vendor.contactPerson}
                      </p>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C6A56B]" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C6A56B]" />
                        <span>{vendor.email}</span>
                      </div>
                    )}
                    {vendor.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C6A56B]" />
                        <span>{vendor.location}</span>
                      </div>
                    )}
                  </div>

                  {vendor.notes && (
                    <p className="font-serif italic text-xs text-[#72756D] mt-3 bg-[#FAF7F1] p-2.5 rounded-xl border border-[#E9E3D8]/70">
                      "{vendor.notes}"
                    </p>
                  )}
                </div>

                {/* Financials & Actions */}
                <div className="mt-5 pt-3 border-t border-[#E9E3D8] flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-[#72756D] uppercase">Quoted</span>
                      <p className="font-semibold text-[#1C2921]">
                        {formatCurrency(vendor.quotedAmount, event.currency)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#72756D] uppercase">Advance Paid</span>
                      <p className="font-semibold text-[#28523D]">
                        {formatCurrency(vendor.advancePaid, event.currency)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="p-1.5 text-[#72756D] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete vendor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Add Vendor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-dropdown max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
              <h3 className="font-serif text-lg text-[#1C2921]">Add New Vendor</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-[#72756D]" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-[#1C2921] mb-1">Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lenscraft Photography Studio"
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  >
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Decor">Decor</option>
                    <option value="Photography">Photography</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Attire">Attire</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  >
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Devansh Mehra"
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-[#1C2921] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@studio.example.com"
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">
                    Quoted Amount ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quotedAmount}
                    onChange={(e) => setQuotedAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1C2921] mb-1">
                    Advance Paid ({event.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-[#1C2921] mb-1">Notes & Scope</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Package details, deliverable timelines, equipment..."
                    className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none resize-none"
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
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
