export const siteConfig = {
  name: 'Project Nova',
  description: 'A beautiful, intuitive crypto dashboard with real-time market data',
  url: 'https://project-nova.vercel.app',
  ogImage: 'https://project-nova.vercel.app/og.jpg',
  links: {
    twitter: 'https://twitter.com/yourusername',
    github: 'https://github.com/yourusername/project-nova',
  },
  mainNav: [
    {
      title: 'Dashboard',
      href: '/',
    },
    {
      title: 'Markets',
      href: '/markets',
    },
    {
      title: 'Portfolio',
      href: '/portfolio',
    },
    {
      title: 'Watchlist',
      href: '/watchlist',
    },
  ],
} as const;
