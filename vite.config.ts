import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-edge-adapter/plugin";

export default defineConfig({
  plugins: [remix(), netlifyPlugin(), tsconfigPaths()],
  ssr: {
    // External packages that shouldn't be bundled for the edge
    external: [
      // Node.js built-ins
      'node:crypto',
      'node:fs',
      'node:fs/promises',
      'node:path',
      'node:url',
      'node:util',
      'node:stream',
      'node:buffer',
      'node:http',
      'node:https',
      'node:zlib',
      'node:querystring',
      'node:process',
      'node:events',
      'node:assert',
      'fs',
      'fs/promises',
      'path',
      'url',
      'util',
      'crypto',
      'stream',
      'buffer',
      'http',
      'https',
      'zlib',
      'querystring',
      // Remix packages
      '@remix-run/node',
      // Add packages that depend heavily on Node.js built-ins
      'googleapis',
    ],
  },
});
