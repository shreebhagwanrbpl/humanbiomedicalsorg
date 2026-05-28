import Services from "@/app/services/page";

export default async function DistrictServicesPage({
  params,
}) {

  const resolvedParams =
    await params;

  const district =
    resolvedParams?.district;

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
    <Services city={city} />
  );

}