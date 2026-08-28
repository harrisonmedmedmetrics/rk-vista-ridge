"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Close } from "@/components/icons";

const links = [
  ["Overview", "/#overview"],
  ["Facility", "/#facility"],
  ["Location", "/#location"],
  ["Gallery", "/gallery"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`site-header ${solid || open ? "is-solid" : ""}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Vista Ridge home">
          <Image className="brand-logo brand-logo-light" src="/brand/rk-logo-white.png" alt="RK Logistics Group" width={548} height={138} priority />
          <Image className="brand-logo brand-logo-dark" src="/brand/rk-logo.png" alt="RK Logistics Group" width={548} height={138} priority />
          <span className="brand-divider" aria-hidden="true" />
          <span className="property-wordmark">Vista Ridge</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link className="header-cta" href="/#tour">Request a Tour</Link>
        <button className="menu-button" type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
          {open ? <Close /> : <Menu />}
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="mobile-menu is-open">
          <nav aria-label="Mobile navigation">
            {links.map(([label, href], i) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}</Link>
            ))}
            <Link className="mobile-menu-cta" href="/#tour" onClick={() => setOpen(false)}>Request a Tour</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
