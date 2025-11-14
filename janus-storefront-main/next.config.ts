import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isCI = process.env.CI === "true" || process.env.NODE_ENV === "test";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    ...(isCI ? { unoptimized: true } : {}),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/merchant-center-europe/sample-data/b2c-lifestyle/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "www.graco.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.cdn.us-central1.gcp.commercetools.com",
        port: "",
        pathname: "**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "cf-images.us-east-1.prod.boltdns.net",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
  eslint: {
    // Default next.js eslint directories (https://nextjs.org/docs/app/api-reference/config/eslint#linting-custom-directories-and-files)
    // with the addition of "tests"
    dirs: ["pages", "app", "components", "lib", "src", "tests"],
  },
  async rewrites() {
    return [
      {
        // Allow .html to serve up pages without the .html suffix
        source: "/:path*.html",
        destination: "/:path*",
      },
      // Match .html with trailing segment (e.g., cart id)
      {
        source: "/:path*.html/:uuid",
        destination: "/:path*/:uuid",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");
export default withNextIntl(nextConfig);
