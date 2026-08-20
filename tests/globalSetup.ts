import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

/**
 * Global setup: start the real backend WITHOUT Docker.
 *
 * 1. Downloads a Tomcat binary (tar.gz) if not already cached in .tmp-tomcat/
 * 2. Extracts it and deploys target/cac-0.0.1.war as ROOT.war
 * 3. Starts `catalina.sh run` with the DB env vars from .env
 * 4. Polls the backend until it answers
 *
 * Env knobs:
 *  - TOMCAT_VERSION  (default: 9.0.98)
 *  - TOMCAT_BASE     (default: .tmp-tomcat)
 *  - BACKEND_PORT    (default: 8080)
 *  - BACKEND_URL     (default: http://localhost:8080)
 *  - JAVA_HOME       (must point at JDK 21)
 */

const TOMCAT_VERSION = process.env.TOMCAT_VERSION ?? "9.0.98";
const TOMCAT_BASE = process.env.TOMCAT_BASE ?? path.join(process.cwd(), ".tmp-tomcat");
const TOMCAT_URL = `https://archive.apache.org/dist/tomcat/tomcat-9/v${TOMCAT_VERSION}/bin/apache-tomcat-${TOMCAT_VERSION}.tar.gz`;
const WAR_FILE = path.join(process.cwd(), "target", "cac-0.0.1.war");
const BACKEND_URL = process.env.BACKEND_URL ?? `http://localhost:${process.env.BACKEND_PORT ?? 8080}`;
const READY_TIMEOUT_MS = Number(process.env.READY_TIMEOUT_MS ?? 120_000);
const POLL_INTERVAL_MS = 2_000;

function run(cmd: string) {
  execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
}

function loadDotEnv(): Record<string, string> {
  const envPath = path.join(process.cwd(), ".env");
  const vars: Record<string, string> = {};
  if (!existsSync(envPath)) return vars;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) vars[m[1]] = m[2];
  }
  return vars;
}

async function downloadTomcat(): Promise<string> {
  const tarball = path.join(TOMCAT_BASE, `apache-tomcat-${TOMCAT_VERSION}.tar.gz`);
  if (!existsSync(tarball)) {
    mkdirSync(TOMCAT_BASE, { recursive: true });
    console.log(`⬇️  Downloading Tomcat ${TOMCAT_VERSION} ...`);
    run(`curl -fL --retry 3 -o ${tarball} ${TOMCAT_URL}`);
  }
  return tarball;
}

async function waitForBackend(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError = "";
  while (Date.now() < deadline) {
    try {
      // Any HTTP response (even 404) means Tomcat is up and serving.
      const res = await fetch(url, { method: "GET", signal: AbortSignal.timeout(3000) });
      console.log(`   ↳ ${res.status} ${res.statusText}`);
      return;
    } catch (err) {
      lastError = String(err);
    }
    await delay(POLL_INTERVAL_MS);
  }
  throw new Error(
    `Backend did not become ready at ${url} within ${timeoutMs / 1000}s. ` +
      `Last error: ${lastError}. ` +
      "Check the Tomcat log in .tmp-tomcat/logs/ for startup errors.",
  );
}

export default async function globalSetup() {
  if (!existsSync(WAR_FILE)) {
    throw new Error(`${WAR_FILE} not found — run \`mvn package\` first.`);
  }

  // 1. Download + extract Tomcat (cached in .tmp-tomcat/)
  const tarball = await downloadTomcat();
  const tomcatHome = path.join(TOMCAT_BASE, `apache-tomcat-${TOMCAT_VERSION}`);
  if (!existsSync(path.join(tomcatHome, "bin", "catalina.sh"))) {
    mkdirSync(TOMCAT_BASE, { recursive: true });
    run(`tar -xzf ${tarball} -C ${TOMCAT_BASE}`);
  }

  // 2. Deploy the WAR as ROOT (fresh webapps dir each run)
  const webapps = path.join(tomcatHome, "webapps");
  rmSync(webapps, { recursive: true, force: true });
  mkdirSync(webapps, { recursive: true });
  run(`cp ${WAR_FILE} ${path.join(webapps, "ROOT.war")}`);

  // 3. Start Tomcat with DB env vars from .env
  const dotEnv = loadDotEnv();
  const env: Record<string, string> = {
    ...process.env,
    JAVA_HOME: process.env.JAVA_HOME ?? "",
    CATALINA_PID: path.join(TOMCAT_BASE, "tomcat.pid"),
    // DB vars expected by the Java app (Conexion.java)
    DB_URL: process.env.DB_URL ?? `jdbc:postgresql://localhost:5432/cac_movies`,
    DB_USER: process.env.DB_USER ?? dotEnv.DB_USER ?? "",
    DB_PASS: process.env.DB_PASS ?? dotEnv.DB_PASS ?? "",
    SALT_KEY: process.env.SALT_KEY ?? dotEnv.SALT_KEY ?? "",
  };

  console.log(`🚀 Starting Tomcat ${TOMCAT_VERSION} on ${BACKEND_URL} ...`);
  // Use `catalina.sh start` (daemon mode) instead of `run` so the JVM is
  // fully detached from this process — Playwright won't kill it when setup returns.
  run(
    `JAVA_HOME=${env.JAVA_HOME} CATALINA_PID=${env.CATALINA_PID} ` +
      `DB_URL='${env.DB_URL}' DB_USER='${env.DB_USER}' DB_PASS='${env.DB_PASS}' SALT_KEY='${env.SALT_KEY}' ` +
      `${path.join(tomcatHome, "bin", "catalina.sh")} start`
  );

  // 4. Wait until the backend answers (any HTTP response counts as "up")
  await waitForBackend(`${BACKEND_URL}/movies`, READY_TIMEOUT_MS);
  console.log(`\n✅ Backend ready at ${BACKEND_URL}\n`);
}
