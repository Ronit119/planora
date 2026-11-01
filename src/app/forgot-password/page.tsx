"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlanoraLogo } from "@/components/ui/PlanoraLogo";
import { ArrowRight, Mail, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("ronit@planora.com");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F1] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
        <PlanoraLogo />
        <Link
          href="/login"
          className="text-xs font-semibold text-[#173B2D] hover:underline"
        >
          ← Back to Sign in
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-[#E9E3D8] shadow-dropdown">
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl text-[#1C2921]">Reset Password</h1>
            <p className="font-serif italic text-xs text-[#72756D] mt-1.5">
              Enter your email address and we'll send you recovery instructions.
            </p>
          </div>

          {sent ? (
            <div className="p-4 rounded-2xl bg-[#E8F1E5] text-xs text-[#28523D] text-center space-y-2">
              <Check className="w-5 h-5 mx-auto" />
              <p className="font-semibold">Reset instructions sent!</p>
              <p className="text-[#72756D]">Please check your inbox at {email}.</p>
              <div className="pt-2">
                <Link href="/login" className="font-semibold underline">
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#72756D]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-[#72756D]">
        Designed & Developed by <strong className="text-[#173B2D]">Ronit Dhawan</strong>
      </div>
    </div>
  );
}
