import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";

const root = "/home/nemo/projects/rk-vista-ridge";
const outDir = path.join(root, "qa");
await fs.mkdir(outDir, { recursive: true });
const base = process.env.QA_BASE_URL || "http://127.0.0.1:4177";
const browser = await chromium.launch({ headless: true, executablePath: "/snap/bin/chromium", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const report = { url: `${base}/gallery`, viewports: {}, lightbox: {} };
let failed = false;

for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", msg => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
  page.on("pageerror", err => pageErrors.push(err.message));
  await page.goto(`${base}/gallery`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  for (let y = 0; y <= await page.evaluate(() => document.documentElement.scrollHeight); y += 600) {
    await page.evaluate(nextY => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  const facts = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    imageCount: document.images.length,
    brokenImages: [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src),
    galleryItems: document.querySelectorAll(".gallery-item").length,
    unlabelledButtons: [...document.querySelectorAll("button")].filter(button => !(button.getAttribute("aria-label") || button.textContent?.trim())).length,
  }));
  await page.addScriptTag({ path: path.join(root, "node_modules/axe-core/axe.min.js") });
  const axe = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } })).violations.map(v => ({ id: v.id, impact: v.impact, targets: v.nodes.map(n => n.target) })));
  await page.screenshot({ path: path.join(outDir, `${name}-gallery-page-top.jpg`), type: "jpeg", quality: 86, fullPage: false });
  await page.locator(".gallery-page-grid").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, `${name}-gallery-page-grid.jpg`), type: "jpeg", quality: 86, fullPage: false });
  if (name === "desktop") {
    await page.locator(".gallery-item").first().click();
    const dialogOpen = await page.locator("dialog[open]").count() === 1;
    report.lightbox.opened = dialogOpen;
    if (dialogOpen) await page.getByRole("button", { name: "Close image" }).click();
    report.lightbox.closed = await page.locator("dialog[open]").count() === 0;
  }
  report.viewports[name] = { facts, axe, consoleErrors, pageErrors };
  if (facts.scrollWidth > facts.viewport + 1 || facts.brokenImages.length || facts.galleryItems !== 12 || facts.unlabelledButtons || consoleErrors.length || pageErrors.length || axe.some(v => ["critical", "serious"].includes(v.impact))) failed = true;
  await context.close();
}
if (!report.lightbox.opened || !report.lightbox.closed) failed = true;
await browser.close();
await fs.writeFile(path.join(outDir, "qa-gallery-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ failed, report: path.join(outDir, "qa-gallery-report.json"), summary: Object.fromEntries(Object.entries(report.viewports).map(([k,v]) => [k, { viewport: v.facts.viewport, scrollWidth: v.facts.scrollWidth, galleryItems: v.facts.galleryItems, brokenImages: v.facts.brokenImages.length, axeViolations: v.axe.length, consoleErrors: v.consoleErrors.length, pageErrors: v.pageErrors.length }])), lightbox: report.lightbox }, null, 2));
process.exit(failed ? 1 : 0);
