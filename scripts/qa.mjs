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
    return {
      title: document.title,
      h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
      sectionCount: document.querySelectorAll("main section").length,
      imageCount: document.images.length,
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
    ? ["top", "overview", "specialty", "gallery", "location", "rk", "tour", "footer"]
    : ["top", "facility", "controlled", "specialty", "film", "gallery", "location", "rk", "tour", "footer"];
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

  report.viewports[name] = { viewport, facts, axe, consoleErrors, pageErrors, requestFailures };
  if (facts.brokenImages.length || facts.missingTargets.length || facts.upscaledImages.length || facts.scrollWidth > viewport.width + 1 || labelsMissing(facts.labels) || pageErrors.length || consoleErrors.length || axe.some(v => ["critical", "serious"].includes(v.impact))) failed = true;
  await context.close();
}

function labelsMissing(labels) {
  return labels.some(field => field.name !== "website" && !field.labelled);
}

await audit("desktop", { width: 1440, height: 900 });
await audit("mobile", { width: 390, height: 844 });
await audit("tablet", { width: 1024, height: 768 });
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
const galleryHref = await page.getByRole("link", { name: /View all photos/ }).getAttribute("href");
report.carousel = { changed: carouselBefore !== carouselAfter, before: carouselBefore, after: carouselAfter, galleryHref };
if (!report.carousel.changed || galleryHref !== "/gallery") failed = true;
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
console.log(JSON.stringify({ failed, report: path.join(outDir, "qa-report.json"), viewports: Object.keys(report.viewports), form: report.form, carousel: report.carousel, summaries: Object.fromEntries(Object.entries(report.viewports).map(([k,v]) => [k, { scrollWidth: v.facts.scrollWidth, viewport: v.facts.viewport, brokenImages: v.facts.brokenImages.length, upscaledImages: v.facts.upscaledImages.length, axeViolations: v.axe.length, consoleErrors: v.consoleErrors.length, pageErrors: v.pageErrors.length, video: `${v.facts.videoWidth}/${v.facts.videoReadyState}`, lcp: Math.round(v.facts.vitals.lcp), cls: Number(v.facts.vitals.cls.toFixed(4)) }])) }, null, 2));
process.exit(failed ? 1 : 0);
