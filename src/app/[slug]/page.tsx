import { notFound } from "next/navigation";
import HospitalLanding from "@/components/HospitalLanding";
import { getHospitalBySlug, getHospitalSlugs } from "@/lib/load-hospital";

export async function generateStaticParams() {
  return getHospitalSlugs().map((slug) => ({ slug }));
}

export default async function HospitalLocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hospital = getHospitalBySlug(slug);
  if (!hospital) notFound();

  return <HospitalLanding hospital={hospital} />;
}
