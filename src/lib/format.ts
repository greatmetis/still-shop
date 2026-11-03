/**
 * TODO 2: formatters. Pure functions: same input, same output, no side effects.
 *
 *   discountedPrice(9.99, 10)  → 8.99      (rounded to cents)
 *   formatPrice(1099.99)       → "$1,099.99"
 *   formatDate("2026-10-25T12:00:00.000Z") → "Oct 25, 2026"
 *   formatDate("not a date")   → ""        (never throws)
 *
 * Use Intl.NumberFormat (en-US, USD) and Intl.DateTimeFormat (en-US). Watch out for floating
 * point: 0.1 + 0.2 is not exactly 0.3 in JavaScript.
 *
 * How to start: in format.test.ts change `describe.skip` to `describe`, then run `npm test`.
 * You'll learn: floating-point pitfalls, Intl, pure functions.
 * Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
 */

export function discountedPrice(price: number, discountPercentage: number): number {
  const rawPrice = price * (100 - discountPercentage) / 100;
  const DigetNumber = Math.round(rawPrice * 100) / 100
  return DigetNumber;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", { style:"currency",currency:"USD" }).format(
    amount);
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if(Number.isNaN(date.getTime())) return "";
  return   new Intl.DateTimeFormat("en-US",{
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}
