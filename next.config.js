/** @type {import('next').NextConfig} */

import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
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
      // Vercel Blob Storage - specific hostname
      {
        protocol: "https",
        hostname: "lv4ihdf4sxac4yjo.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      // Vercel Blob Storage - wildcard for all blob storage URLs
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
    optimizeCss: true,
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default process.env.ANALYZE ? bundleAnalyzer(nextConfig) : nextConfig;
