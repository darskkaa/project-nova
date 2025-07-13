/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable static exports
  output: 'export',
  // Base path if your app is hosted in a subdirectory
  // basePath: '',
  // Asset prefix if your app is hosted in a subdirectory
  // assetPrefix: '/',
  
  images: {
    // Configure domains for external images
    domains: [
      's2.coinmarketcap.com',
      's3.coinmarketcap.com',
      'cryptologos.cc',
      'raw.githubusercontent.com',
    ],
    // Disable image optimization in static export
    unoptimized: true,
  },
  
  // Environment variables that should be exposed to the client
  env: {
    NEXT_PUBLIC_APP_NAME: 'Project Nova',
    NEXT_PUBLIC_APP_DESCRIPTION: 'A beautiful, intuitive crypto dashboard with real-time market data',
  },
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add custom webpack configuration here if needed
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    return config;
  },
  
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Enable source maps in production for debugging
  productionBrowserSourceMaps: true,
  
  // Disable redirects in static export
  // Redirects are not supported with output: 'export'
  // Consider handling redirects at the hosting level or client-side
};

// For production builds, we want to use the Netlify plugin
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV !== 'production',
    register: true,
    skipWaiting: true,
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}
