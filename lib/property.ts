export const siteConfig = {
  name: "Vista Ridge | RK Logistics Group",
  shortName: "Vista Ridge",
  description:
    "A 208,010-square-foot specialized industrial facility in Kyle, Texas, with climate-controlled capacity, heavy power, a dedicated temperature-controlled workroom and tour availability.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://rk-vista-ridge.vercel.app",
  tourEmail: process.env.TOUR_REQUEST_EMAIL || "info@rklogisticsgroup.com",
  corporateUrl: "https://rklogisticsgroup.com",
  privacyUrl: "https://rklogisticsgroup.com/data-privacy-statement/",
  indexable: process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true",
};

export const property = {
  id: "vista-ridge",
  pageVersion: "2026-08-31-launch-candidate",
  name: "Vista Ridge",
  market: "Kyle, Texas",
  corridor: "Texas Innovation Corridor",
  headline: "Specialized industrial capacity, built for exacting operations.",
  summary:
    "A 208,010-square-foot facility combining substantial warehouse scale with controlled environments, heavy power and specialized support space in the I-35 corridor between Austin and San Antonio.",
  primaryCta: "Request a Tour",
  stats: [
    { value: "208,010", unit: "SF", label: "Total facility" },
    { value: "60,000", unit: "SF", label: "Climate-controlled" },
    { value: "3,250", unit: "SF", label: "Dedicated workroom" },
    { value: "16", unit: "× 480V", label: "Internal power outlets" },
  ],
  technicalProfile: {
    eyebrow: "Facility profile",
    title: "A clear profile for an initial fit check.",
    copy: "A concise view of the physical infrastructure at Vista Ridge, built for preliminary operational evaluation before a property conversation.",
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
      eyebrow: "Controlled environment",
      title: "60,000 SF under precise environmental control",
      copy:
        "A firewall-separated, insulated area with full HVAC control for temperature and humidity, designed for operations where environmental consistency matters.",
    },
    {
      eyebrow: "Integrated cold storage",
      title: "Permanent walk-in refrigerator / freezer",
      copy:
        "A dedicated 360-square-foot walk-in refrigerator and freezer is installed within the climate-controlled footprint.",
    },
    {
      eyebrow: "Dedicated workroom",
      title: "Temperature-controlled workroom on site",
      copy:
        "A 3,250-square-foot dedicated, temperature-controlled workroom supports controlled workflows, evaluation and technical support.",
    },
    {
      eyebrow: "Power infrastructure",
      title: "Heavy power where the work happens",
      copy:
        "Sixteen internal 480V outlets support demanding equipment and flexible industrial operating requirements across the building.",
    },
  ],
  h4: {
    eyebrow: "Hazardous-material readiness",
    title: "Built for operations that cannot compromise.",
    copy:
      "The facility currently holds H4 storage approval based on toxic and corrosive classifications stored on site.",
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
