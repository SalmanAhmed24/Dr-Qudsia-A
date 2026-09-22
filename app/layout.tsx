import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { EMAIL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz"],
});

const body = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dr Qudsia Akram | Assistant Professor of International Relations, Lahore",
    template: "%s | Dr Qudsia Akram",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: [
    "Qudsia Akram",
    "International Relations",
    "Kinnaird College for Women",
    "Middle East politics",
    "South Asia security",
    "Indian Ocean geopolitics",
    "terrorism studies",
    "foreign policy analysis",
    "Lahore",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: SITE_NAME,
    title: "Dr Qudsia Akram | International Relations scholar",
    description: "Research, teaching and talks on the Middle East, South Asia, the Indian Ocean and global security.",
    firstName: "Qudsia",
    lastName: "Akram",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr Qudsia Akram | International Relations scholar",
    description: "Research, teaching and talks on the Middle East, South Asia, the Indian Ocean and global security.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F9FF" },
    { media: "(prefers-color-scheme: dark)", color: "#14162E" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  honorificPrefix: "Dr",
  url: SITE_URL,
  jobTitle: "Assistant Professor of International Relations",
  email: `mailto:${EMAIL}`,
  worksFor: {
    "@type": "CollegeOrUniversity",
    name: "Kinnaird College for Women",
    address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of the Punjab" },
    { "@type": "CollegeOrUniversity", name: "Quaid-i-Azam University" },
    { "@type": "CollegeOrUniversity", name: "Lahore College for Women University" },
  ],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "PhD International Relations" },
    { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "M.Phil. International Relations" },
  ],
  knowsAbout: [
    "International Relations",
    "Middle East politics",
    "Terrorism and counter-terrorism",
    "South Asian security",
    "Indian Ocean geopolitics",
    "Russian foreign policy",
    "Foreign policy analysis",
    "Research methodology",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
