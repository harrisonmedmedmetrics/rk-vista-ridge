import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/property";

// RK's live site uses Inter across its current homepage and navigation.
const inter = Inter({ subsets: ["latin"], variable: "--font-rk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Vista Ridge | Specialized Industrial Space in Kyle, Texas",
  description: siteConfig.description,
  applicationName: "Vista Ridge by RK Logistics Group",
  robots: siteConfig.indexable ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Vista Ridge | RK Logistics Group",
    description: siteConfig.description,
    siteName: "Vista Ridge",
    images: [{ url: "/media/vista-ridge-og.jpg", width: 1200, height: 630, alt: "Vista Ridge industrial facility" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vista Ridge | RK Logistics Group",
    description: siteConfig.description,
    images: ["/media/vista-ridge-og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
