/**
 * Format paisa amount to Rs. display string
 * e.g. 250000 paisa → "Rs. 2,500.00"
 */
export function formatRs(paisa: number): string {
  const rupees = paisa / 100;
  return `Rs. ${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format ISO date string to readable date
 * e.g. "2024-04-10T09:30:00Z" → "Apr 10, 2024"
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
