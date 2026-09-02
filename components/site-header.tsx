"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Close, Menu } from "@/components/icons";

const corporateRoot = "https://www.rklogisticsgroup.com";

type NavLink = {
  label: string;
  href: string;
  newTab?: boolean;
};

type NavGroup = {
  label: string;
  links: NavLink[];
};

const whatWeDo: NavGroup = {
  label: "What We Do",
  links: [
    { label: "Freight Services", href: `${corporateRoot}/freight-services.html` },
    { label: "Manufacturing Support", href: `${corporateRoot}/what-we-do.html` },
    { label: "Warehousing", href: `${corporateRoot}/value-added-logistics-services.html` },
    { label: "Foreign-Trade Zones", href: `${corporateRoot}/what-we-do.html` },
    { label: "Battery Storage", href: `${corporateRoot}/value-added-logistics-services.html` },
    { label: "Order Fulfillment", href: `${corporateRoot}/what-we-do.html` },
    { label: "Global Spares / Field Service Support", href: `${corporateRoot}/what-we-do.html` },
    { label: "Dedicated & Specialty Transportation", href: `${corporateRoot}/managed-transportation.html` },
    { label: "Reverse Logistics", href: `${corporateRoot}/what-we-do.html` },
  ],
};

const services: NavGroup = {
  label: "Services",
  links: [
    { label: "Freight Services", href: `${corporateRoot}/freight-services.html` },
    { label: "Inbound Control Tower™", href: `${corporateRoot}/control-tower.html` },
    { label: "Data Center Build Logistics", href: `${corporateRoot}/data-center-logistics.html` },
    { label: "Life Sciences Logistics", href: `${corporateRoot}/life-sciences-logistics.html` },
    { label: "Warehouse to World", href: `${corporateRoot}/warehouse-to-world.html` },
    { label: "Freight Brokerage", href: `${corporateRoot}/freight-brokerage.html` },
    { label: "Manufacturing Support", href: `${corporateRoot}/what-we-do.html` },
    { label: "Warehousing & FTZ", href: `${corporateRoot}/what-we-do.html` },
    { label: "Fulfillment", href: `${corporateRoot}/what-we-do.html` },
    { label: "Reverse Logistics", href: `${corporateRoot}/what-we-do.html` },
    { label: "Specialty Transportation", href: `${corporateRoot}/what-we-do.html` },
    { label: "Spare Parts Management", href: `${corporateRoot}/what-we-do.html` },
    { label: "Operating Standard", href: `${corporateRoot}/operating-standard.html` },
    { label: "Underwriter's Pack", href: `${corporateRoot}/procurement.html` },
  ],
};

const about: NavGroup = {
  label: "About",
  links: [
    { label: "About RK", href: `${corporateRoot}/about.html` },
    { label: "Innovation Center", href: `${corporateRoot}/innovation-center.html` },
    { label: "Industries", href: `${corporateRoot}/industries.html` },
    { label: "Team", href: `${corporateRoot}/team.html` },
    { label: "Case Studies", href: `${corporateRoot}/case-studies.html` },
    { label: "Sustainability", href: `${corporateRoot}/sustainability.html` },
  ],
};

const customerLogin: NavGroup = {
  label: "Customer Login",
  links: [
    { label: "Warehouse Login", href: "http://www.rktrac.com/Login/Login.aspx?ReturnUrl=%2f", newTab: true },
    { label: "Freight Login", href: `${corporateRoot}/customer-login.html` },
  ],
};

const directLinks: NavLink[] = [
  { label: "Where We Are", href: `${corporateRoot}/where-we-are.html` },
  { label: "Careers", href: `${corporateRoot}/careers.html` },
  { label: "Latest News", href: `${corporateRoot}/field-notes.html` },
];

function CorporateLink({ link, className, onNavigate }: { link: NavLink; className?: string; onNavigate?: () => void }) {
  return (
    <a
      className={className}
      href={link.href}
      target={link.newTab ? "_blank" : undefined}
      rel={link.newTab ? "noopener" : undefined}
      onClick={onNavigate}
    >
      {link.label}
    </a>
  );
}

function NavigationGroup({ group, className, onNavigate }: { group: NavGroup; className?: string; onNavigate?: () => void }) {
  return (
    <details className={["rk-nav-drop", className].filter(Boolean).join(" ")}>
      <summary>{group.label}</summary>
      <div className="rk-nav-panel">
        {group.links.map((link) => (
          <CorporateLink key={`${group.label}-${link.label}`} link={link} onNavigate={onNavigate} />
        ))}
      </div>
    </details>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.51 19.51 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16.13 16.13 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeDetails = useCallback(() => {
    headerRef.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((details) => {
      details.open = false;
    });
  }, []);

  const closeNavigation = useCallback(() => {
    setOpen(false);
    closeDetails();
  }, [closeDetails]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeNavigation();
    };
    desktop.addEventListener("change", onDesktopChange);
    return () => desktop.removeEventListener("change", onDesktopChange);
  }, [closeNavigation]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNavigation();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeNavigation, open]);

  const toggleNavigation = () => {
    const nextOpen = !open;
    closeDetails();
    setOpen(nextOpen);
  };

  return (
    <header ref={headerRef} className="site-header rk-site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="rk-header-inner">
        <a className="rk-header-brand" href={`${corporateRoot}/index.html`} aria-label="RK Logistics home">
          <span className="rk-header-wordmark"><span className="rk-header-rk">RK</span>Logistics</span>
          <span className="rk-header-tagline">Logistics for Innovation</span>
        </a>

        <nav className="rk-desktop-nav" id="rk-primary-nav" aria-label="RK Logistics primary navigation" data-open={open ? "true" : "false"}>
          <NavigationGroup group={whatWeDo} onNavigate={closeNavigation} />
          <NavigationGroup group={services} className="rk-nav-services-primary" onNavigate={closeNavigation} />
          <NavigationGroup group={about} onNavigate={closeNavigation} />
          {directLinks.map((link) => <CorporateLink key={link.label} link={link} onNavigate={closeNavigation} />)}
          {customerLogin.links.map((link) => (
            <CorporateLink key={`mobile-${link.label}`} className="rk-nav-login-mobile" link={link} onNavigate={closeNavigation} />
          ))}
        </nav>

        <div className="rk-header-actions">
          <a className="rk-phone" href="tel:+18008217770" aria-label="Call RK Logistics at (800) 821-7770"><PhoneIcon />(800) 821-7770</a>
          <a className="rk-quote-button" href={`${corporateRoot}/contact.html`}>Get a Quote</a>
          <div className="rk-customer-login"><NavigationGroup group={customerLogin} /></div>
          <NavigationGroup group={services} className="rk-mobile-services" onNavigate={closeNavigation} />
          <button
            className="rk-menu-button"
            type="button"
            onClick={toggleNavigation}
            aria-expanded={open}
            aria-controls="rk-primary-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
