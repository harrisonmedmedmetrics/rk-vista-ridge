import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/property";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-main">
        <Link className="footer-brand" href="/"><Image src="/brand/rk-logo-white.png" alt="RK Logistics Group" width={548} height={138} /></Link>
        <div className="footer-links"><Link href="/#facility">Facility</Link><Link href="/gallery">Gallery</Link><Link href="/#location">Location</Link><Link href="/#tour">Tour</Link></div>
        <div className="footer-contact"><p>Property inquiries</p><a href={`mailto:${siteConfig.tourEmail}`}>{siteConfig.tourEmail}</a><a href="tel:+18008217770">(800) 821-7770</a></div>
      </div>
      <div className="site-container footer-bottom">
        <span>© {new Date().getFullYear()} RK Logistics Group, Inc.</span>
        <div><a href={siteConfig.privacyUrl} target="_blank" rel="noreferrer">Data Privacy</a><a href="https://rklogisticsgroup.com/terms-and-conditions/" target="_blank" rel="noreferrer">Terms</a></div>
      </div>
    </footer>
  );
}
