// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://josmrpy.github.io",
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/josmrpy/josmrpy/raw/main/banner.png",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/josmrpy/josmrpy/main/banner.png",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/josmrpy.png",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
    ],
  },
});
