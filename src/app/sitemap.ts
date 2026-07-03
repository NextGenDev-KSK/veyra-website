import type { MetadataRoute } from "next";

const SITE_URL =
  "https://nextgendev-ksk.github.io" + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");

// Required for `output: "export"` — emit a static sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Single-page site: one canonical entry.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
