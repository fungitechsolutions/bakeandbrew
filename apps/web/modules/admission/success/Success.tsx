"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle,
  Printer,
  ArrowLeft,
  Clock,
  AlertTriangle,
  User,
  BookOpen,
  Hash,
} from "lucide-react";
import PrintAdmissionForm, { PrintAdmissionData } from "../PrintAdmissionForm";
import { siteInfo } from "@/utils/site-info";
import { useAdmissionStore } from "@/store/useAdmissionStore";

export interface SubmittedAdmission {
  referenceNo: string;
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  source: string;
  shift: "morning" | "day" | "evening";
  shiftTime: string;
  courses: string[];
  photoURL: string | null;
  status: "pending" | "active" | "rejected" | "completed";
  createdAt: string;
  fiscalYear: string;
  email: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NP", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function buildPrintData(student: SubmittedAdmission): PrintAdmissionData {
  return {
    fullName: student.fullName,
    dob: student.dob,
    gender: student.gender,
    phone: student.phone,
    address: student.address,
    photoUrl: student.photoURL ?? null,
    guardianName: student.guardianName,
    guardianPhone: student.guardianPhone,
    courses: student.courses,
    source: student.source,
    shift: student.shift,
    shiftTime: student.shiftTime,
    referenceNo: student.referenceNo,
    email: student.email,
  };
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#2f4e40]/08 last:border-0">
      {Icon && (
        <Icon
          size={14}
          className="mt-0.5 flex-shrink-0 text-[#c28a4f]"
          strokeWidth={2}
        />
      )}
      <div className="flex-1 min-w-0">
        <p
          className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#2f4e40]/40 mb-0.5"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {label}
        </p>
        <p
          className="text-[0.92rem] text-[#1a1a1a] font-medium break-words"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AdmissionSuccessPage() {
  const router = useRouter();
  const { submittedStudent, clearSubmittedStudent } = useAdmissionStore();

  const [showPrint, setShowPrint] = useState(false);
  const [hasPrinted, setHasPrinted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!submittedStudent) {
      router.replace("/admission");
    }
  }, [submittedStudent, router, mounted]);

  //   useEffect(() => {
  //     return () => {
  //       clearSubmittedStudent();
  //     };
  //   }, [clearSubmittedStudent]);

  if (!mounted || !submittedStudent) return null;

  const student = submittedStudent;
  const printData = buildPrintData(student);

  function handlePrintOpen() {
    setShowPrint(true);
    setHasPrinted(true);
  }

  return (
    <>
      <main className="min-h-screen bg-[#fbfaf7] flex flex-col">
        {/* ── Top bar ── */}
        <header className="w-full border-b border-[#2f4e40]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <Image
              src={siteInfo.assets.noBGLogo}
              alt={siteInfo.company.name}
              width={100}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-[#2f4e40]/60 hover:text-[#2f4e40] transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <ArrowLeft size={13} strokeWidth={2.5} />
              Back to Home
            </button>
          </div>
        </header>

        <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* ── Left: confirmation ── */}
            <div className="flex flex-col gap-6">
              {/* Hero confirmation card */}
              <div className="bg-white rounded-2xl border border-[#2f4e40]/10 shadow-sm overflow-hidden">
                {/* Green accent strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#2f4e40] to-[#c28a4f]" />

                <div className="px-6 sm:px-8 pt-8 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#2f4e40]/08 flex items-center justify-center">
                      <CheckCircle
                        size={22}
                        className="text-[#2f4e40]"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div>
                      <h1
                        className="text-[1.55rem] sm:text-[1.85rem] font-bold text-[#1a1a1a] leading-tight tracking-tight"
                        style={{
                          fontFamily: "var(--font-playfair, Georgia, serif)",
                        }}
                      >
                        Application Received
                      </h1>
                      <p
                        className="mt-1.5 text-[0.9rem] text-[#2f4e40]/60 leading-relaxed"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Thank you,{" "}
                        <span className="font-semibold text-[#2f4e40]">
                          {student.fullName.split(" ")[0]}
                        </span>
                        . Your admission form has been successfully submitted to{" "}
                        {siteInfo.company.shortName}.
                      </p>
                    </div>
                  </div>

                  {/* Reference pill */}
                  <div className="mt-6 inline-flex items-center gap-2.5 bg-[#2f4e40]/05 border border-[#2f4e40]/12 rounded-lg px-4 py-2.5">
                    <Hash
                      size={13}
                      className="text-[#c28a4f]"
                      strokeWidth={2.5}
                    />
                    <div>
                      <p
                        className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#2f4e40]/40"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Reference Number
                      </p>
                      <p
                        className="text-[0.95rem] font-bold text-[#2f4e40] tracking-wide mt-0.5"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {student.referenceNo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next steps */}
              <div className="bg-white rounded-2xl border border-[#2f4e40]/10 shadow-sm px-6 sm:px-8 py-6">
                <h2
                  className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#2f4e40]/40 mb-4"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  What Happens Next
                </h2>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      icon: Clock,
                      title: "We will reach out within 24–48 hours",
                      body: "Our admissions team will call or message you to confirm enrollment and share batch details.",
                    },
                    {
                      icon: BookOpen,
                      title: "Keep your reference number safe",
                      body: `Use ${student.referenceNo} for any communication with our office.`,
                    },
                    {
                      icon: User,
                      title: "Student dashboard coming soon",
                      body: "Once your account is activated, you can log in to track your admission status and re-print your form.",
                    },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="flex gap-3.5 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#2f4e40]/06 flex items-center justify-center mt-0.5">
                        <Icon
                          size={14}
                          className="text-[#2f4e40]"
                          strokeWidth={2}
                        />
                      </div>
                      <div>
                        <p
                          className="text-[0.87rem] font-semibold text-[#1a1a1a]"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {title}
                        </p>
                        <p
                          className="text-[0.82rem] text-[#1a1a1a]/50 mt-0.5 leading-relaxed"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Print CTA */}
              <div className="bg-white rounded-2xl border border-[#2f4e40]/10 shadow-sm px-6 sm:px-8 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2
                      className="text-[0.87rem] font-semibold text-[#1a1a1a]"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Save a copy of your form
                    </h2>
                    <p
                      className="text-[0.8rem] text-[#1a1a1a]/50 mt-0.5 leading-relaxed max-w-sm"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Print or save as PDF now. Once you leave this page, this
                      option will not be available until your student dashboard
                      is activated.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={handlePrintOpen}
                      disabled={hasPrinted}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2f4e40] text-white text-[0.85rem] font-semibold transition-all hover:bg-[#3a5a49] disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      <Printer size={14} strokeWidth={2} />
                      {hasPrinted ? "Form Opened" : "Print / Save PDF"}
                    </button>

                    {hasPrinted && (
                      <button
                        onClick={handlePrintOpen}
                        className="inline-flex items-center justify-center gap-1.5 text-[0.75rem] text-[#2f4e40]/50 hover:text-[#2f4e40] transition-colors"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Open again
                      </button>
                    )}
                  </div>
                </div>

                {hasPrinted && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-3">
                    <AlertTriangle
                      size={13}
                      className="text-amber-500 mt-0.5 flex-shrink-0"
                      strokeWidth={2}
                    />
                    <p
                      className="text-[0.78rem] text-amber-700 leading-relaxed"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      You have already opened the print dialog. If you need
                      another copy later, visit your student dashboard once it
                      is activated.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: applicant summary ── */}
            <aside className="bg-white rounded-2xl border border-[#2f4e40]/10 shadow-sm overflow-hidden">
              {/* Photo header */}
              <div className="bg-[#2f4e40] px-6 py-5 flex items-center gap-4">
                {student.photoURL ? (
                  <Image
                    src={student.photoURL}
                    alt={student.fullName}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20 flex-shrink-0"
                    unoptimized
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <User
                      size={20}
                      className="text-white/60"
                      strokeWidth={1.5}
                    />
                  </div>
                )}
                <div>
                  <p
                    className="text-white font-semibold text-[0.95rem] leading-tight"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {student.fullName}
                  </p>
                  <p
                    className="text-white/50 text-[0.75rem] mt-0.5"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {capitalize(student.status)} · {capitalize(student.shift)}
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="px-5 py-2">
                <InfoRow
                  label="Date of Birth"
                  value={formatDate(student.dob)}
                  icon={User}
                />
                <InfoRow label="Phone" value={student.phone} icon={User} />
                <InfoRow label="Address" value={student.address} icon={User} />
                <InfoRow
                  label="Guardian"
                  value={`${student.guardianName} · ${student.guardianPhone}`}
                  icon={User}
                />
                <InfoRow
                  label="Shift"
                  value={`${capitalize(student.shift)} · ${student.shiftTime}`}
                  icon={Clock}
                />
                <InfoRow
                  label="Submitted"
                  value={formatDate(student.createdAt)}
                  icon={CheckCircle}
                />
              </div>

              {/* Fiscal year badge */}
              <div className="px-5 pb-5 pt-1">
                <div className="rounded-lg bg-[#2f4e40]/05 border border-[#2f4e40]/08 px-3.5 py-2.5 flex items-center justify-between">
                  <span
                    className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#2f4e40]/40"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Fiscal Year
                  </span>
                  <span
                    className="text-[0.82rem] font-semibold text-[#2f4e40]"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {student.fiscalYear}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="border-t border-[#2f4e40]/08 bg-white/60 mt-auto">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.75rem] text-[#1a1a1a]/35">
            <span style={{ fontFamily: "var(--font-dm-sans)" }}>
              {siteInfo.company.name} &nbsp;·&nbsp; PAN {siteInfo.company.panNo}
            </span>
            <span style={{ fontFamily: "var(--font-dm-sans)" }}>
              {siteInfo.contact.address} &nbsp;·&nbsp; {siteInfo.contact.phone}
            </span>
          </div>
        </footer>
      </main>

      {/* ── Print modal (outside main to avoid stacking-context issues) ── */}
      {showPrint && (
        <PrintAdmissionForm
          data={{
            ...printData,
          }}
          onClose={() => setShowPrint(false)}
        />
      )}
    </>
  );
}
