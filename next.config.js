const { i18n } = require('./next-i18next.config')

const plugins = [];

if(process.env.ANALYZE === 'true') {
  const bundleAnalyzer = require('@next/bundle-analyzer')
  plugins.push(bundleAnalyzer({ enable: true }))
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        'svg-sprite-loader',
        'svgo-loader'
      ]
    })
    
    return config
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  rewrites: async () => [
    { source: '/en/privacy-policy', destination: '/en/content/privacy-policy', locale: false },
    { source: '/ru/privacy-policy', destination: '/ru/content/privacy-policy-ru', locale: false },
    { source: '/en/about-project', destination: '/en/content/about-project-en', locale: false },
    { source: '/ru/about-project', destination: '/ru/content/about-project', locale: false },
  ],
  reactStrictMode: false,
}

module.exports = plugins.reduce((acc, next) => next(acc), nextConfig)
