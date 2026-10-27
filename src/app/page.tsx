import { notFound } from "next/navigation";
import HospitalLanding from "@/components/HospitalLanding";
import { getHospitalBySlug } from "@/lib/load-hospital";

const DEFAULT_HOSPITAL = "bangalore";

export default function Home() {
  const hospital = getHospitalBySlug(DEFAULT_HOSPITAL);
  if (!hospital) notFound();

  return <HospitalLanding hospital={hospital} />;
}
