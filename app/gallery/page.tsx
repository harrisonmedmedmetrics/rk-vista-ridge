import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { MobileTourBar } from "@/components/mobile-tour-bar";
import { PropertyGallery } from "@/components/property-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { property, siteConfig } from "@/lib/property";

export const metadata: Metadata = {
  title: "Property Gallery | Vista Ridge",
  description: `Explore ${property.gallery.length} documentary exterior, loading, warehouse and support-space photographs from Vista Ridge in Kyle, Texas.`,
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Vista Ridge Property Gallery",
    description: "Real property photography from Vista Ridge by RK Logistics Group.",
    url: `${siteConfig.url}/gallery`,
    images: [{ url: "/media/official-rk-exterior.webp", width: 1920, height: 1080, alt: "Vista Ridge exterior overview" }],
  },
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="gallery-page">
        <section className="gallery-page-hero" aria-labelledby="gallery-page-title">
          <Image src="/media/official-rk-exterior.webp" alt="Vista Ridge exterior overview" fill priority sizes="100vw" />
          <div className="gallery-page-scrim" aria-hidden="true" />
          <div className="site-container gallery-page-hero-content">
            <p>Vista Ridge · Real property photography</p>
            <h1 id="gallery-page-title">Property<br />Gallery</h1>
            <Link href="/#gallery">Back to property overview <ArrowRight /></Link>
          </div>
        </section>
        <section className="gallery-page-intro">
          <div className="site-container">
            <div className="section-kicker"><span>01</span><p>Explore the facility</p></div>
            <div>
              <h2>{property.gallery.length} views.<br />One facility.</h2>
              <p>Move through exterior arrival, loading infrastructure, warehouse volume, circulation and support space. Select any image for a full-size view.</p>
            </div>
          </div>
        </section>
        <section className="gallery-page-grid" aria-label={`${property.name} property photographs`}>
          <PropertyGallery />
        </section>
        <section className="gallery-page-cta">
          <div className="site-container">
            <p>Ready to see the facility in person?</p>
            <h2>Walk Vista Ridge with the RK team.</h2>
            <Link className="button button-primary" href="/#tour">Request a Tour <ArrowUpRight /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
      <MobileTourBar />
    </>
  );
}
