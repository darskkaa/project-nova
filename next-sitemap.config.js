/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com', // Replace with your actual domain
  generateRobotsTxt: true, // Generate robots.txt
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  exclude: ['/server-sitemap.xml'],
  generateIndexSitemap: true,
  outDir: 'public',
  // Additional configuration options
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  // Next.js specific configuration
  targetDirectory: 'public',
  // Add any additional paths that should be included in the sitemap
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/markets'),
    await config.transform(config, '/watchlist'),
    await config.transform(config, '/news'),
  ],
}
