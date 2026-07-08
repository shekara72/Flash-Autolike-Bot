import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://flash-autolike.bot";
  const routes = [
    "",
    "/auth/login",
    "/checkout",
    "/features",
    "/pricing",
    "/how-it-works",
    "/about",
    "/testimonials",
    "/gallery",
    "/faq",
    "/contact",
    "/support",
    "/privacy",
    "/terms",
    "/refund-policy"
  ];
  
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
