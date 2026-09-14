import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";

const root = "/home/nemo/projects/rk-vista-ridge";
const outDir = path.join(root, "qa");
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/snap/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const base = process.env.QA_BASE_URL || "http://127.0.0.1:4177";
const report = { url: base, createdAt: new Date().toISOString(), viewports: {}, errors: [], form: {}, links: {}, performance: {} };
let failed = false;

async function audit(name, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  await page.addInitScript(() => {
    window.__qaVitals = { lcp: 0, cls: 0 };
    try {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) window.__qaVitals.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__qaVitals.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}
  });
  page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", err => pageErrors.push(err.message));
  page.on("requestfailed", req => requestFailures.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText}`));
  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(1800);
  await page.evaluate(async () => {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 650) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);

  const facts = await page.evaluate(() => {
    const unloaded = [...document.images].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc || img.src);
    const targets = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute("href")).filter(Boolean);
    const missingTargets = targets.filter(href => href !== "#" && !document.querySelector(href));
    const labels = [...document.querySelectorAll("input:not([type=hidden]), select, textarea")].map(el => ({
      name: el.getAttribute("name"),
      labelled: !!el.closest("label") || !!el.getAttribute("aria-label") || !!el.getAttribute("aria-labelledby"),
    }));
    const video = document.querySelector("video");
    const nav = performance.getEntriesByType("navigation")[0];
    const elementTop = (element) => element?.getBoundingClientRect().top ?? 0;
    const textTop = (element) => {
      if (!element) return 0;
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect().top;
    };
    const relativeTop = (element, parent) => elementTop(element) - elementTop(parent);
    const spread = (values) => values.length ? Math.max(...values) - Math.min(...values) : 0;
    const serviceCards = [...document.querySelectorAll(".service-model-item")];
    const capabilityRows = [...document.querySelectorAll(".capability-row")];
    const facilityStatCells = [...document.querySelectorAll(".facility-stats .stat")];
    const facilityStatValueLabelGaps = facilityStatCells.map(cell => elementTop(cell.querySelector(".stat-label")) - (cell.querySelector(":scope > p")?.getBoundingClientRect().bottom ?? 0));
    const facilityStatUnitOffsets = facilityStatCells.map(cell => {
      const value = cell.querySelector("strong")?.getBoundingClientRect();
      const unit = cell.querySelector(":scope > p > span")?.getBoundingClientRect();
      return value && unit ? (unit.top - value.top) / value.height : 0;
    }).filter(value => value > 0);
    const facilityStatValueCenterDeltas = facilityStatCells.map(cell => {
      const bounds = cell.getBoundingClientRect();
      const value = cell.querySelector("strong")?.getBoundingClientRect();
      const unit = cell.querySelector(":scope > p > span")?.getBoundingClientRect();
      if (!value) return 0;
      const groupCenter = (value.left + (unit?.right ?? value.right)) / 2;
      return Math.abs(groupCenter - (bounds.left + bounds.right) / 2);
    });
    const thirdFacilityStat = document.querySelector(".facility-stats .stat-reveal:nth-child(3)");
    const sourceIcon = document.querySelector(".source-link svg");
    const formatting = {
      overviewTopDelta: Math.round(elementTop(document.querySelector(".overview-title-row > p")) - elementTop(document.querySelector("#overview-title"))),
      facilityTopDelta: Math.round(elementTop(document.querySelector(".facility-intro-copy > p")) - elementTop(document.querySelector("#facility-title"))),
      galleryTopDelta: Math.round(elementTop(document.querySelector(".gallery-title-row > p")) - elementTop(document.querySelector("#gallery-title"))),
      rkTopDelta: Math.round(elementTop(document.querySelector(".rk-copy")) - elementTop(document.querySelector(".rk-brand-intro"))),
      serviceTitleOffsetSpread: Math.round(spread(serviceCards.map(card => relativeTop(card.querySelector("h3"), card)))),
      capabilityTitleCopyMaxDelta: Math.round(Math.max(0, ...capabilityRows.map(row => Math.abs(textTop(row.querySelector("h3")) - textTop(row.querySelector(":scope > p")))))),
      facilityStatMaxValueLabelGap: Math.round(Math.max(0, ...facilityStatValueLabelGaps)),
      facilityStatValueLabelGapSpread: Math.round(spread(facilityStatValueLabelGaps)),
      facilityStatMaxUnitOffsetRatio: Number(Math.max(0, ...facilityStatUnitOffsets).toFixed(2)),
      facilityStatValueCenterMaxDelta: Math.round(Math.max(0, ...facilityStatValueCenterDeltas)),
      sourceIconMarginBottom: sourceIcon ? getComputedStyle(sourceIcon).marginBottom : null,
      locationKickerUsesDarkStyle: document.querySelector(".location-content .section-kicker")?.classList.contains("dark") ?? true,
      rkExperienceValue: document.querySelector(".rk-proof-row > div:first-child strong")?.textContent?.trim(),
      rkExperienceLabel: document.querySelector(".rk-proof-row > div:first-child span")?.textContent?.trim(),
      facilityStatDividerColor: thirdFacilityStat ? getComputedStyle(thirdFacilityStat).borderTopColor : null,
    };
    return {
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
      heroActionsBottom: Math.round(document.querySelector(".hero-actions")?.getBoundingClientRect().bottom || 0),
      sectionCount: document.querySelectorAll("main section").length,
      serviceModelItems: [...document.querySelectorAll(".service-model-item h3")].map(item => item.textContent?.replace(/\s+/g, " ").trim()),
      formatting,
      specificationEntries: [...document.querySelectorAll(".specification-list div")].map(item => ({
        label: item.querySelector("dt")?.textContent?.replace(/\s+/g, " ").trim(),
        value: item.querySelector("dd")?.textContent?.replace(/\s+/g, " ").trim(),
      })),
      imageCount: document.images.length,
      specialtyGap: (() => {
        const heading = document.querySelector("#specialty-title")?.getBoundingClientRect();
        const card = document.querySelector(".specialty-card")?.getBoundingClientRect();
        return heading && card ? Math.round(card.top - heading.bottom) : null;
      })(),
      upscaledImages: [...document.images].map(img => {
        let deliveredWidth = img.naturalWidth;
        try { deliveredWidth = Number(new URL(img.currentSrc || img.src).searchParams.get("w")) || deliveredWidth; } catch {}
        return { img, deliveredWidth };
      }).filter(({ img, deliveredWidth }) => img.clientWidth > 20 && deliveredWidth > 0 && img.clientWidth > deliveredWidth * 1.08).map(({ img, deliveredWidth }) => ({ src: img.currentSrc || img.src, deliveredWidth, naturalWidth: img.naturalWidth, renderedWidth: Math.round(img.clientWidth) })),
      unloadedImages: unloaded,
      brokenImages: [],
      missingTargets,
      labels,
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      videoReadyState: video?.readyState ?? -1,
      videoWidth: video?.videoWidth ?? 0,
      domContentLoaded: nav ? nav.domContentLoadedEventEnd : 0,
      loadEventEnd: nav ? nav.loadEventEnd : 0,
      resourceBytes: performance.getEntriesByType("resource").reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      vitals: window.__qaVitals,
    };
  });

  for (const url of [...new Set(facts.unloadedImages)]) {
    const response = await page.request.get(url);
    if (!response.ok()) facts.brokenImages.push({ url, status: response.status() });
  }

  await page.addScriptTag({ path: path.join(root, "node_modules/axe-core/axe.min.js") });
  const axe = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } });
    return result.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length, targets: v.nodes.slice(0, 10).map(n => n.target) }));
  });

  const screenshotSections = name === "mobile"
    ? ["top", "overview", "specialty", "specifications", "gallery", "location", "rk", "tour", "footer"]
    : ["top", "overview", "facility", "controlled", "specialty", "specifications", "film", "gallery", "location", "rk", "tour", "footer"];
  for (const key of screenshotSections) {
    const selector = {
      top: "#top",
      controlled: ".controlled-section",
      specialty: ".specialty-section",
      film: ".film-section",
      rk: ".rk-section",
      footer: ".site-footer",
    }[key] || `#${key}`;
    const el = page.locator(selector).first();
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(outDir, `${name}-${key}.jpg`), type: "jpeg", quality: 84, fullPage: false });
    }
  }

  const formattingFailed =
    facts.formatting.serviceTitleOffsetSpread > 2 ||
    facts.formatting.facilityStatMaxValueLabelGap > 28 ||
    facts.formatting.facilityStatValueLabelGapSpread > 2 ||
    facts.formatting.facilityStatMaxUnitOffsetRatio > 0.36 ||
    facts.formatting.facilityStatValueCenterMaxDelta > 2 ||
    facts.formatting.sourceIconMarginBottom !== "0px" ||
    facts.formatting.locationKickerUsesDarkStyle ||
    facts.formatting.rkExperienceValue !== "Over 30" ||
    facts.formatting.rkExperienceLabel !== "Years of experience" ||
    (viewport.width > 800 && Math.abs(facts.formatting.overviewTopDelta) > 2) ||
    (viewport.width > 1080 && Math.abs(facts.formatting.facilityTopDelta) > 2) ||
    (viewport.width > 800 && Math.abs(facts.formatting.galleryTopDelta) > 2) ||
    (viewport.width > 800 && Math.abs(facts.formatting.rkTopDelta) > 2) ||
    (viewport.width > 800 && facts.formatting.capabilityTitleCopyMaxDelta > 5) ||
    (viewport.width <= 800 && !facts.formatting.facilityStatDividerColor?.includes("255, 255, 255"));
  report.viewports[name] = { viewport, facts, axe, consoleErrors, pageErrors, requestFailures };
  if (formattingFailed || facts.h1 !== "Managed logistics for Central Texas manufacturers." || facts.heroActionsBottom > viewport.height || facts.serviceModelItems.length !== 4 || facts.serviceModelItems.some(item => !item) || facts.brokenImages.length || facts.missingTargets.length || facts.upscaledImages.length || facts.specificationEntries.length !== 6 || facts.specificationEntries.some(item => !item.label || !item.value) || (facts.specialtyGap !== null && facts.specialtyGap < 24) || facts.scrollWidth > viewport.width + 1 || labelsMissing(facts.labels) || pageErrors.length || consoleErrors.length || axe.some(v => ["critical", "serious"].includes(v.impact))) failed = true;
  await context.close();
}

function labelsMissing(labels) {
  return labels.some(field => field.name !== "website" && !field.labelled);
}

await audit("desktop", { width: 1440, height: 900 });
await audit("mobile", { width: 390, height: 844 });
await audit("tablet", { width: 1024, height: 768 });
await audit("compact", { width: 1280, height: 720 });
await audit("laptop", { width: 1180, height: 820 });
await audit("wide", { width: 1920, height: 1080 });
await audit("ultrawide", { width: 2560, height: 1440 });

const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
await page.goto(`${base}/?utm_source=qa&utm_medium=automation&utm_campaign=v1`, { waitUntil: "domcontentloaded" });
await page.locator("#gallery").scrollIntoViewIfNeeded();
await page.locator(".home-carousel-frame img.is-active").waitFor({ state: "visible", timeout: 15000 });
const carouselBefore = await page.locator(".home-carousel-meta strong").textContent();
await page.getByRole("button", { name: "Next property photo" }).click();
const carouselAfter = await page.locator(".home-carousel-meta strong").textContent();
const galleryHref = await page.getByRole("link", { name: "View all 12 photos" }).getAttribute("href");
report.carousel = { changed: carouselBefore !== carouselAfter, before: carouselBefore, after: carouselAfter, galleryHref };
if (!report.carousel.changed || galleryHref !== "/gallery") failed = true;

const expectReview = process.env.QA_EXPECT_REVIEW !== "0";
const robotsMeta = await page.locator('meta[name="robots"]').getAttribute("content");
const robotsText = await (await page.request.get(`${base}/robots.txt`)).text();
const sitemapText = await (await page.request.get(`${base}/sitemap.xml`)).text();
report.launch = { expectReview, robotsMeta, robotsText, sitemapHasUrl: sitemapText.includes("<url>") };
if (expectReview && (!robotsMeta?.includes("noindex") || !robotsMeta.includes("nofollow") || !robotsText.includes("Disallow: /") || report.launch.sitemapHasUrl)) failed = true;
if (!expectReview && (!robotsMeta?.includes("index") || !robotsText.includes("Allow: /") || !report.launch.sitemapHasUrl)) failed = true;

if (process.env.QA_SKIP_FORM === "1") {
  report.form = { skipped: true, reason: "QA_SKIP_FORM=1" };
} else {
  await page.locator("#tour").scrollIntoViewIfNeeded();
  await page.getByLabel("Name *").fill("QA Test");
  await page.getByLabel("Company *").fill("Hermes QA");
  await page.getByLabel("Work email *").fill("qa@example.com");
  await page.getByLabel("What are you exploring? *").selectOption("unsure");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Request a Tour" }).last().click();
  await page.locator(".form-status.success").waitFor({ timeout: 15000 });
  const mailto = await page.locator('.form-status.success a[href^="mailto:"]').getAttribute("href");
  report.form = { success: true, mailtoPresent: !!mailto, destinationIsRK: !!mailto?.includes("info%40rklogisticsgroup.com"), attributionIncluded: !!mailto?.includes("qa") };
  if (!report.form.mailtoPresent || !report.form.destinationIsRK || !report.form.attributionIncluded) failed = true;
}

const hrefs = await page.locator("a[href]").evaluateAll(els => [...new Set(els.map(el => el.getAttribute("href")))].filter(Boolean));
report.links = { total: hrefs.length, internalAnchors: hrefs.filter(h => h.startsWith("#")).length, external: hrefs.filter(h => h.startsWith("http")).length, mailto: hrefs.filter(h => h.startsWith("mailto:")).length };
await context.close();
await browser.close();

await fs.writeFile(path.join(outDir, "qa-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ failed, report: path.join(outDir, "qa-report.json"), viewports: Object.keys(report.viewports), form: report.form, carousel: report.carousel, summaries: Object.fromEntries(Object.entries(report.viewports).map(([k,v]) => [k, { scrollWidth: v.facts.scrollWidth, viewport: v.facts.viewport, specialtyGap: v.facts.specialtyGap, brokenImages: v.facts.brokenImages.length, upscaledImages: v.facts.upscaledImages.length, axeViolations: v.axe.length, consoleErrors: v.consoleErrors.length, pageErrors: v.pageErrors.length, video: `${v.facts.videoWidth}/${v.facts.videoReadyState}`, lcp: Math.round(v.facts.vitals.lcp), cls: Number(v.facts.vitals.cls.toFixed(4)) }])) }, null, 2));
process.exit(failed ? 1 : 0);
