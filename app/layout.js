import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import {
  Plus_Jakarta_Sans,
  Inter,
} from "next/font/google";

/* Premium Fonts */

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(
    "https://humanbiomedicals.org"
  ),

  title: {
    default:
      "Human Biomedicals LLP | Biomedicals, Laboratory & Hospital Equipment Supplier India",

    template:
      "%s | Human Biomedicals LLP",
  },

  description:
    "Human Biomedicals LLP is a trusted supplier of biomedicals, laboratory, pathology, diagnostic and hospital equipment in India. We provide premium medical devices, ICU equipment, OT setup, pathology machines and healthcare technology solutions.",

  keywords: [
    "biomedicals equipment supplier",
    "laboratory equipment supplier India",
    "hospital equipment supplier",
    "pathology lab equipment",
    "diagnostic systems India",
    "medical laboratory equipment",
    "hospital machines",
    "medical devices supplier",
    "healthcare technology solutions",
    "ICU equipment supplier",
    "OT equipment supplier",
    "pathology machines India",
    "medical equipment supplier India",
    "hematology analyzer",
    "cbc machine supplier",
    "biochemistry analyzer",
    "elisa reader",
    "electrolyte analyzer",
    "fully automatic analyzer",
    "semi auto analyzer",
    "laboratory instruments",
    "diagnostic equipment supplier",
    "Human Biomedicals LLP",
  ],

  authors: [
    {
      name: "Human Biomedicals LLP",
    },
  ],

  creator:
    "Human Biomedicals LLP",

  publisher:
    "Human Biomedicals LLP",

  verification: {
    google:
      "PASTE_YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview":
        "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical:
      "https://humanbiomedicals.org",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut:
      "/favicon.ico",
    apple:
      "/apple-touch-icon.png",
  },

  openGraph: {
    title:
      "Human Biomedicals LLP | Biomedicals & Hospital Equipment Supplier",

    description:
      "Premium biomedicals, laboratory, pathology, diagnostic and hospital equipment supplier across India.",

    url:
      "https://humanbiomedicals.org",

    siteName:
      "Human Biomedicals LLP",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt:
          "Human Biomedicals LLP",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Human Biomedicals LLP | Medical Equipment Supplier",

    description:
      "Trusted supplier of biomedical, pathology, diagnostic, laboratory and hospital equipment.",

    images: [
      "/og-image.jpg",
    ],
  },

  category:
    "Medical Equipment",
};

export default function RootLayout({
  children,
}) {
  const organizationSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    name:
      "Human Biomedicals LLP",

    url:
      "https://humanbiomedicals.org",

    logo:
      "https://humanbiomedicals.org/logo.png",

    description:
      "Supplier of biomedical, pathology, laboratory and hospital equipment across India.",

    sameAs: [],
  };

  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable}`}
    >
      <body>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                organizationSchema
              ),
          }}
        />

        <Navbar />

        {children}

        <Footer />

      </body>
    </html>
  );
}