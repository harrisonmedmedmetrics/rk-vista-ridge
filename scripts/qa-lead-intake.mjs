import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import path from "node:path";

const root = "/home/nemo/projects/rk-vista-ridge";
const nextBin = path.join(root, "node_modules/next/dist/bin/next");
const payload = {
  name: "QA Test",
  company: "Hermes QA",
  email: "qa@example.com",
  interest: "lease",
  consent: true,
  propertyId: "vista-ridge",
  pageVersion: "untrusted-client-value",
  source: "qa",
  medium: "automation",
  campaign: "launch-readiness",
};

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Could not allocate a test port."));
        return;
      }
      const { port } = address;
      server.close(error => error ? reject(error) : resolve(port));
    });
  });
}

async function waitFor(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = "";
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError}`);
}

async function startNext(extraEnv) {
  const port = await freePort();
  const child = spawn(process.execPath, [nextBin, "start", "--port", String(port)], {
    cwd: root,
    env: { ...process.env, ...extraEnv },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", chunk => { output += chunk.toString(); });
  child.stderr.on("data", chunk => { output += chunk.toString(); });
  child.once("error", error => { output += error.message; });
  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await waitFor(baseUrl);
  } catch (error) {
    child.kill("SIGTERM");
    throw new Error(`${error instanceof Error ? error.message : error}\n${output}`);
  }
  return { baseUrl, child };
}

async function stop(child) {
  if (!child || child.exitCode !== null) return;
  child.kill("SIGTERM");
  await new Promise(resolve => child.once("exit", resolve));
}

async function submit(baseUrl) {
  const response = await fetch(`${baseUrl}/api/tour-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { status: response.status, body: await response.json() };
}

async function startWebhook() {
  const received = [];
  const server = http.createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    received.push({ headers: request.headers, body: JSON.parse(body) });
    response.writeHead(201, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ accepted: true }));
  });
  const port = await freePort();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return { received, server, url: `http://127.0.0.1:${port}/tour-requests` };
}

let noRoute;
let routed;
let webhook;
try {
  noRoute = await startNext({ TOUR_REQUEST_DELIVERY_MODE: "webhook-required" });
  const blocked = await submit(noRoute.baseUrl);
  assert.equal(blocked.status, 503, `Expected a launch-mode request without routing to fail safely, received ${blocked.status}.`);
  assert.equal(blocked.body.code, "routing_unavailable");
  await stop(noRoute.child);
  noRoute = undefined;

  webhook = await startWebhook();
  routed = await startNext({
    TOUR_REQUEST_DELIVERY_MODE: "webhook-required",
    TOUR_REQUEST_WEBHOOK_URL: webhook.url,
    TOUR_REQUEST_PRIMARY_OWNER: "primary-owner",
    TOUR_REQUEST_BACKUP_OWNER: "backup-owner",
    TOUR_REQUEST_RESPONSE_SLA_MINUTES: "15",
  });
  const delivered = await submit(routed.baseUrl);
  assert.equal(delivered.status, 200);
  assert.equal(delivered.body.ok, true);
  assert.equal(delivered.body.mode, "webhook");
  await new Promise(resolve => setTimeout(resolve, 150));
  assert.equal(webhook.received.length, 1);
  assert.equal(webhook.received[0].body.propertyId, "vista-ridge");
  assert.equal(webhook.received[0].body.pageVersion, "2026-09-02-james-review");
  assert.deepEqual(webhook.received[0].body.routing, {
    primaryOwner: "primary-owner",
    backupOwner: "backup-owner",
    responseSlaMinutes: 15,
  });
  console.log(JSON.stringify({
    blockedWithoutRouting: blocked.status,
    deliveredWithRouting: delivered.status,
    webhookPayload: {
      propertyId: webhook.received[0].body.propertyId,
      pageVersion: webhook.received[0].body.pageVersion,
      routing: webhook.received[0].body.routing,
    },
  }, null, 2));
} finally {
  await stop(noRoute?.child);
  await stop(routed?.child);
  if (webhook?.server) await new Promise(resolve => webhook.server.close(resolve));
}
