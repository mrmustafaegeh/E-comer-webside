/** @type {import('next').NextConfig} */
import withBundleAnalyzer from "@next/bundle-analyzer";
import Critters from "critters";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lv4ihdf4sxac4yjo.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },

  // ADD CSS OPTIMIZATION
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  webpack: (config, { isServer, dev }) => {
    // CSS optimization for production only
    if (!isServer && !dev) {
      const CrittersPlugin = new Critters({
        preload: "swap",
        pruneSource: true,
        reduceInlineStyles: false,
        logLevel: "warn",
      });

      config.plugins = config.plugins || [];
      config.plugins.push(CrittersPlugin);
    }

    // Remove polyfills for modern browsers
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "core-js": false,
        "regenerator-runtime": false,
        "@swc/helpers": false,
      };
    }
    return config;
  },
};

export default process.env.ANALYZE ? bundleAnalyzer(nextConfig) : nextConfig;
