"use client";

import { useRef, useId } from "react";
import { Printer, X, MapPin, Phone, Mail, Clock } from "lucide-react";
import NextImage from "next/image";
import "./PrintAdmissionForm.css";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PrintAdmissionData {
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email?: string;
  address: string;
  photoUrl: string | null;
  guardianName: string;
  guardianPhone: string;
  courses: string[];
  source: string;
  shift: string;
  shiftTime: string;
  referenceNo: string;
}

interface Props {
  data: PrintAdmissionData;
  onClose: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(raw: string) {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-NP", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function todayFormatted() {
  return new Date().toLocaleDateString("en-NP", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  placeholder = "—",
}: {
  label: string;
  value?: string | null;
  placeholder?: string;
}) {
  const isEmpty = !value?.trim();
  return (
    <div className="paf-field">
      <span className="paf-label">{label}</span>
      <div className={`paf-value${isEmpty ? " empty" : ""}`}>
        {isEmpty ? placeholder : value}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PrintAdmissionForm({ data, onClose }: Props) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const uid = useId().replace(/:/g, "");
  // const formNo = `BB-${new Date().getFullYear()}-${uid.slice(-6).toUpperCase()}`;
  const today = todayFormatted();

  // ── KEY FIX: use window.print() directly ──
  // The @media print CSS already hides everything except .paf-printable-root.
  // No iframe needed — iframes can't resolve Next.js image URLs or load
  // CSS files, so they always print blank.
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-modal-overlay">
      <div className="print-sheet-wrapper">
        {/* ── Toolbar (hidden at print time via CSS) ── */}
        <div className="print-toolbar no-print">
          <span className="print-toolbar-title">
            Admission Form Preview — {data.referenceNo}
          </span>
          <div className="print-toolbar-actions">
            <button
              className="print-btn print-btn-primary"
              onClick={handlePrint}
            >
              <Printer size={13} />
              Print / Save PDF
            </button>
            <button className="print-btn print-btn-ghost" onClick={onClose}>
              <X size={13} />
              Close
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            PRINTABLE DOCUMENT
            The class paf-printable-root is the anchor
            that @media print uses to show ONLY this area.
        ════════════════════════════════════════ */}
        <div className="paf paf-printable-root" ref={printAreaRef}>
          {/* ── Header ── */}
          <div className="paf-header">
            <div className="paf-header-left">
              <div className="paf-logo-circle">
                <NextImage
                  src="/assets/logo-white-no-bg.png"
                  alt="Bake & Brew Logo"
                  width={44}
                  height={44}
                  style={{ objectFit: "contain", padding: 5 }}
                  unoptimized
                />
              </div>
              <div>
                <p className="paf-school-name">
                  Bake &amp; Brew Barista Coffee School
                </p>
                <p className="paf-tagline">
                  Industry-first training in coffee, bakery, and hospitality.
                </p>
                <p className="paf-contact-line">
                  <span className="paf-contact-item">
                    <MapPin size={9} strokeWidth={2.5} />
                    Butwal, Kalikanagar, Rupandehi
                  </span>
                  <span className="paf-contact-sep">|</span>
                  <span className="paf-contact-item">
                    <Phone size={9} strokeWidth={2.5} />
                    +977 9851433332
                  </span>
                  <span className="paf-contact-sep">|</span>
                  <span className="paf-contact-item">
                    <Mail size={9} strokeWidth={2.5} />
                    brewandbakeacademy@gmail.com
                  </span>
                </p>
                <p className="paf-contact-line" style={{ marginTop: 1 }}>
                  <span className="paf-contact-item">
                    <Clock size={9} strokeWidth={2.5} />
                    Sun – Fri, 7:00 AM – 5:00 PM
                  </span>
                  <span className="paf-contact-sep">|</span>
                  PAN: 623612846
                </p>
              </div>
            </div>

            <div className="paf-header-right">
              <div className="paf-photo-box">
                {data.photoUrl ? (
                  <NextImage
                    src={data.photoUrl}
                    alt="Applicant"
                    width={76}
                    height={92}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    unoptimized
                  />
                ) : (
                  <span className="paf-photo-placeholder">
                    Passport
                    <br />
                    Photo
                  </span>
                )}
              </div>
              <span className="paf-form-no">
                Reference No: {data.referenceNo}
              </span>
            </div>
          </div>

          {/* ── Title Banner with Date ── */}
          <div className="paf-title-banner">
            <div className="paf-title-banner-inner">
              <div>
                <h2>Student Admission Form</h2>
                <p>Brew &amp; Bake Academy — {new Date().getFullYear()}</p>
              </div>
              <div className="paf-banner-date">
                <span className="paf-banner-date-label">Date</span>
                <span className="paf-banner-date-value">{today}</span>
              </div>
            </div>
          </div>

          {/* ── Section 1: Personal ── */}
          <div className="paf-section">
            <div className="paf-section-title">1. Personal Information</div>
            <div className="paf-grid paf-grid-3">
              <div className="paf-col-span-2">
                <Field label="Full Name" value={data.fullName} />
              </div>
              <Field label="Gender" value={capitalize(data.gender)} />
              <Field label="Date of Birth" value={formatDate(data.dob)} />
              <Field label="Phone Number" value={data.phone} />
              <Field
                label="Email Address"
                value={data.email}
                placeholder="N/A"
              />
              <div className="paf-col-span-3">
                <Field label="Home Address" value={data.address} />
              </div>
            </div>
          </div>

          {/* ── Section 2: Guardian ── */}
          <div className="paf-section">
            <div className="paf-section-title">
              2. Guardian / Parent Information
            </div>
            <div className="paf-grid paf-grid-2">
              <Field label="Guardian Full Name" value={data.guardianName} />
              <Field label="Guardian Phone" value={data.guardianPhone} />
            </div>
          </div>

          {/* ── Section 3: Course ── */}
          <div className="paf-section">
            <div className="paf-section-title">
              3. Course &amp; Schedule Details
            </div>
            <table className="paf-courses-table">
              <thead>
                <tr>
                  <th className="paf-sn">S.N.</th>
                  <th>Course Name</th>
                </tr>
              </thead>
              <tbody>
                {data.courses.length > 0 ? (
                  data.courses.map((course, i) => (
                    <tr key={i}>
                      <td className="paf-sn">{i + 1}</td>
                      <td>{course}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="paf-sn">—</td>
                    <td style={{ color: "#aaa", fontStyle: "italic" }}>
                      No courses selected
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="paf-grid paf-grid-3" style={{ marginTop: 7 }}>
              <div className="paf-field">
                <span className="paf-label">Shift</span>
                <div className="paf-value">
                  {/* <span className="paf-badge"> */}
                  {capitalize(data.shift) || "—"}
                  {/* </span> */}
                </div>
              </div>
              <Field label="Shift Timing" value={data.shiftTime} />
              <Field
                label="How Did You Hear About Us"
                value={capitalize(data.source)}
              />
            </div>
          </div>

          {/* ── Office Use Only ── */}
          <div className="paf-office-use">
            <div className="paf-office-use-title">For Office Use Only</div>
            <div className="paf-office-grid">
              <Field label="Registration No." value="" placeholder=" " />
              <Field label="Admission Date" value="" placeholder=" " />
              <Field label="Fee Received (NPR)" value="" placeholder=" " />
              <Field label="Receipt No." value="" placeholder=" " />
            </div>
          </div>

          {/* ── Declaration ── */}
          <div className="paf-declaration">
            <strong>Declaration:</strong> I hereby declare that all information
            provided in this form is true and correct to the best of my
            knowledge. I understand that providing false information may result
            in cancellation of my admission. I agree to abide by the rules and
            regulations of{" "}
            <strong>Bake &amp; Brew Barista Coffee School</strong> and
            understand that our team will contact me within 24–48 hours to
            confirm enrollment.
          </div>

          {/* ── Signatures ── */}
          <div className="paf-sig-row">
            <div className="paf-sig-box">
              <div className="paf-sig-line" />
              <span className="paf-sig-label">Applicant&apos;s Signature</span>
            </div>
            <div className="paf-sig-box">
              <div className="paf-sig-line" />
              <span className="paf-sig-label">Guardian&apos;s Signature</span>
            </div>
            <div className="paf-sig-box">
              <div className="paf-sig-line" />
              <span className="paf-sig-label">
                Authorized Signatory &amp; Stamp
              </span>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="paf-footer" style={{ marginTop: 12 }}>
            <div className="paf-footer-left">
              Bake &amp; Brew Barista Coffee School <br /> Butwal, Kalikanagar,
              Rupandehi
            </div>
            <div className="paf-footer-right">
              brewandbakeacademy@gmail.com <br /> +977 9851433332
            </div>
          </div>
        </div>
        {/* end .paf */}
      </div>
    </div>
  );
}
