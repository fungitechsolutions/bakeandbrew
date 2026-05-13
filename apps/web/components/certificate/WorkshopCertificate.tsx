"use client";

import Image, { type ImageLoader } from "next/image";
import styles from "./WorkshopCertificate.module.css";
import { siteInfo } from "@/utils/site-info";

export interface WorkshopCertificateProps {
  studentName: string;
  referenceNo: string;
  /** Workshop title e.g. "Specialty Coffee Brewing" */
  workshopTitle: string;
  /** Date string e.g. "May 12, 2026" */
  workshopDate: string;
  /** Issue date string */
  issueDate: string;
  logoUrl: string;
  directorSignatureUrl: string;
  headSignatureUrl: string;
  accreditationLogoUrl?: string;
  footerAddress?: string;
  footerContact?: string;
  footerPhone?: string;
}

const passthroughLoader: ImageLoader = ({ src }) => src;

export function WorkshopCertificate({
  studentName,
  referenceNo,
  workshopTitle,
  workshopDate,
  // issueDate,
  logoUrl,
  // directorSignatureUrl,
  // headSignatureUrl,
  accreditationLogoUrl,
  footerAddress = siteInfo.contact.address,
  footerContact = siteInfo.contact.email,
  footerPhone = siteInfo.contact.phone,
}: WorkshopCertificateProps) {
  const centerMarkUrl = accreditationLogoUrl ?? logoUrl;

  return (
    <div className={styles.printScope} data-certificate>
      <div className={styles.previewFrame}>
        <section className={styles.paper} aria-label="Workshop Certificate">
          {/* ── Top arc — gold tones instead of green ── */}
          <svg
            className={styles.topArc}
            viewBox="0 0 794 210"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="wsArcGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7a4e24" stopOpacity="0.50" />
                <stop offset="55%" stopColor="#c28a4f" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#7a4e24" stopOpacity="0.46" />
              </linearGradient>
            </defs>
            <path
              d="M0,168 C120,42 300,32 415,78 C556,134 664,134 794,72 L794,0 L0,0 Z"
              fill="url(#wsArcGrad)"
            />
            <path
              d="M0,182 C120,58 300,46 415,92 C556,148 664,148 794,86"
              fill="none"
              stroke="#c28a4f"
              strokeWidth="3"
              opacity="0.3"
            />
          </svg>

          {/* ── Logo ── */}
          <div className={styles.logoCorner} aria-hidden="true">
            <Image
              className={styles.logoCornerImg}
              src={logoUrl}
              alt=""
              loader={passthroughLoader}
              priority
              width={150}
              height={150}
            />
          </div>

          {/* ── Top-right ── */}
          <div className={styles.topRightMeta}>
            <div className={styles.schoolNameHeader}>
              {siteInfo.company.shortName}
            </div>
            <div className={styles.certNoRow}>
              <span className={styles.metaLabel}>Certificate No.</span>
              <span className={styles.metaValue}>{referenceNo}</span>
            </div>
          </div>

          {/* ── Body ── */}
          <div className={styles.body}>
            {/* Title — "Certificate of Participation" instead of "of Training" */}
            <div className={styles.titleStack}>
              <div className={styles.scriptBig}>Certificate</div>
              <div className={styles.scriptMedium}>of Participation</div>
            </div>

            <div className={styles.titleRule} aria-hidden="true" />

            <div className={styles.presentedTo}>Proudly presented to</div>

            <div className={styles.studentBlock}>
              <div className={styles.studentName}>{studentName}</div>
              <div className={styles.studentRule} aria-hidden="true" />
            </div>

            {/* Workshop-specific prose */}
            <p className={styles.bodyProse}>
              This is to certify that the above named individual has
              successfully attended and participated in the one day workshop{" "}
              <span className={styles.courseInline}>{workshopTitle}</span> held
              on <span className={styles.courseInline}>{workshopDate}</span>,
              organised by{" "}
              <span className={styles.schoolInline}>
                {siteInfo.company.shortName}
              </span>
              .
            </p>

            {/* <div className={styles.issuedOn}>Issued on {issueDate}</div> */}
          </div>

          {/* ── Footer arc — green tones to complement gold header ── */}
          <div className={styles.footerArcWrap} aria-hidden="true">
            <svg
              className={styles.footerArc}
              viewBox="0 0 794 190"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="wsFooterGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2f4e40" stopOpacity="0.40" />
                  <stop offset="55%" stopColor="#3a5a49" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#2f4e40" stopOpacity="0.36" />
                </linearGradient>
              </defs>
              <path
                d="M0,20 C128,128 288,152 415,114 C558,68 668,68 794,132 L794,190 L0,190 Z"
                fill="url(#wsFooterGrad)"
              />
              <path
                d="M0,10 C128,114 288,138 415,100 C558,52 668,52 794,116"
                fill="none"
                stroke="#2f4e40"
                strokeWidth="3"
                opacity="0.28"
              />
            </svg>

            {/* Address + PAN left · email + phone right */}
            <div className={styles.footerMeta}>
              <div className={styles.footerLeft}>
                <div className={styles.footerAddress}>{footerAddress}</div>
                <div className={styles.footerPan}>
                  PAN: {siteInfo.company.panNo}
                </div>
              </div>
              <div className={styles.footerContact}>
                {footerContact}
                <br />
                {footerPhone}
              </div>
            </div>
          </div>

          {/* ── Signatures ── */}
          <footer className={styles.bottom} aria-label="Signatures">
            <div className={styles.sigCol}>
              <div className={styles.sigBlank} />
              <div className={styles.sigLine} aria-hidden="true" />
              <div className={styles.sigLabel}>Training Director</div>
            </div>
            <div className={styles.centerCol}>
              {/* <Image
                className={styles.bottomMark}
                src={centerMarkUrl}
                alt="academy mark"
                loader={passthroughLoader}
                unoptimized
                width={180}
                height={180}
              /> */}
            </div>
            <div className={styles.sigCol}>
              <div className={styles.sigBlank} />
              <div className={styles.sigLine} aria-hidden="true" />
              <div className={styles.sigLabel}>Head of School</div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
