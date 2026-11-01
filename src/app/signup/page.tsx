"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlanoraLogo } from "@/components/ui/PlanoraLogo";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("Ronit Dhawan");
  const [email, setEmail] = useState("ronit@planora.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F1] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
        <PlanoraLogo />
        <Link
          href="/"
          className="text-xs font-semibold text-[#173B2D] hover:underline"
        >
          ← Back to Overview
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-[#FFFDF9] rounded-3xl p-8 border border-[#E9E3D8] shadow-dropdown">
          <div className="text-center mb-6">
            <h1 className="font-serif text-3xl text-[#1C2921]">Join Planora</h1>
            <p className="font-serif italic text-xs text-[#72756D] mt-1.5">
              Create your account to start planning beautiful celebrations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1C2921] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#72756D]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
                />
              </div>
            </div>

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

            <div>
              <label className="block font-semibold text-[#1C2921] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#72756D]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none bg-[#FAF7F1]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? "Creating..." : "Create Free Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E9E3D8] text-center text-xs text-[#72756D]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#173B2D] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-[#72756D]">
        Designed & Developed by <strong className="text-[#173B2D]">Ronit Dhawan</strong>
      </div>
    </div>
  );
}
