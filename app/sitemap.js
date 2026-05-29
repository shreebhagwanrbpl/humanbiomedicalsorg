import { db } from "@/firebase";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export const dynamic =
  "force-dynamic";

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

    console.log(
      "Total Districts:",
      snapshot.size
    );

    const districtUrls =
      snapshot.docs.map((doc) => ({
        url:
          `${baseUrl}/${doc.id}`,
        lastModified:
          new Date(),
        changeFrequency:
          "daily",
        priority: 0.9,
      }));

    return [
      // Homepage
      {
        url: baseUrl,
        lastModified:
          new Date(),
        priority: 1,
      },

      // Static pages
      {
        url:
          `${baseUrl}/about`,
        priority: 0.8,
      },
      {
        url:
          `${baseUrl}/items`,
        priority: 0.9,
      },
      {
        url:
          `${baseUrl}/services`,
        priority: 0.8,
      },
      {
        url:
          `${baseUrl}/contact`,
        priority: 0.8,
      },

      // 3900+ districts
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