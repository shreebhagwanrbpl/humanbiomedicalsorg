import { db } from "@/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap() {
  const baseUrl =
    "https://humanbiomedicals.org";

  try {
    const snapshot =
      await getDocs(
        collection(
          db,
          "websites",
          "humanbiomedicalsorg",
          "districts"
        )
      );

    const districtUrls =
      snapshot.docs.flatMap(
        (doc) => {
          const district =
            doc.id;

          return [
            // Main district page
            {
              url: `${baseUrl}/${district}`,
              lastModified:
                new Date(),
              changeFrequency:
                "daily",
              priority: 0.9,
            },

            // District About
            {
              url: `${baseUrl}/${district}/about`,
              lastModified:
                new Date(),
              changeFrequency:
                "weekly",
              priority: 0.8,
            },

            // District Items
            {
              url: `${baseUrl}/${district}/items`,
              lastModified:
                new Date(),
              changeFrequency:
                "daily",
              priority: 0.9,
            },

            // District Services
            {
              url: `${baseUrl}/${district}/services`,
              lastModified:
                new Date(),
              changeFrequency:
                "weekly",
              priority: 0.8,
            },

            // District Contact
            {
              url: `${baseUrl}/${district}/contact`,
              lastModified:
                new Date(),
              changeFrequency:
                "monthly",
              priority: 0.7,
            },
          ];
        }
      );

    return [
      // Homepage
      {
        url: baseUrl,
        lastModified:
          new Date(),
        changeFrequency:
          "daily",
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

      // All District URLs
      ...districtUrls,
    ];
  } catch (error) {
    console.error(
      "Sitemap Error:",
      error
    );

    return [
      {
        url: baseUrl,
        priority: 1,
      },
    ];
  }
}