import { fetchFullCatalog, getDistrictsData } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl = "https://humanbiomedicals.org";

  try {
    // 1. Fetch District URLs
    let districtUrls = [];
    try {
      const districts = await getDistrictsData();

      districtUrls = (districts || []).flatMap((doc) => {
        const district = doc.slug || doc.id || doc.district;
        if (!district) return [];
        return [
          {
            url: `${baseUrl}/${district}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
          },
          {
            url: `${baseUrl}/${district}/about`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          },
          {
            url: `${baseUrl}/${district}/items`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
          },
          {
            url: `${baseUrl}/${district}/services`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          },
          {
            url: `${baseUrl}/${district}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          },
        ];
      });
    } catch (distErr) {
      console.warn("Could not load districts for sitemap:", distErr.message);
    }

    // 2. Fetch Product URLs
    let productUrls = [];
    try {
      const products = await fetchFullCatalog();
      productUrls = (products || []).map((prod) => ({
        url: `${baseUrl}/items/${prod.slug}`,
        lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    } catch (prodErr) {
      console.warn("Could not load products for sitemap:", prodErr.message);
    }

    return [
      // Homepage
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      // Static Pages
      {
        url: `${baseUrl}/about`,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/items`,
        priority: 0.9,
      },
      {
        url: `${baseUrl}/services`,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        priority: 0.8,
      },
      // All Product URLs
      ...productUrls,
      // All District URLs
      ...districtUrls,
    ];
  } catch (error) {
    console.error("Sitemap Error:", error);

    return [
      {
        url: baseUrl,
        priority: 1,
      },
    ];
  }
}