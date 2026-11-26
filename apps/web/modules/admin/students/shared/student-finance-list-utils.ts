export function formatFinancePercent(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return "—";
  return `${num}%`;
}

// A flat-amount discount stores the percent its amount came to of the balance
// when it was added, so show that percent and mark it "(flat)". A small amount
// on a large balance rounds to 0.00, which reads "<0.01%" instead of "0%".
export function formatDiscountPercent(
  mode: "percent" | "amount",
  percent: number | string,
): string {
  if (mode !== "amount") return formatFinancePercent(percent);
  const num = typeof percent === "string" ? parseFloat(percent) : percent;
  if (Number.isNaN(num)) return "—";
  return `${num > 0 ? `${num}%` : "<0.01%"} (flat)`;
}

export function formatFinanceDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
