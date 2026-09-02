import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3020";
const corporateRoot = "https://www.rklogisticsgroup.com";
const warehouseLogin = "http://www.rktrac.com/Login/Login.aspx?ReturnUrl=%2f";

const expectedGroups = {
  "What We Do": [
    ["Freight Services", `${corporateRoot}/freight-services.html`],
    ["Manufacturing Support", `${corporateRoot}/what-we-do.html`],
    ["Warehousing", `${corporateRoot}/value-added-logistics-services.html`],
    ["Foreign-Trade Zones", `${corporateRoot}/what-we-do.html`],
    ["Battery Storage", `${corporateRoot}/value-added-logistics-services.html`],
    ["Order Fulfillment", `${corporateRoot}/what-we-do.html`],
    ["Global Spares / Field Service Support", `${corporateRoot}/what-we-do.html`],
    ["Dedicated & Specialty Transportation", `${corporateRoot}/managed-transportation.html`],
    ["Reverse Logistics", `${corporateRoot}/what-we-do.html`],
  ],
  Services: [
    ["Freight Services", `${corporateRoot}/freight-services.html`],
    ["Inbound Control Tower™", `${corporateRoot}/control-tower.html`],
    ["Data Center Build Logistics", `${corporateRoot}/data-center-logistics.html`],
    ["Life Sciences Logistics", `${corporateRoot}/life-sciences-logistics.html`],
    ["Warehouse to World", `${corporateRoot}/warehouse-to-world.html`],
    ["Freight Brokerage", `${corporateRoot}/freight-brokerage.html`],
    ["Manufacturing Support", `${corporateRoot}/what-we-do.html`],
    ["Warehousing & FTZ", `${corporateRoot}/what-we-do.html`],
    ["Fulfillment", `${corporateRoot}/what-we-do.html`],
    ["Reverse Logistics", `${corporateRoot}/what-we-do.html`],
    ["Specialty Transportation", `${corporateRoot}/what-we-do.html`],
    ["Spare Parts Management", `${corporateRoot}/what-we-do.html`],
    ["Operating Standard", `${corporateRoot}/operating-standard.html`],
    ["Underwriter's Pack", `${corporateRoot}/procurement.html`],
  ],
  About: [
    ["About RK", `${corporateRoot}/about.html`],
    ["Innovation Center", `${corporateRoot}/innovation-center.html`],
    ["Industries", `${corporateRoot}/industries.html`],
    ["Team", `${corporateRoot}/team.html`],
    ["Case Studies", `${corporateRoot}/case-studies.html`],
    ["Sustainability", `${corporateRoot}/sustainability.html`],
  ],
  "Customer Login": [
    ["Warehouse Login", warehouseLogin],
    ["Freight Login", `${corporateRoot}/customer-login.html`],
  ],
};

const browser = await chromium.launch({
  executablePath: "/snap/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const report = { base, desktop: {}, mobile: {}, links: {}, typography: {} };

function closeTo(actual, expected, tolerance, message) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: expected ${expected}±${tolerance}, got ${actual}`);
}

async function open(viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  return { context, page };
}

try {
  const { context: desktopContext, page: desktop } = await open({ width: 1180, height: 820 });
  const desktopSnapshot = await desktop.evaluate(() => {
    const style = selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const computed = getComputedStyle(element);
      return {
        display: computed.display,
        width: rect.width,
        height: rect.height,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        borderBottomWidth: computed.borderBottomWidth,
        padding: computed.padding,
      };
    };
    const root = getComputedStyle(document.documentElement);
    return {
      header: style(".site-header"),
      brand: style(".rk-header-brand"),
      wordmark: style(".rk-header-wordmark"),
      tagline: style(".rk-header-tagline"),
      nav: style(".rk-desktop-nav"),
      navItem: style(".rk-desktop-nav > .rk-nav-drop > summary"),
      quote: style(".rk-quote-button"),
      customer: style(".rk-customer-login summary"),
      menu: style(".rk-menu-button"),
      body: style("body"),
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      brandText: document.querySelector(".rk-header-brand")?.innerText?.replace(/\s+/g, " ").trim(),
      topLevel: [...document.querySelectorAll(".rk-desktop-nav > a:not(.rk-nav-login-mobile), .rk-desktop-nav > details > summary")].map(element => element.textContent?.trim()),
      tokens: {
        base: root.getPropertyValue("--rk-text-base").trim(),
        large: root.getPropertyValue("--rk-text-lg").trim(),
        heading: root.getPropertyValue("--rk-text-2xl").trim(),
        hero: root.getPropertyValue("--rk-text-hero").trim(),
      },
    };
  });

  assert.ok(desktopSnapshot.header, "Header is missing");
  closeTo(desktopSnapshot.header.height, 73, 1, "1180px header height");
  assert.equal(desktopSnapshot.header.backgroundColor, "rgba(255, 255, 255, 0.92)");
  assert.equal(desktopSnapshot.header.borderBottomWidth, "1px");
  assert.equal(desktopSnapshot.brandText, "RK Logistics LOGISTICS FOR INNOVATION");
  assert.equal(desktopSnapshot.wordmark.fontSize, "22px");
  assert.equal(desktopSnapshot.wordmark.fontWeight, "700");
  assert.equal(desktopSnapshot.tagline.fontSize, "9.5px");
  assert.equal(desktopSnapshot.tagline.fontWeight, "600");
  assert.equal(desktopSnapshot.tagline.letterSpacing, "2.4px");
  assert.equal(desktopSnapshot.nav.display, "flex");
  assert.equal(desktopSnapshot.navItem.fontSize, "15px");
  assert.equal(desktopSnapshot.navItem.fontWeight, "500");
  assert.equal(desktopSnapshot.navItem.color, "rgb(61, 115, 37)");
  assert.equal(desktopSnapshot.quote.fontSize, "16px");
  assert.equal(desktopSnapshot.quote.fontWeight, "600");
  assert.equal(desktopSnapshot.quote.backgroundColor, "rgb(79, 124, 46)");
  assert.equal(desktopSnapshot.customer.fontSize, "15px");
  assert.equal(desktopSnapshot.customer.fontWeight, "600");
  assert.equal(desktopSnapshot.menu.display, "none");
  assert.deepEqual(desktopSnapshot.topLevel, ["What We Do", "Services", "About", "Where We Are", "Careers", "Latest News"]);
  assert.ok(desktopSnapshot.body.fontFamily.includes("Inter"));
  assert.equal(desktopSnapshot.tokens.base, "clamp(1rem, .95rem + .25vw, 1.125rem)");
  assert.equal(desktopSnapshot.tokens.large, "clamp(1.125rem, 1rem + .75vw, 1.5rem)");
  assert.equal(desktopSnapshot.tokens.heading, "clamp(2rem, 1.2rem + 2.5vw, 3.5rem)");
  assert.equal(desktopSnapshot.tokens.hero, "clamp(2.75rem, 1rem + 5.5vw, 6rem)");
  assert.ok(desktopSnapshot.scrollWidth <= desktopSnapshot.viewportWidth + 1, "Desktop header creates horizontal overflow");
  report.desktop = desktopSnapshot;

  const links = await desktop.locator(".site-header a[href]").evaluateAll(elements => elements.map(element => ({
    text: element.textContent?.replace(/\s+/g, " ").trim(),
    href: element.href,
    target: element.getAttribute("target") || "",
  })));
  const requiredLinks = [
    ["RKLogisticsLogistics for Innovation", `${corporateRoot}/index.html`],
    ["Where We Are", `${corporateRoot}/where-we-are.html`],
    ["Careers", `${corporateRoot}/careers.html`],
    ["Latest News", `${corporateRoot}/field-notes.html`],
    ["Get a Quote", `${corporateRoot}/contact.html`],
    ...Object.values(expectedGroups).flat(),
  ];
  for (const [text, href] of requiredLinks) {
    assert.ok(links.some(link => link.text === text && link.href === href), `Missing or incorrect header link: ${text} -> ${href}`);
  }
  const warehouseLinks = links.filter(link => link.text === "Warehouse Login");
  assert.ok(warehouseLinks.length >= 2, "Warehouse Login must be available in desktop and mobile navigation markup");
  assert.ok(warehouseLinks.every(link => link.href === warehouseLogin && link.target === "_blank"), "Warehouse Login target does not match RK's live header");
  await desktopContext.route(url => url.hostname === "www.rktrac.com", route => route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>Warehouse Login target</title>" }));
  await desktop.locator(".rk-customer-login > .rk-nav-drop > summary").click();
  const warehouseLink = desktop.locator(".rk-customer-login a", { hasText: "Warehouse Login" });
  await warehouseLink.waitFor({ state: "visible" });
  const popupPromise = desktop.waitForEvent("popup");
  await warehouseLink.click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded");
  const clickedWarehouseUrl = new URL(popup.url());
  assert.equal(clickedWarehouseUrl.hostname, "www.rktrac.com");
  assert.equal(clickedWarehouseUrl.pathname, "/Login/Login.aspx");
  assert.equal(clickedWarehouseUrl.searchParams.get("ReturnUrl"), "/");
  await popup.close();
  report.links = { checked: requiredLinks.length, warehouseLogin, warehouseOccurrences: warehouseLinks.length, clickedWarehouseUrl: clickedWarehouseUrl.href };
  report.typography = desktopSnapshot.tokens;
  await desktopContext.close();

  const { context: mobileContext, page: mobile } = await open({ width: 390, height: 844 });
  const mobileAtRest = await mobile.evaluate(() => {
    const info = selector => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return { display: style.display, width: rect.width, height: rect.height, fontSize: style.fontSize };
    };
    return {
      header: info(".site-header"),
      brand: info(".rk-header-brand"),
      quote: info(".rk-quote-button"),
      customer: info(".rk-customer-login"),
      services: info(".rk-mobile-services"),
      menu: info(".rk-menu-button"),
      nav: info(".rk-desktop-nav"),
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    };
  });
  closeTo(mobileAtRest.header.height, 107, 1.5, "390px header height");
  assert.equal(mobileAtRest.customer.display, "none");
  assert.equal(mobileAtRest.services.display, "block");
  assert.equal(mobileAtRest.menu.display, "flex");
  assert.equal(mobileAtRest.nav.display, "none");
  assert.ok(mobileAtRest.scrollWidth <= mobileAtRest.viewportWidth + 1, "Mobile header creates horizontal overflow");

  await mobile.locator(".rk-menu-button").click();
  assert.equal(await mobile.locator(".rk-menu-button").getAttribute("aria-expanded"), "true");
  assert.equal(await mobile.locator(".rk-desktop-nav").getAttribute("data-open"), "true");
  await mobile.locator(".rk-desktop-nav").waitFor({ state: "visible" });
  const openedMobileNav = mobile.locator(".rk-desktop-nav");
  for (const label of ["What We Do", "About", "Where We Are", "Careers", "Latest News", "Warehouse Login", "Freight Login"]) {
    await openedMobileNav.getByText(label, { exact: true }).last().waitFor({ state: "visible" });
  }

  await mobile.locator(".rk-mobile-services > summary").click();
  const mobileServices = await mobile.locator(".rk-mobile-services .rk-nav-panel a").evaluateAll(elements => elements.map(element => [
    element.textContent?.trim(),
    element.href,
  ]));
  assert.deepEqual(mobileServices, expectedGroups.Services);

  const mobileAfter = await mobile.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    menuOpen: document.querySelector(".rk-desktop-nav")?.getAttribute("data-open"),
    servicesOpen: document.querySelector(".rk-mobile-services")?.hasAttribute("open"),
  }));
  assert.ok(mobileAfter.scrollWidth <= mobileAfter.viewportWidth + 1, "Opened mobile menus create horizontal overflow");
  report.mobile = { atRest: mobileAtRest, afterOpen: mobileAfter, services: mobileServices.length };
  await mobileContext.close();

  console.log(JSON.stringify({ ok: true, report }, null, 2));
} finally {
  await browser.close();
}
