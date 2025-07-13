import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Project Nova - Crypto Intelligence Dashboard',
  description: 'A beautiful, intuitive crypto dashboard with real-time market data',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
  viewport: 'width=device-width, initial-scale=1',
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#030712" media="(prefers-color-scheme: dark)" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-dark-950 dark:to-dark-900 text-gray-900 dark:text-white transition-colors duration-200`}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="py-6 border-t border-gray-200 dark:border-dark-700">
              <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Data provided by <a href="https://coinmarketcap.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">CoinMarketCap</a></p>
                <p className="mt-1">© {new Date().getFullYear()} Project Nova. All rights reserved.</p>
              </div>
            </footer>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
