import Contact from "@/app/contact/page";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/firebase";

export default async function DistrictContactPage({
  params,
}) {

  const resolvedParams =
    await params;

  const districtSlug =
    resolvedParams?.district;

  let districtData = null;

  try {

    const docRef = doc(
      db,
      "websites",
      "humanbiomedicalsorg",
      "districts",
      districtSlug
    );

    const docSnap =
      await getDoc(docRef);

    if (docSnap.exists()) {

      districtData =
        docSnap.data();

    }

  } catch (error) {

    console.log(error);

  }

  return (
    <Contact
      city={
        districtData?.district
      }
      state={
        districtData?.state
      }
    />
  );

}