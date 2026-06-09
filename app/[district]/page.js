import HomePage from "../page";

// SEO Metadata
export async function generateMetadata({
  params,
}) {

  const resolvedParams =
    await params;

  const district =
    resolvedParams?.district || "";

  const city = district
    .replace(/-/g, " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  return {
    title:
      `Biomedical Equipment Supplier in ${city} | Human Biomedicals`,

    description:
      `Buy biomedical, pathology, laboratory and hospital equipment in ${city}. Trusted medical equipment supplier in ${city}.`,

    keywords: [
      `Biomedical Equipment ${city}`,
      `Hospital Equipment ${city}`,
      `Pathology Equipment ${city}`,
      `Laboratory Equipment ${city}`,
      `${city} Medical Supplier`,
    ],

    alternates: {
      canonical:
        `https://humanbiomedicals.org/${district}`,
    },
  };
}

export default async function Page({
  params,
}) {

  const resolvedParams =
    await params;

  const district =
    resolvedParams?.district ||
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