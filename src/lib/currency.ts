/**
 * Precision Financial and Currency Formatting for Planora
 * Respects ISO Currency codes and Indian Numbering System (Lakhs/Crores)
 */

export function formatCurrency(
  amount: number,
  currency: string = "INR",
  includeDecimals: boolean = false
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    amount = 0;
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  let formattedNumber = "";

  if (currency.toUpperCase() === "INR") {
    // Format according to Indian numbering system: 28,00,000
    const rounded = includeDecimals ? absAmount.toFixed(2) : Math.round(absAmount).toString();
    const parts = rounded.split(".");
    let intPart = parts[0];
    const decPart = parts.length > 1 ? `.${parts[1]}` : "";

    if (intPart.length > 3) {
      const lastThree = intPart.substring(intPart.length - 3);
      const otherNumbers = intPart.substring(0, intPart.length - 3);
      const withCommas = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      intPart = `${withCommas},${lastThree}`;
    }

    formattedNumber = `₹${intPart}${decPart}`;
  } else {
    // Standard international formatting
    const symbolMap: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      AED: "AED ",
      CAD: "CA$",
      AUD: "A$",
    };

    const symbol = symbolMap[currency.toUpperCase()] || `${currency.toUpperCase()} `;
    const numStr = absAmount.toLocaleString("en-US", {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    });
    formattedNumber = `${symbol}${numStr}`;
  }

  return isNegative ? `-${formattedNumber}` : formattedNumber;
}

/**
 * Format currency with compact notation for small cards (e.g. ₹28L)
 */
export function formatCompactCurrency(amount: number, currency: string = "INR"): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (currency.toUpperCase() === "INR") {
    if (absAmount >= 10000000) {
      return `${sign}₹${(absAmount / 10000000).toFixed(1)}Cr`;
    }
    if (absAmount >= 100000) {
      return `${sign}₹${(absAmount / 100000).toFixed(1)}L`;
    }
    if (absAmount >= 1000) {
      return `${sign}₹${(absAmount / 1000).toFixed(1)}k`;
    }
    return `${sign}₹${absAmount}`;
  }

  const symbolMap: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "AED ",
  };
  const sym = symbolMap[currency.toUpperCase()] || "";

  if (absAmount >= 1000000) {
    return `${sign}${sym}${(absAmount / 1000000).toFixed(1)}M`;
  }
  if (absAmount >= 1000) {
    return `${sign}${sym}${(absAmount / 1000).toFixed(1)}k`;
  }
  return `${sign}${sym}${absAmount}`;
}

/**
 * Parse monetary string input to clean number
 */
export function parseCurrencyInput(value: string | number): number {
  if (typeof value === "number") return isNaN(value) ? 0 : Math.max(0, value);
  if (!value) return 0;
  const clean = value.toString().replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}
