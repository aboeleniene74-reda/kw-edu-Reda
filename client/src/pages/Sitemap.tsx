import { useEffect } from "react";
import { trpc } from "../lib/trpc";

export default function Sitemap() {
  const { data: urls, isLoading } = trpc.sitemap.getUrls.useQuery();

  useEffect(() => {
    if (urls && !isLoading) {
      // Generate XML
      const xml = generateSitemapXML(urls);
      
      // Set content type and output XML
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      window.location.href = url;
    }
  }, [urls, isLoading]);

  if (isLoading) {
    return <div className="p-8 text-center">جاري تحميل Sitemap...</div>;
  }

  return null;
}

function generateSitemapXML(urls: any[]) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlEntries = urls
    .map((entry) => {
      return `
  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}
    <changefreq>${entry.changefreq || "monthly"}</changefreq>
    <priority>${entry.priority || "0.5"}</priority>
  </url>`;
    })
    .join("");

  return `${xmlHeader}\n${urlsetOpen}${urlEntries}\n${urlsetClose}`;
}
