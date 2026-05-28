import ItemsPage from "../items/page";

export default async function DistrictItemsPage({
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
    <ItemsPage city={city} />
  );

}