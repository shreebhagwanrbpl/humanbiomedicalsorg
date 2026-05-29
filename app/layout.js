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
  metadataBase: new URL("https://humanbiomedicals.org"),

  title: {
    default:
      "Human Biosis Pvt Ltd | Biomedical, Laboratory & Hospital Equipment Supplier India",
    template: "%s | Human Biosis Pvt Ltd",
  },

  description:
    "Human Biosis Pvt Ltd is a trusted supplier of biomedical, laboratory, pathology, diagnostic, and hospital equipment in India. We provide premium medical devices, ICU equipment, OT setup, pathology machines, and healthcare technology solutions.",

  keywords: [
    "biomedical equipment supplier",
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
    "Human Biosis Pvt Ltd",
  ],

  authors: [
    {
      name: "Human Biosis Pvt Ltd",
    },
  ],

  creator: "Human Biosis Pvt Ltd",
  publisher: "Human Biosis Pvt Ltd",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://humanbiomedicals.org",
  },

  openGraph: {
    title:
      "Human Biosis Pvt Ltd | Biomedical & Hospital Equipment Supplier",
    description:
      "Premium biomedical, laboratory, pathology, diagnostic, and hospital equipment supplier across India.",
    url: "https://humanbiomedicals.org",
    siteName: "Human Biosis Pvt Ltd",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // public folder me image daalna
        width: 1200,
        height: 630,
        alt: "Human Biosis Pvt Ltd",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Human Biosis Pvt Ltd | Biomedical Equipment Supplier",
    description:
      "Trusted supplier of biomedical, pathology, diagnostic, laboratory and hospital equipment.",
    images: ["/og-image.jpg"],
  },

  category: "Medical Equipment",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable}`}
    >
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}