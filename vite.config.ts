import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";

export default defineConfig({
  plugins: [remix(), netlifyPlugin(), tsconfigPaths()],
  ssr: {
    // Only external Node.js built-ins that we don't use directly
    external: [
      // Node.js built-ins
      'node:crypto',
      'node:fs',
      'node:fs/promises',
      'node:path',
      'node:stream',
      'node:buffer',
      // Excluding @remix-run/node is necessary for Edge compatibility
      '@remix-run/node',
    ]
  },
});
