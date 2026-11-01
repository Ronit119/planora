"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlanoraLogo } from "@/components/ui/PlanoraLogo";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ronit@planora.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Authenticate and redirect to dashboard
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
            <h1 className="font-serif text-3xl text-[#1C2921]">Sign in to Planora</h1>
            <p className="font-serif italic text-xs text-[#72756D] mt-1.5">
              Access your events, budgets and AI event copilot.
            </p>
          </div>

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

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-semibold text-[#1C2921]">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#28523D] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
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
              <span>{loading ? "Signing in..." : "Enter Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#E9E3D8] text-center text-xs text-[#72756D]">
            Don't have an account yet?{" "}
            <Link href="/signup" className="font-semibold text-[#173B2D] hover:underline">
              Sign up free
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
