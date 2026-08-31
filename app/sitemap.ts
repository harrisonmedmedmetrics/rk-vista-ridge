import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/property";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.indexable) return [];

  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
