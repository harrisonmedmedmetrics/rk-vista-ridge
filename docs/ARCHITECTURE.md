# Architecture

## Product shape

Vista Ridge V1 is a single-property leasing experience implemented as a Next.js App Router application. The component and data boundaries are designed so additional RK properties can later use the same shell without duplicating page logic.

## Main layers

- `lib/property.ts`: versioned public property data, capability copy, gallery, location context and inquiry defaults.
- `app/page.tsx`: semantic property-page composition.
- `components/`: reusable navigation, media, gallery, reveal and inquiry components.
- `app/api/tour-request/route.ts`: validated tour-request boundary with optional webhook delivery and RK email fallback.
- `public/media/`: optimized real-property media derivatives.
- `scripts/prepare_media.py`: reproducible internal media-preparation workflow.
- `scripts/qa.mjs`: local or deployed browser QA across desktop, mobile and wide viewports.

## Inquiry flow

1. The client collects required identity, company, interest and consent fields.
2. UTM parameters and click identifiers are added at submission time.
3. `/api/tour-request` performs validation, honeypot filtering, length limits and best-effort rate limiting.
4. When `TOUR_REQUEST_WEBHOOK_URL` is configured, a JSON payload is posted to that destination.
5. Without a webhook, the route returns a prefilled email addressed to `TOUR_REQUEST_EMAIL` or RK's public inbox.

No request data is written to the repository or filesystem.

## Content and privacy boundary

The public application includes only executive-authorized property facts and media. It excludes raw agreements, customer and employee information, pricing, billing, operational exports, inventory, order and claims records.

## Future properties

A portfolio V2 should add:

```text
app/properties/page.tsx
app/properties/[slug]/page.tsx
lib/properties/*.ts or an approved CMS/database
```

The current component structure already supports this migration. Search, map, filtering and comparison should wait until multiple approved properties exist.
