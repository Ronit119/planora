"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoreVertical, Check, ExternalLink, Trash2 } from "lucide-react";
import { Vendor, VendorStatus } from "@/lib/types";

interface VendorChecklistCardProps {
  eventId: string;
  vendors: Vendor[];
  onStatusChange?: (vendorId: string, newStatus: VendorStatus) => void;
  onDeleteVendor?: (vendorId: string) => void;
}

export function VendorChecklistCard({
  eventId,
  vendors = [],
  onStatusChange,
  onDeleteVendor,
}: VendorChecklistCardProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const displayVendors = vendors.slice(0, 4);

  const getStatusBadge = (status: VendorStatus) => {
    switch (status) {
      case "Booked":
      case "Completed":
        return {
          label: "✓ Booked",
          className: "bg-[#E8F1E5] text-[#28523D] border border-[#28523D]/20",
        };
      case "Contacted":
      case "Negotiating":
        return {
          label: "◉ Contacted",
          className: "bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/20",
        };
      case "Shortlisted":
      case "Researching":
      default:
        return {
          label: "☆ Shortlisted",
          className: "bg-[#EEF2F6] text-[#475569] border border-[#475569]/20",
        };
    }
  };

  return (
    <div className="bg-[#FFFDF9] rounded-3xl p-5 sm:p-6 border border-[#E9E3D8] shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
        <h3 className="font-serif text-lg font-normal tracking-wide text-[#1C2921]">
          Vendor Checklist
        </h3>
        <Link
          href={`/events/${eventId}/vendors`}
          className="text-xs text-[#28523D] hover:text-[#173B2D] flex items-center gap-1 transition-colors group font-medium"
        >
          <span>Manage Vendors</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Vendors List */}
      <div className="mt-4 space-y-3.5">
        {displayVendors.map((vendor) => {
          const badge = getStatusBadge(vendor.status);
          const isMenuOpen = activeMenuId === vendor.id;

          return (
            <div
              key={vendor.id}
              className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-[#FAF7F1] transition-colors relative"
            >
              {/* Left Thumbnail & Title */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-8 rounded-lg overflow-hidden bg-[#E9E3D8] border border-[#E9E3D8] flex-shrink-0">
                  <Image
                    src={vendor.image || "/images/vendor-royal-courtyard-crop.jpg"}
                    alt={vendor.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>

                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-medium text-[#1C2921] truncate leading-tight">
                    {vendor.name}
                  </h4>
                  <p className="text-[11px] text-[#72756D]">{vendor.category}</p>
                </div>
              </div>

              {/* Status Badge & Three-Dot Menu */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${badge.className}`}
                >
                  {badge.label}
                </span>

                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(isMenuOpen ? null : vendor.id)}
                    className="p-1 text-[#72756D] hover:text-[#1C2921] rounded-full hover:bg-[#E9E3D8]/50"
                    aria-label={`Actions for ${vendor.name}`}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Context Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-[#FFFDF9] rounded-xl shadow-dropdown border border-[#E9E3D8] z-20 py-1 text-xs">
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          if (onStatusChange) onStatusChange(vendor.id, "Booked");
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F1] flex items-center gap-2 text-[#28523D]"
                      >
                        <Check className="w-3.5 h-3.5" /> Mark as Booked
                      </button>

                      <Link
                        href={`/events/${eventId}/vendors`}
                        onClick={() => setActiveMenuId(null)}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#FAF7F1] flex items-center gap-2 text-[#1C2921]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Full Profile
                      </Link>

                      {onDeleteVendor && (
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            onDeleteVendor(vendor.id);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-[#E9E3D8]"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
