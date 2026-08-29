export interface ExperienceDuration {
  years: number;
  months: number;
  days: number;
  formatted: string; // e.g. "1 year 5 month 0 days"
  fullFormatted: string; // e.g. "1 Year, 5 Months, 0 Days"
  shortFormatted: string; // e.g. "1y 5m 0d"
  badgeFormatted: string; // e.g. "1 yr 5 mos"
  joinDateString: string; // e.g. "March 29, 2025"
}

// Wix Developer Join Date (1.5 years / 1 year 5 months ago from reference)
// March 29, 2025
export const WIX_JOIN_DATE = new Date("2025-03-29T00:00:00");

/**
 * Calculates the exact dynamic duration between a start date (Join Date) and current date.
 * Handles calendar months of varying lengths and leap years accurately.
 */
export function calculateExperience(
  startDate: Date = WIX_JOIN_DATE,
  currentDate: Date = new Date()
): ExperienceDuration {
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    // Get total days in previous month of 'end'
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Fallback if date is in future
  if (years < 0) {
    years = 0;
    months = 0;
    days = 0;
  }

  const formatted = `${years} year ${months} month ${days} days`;
  const fullFormatted = `${years} ${years === 1 ? "Year" : "Years"}, ${months} ${months === 1 ? "Month" : "Months"}, ${days} ${days === 1 ? "Day" : "Days"}`;
  const shortFormatted = `${years}y ${months}m ${days}d`;
  const badgeFormatted = `${years} yr ${months} mos ${days}d`;

  const joinDateString = startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    years,
    months,
    days,
    formatted,
    fullFormatted,
    shortFormatted,
    badgeFormatted,
    joinDateString,
  };
}
