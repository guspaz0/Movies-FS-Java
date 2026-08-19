import { createRequire } from "node:module";
import { fileURLToPath, URL } from "node:url";
import { cpSync, mkdirSync } from "node:fs";
import { defineConfig, loadEnv, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";

/** Copies ui/WEB-INF into the build output so the WAR keeps its web.xml. */
function copyWebInf(outDir: string): Plugin {
  return {
    name: "copy-web-inf",
    apply: "build",
    closeBundle() {
      const src = fileURLToPath(new URL("./WEB-INF", import.meta.url));
      mkdirSync(outDir, { recursive: true });
      cpSync(src, `${outDir}/WEB-INF`, { recursive: true });
    },
  };
}

const require = createRequire(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    root: fileURLToPath(new URL(".", import.meta.url)),
    build: {
      outDir: fileURLToPath(
        new URL("../src/main/webapp", import.meta.url),
      ),
      emptyOutDir: true,
    },
    plugins: [
      vue(),
      copyWebInf(
        fileURLToPath(new URL("../src/main/webapp", import.meta.url)),
      ),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@fortawesome/fontawesome-svg-core":
          require.resolve("@fortawesome/fontawesome-svg-core"),
      },
    },
  });
};

