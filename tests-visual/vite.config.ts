import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// the app uses the fonts of the operating system: every page gets the bundled ones instead (see harness/fonts.css)
const bundledFonts = (): Plugin => ({
  name: 'bundled-fonts',
  transformIndexHtml: (html) =>
    html.replace('</head>', '<script type="module">import "/tests-visual/harness/fonts.css";</script></head>'),
});

// serves the app (index.html, every route) and the stories (tests-visual/harness/story.html?story=button)
export default defineConfig({
  root: fileURLToPath(new URL('..', import.meta.url)),
  // .env.test: the api url the tests mock (https://petstore.test)
  mode: 'test',
  plugins: [react(), bundledFonts()],
  server: {
    port: 3100,
    strictPort: true,
  },
});
