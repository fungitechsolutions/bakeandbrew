// Hosts next/image may load remote images from. next.config.ts uses this list
// as images.remotePatterns, so the config and isAllowedImageUrl can't drift.
// Keep plain relative imports here: next.config.ts imports this file.
// Exact hostnames only: isAllowedImageUrl doesn't do next/image's globs.
export const remoteImagePatterns: { protocol: "https"; hostname: string }[] = [
  { protocol: "https", hostname: "randomuser.me" },
  { protocol: "https", hostname: "picsum.photos" },
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "res.cloudinary.com" },
];

// next/image throws while rendering (dev) or fails to load (prod) a src whose
// host isn't in remotePatterns, so check a stored photo URL before using it.
export function isAllowedImageUrl(src?: string | null): src is string {
  if (!src) return false;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }

  return remoteImagePatterns.some(
    (pattern) =>
      url.protocol === `${pattern.protocol}:` &&
      url.hostname === pattern.hostname,
  );
}
