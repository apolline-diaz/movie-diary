/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.themoviedb.org",
      },
      {
        protocol: "https",
        hostname: "xcwrhyjbfgzsaslstssc.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.mubicdn.net",
      },
    ],
  },
};

export default nextConfig;
