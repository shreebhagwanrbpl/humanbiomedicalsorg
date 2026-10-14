export const dynamic = "force-dynamic";
export const revalidate = 0;

import About from "@/app/about/page";

export default async function DistrictAboutPage({
  params,
}) {

  const resolvedParams =
    await params;

  const district =
    resolvedParams?.district;

  return (
    <About district={district} />
  );

}