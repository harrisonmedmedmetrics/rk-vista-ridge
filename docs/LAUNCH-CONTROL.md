# Vista Ridge launch-control handoff

This branch is deliberately a review candidate. It is noindex by default and keeps the inquiry form in a visitor-controlled email-draft mode until the commercial team approves launch and configures a verified lead destination.

## What this candidate includes

- The complete 12-image property gallery, with the count stated on the overview and gallery pages.
- A technical-profile section using the confirmed current facility facts in `lib/property.ts`.
- A request path for clear height, bay/column spacing, layout, and permitted-use questions without inventing unverified specifications.
- Production-safe review controls: noindex metadata, a blocking `robots.txt`, and an empty sitemap until approved indexing is explicitly enabled.
- Launch-mode lead routing: a form cannot claim success if the webhook, owner, backup owner, and response SLA are absent or the endpoint fails.

## Approval meeting decisions

Before a public launch, Taylor, James, Peter, Facilities/EHS, legal/commercial, and the lead-system owner should agree on all of these:

1. Public marketing and tours are approved, including whether the offer is lease/sublease, RK-operated capacity, or both.
2. Each public technical claim and image remains accurate and approved for external use.
3. The actual available area, minimum divisible area, timing, proposal terms, and any plan/package that may be sent are approved.
4. A single primary owner, backup owner, and response SLA are named for every inquiry.
5. The webhook destination creates a visible record and alerts the responsible owner.
6. The approved production domain, privacy/terms review, and analytics approach are confirmed.

## Production configuration after approval

Set these in Vercel Production only after the meeting. Do not put values in source control.

```text
NEXT_PUBLIC_SITE_URL=https://<approved-production-domain>
NEXT_PUBLIC_SITE_INDEXABLE=true
TOUR_REQUEST_DELIVERY_MODE=webhook-required
TOUR_REQUEST_WEBHOOK_URL=https://<approved-lead-endpoint>
TOUR_REQUEST_WEBHOOK_SECRET=<stored-in-vercel-only-if-needed>
TOUR_REQUEST_PRIMARY_OWNER=<named-owner>
TOUR_REQUEST_BACKUP_OWNER=<named-backup>
TOUR_REQUEST_RESPONSE_SLA_MINUTES=<positive-integer>
```

When `TOUR_REQUEST_DELIVERY_MODE=webhook-required`, the endpoint returns an error rather than silently falling back to email if routing is incomplete or the webhook fails. That is intentional.

## Verification before production promotion

```bash
npm run lint
npm run typecheck
npm run build
npm run qa:full
```

Then submit one controlled form request through the production candidate and confirm, by reading the exact destination record, that it contains the correct property ID, page version, UTM data, owner, backup owner, and SLA. Confirm the primary owner receives the alert and can respond inside the agreed SLA.

Add email/outbound messaging only after this website launch control is approved. The content, sending domain, suppression/opt-out process, audience, and sender identity require their own commercial and compliance review.
