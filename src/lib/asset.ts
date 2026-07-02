// Prefix public/ asset URLs with the deploy base path.
//
// Next.js auto-prefixes its own assets (_next chunks, next/font, the app icon)
// with `basePath`, but NOT raw string URLs like an <audio src>, a fetch(), or a
// three.js loader path. On GitHub Pages the site is served from a subpath
// (e.g. /veyra-website), so those raw paths must be prefixed by hand.
//
// NEXT_PUBLIC_BASE_PATH is inlined at build time (empty in local dev, set to the
// repo subpath in CI), so this works on both the server and the client.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string): string => `${BASE_PATH}${path}`;
