# Vista Ridge by RK Logistics Group

Premium, property-specific industrial leasing experience for Vista Ridge in Kyle, Texas.

- Live review: https://rk-vista-ridge.vercel.app
- Repository: https://github.com/harrisonmedmedmetrics/rk-vista-ridge

## V1 scope

- Cinematic real-property hero and exterior film
- Executive-approved facility facts and specialized capability story
- Climate-controlled, laboratory, power and H4-readiness sections
- Responsive real-property gallery with lightbox
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
npm start -- --port 4177
node scripts/qa.mjs
```

## Tour-request routing

The form posts to `/api/tour-request`.

- If `TOUR_REQUEST_WEBHOOK_URL` is configured, requests are sent to that endpoint.
- Otherwise, the user receives a prefilled email addressed to RK Logistics' public inquiry inbox.
- Set `TOUR_REQUEST_EMAIL` to change the fallback recipient without changing UI code.
- `TOUR_REQUEST_WEBHOOK_SECRET` adds a bearer credential to webhook requests.
- UTM fields and `gclid` / `fbclid` are captured in the request payload.

See `.env.example` for configuration.

## Media provenance

All facility media in `public/media` is derived from the real property footage supplied and authorized by RK executive leadership. `scripts/prepare_media.py` creates the optimized web derivatives, mobile crop, Open Graph image and exterior film. Internal regeneration requires an approved source map supplied through `RK_MEDIA_CONFIG`; that private mapping is intentionally excluded from this repository. Do not replace documentary property imagery with generated facility features.

## Content boundaries

This repository intentionally excludes raw agreements, customer or employee information, pricing, internal operational exports, and private source documents. Only property facts selected for the V1 experience are present.

## Deployment

This project is designed for a dedicated Vercel review project. Production launch requires:

1. a monitored inquiry recipient or webhook;
2. a successful end-to-end tour-request test; and
3. approval of the exact deployed V1.
