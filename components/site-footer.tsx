import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Your Name
            </a>
            . The source code is available on{' '}
            <a
              href="https://github.com/yourusername/project-nova"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <Link
            href="https://github.com/yourusername/project-nova"
            target="_blank"
            rel="noreferrer"
            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noreferrer"
            className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
          >
            <Twitter className="h-4 w-4" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
      <div className="container py-4 text-center text-xs text-muted-foreground">
        <p>
          Data provided by{' '}
          <a
            href="https://coinmarketcap.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            CoinMarketCap
          </a>
          . This is not financial advice. Cryptocurrency trading involves risk.
        </p>
      </div>
    </footer>
  );
}
