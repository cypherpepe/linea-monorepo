const isProd = process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
const basePath = isProd ? "/hub/bridge" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s2.coinmarketcap.com",
        pathname: "/static/img/coins/**",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/coins/images/**",
      },
    ],
  },
  sassOptions: {
    prependData: `@use 'sass:math'; @import 'src/scss/breakpoints';`,
  },
  webpack: (config) => {
    const warning = [...(config.ignoreWarnings || []), { module: /typeorm/ }];

    config.ignoreWarnings = warning;

    config.resolve.fallback = {
      fs: false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");

    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
