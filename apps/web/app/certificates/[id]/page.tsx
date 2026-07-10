import type { Metadata } from "next";
import { getCertificateDetails } from "@/lib/queries/certificates/get-certificate-details";
import { CertificateNotFound } from "@/modules/certificates/CertificateNotFound";
import { CertificateVerificationPage } from "@/modules/certificates/CertificateVerificationPage";
import { siteInfo } from "@/utils/site-info";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Certificate Verification — ${siteInfo.company.shortName}`,
    description: `Verify an official training certificate issued by ${siteInfo.company.shortName}. Certificate ID: ${id}`,
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCertificateDetails(id);

  if (result.status === "not_found") {
    return <CertificateNotFound />;
  }

  return <CertificateVerificationPage certificate={result.data} />;
}
