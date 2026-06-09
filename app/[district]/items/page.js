import ItemsPage from "../../items/page";

// SEO Metadata
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

  return {
    title:
      `Buy Medical Laboratory Equipment in ${city} | Human Biomedicals`,

    description:
      `Buy laboratory equipment, hospital machines, pathology devices, diagnostic systems in ${city}. Best medical equipment supplier in ${city}.`,

    keywords: [
      `Medical Equipment ${city}`,
      `Laboratory Equipment ${city}`,
      `Hospital Equipment ${city}`,
      `Diagnostic Equipment ${city}`,
      `Pathology Equipment ${city}`,
      `${city} Medical Supplier`,
    ],

    alternates: {
      canonical:
        `https://humanbiomedicals.org/${district}/items`,
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