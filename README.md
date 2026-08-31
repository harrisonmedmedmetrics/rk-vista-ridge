# Vista Ridge by RK Logistics Group

Premium, property-specific industrial leasing experience for Vista Ridge in Kyle, Texas.

- Live review: https://rk-vista-ridge.vercel.app
- Repository: https://github.com/harrisonmedmedmetrics/rk-vista-ridge

## V1 scope

- Cinematic real-property hero and exterior film
- Executive-approved facility facts and specialized capability story
- Climate-controlled, temperature-controlled workroom, power and H4-readiness sections
- Twelve-image documentary property gallery with lightbox
- Regional Kyle / I-35 location context
- RK Logistics credibility section sourced from the public corporate site
- Validated tour-request flow with UTM/click-ID capture
- Configurable webhook delivery with a safe RK email fallback
- Metadata, Open Graph image, JSON-LD, robots and sitemap
- Responsive, reduced-motion and WCAG 2 AA behavior

## Local development

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run typecheck
npm run build
npm run qa:full
```

## Tour-request routing

The form posts to `/api/tour-request`.

- If `TOUR_REQUEST_WEBHOOK_URL` is configured, requests are sent to that endpoint.
- In review mode, the user receives a prefilled email addressed to RK Logistics' public inquiry inbox.
- For production, set `TOUR_REQUEST_DELIVERY_MODE=webhook-required` with a real monitored endpoint, named primary and backup owners, and a positive response SLA. The API then returns an error instead of silently falling back if routing is incomplete or the endpoint fails.
- Set `TOUR_REQUEST_EMAIL` to change the review fallback recipient without changing UI code.
- `TOUR_REQUEST_WEBHOOK_SECRET` adds a bearer credential to webhook requests.
- UTM fields and `gclid` / `fbclid` are captured in the request payload.

See `.env.example` and `docs/LAUNCH-CONTROL.md` for configuration and approval gates.

## Media provenance

All facility media in `public/media` is derived from real property footage supplied and authorized by RK executive leadership or from RK's existing official property imagery. `scripts/prepare_media.py` creates the optimized web derivatives, mobile crop, Open Graph image and exterior film. Internal regeneration requires an approved source map supplied through `RK_MEDIA_CONFIG`; that private mapping is intentionally excluded from this repository. Do not replace documentary property imagery with generated facility features.

## Content boundaries

This repository intentionally excludes raw agreements, customer or employee information, pricing, internal operational exports, and private source documents. Only property facts selected for the V1 experience are present.

## Deployment

This project is designed for a dedicated Vercel review project. Production launch requires:

1. commercial approval of the exact offer, property facts, media and deployed V1;
2. a monitored webhook with named primary/backup owners and response SLA;
3. a successful end-to-end tour-request test verified at the receiving system; and
4. an approved production domain with `NEXT_PUBLIC_SITE_INDEXABLE=true` applied only at the production build.

The review candidate is deliberately noindex until that final approval. See `docs/LAUNCH-CONTROL.md` for the production handoff and `docs/30-DAY-PILOT.md` for the approval-gated rollout.
