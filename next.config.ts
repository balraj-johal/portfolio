import { NextConfig } from "next";

const config: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
        pathname: `/${process.env.CONTENTFUL_SPACE_ID}/**`,
      },
      {
        protocol: "https",
        hostname: "videos.ctfassets.net",
        port: "",
        pathname: `/${process.env.CONTENTFUL_SPACE_ID}/**`,
      },
    ],
  },
};

module.exports = config;
