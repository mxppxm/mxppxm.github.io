import { defineConfig } from "astro/config";
import remarkBreaks from "remark-breaks";

// https://astro.build/config
export default defineConfig({
  site: "https://mxppxm.github.io",
  base: "/",
  output: "static",
  markdown: {
    gfm: true,
    remarkPlugins: [remarkBreaks],
  },
  build: {
    assets: "assets",
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
  },
});
