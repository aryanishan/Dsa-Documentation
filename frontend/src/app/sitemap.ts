import type { MetadataRoute } from "next";

import { getAllDocs } from "@/lib/docs";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/roadmap`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...getAllDocs().map((doc) => ({ url: `${siteConfig.url}/docs/${doc.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
