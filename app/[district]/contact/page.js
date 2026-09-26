import Contact from "@/app/contact/page";
import { getDistrictData } from "@/lib/admin-api";

export default async function DistrictContactPage({
  params,
}) {
  const resolvedParams = await params;
  const districtSlug = resolvedParams?.district;

  let districtData = null;

  try {
    districtData = await getDistrictData(districtSlug);
  } catch (error) {
    console.error("Error fetching district contact data:", error);
  }

  const fallbackCity = districtSlug
    ? districtSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "";

  return (
    <Contact
      city={districtData?.district || fallbackCity}
      state={districtData?.state || "India"}
    />
  );
}