import ItemsPage from "../../itemsbkp/page";

export async function generateMetadata({
  params,
}) {

  const district =
    params?.district || "";

  const city = district
    ? district
      .replace(/-/g, " ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      )
    : "India";

  const title =
    `Medical Laboratory Equipment Supplier in ${city} | Human Biomedicals`;

  const description =
    `Buy laboratory equipment, pathology machines, diagnostic systems, hospital equipment and healthcare devices in ${city}. Trusted medical equipment supplier in ${city}.`;

  const url =
    `https://humanbiomedicals.org/${district}/items`;

  return {
    title,
    description,

    keywords: [
      `Medical Equipment ${city}`,
      `Laboratory Equipment ${city}`,
      `Hospital Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      `Pathology Equipment ${city}`,
      `${city} Medical Supplier`,
      `${city} Laboratory Supplier`,
      `${city} Hospital Equipment Supplier`,
      "Human Biomedicals",
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
        "Human Biomedicals",
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

export default function DistrictItemsPage({
  params,
}) {

  const district =
    params?.district || "";

  const city = district
    ? district
      .replace(/-/g, " ")
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      )
    : "";

  return (
    <ItemsPage city={city} />
  );
}