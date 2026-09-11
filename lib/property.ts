export const siteConfig = {
  name: "Vista Ridge | RK Logistics Group",
  shortName: "Vista Ridge",
  description:
    "RK-operated warehousing, inventory control, fulfillment and dedicated delivery from a specialized industrial facility in Kyle, Texas.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rk-vista-ridge.vercel.app",
  tourEmail: process.env.TOUR_REQUEST_EMAIL || "info@rklogisticsgroup.com",
  corporateUrl: "https://rklogisticsgroup.com",
  privacyUrl: "https://rklogisticsgroup.com/data-privacy-statement/",
  indexable: process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
};

export const property = {
  id: "vista-ridge",
  pageVersion: "2026-09-11-service-led-review",
  name: "Vista Ridge",
  market: "Kyle, Texas",
  corridor: "Texas Innovation Corridor",
  headline:
    "At Vista Ridge, RK supports receiving, inventory control, staging, fulfillment and dedicated delivery from one Central Texas site.",
  summary:
    "The value is not the building alone. It is the program RK can configure inside it: inbound flow, inventory control, order activity and delivery aligned to each customer operation.",
  primaryCta: "Request a Tour",
  stats: [
    { value: "208,010", unit: "SF", label: "Total facility" },
    { value: "71", unit: "", label: "Dock doors" },
    { value: "60,000", unit: "SF", label: "Climate-controlled" },
    { value: "3,250", unit: "SF", label: "Dedicated workroom" },
  ],
  operatingModel: [
    {
      step: "01",
      eyebrow: "Inbound operations",
      title: "Receive and put away product",
      copy:
        "RK teams support product receipt, put-away and coordinated inbound flow for manufacturing and industrial inventory.",
    },
    {
      step: "02",
      eyebrow: "Inventory control",
      title: "Control and stage inventory",
      copy:
        "RK controls and stages inventory around the requirements of each qualified customer program.",
    },
    {
      step: "03",
      eyebrow: "Order execution",
      title: "Manage orders and fulfillment",
      copy:
        "RK can manage orders, fulfillment and approved value-added services within the same operating environment.",
    },
    {
      step: "04",
      eyebrow: "Outbound coordination",
      title: "Deliver to local operations",
      copy:
        "Dedicated and expedited delivery can connect Vista Ridge inventory to manufacturing sites across the Austin area.",
    },
  ],
  operatingModelNote:
    "Program scope, service requirements and facility fit are confirmed with RK Logistics for each prospective operation.",
  technicalProfile: {
    eyebrow: "Facility proof",
    title: "The physical profile behind the operating story.",
    copy: "Use these verified review-stage facts for an initial fit check, then confirm layout, use, infrastructure and commercial requirements directly with RK.",
    specifications: [
      { label: "Total facility", value: "208,010 SF" },
      { label: "Dock doors", value: "71" },
      { label: "Climate-controlled area", value: "60,000 SF" },
      { label: "Walk-in cold storage", value: "360 SF" },
      { label: "Dedicated workroom", value: "3,250 SF" },
      { label: "Internal power outlets", value: "16 × 480V" },
    ],
    note: "Property information is provided for preliminary evaluation. Final technical fit, proposed use and commercial terms are confirmed with RK Logistics.",
  },
  capabilities: [
    {
      eyebrow: "Controlled warehousing",
      title: "Support qualified controlled-storage needs in a dedicated environment",
      copy:
        "A 60,000-square-foot, firewall-separated and insulated area provides full HVAC control for temperature and humidity where environmental consistency matters.",
    },
    {
      eyebrow: "On-site cold-storage infrastructure",
      title: "Keep refrigerated and frozen storage inside the operation",
      copy:
        "A dedicated 360-square-foot walk-in refrigerator and freezer sits within the climate-controlled footprint, keeping cold-storage capacity close to the managed workflow.",
    },
    {
      eyebrow: "Controlled workflow support",
      title: "Bring specialized work closer to inventory",
      copy:
        "A 3,250-square-foot dedicated, temperature-controlled workroom can support approved controlled workflows, evaluation and technical activity on site.",
    },
    {
      eyebrow: "Equipment-ready operations",
      title: "Position demanding equipment where the work happens",
      copy:
        "Sixteen internal 480V outlets provide flexibility for qualified equipment-intensive and industrial operating requirements.",
    },
    {
      eyebrow: "Hazardous-material fit",
      title: "Evaluate the material profile before the program begins",
      copy:
        "The facility's current H4 storage profile reflects toxic and corrosive classifications stored on site. Every proposed use requires fit confirmation.",
    },
  ],
  h4: {
    eyebrow: "Hazardous-material readiness",
    title: "Start with the material profile. Confirm the operational fit.",
    copy:
      "Vista Ridge currently holds H4 storage approval based on toxic and corrosive classifications stored on site. That existing profile is a starting point, not a blanket approval for every material or program.",
    details: [
      {
        label: "Current storage approval",
        value: "H4",
        copy: "The facility's current hazardous-material storage profile.",
      },
      {
        label: "Classifications on site",
        value: "Toxic + corrosive",
        copy: "The classifications supporting the current storage approval.",
      },
      {
        label: "Other classifications",
        value: "Confirm fit",
        copy: "Additional infrastructure, permitting and operational approval may be required.",
      },
    ],
    caveat:
      "Other hazardous-material classifications may require additional infrastructure, permitting and operational approval. Capability should be confirmed for each proposed use.",
  },
  location: {
    lat: 29.9892928,
    lon: -97.8772103,
    title: "Positioned between Austin and San Antonio",
    copy:
      "Kyle sits in the heart of the I-35 corridor, connecting Central Texas' fast-growing employment, manufacturing and distribution markets.",
    distances: [
      { label: "San Marcos Municipal Airport", value: "12 mi" },
      { label: "Austin-Bergstrom International", value: "25 mi" },
      { label: "San Antonio International", value: "52 mi" },
    ],
    sourceUrl: "https://kyleed.com/choose-kyle/transportation-and-location",
  },
  gallery: [
    { src: "/media/official-rk-exterior.webp", alt: "Wide exterior view of the Vista Ridge building and arrival drive", label: "Exterior overview" },
    { src: "/media/facade.webp", alt: "Vista Ridge exterior façade and arrival court", label: "Façade" },
    { src: "/media/arrival.webp", alt: "Wide arrival view across Vista Ridge", label: "Arrival" },
    { src: "/media/facade-arrival.webp", alt: "Architectural view of the Vista Ridge main-entry façade", label: "Entry architecture" },
    { src: "/media/truck-court.webp", alt: "Wide truck-court view at Vista Ridge", label: "Truck court" },
    { src: "/media/loading.webp", alt: "Exterior loading elevation and truck court at Vista Ridge", label: "Loading elevation" },
    { src: "/media/dock.webp", alt: "Interior loading door and staging area at Vista Ridge", label: "Dock area" },
    { src: "/media/interior-wide.webp", alt: "Wide view across the Vista Ridge warehouse floor", label: "Warehouse-wide" },
    { src: "/media/interior-volume.webp", alt: "Broad warehouse bay showing interior scale at Vista Ridge", label: "Interior volume" },
    { src: "/media/interior-aisle.webp", alt: "Racked storage aisle inside Vista Ridge", label: "Warehouse aisle" },
    { src: "/media/interior-aisle-alt.webp", alt: "Long interior warehouse aisle at Vista Ridge", label: "Storage depth" },
    { src: "/media/office.webp", alt: "Office and support area inside Vista Ridge", label: "Support space" },
  ],
} as const;

export type TourRequest = {
  name: string;
  company: string;
  email: string;
  phone?: string;
  interest: "lease" | "operated-logistics" | "unsure";
  spaceNeed?: string;
  timeline?: string;
  message?: string;
  consent: boolean;
  website?: string;
  propertyId: string;
  pageVersion: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  clickId?: string;
};
