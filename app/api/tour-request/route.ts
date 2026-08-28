import { NextResponse } from "next/server";
import { siteConfig, type TourRequest } from "@/lib/property";

const rateLimit = new Map<string, { count: number; reset: number }>();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERESTS = new Set(["lease", "operated-logistics", "unsure"]);

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function allowed(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "unknown";
  const ip = forwarded.split(",")[0].trim();
  const now = Date.now();
  const existing = rateLimit.get(ip);
  if (!existing || existing.reset < now) {
    rateLimit.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (existing.count >= 5) return false;
  existing.count += 1;
  return true;
}

function buildMailto(data: TourRequest, requestId: string) {
  const interest = {
    lease: "Lease / sublease space",
    "operated-logistics": "RK-operated logistics capacity",
    unsure: "Not sure yet",
  }[data.interest];
  const body = [
    "Vista Ridge tour request",
    "",
    `Request reference: ${requestId}`,
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Interest: ${interest}`,
    `Approximate space need: ${data.spaceNeed || "Not provided"}`,
    `Timing: ${data.timeline || "Not provided"}`,
    "",
    "Message:",
    data.message || "No additional message",
    "",
    `Attribution: source=${data.source || "direct"}; medium=${data.medium || "website"}; campaign=${data.campaign || "none"}; term=${data.term || "none"}; content=${data.content || "none"}; click_id=${data.clickId || "none"}`,
  ].join("\n");
  return `mailto:${encodeURIComponent(siteConfig.tourEmail)}?subject=${encodeURIComponent("Vista Ridge — request a tour")}&body=${encodeURIComponent(body)}`;
}

export async function POST(request: Request) {
  if (!allowed(request)) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  }

  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (text(raw.website, 100)) {
    return NextResponse.json({ ok: true, requestId: crypto.randomUUID(), mode: "accepted" });
  }

  const data: TourRequest = {
    name: text(raw.name, 100),
    company: text(raw.company, 140),
    email: text(raw.email, 180).toLowerCase(),
    phone: text(raw.phone, 50),
    interest: text(raw.interest, 40) as TourRequest["interest"],
    spaceNeed: text(raw.spaceNeed, 80),
    timeline: text(raw.timeline, 80),
    message: text(raw.message, 1500),
    consent: raw.consent === true,
    website: "",
    propertyId: text(raw.propertyId, 80),
    pageVersion: text(raw.pageVersion, 40),
    source: text(raw.source, 120),
    medium: text(raw.medium, 120),
    campaign: text(raw.campaign, 120),
    term: text(raw.term, 120),
    content: text(raw.content, 120),
    clickId: text(raw.clickId, 200),
  };

  if (!data.name || !data.company || !EMAIL_RE.test(data.email) || !INTERESTS.has(data.interest) || !data.consent || data.propertyId !== "vista-ridge") {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  const requestId = crypto.randomUUID();
  const webhook = process.env.TOUR_REQUEST_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.TOUR_REQUEST_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.TOUR_REQUEST_WEBHOOK_SECRET}` } : {}),
        },
        body: JSON.stringify({ ...data, requestId, receivedAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(7000),
      });
      if (response.ok) return NextResponse.json({ ok: true, requestId, mode: "webhook" });
    } catch {
      // Fall through to the safe, user-controlled email path.
    }
  }

  return NextResponse.json({ ok: true, requestId, mode: "mailto", mailtoUrl: buildMailto(data, requestId) });
}
