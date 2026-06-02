export function getApiUrl() {
  return process.env.NODE_ENV !== "production" && typeof window === "undefined"
    ? process.env.INTERNAL_API_URL
    : process.env.NEXT_PUBLIC_API_URL;
}
