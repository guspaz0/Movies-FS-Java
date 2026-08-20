import { execSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

/**
 * Global teardown: stop the Tomcat instance started by globalSetup.
 * Runs once after the whole Playwright suite finishes (even on failure).
 *
 * The Tomcat process is started by the Playwright runner's globalSetup,
 * which may run in a different process, so we stop it via CATALINA_PID
 * (or by killing whatever listens on the backend port as a fallback).
 *
 * Env knobs:
 *  - TOMCAT_BASE   (default: .tmp-tomcat)
 *  - BACKEND_PORT  (default: 8080)
 *  - KEEP_TOMCAT_RUNNING=1 to leave it up for manual inspection
 */

const TOMCAT_BASE = process.env.TOMCAT_BASE ?? path.join(process.cwd(), ".tmp-tomcat");
const BACKEND_PORT = process.env.BACKEND_PORT ?? "8080";

export default async function globalTeardown() {
  if (process.env.KEEP_TOMCAT_RUNNING) {
    console.log("\n⚠️  KEEP_TOMCAT_RUNNING=1 — leaving Tomcat running\n");
    return;
  }

  let stopped = false;

  // 1. Preferred: stop via CATALINA_PID
  const pidFile = path.join(TOMCAT_BASE, "tomcat.pid");
  if (existsSync(pidFile)) {
    try {
      const pid = readFileSync(pidFile, "utf8").trim();
      if (pid) {
        process.kill(Number(pid), "SIGTERM");
        stopped = true;
        console.log(`\n🛑 Sent SIGTERM to Tomcat (pid ${pid})`);
      }
    } catch (err) {
      console.error("⚠️  Failed to stop Tomcat via PID file:", err);
    }
    rmSync(pidFile, { force: true });
  }

  // 2. Fallback: kill whatever is listening on the backend port
  if (!stopped) {
    try {
      const pids = execSync(
        `lsof -ti tcp:${BACKEND_PORT} -sTCP:LISTEN`,
        { encoding: "utf8" },
      )
        .trim()
        .split("\n")
        .filter(Boolean);
      for (const pid of pids) {
        process.kill(Number(pid), "SIGTERM");
        console.log(`🛑 Killed process ${pid} listening on :${BACKEND_PORT}`);
      }
      stopped = pids.length > 0;
    } catch {
      // nothing listening — fine
    }
  }

  if (!stopped) console.log("\nℹ️  No running Tomcat found to stop\n");
  else console.log("🛑 Tomcat stopped\n");
}
