"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Check } from "@/components/icons";

type ApiResult = { ok?: boolean; error?: string; requestId?: string; mode?: string; mailtoUrl?: string };

export function TourRequestForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [mailtoUrl, setMailtoUrl] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    setMailtoUrl("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries()) as Record<string, unknown>;
    const q = new URLSearchParams(window.location.search);
    payload.consent = form.get("consent") === "on";
    payload.propertyId = "vista-ridge";
    payload.pageVersion = "v1";
    payload.source = q.get("utm_source") || "direct";
    payload.medium = q.get("utm_medium") || "website";
    payload.campaign = q.get("utm_campaign") || "";
    payload.term = q.get("utm_term") || "";
    payload.content = q.get("utm_content") || "";
    payload.clickId = q.get("gclid") || q.get("fbclid") || "";

    try {
      const response = await fetch("/api/tour-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as ApiResult;
      if (!response.ok || !result.ok) throw new Error(result.error || "We could not prepare your request.");
      setStatus("success");
      if (result.mode === "mailto" && result.mailtoUrl) {
        setMailtoUrl(result.mailtoUrl);
        setMessage("Your request is ready. Open the prepared email to send it to RK Logistics.");
      } else {
        setMessage(`Thank you. Your request reference is ${result.requestId}. RK Logistics will follow up.`);
        event.currentTarget.reset();
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="tour-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label><span>Name *</span><input name="name" autoComplete="name" required maxLength={100} /></label>
        <label><span>Company *</span><input name="company" autoComplete="organization" required maxLength={140} /></label>
        <label><span>Work email *</span><input name="email" type="email" autoComplete="email" required maxLength={180} /></label>
        <label><span>Phone</span><input name="phone" type="tel" autoComplete="tel" maxLength={50} /></label>
        <label className="form-span-2"><span>What are you exploring? *</span>
          <select name="interest" required defaultValue="">
            <option value="" disabled>Select one</option>
            <option value="lease">Lease / sublease space</option>
            <option value="operated-logistics">RK-operated logistics capacity</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </label>
        <label><span>Approximate space need</span><input name="spaceNeed" placeholder="e.g. 50,000 SF" maxLength={80} /></label>
        <label><span>Timing</span><input name="timeline" placeholder="e.g. Q1 2027" maxLength={80} /></label>
        <label className="form-span-2"><span>Tell us about your operation</span><textarea name="message" rows={5} maxLength={1500} /></label>
      </div>
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="consent-row">
        <input name="consent" type="checkbox" required />
        <span>I agree that RK Logistics may contact me about this property and related logistics solutions.</span>
      </label>
      <div className="form-actions">
        <button className="button button-primary form-submit" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Preparing request…" : "Request a Tour"}<ArrowUpRight />
        </button>
        <p>Qualified tour requests are reviewed directly by RK Logistics.</p>
      </div>
      {status !== "idle" && (
        <div className={`form-status ${status}`} role="status" aria-live="polite">
          {status === "success" && <Check />}
          <span>{message}</span>
          {mailtoUrl && <a href={mailtoUrl}>Open prepared email <ArrowUpRight size={16} /></a>}
        </div>
      )}
    </form>
  );
}
