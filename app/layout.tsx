import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/property";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Vista Ridge | Specialized Industrial Space in Kyle, Texas",
  description: siteConfig.description,
  applicationName: "Vista Ridge by RK Logistics Group",
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
  icons: { icon: "/brand/rk-logo.png", apple: "/brand/rk-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
