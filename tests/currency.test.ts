import { describe, it, expect } from "vitest";
import { formatCurrency, formatCompactCurrency, parseCurrencyInput } from "../src/lib/currency";

describe("Financial Precision & Currency Formatter", () => {
  it("formats Indian Rupees with proper Lakhs/Crores commas", () => {
    expect(formatCurrency(2800000, "INR")).toBe("₹28,00,000");
    expect(formatCurrency(1750000, "INR")).toBe("₹17,50,000");
    expect(formatCurrency(1050000, "INR")).toBe("₹10,50,000");
    expect(formatCurrency(120000, "INR")).toBe("₹1,20,000");
    expect(formatCurrency(980000, "INR")).toBe("₹9,80,000");
  });

  it("handles zero and decimal amounts correctly", () => {
    expect(formatCurrency(0, "INR")).toBe("₹0");
    expect(formatCurrency(1500000.5, "INR", true)).toBe("₹15,00,000.50");
  });

  it("formats international currencies (USD, EUR, GBP)", () => {
    expect(formatCurrency(25000, "USD")).toBe("$25,000");
    expect(formatCurrency(18000, "EUR")).toBe("€18,000");
    expect(formatCurrency(14500, "GBP")).toBe("£14,500");
  });

  it("formats compact notation", () => {
    expect(formatCompactCurrency(2800000, "INR")).toBe("₹28.0L");
    expect(formatCompactCurrency(10000000, "INR")).toBe("₹1.0Cr");
    expect(formatCompactCurrency(50000, "USD")).toBe("$50.0k");
  });

  it("parses user currency inputs cleanly", () => {
    expect(parseCurrencyInput("₹15,00,000")).toBe(1500000);
    expect(parseCurrencyInput("$25,000.50")).toBe(25000.5);
    expect(parseCurrencyInput("invalid")).toBe(0);
    expect(parseCurrencyInput(-500)).toBe(0); // non-negative invariant
  });
});
