# Project Nova - Crypto Intelligence Dashboard

A beautiful, intuitive cryptocurrency dashboard with real-time market data, built with Next.js, TypeScript, and Tailwind CSS.

![Project Nova Screenshot](https://via.placeholder.com/1200x600/1a1a2e/ffffff?text=Project+Nova+Screenshot)

## Features

- 🌐 Real-time global cryptocurrency market data
- 📈 Interactive price charts and market trends
- 🚀 Top gainers and losers tracking
- 🔍 Search and filter functionality
- 📱 Fully responsive design
- ⚡ Fast and optimized performance
- 🎨 Sleek, Apple-inspired UI

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- CoinMarketCap API key (free tier available)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-nova.git
   cd project-nova
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory and add your CoinMarketCap API key:
   ```env
   COINMARKETCAP_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Frontend Framework**: Next.js 13 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Fetching**: Fetch API with Server Components
- **Charts**: Chart.js
- **Icons**: Heroicons
- **Animations**: Framer Motion
- **Type Safety**: TypeScript

## API Integration

This project uses the [CoinMarketCap API](https://coinmarketcap.com/api/) to fetch real-time cryptocurrency data. You'll need to sign up for a free API key on their website.

## Environment Variables

Create a `.env.local` file in the root directory with the following variable:

```env
COINMARKETCAP_API_KEY=your_api_key_here
```

## Project Structure

```
project-nova/
├── app/                    # App Router
│   ├── api/                # API routes
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── MarketOverview.tsx  # Global market stats
│   ├── TopPerformers.tsx   # Gainers/Losers section
│   └── MarketTable.tsx     # Main cryptocurrency table
├── lib/                    # Utility functions
│   └── coinmarketcap.ts    # API client
├── public/                 # Static files
└── styles/                 # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [CoinMarketCap](https://coinmarketcap.com/) for the cryptocurrency data
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
