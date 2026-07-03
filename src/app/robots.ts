import type { MetadataRoute } from "next";

// Absolute site URL, base-path aware (see layout.tsx for the same derivation).
const SITE_URL =
  "https://nextgendev-ksk.github.io" + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");

// Required for `output: "export"` — emit a static robots.txt at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
