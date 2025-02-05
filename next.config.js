/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: { API_KEY: process.env.API_KEY, API_URL: process.env.API_URL },
  // swcMinify: true,
  redirects: async () => {
    return [
      {
        source: "/:path*",
        has: [{ type: "header", key: "host", value: "www.justhomestay.in" }],
        destination: "https://justhomestay.in/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      "jhsstorage.biz",
      "stayvista.com",
      "vistarooms.com",
      "localhost",
      "test.justhomestay.in",
      "justhomestay.in",
    ],
    remotePatterns: [
      { protocol: "https", hostname: "img.vistarooms.com" },
      { protocol: "https", hostname: "img.stayvista.com" },
      { protocol: "https", hostname: "jhsstorage.biz" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "test.justhomestay.in" },
      { protocol: "https", hostname: "localhost" },
      { protocol: "https", hostname: "test.justhomestay.in" },
      { protocol: "https", hostname: "justhomestay.in" },
    ],
  },
};

module.exports = nextConfig;
