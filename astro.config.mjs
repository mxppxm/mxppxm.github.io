import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://mxppxm.github.io",
  base: "/",
  output: "static",
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
