/** @type {import('next').NextConfig} */

const nextConfig = {
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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|wgsl|vert|frag)$/,
      use: ["raw-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;
