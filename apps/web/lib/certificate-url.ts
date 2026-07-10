export function getCertificateVerifyUrl(certificateId: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/certificates/${certificateId}`;
}
