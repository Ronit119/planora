import React from "react";
import Link from "next/link";

interface PlanoraLogoProps {
  className?: string;
  isCollapsed?: boolean;
}

export function PlanoraLogo({ className = "", isCollapsed = false }: PlanoraLogoProps) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-3 group transition-opacity hover:opacity-95 ${className}`}>
      {/* Elegant Golden Leaf Icon */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#E5D4B5] to-[#C6A56B] shadow-sm flex-shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-[#173B2D] transform -rotate-12 transition-transform duration-300 group-hover:rotate-0"
        >
          <path
            d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          <line x1="16" y1="8" x2="2" y2="22" stroke="#FAF7F1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17.5 15H9" stroke="#FAF7F1" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="font-serif text-2xl tracking-wide font-normal text-[#FAF7F1] leading-none">
            Planora
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#C6A56B] font-sans font-medium mt-1">
            Smart Event Planning
          </span>
        </div>
      )}
    </Link>
  );
}
