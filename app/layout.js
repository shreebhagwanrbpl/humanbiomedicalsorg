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
  title: "Rajbiosis Pvt Ltd | Laboratory & Hospital Equipment Supplier",
  description:
    "Rajbiosis Pvt Ltd supplies premium laboratory instruments, pathology systems, diagnostic devices, hospital equipment, and healthcare technology solutions.",

  keywords: [
    "laboratory instruments",
    "hospital equipment",
    "diagnostic systems",
    "pathology machines",
    "healthcare devices",
    "medical laboratory equipment",
    "hospital machines",
    "Rajbiosis Pvt Ltd",
    "healthcare technology",
    "medical equipment supplier India"
  ],
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