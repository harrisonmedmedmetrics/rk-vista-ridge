import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";

const root = "/home/nemo/projects/rk-vista-ridge";
const nextCli = path.join(root, "node_modules/next/dist/bin/next");

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close(error => error ? reject(error) : resolve(port));
    });
  });
}

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(`${path.basename(command)} ${args.join(" ")} exited ${code}`)));
  });
}

async function waitFor(url, child) {
  let output = "";
  child.stdout.on("data", chunk => { output += chunk.toString(); });
  child.stderr.on("data", chunk => { output += chunk.toString(); });
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Next stopped before it became ready:\n${output}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error(`Next did not become ready within 30 seconds:\n${output}`);
}

async function stop(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await new Promise(resolve => child.once("exit", resolve));
}

const buildId = path.join(root, ".next", "BUILD_ID");
try {
  await fs.access(buildId);
} catch {
  throw new Error("Run npm run build before npm run qa:full.");
}

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const env = {
  ...process.env,
  NODE_ENV: "production",
  NEXT_PUBLIC_SITE_INDEXABLE: "false",
  TOUR_REQUEST_DELIVERY_MODE: "review-mailto",
  TOUR_REQUEST_WEBHOOK_URL: "",
  TOUR_REQUEST_PRIMARY_OWNER: "",
  TOUR_REQUEST_BACKUP_OWNER: "",
  TOUR_REQUEST_RESPONSE_SLA_MINUTES: "",
};
const server = spawn(process.execPath, [nextCli, "start", "--port", String(port)], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] });

try {
  await waitFor(base, server);
  const qaEnv = { ...env, QA_BASE_URL: base, QA_EXPECT_REVIEW: "1" };
  await run(process.execPath, ["scripts/qa.mjs"], qaEnv);
  await run(process.execPath, ["scripts/qa-rk-header.mjs"], qaEnv);
  await run(process.execPath, ["scripts/qa-gallery.mjs"], qaEnv);
  await run(process.execPath, ["scripts/qa-lead-intake.mjs"], qaEnv);
  console.log(JSON.stringify({ ok: true, base, suites: ["browser", "rk-header", "gallery", "lead-intake"] }, null, 2));
} finally {
  await stop(server);
}
