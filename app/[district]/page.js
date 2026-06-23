import HomePage from "../page";

export async function generateMetadata({
  params,
}) {

  const district =
    params?.district || "";

  const city = district
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  const title =
    `Biomedical Equipment Supplier in ${city} | Human Biomedicals`;

  const description =
    `Buy biomedical equipment, pathology analyzers, laboratory instruments, diagnostic systems and hospital equipment in ${city}. Trusted medical equipment supplier in ${city}.`;

  const url =
    `https://humanbiomedicals.org/${district}`;

  return {
    title,
    description,

    keywords: [
      `Biomedical Equipment ${city}`,
      `Hospital Equipment ${city}`,
      `Pathology Equipment ${city}`,
      `Laboratory Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      `${city} Medical Supplier`,
      `${city} Biomedical Supplier`,
      `${city} Hospital Equipment Supplier`,
      "Human Biomedials",
    ],

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url,
      siteName:
        "Human Biomedials",
      locale: "en_IN",
      type: "website",
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page({
  params,
}) {

  const district =
    params?.district ||
    "jaipur";

  const city = district
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  return (
    <HomePage
      city={city}
      district={district}
    />
  );
}