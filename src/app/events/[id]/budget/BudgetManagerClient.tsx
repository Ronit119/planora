"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Coins,
  Wallet,
  Leaf,
  Plus,
  Trash2,
  Edit2,
  Search,
  Printer,
  X,
  AlertTriangle,
} from "lucide-react";
import { Event, BudgetCategory, Expense, UserProfile, AppNotification, ThemeInspiration } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

interface BudgetManagerClientProps {
  event: Event;
  categories: BudgetCategory[];
  expenses: Expense[];
  metrics: any;
  profile: UserProfile;
  events: Event[];
  notifications: AppNotification[];
  themes: ThemeInspiration[];
}

export function BudgetManagerClient({
  event,
  categories: initialCategories,
  expenses: initialExpenses,
  metrics: initialMetrics,
  profile,
  events,
  notifications,
  themes,
}: BudgetManagerClientProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Modals
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatAmount, setNewCatAmount] = useState<number>(100000);
  const [newCatColor, setNewCatColor] = useState("#28523D");

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpTitle, setNewExpTitle] = useState("");
  const [newExpAmount, setNewExpAmount] = useState<number>(50000);
  const [newExpCatId, setNewExpCatId] = useState(categories[0]?.id || "");
  const [newExpStatus, setNewExpStatus] = useState<"pending" | "partially_paid" | "paid">("paid");
  const [newExpNotes, setNewExpNotes] = useState("");

  const refreshData = async () => {
    try {
      const catRes = await fetch(`/api/events/${event.id}/budget`);
      const catData = await catRes.json();
      if (catData.success) setCategories(catData.data);

      const expRes = await fetch(`/api/events/${event.id}/expenses`);
      const expData = await expRes.json();
      if (expData.success) setExpenses(expData.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    try {
      const res = await fetch(`/api/events/${event.id}/budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName,
          allocatedAmount: Number(newCatAmount),
          color: newCatColor,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddCategoryOpen(false);
        setNewCatName("");
        setNewCatAmount(100000);
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (confirm("Delete this budget category?")) {
      try {
        await fetch(`/api/events/${event.id}/budget?categoryId=${catId}`, {
          method: "DELETE",
        });
        refreshData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpTitle || newExpAmount <= 0) return;

    const matchedCat = categories.find((c) => c.id === newExpCatId);

    try {
      const res = await fetch(`/api/events/${event.id}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newExpTitle,
          amount: Number(newExpAmount),
          categoryId: newExpCatId,
          categoryName: matchedCat?.name || "General",
          paymentStatus: newExpStatus,
          notes: newExpNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddExpenseOpen(false);
        setNewExpTitle("");
        setNewExpAmount(50000);
        setNewExpNotes("");
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (expId: string) => {
    if (confirm("Delete this expense record?")) {
      try {
        await fetch(`/api/events/${event.id}/expenses?expenseId=${expId}`, {
          method: "DELETE",
        });
        refreshData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Calculations
  const totalPlanned = event.budget;
  const totalAllocated = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalPlanned - totalSpent;
  const isOverBudget = totalSpent > totalPlanned;

  const filteredExpenses = expenses.filter((e) => {
    const matchesQuery =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = filterCategory === "all" || e.categoryId === filterCategory;
    return matchesQuery && matchesCat;
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
              Budget & Expense Ledger
            </h1>
            <p className="font-serif italic text-sm text-[#72756D] mt-1">
              Precision financial tracking for {event.title} ({event.currency})
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#E9E3D8] hover:border-[#C6A56B] text-xs font-medium text-[#1C2921] transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#72756D]" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173B2D] hover:bg-[#28523D] text-[#FAF7F1] text-xs font-medium shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </button>
          </div>
        </div>

        {/* 3 Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E9E3D8] shadow-card">
            <div className="flex items-center gap-2 text-[#72756D] text-xs font-medium mb-1">
              <Coins className="w-4 h-4 text-[#C6A56B]" /> Planned Total Budget
            </div>
            <div className="font-serif text-2xl text-[#1C2921]">
              {formatCurrency(totalPlanned, event.currency)}
            </div>
            <div className="text-[11px] text-[#72756D] mt-1">
              Allocated: {formatCurrency(totalAllocated, event.currency)}
            </div>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E9E3D8] shadow-card">
            <div className="flex items-center gap-2 text-[#72756D] text-xs font-medium mb-1">
              <Wallet className="w-4 h-4 text-[#C6A56B]" /> Total Expenses Paid
            </div>
            <div className="font-serif text-2xl text-[#1C2921]">
              {formatCurrency(totalSpent, event.currency)}
            </div>
            <div className="text-[11px] text-[#72756D] mt-1">
              {totalPlanned > 0 ? `${Math.round((totalSpent / totalPlanned) * 100)}% committed` : ""}
            </div>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E9E3D8] shadow-card">
            <div className="flex items-center gap-2 text-[#72756D] text-xs font-medium mb-1">
              <Leaf className="w-4 h-4 text-[#28523D]" /> Remaining Budget
            </div>
            <div className={`font-serif text-2xl ${isOverBudget ? "text-red-600" : "text-[#28523D]"}`}>
              {formatCurrency(remaining, event.currency)}
            </div>
            <div className="text-[11px] mt-1">
              {isOverBudget ? (
                <span className="text-red-600 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" /> Over budget by {formatCurrency(Math.abs(remaining), event.currency)}
                </span>
              ) : (
                <span className="text-[#28523D] font-medium">
                  {totalPlanned > 0 ? `${((remaining / totalPlanned) * 100).toFixed(1)}% available` : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-[#E9E3D8]">
            <div>
              <h2 className="font-serif text-xl text-[#1C2921]">Category Allocations</h2>
              <p className="text-xs text-[#72756D] mt-0.5">
                Target spend divided across planning pillars
              </p>
            </div>

            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#C6A56B] text-[#173B2D] text-xs font-medium hover:bg-[#FAF7F1] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {categories.map((cat) => {
              const catExpenses = expenses.filter((e) => e.categoryId === cat.id);
              const catSpent = catExpenses.reduce((s, e) => s + e.amount, 0);
              const pctSpent = cat.allocatedAmount > 0 ? Math.round((catSpent / cat.allocatedAmount) * 100) : 0;

              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl bg-[#FAF7F1] border border-[#E9E3D8] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <h4 className="text-sm font-semibold text-[#1C2921]">{cat.name}</h4>
                    </div>

                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 text-[#72756D] hover:text-red-600 rounded-md transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[#72756D]">
                      <span>Allocated</span>
                      <span className="font-medium text-[#1C2921]">
                        {formatCurrency(cat.allocatedAmount, event.currency)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-[#72756D] mt-1">
                      <span>Spent</span>
                      <span className="font-medium text-[#28523D]">
                        {formatCurrency(catSpent, event.currency)}
                      </span>
                    </div>

                    <div className="w-full bg-[#E9E3D8] h-1.5 rounded-full overflow-hidden mt-2.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pctSpent > 100 ? "bg-red-500" : "bg-[#28523D]"
                        }`}
                        style={{ width: `${Math.min(100, pctSpent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense Ledger Table */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3D8]">
            <h2 className="font-serif text-xl text-[#1C2921]">Expense Ledger</h2>

            {/* Filter and Search */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#72756D]" />
                <input
                  type="text"
                  placeholder="Filter expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E9E3D8] focus:outline-none focus:border-[#C6A56B] bg-[#FAF7F1]"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E9E3D8] focus:outline-none focus:border-[#C6A56B] bg-[#FAF7F1]"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E9E3D8] text-[#72756D]">
                  <th className="py-2.5 px-3 font-semibold">Expense Title</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Amount</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E3D8]/50">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#72756D]">
                      No expenses recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-[#FAF7F1] transition-colors">
                      <td className="py-3 px-3 font-medium text-[#1C2921]">
                        {exp.title}
                        {exp.notes && (
                          <p className="text-[10px] text-[#72756D] mt-0.5">{exp.notes}</p>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#72756D]">{exp.categoryName || "General"}</td>
                      <td className="py-3 px-3 text-[#72756D]">{exp.paymentDate || "—"}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            exp.paymentStatus === "paid"
                              ? "bg-green-100 text-green-800"
                              : exp.paymentStatus === "partially_paid"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {exp.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-[#1C2921]">
                        {formatCurrency(exp.amount, event.currency)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1 text-[#72756D] hover:text-red-600 rounded-md transition-colors"
                          title="Delete expense"
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
      </div>

      {/* Modal: Add Category */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-dropdown">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
              <h3 className="font-serif text-lg text-[#1C2921]">Add Budget Category</h3>
              <button onClick={() => setIsAddCategoryOpen(false)}>
                <X className="w-4 h-4 text-[#72756D]" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Attire & Styling"
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">
                  Allocated Amount ({event.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newCatAmount}
                  onChange={(e) => setNewCatAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Theme Color</label>
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-full h-9 rounded-xl border border-[#E9E3D8] cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E9E3D8] text-[#1C2921]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B2D] text-white font-medium"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Expense */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFFDF9] rounded-3xl p-6 border border-[#E9E3D8] shadow-dropdown">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3D8]">
              <h3 className="font-serif text-lg text-[#1C2921]">Record Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)}>
                <X className="w-4 h-4 text-[#72756D]" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Expense Title</label>
                <input
                  type="text"
                  required
                  value={newExpTitle}
                  onChange={(e) => setNewExpTitle(e.target.value)}
                  placeholder="e.g. Floral Mandap Initial Deposit"
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">
                  Amount ({event.currency})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Category</label>
                <select
                  value={newExpCatId}
                  onChange={(e) => setNewExpCatId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Payment Status</label>
                <select
                  value={newExpStatus}
                  onChange={(e) => setNewExpStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                >
                  <option value="paid">Paid</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#1C2921] mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={newExpNotes}
                  onChange={(e) => setNewExpNotes(e.target.value)}
                  placeholder="e.g. 50% deposit via bank transfer"
                  className="w-full p-2.5 rounded-xl border border-[#E9E3D8] focus:border-[#C6A56B] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E9E3D8] text-[#1C2921]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#173B2D] text-white font-medium"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
