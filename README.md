# Crypto Price Watch

A modern, clean cryptocurrency monitoring web application built with Next.js and ShadCN UI.

## Features

- **Real-time Price Monitoring**: Track cryptocurrency prices with live updates
- **Clean Modern UI**: Built with ShadCN UI components and Tailwind CSS
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Search Functionality**: Easily search and filter cryptocurrencies
- **Market Statistics**: View total market cap, 24h volume, and price changes
- **White and Blue Theme**: Clean color scheme as requested

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: ShadCN UI with Radix UI primitives
- **Styling**: Tailwind CSS with custom white/blue theme
- **Icons**: Lucide React
- **Charts**: Recharts (ready for integration)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles and Tailwind imports
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Main dashboard page
├── components/         # Reusable UI components
│   └── ui/            # ShadCN UI components
└── lib/               # Utility functions
    └── utils.ts       # cn() function for class merging
```

## Customization

### Color Scheme

The app uses a clean white and blue color palette defined in `tailwind.config.js`:

- Primary colors: Blue tones (50-900)
- Background: White
- Cards and components: White with subtle borders
- Text: Dark gray for readability

### Adding Real Data

Currently using mock data. To integrate with real cryptocurrency APIs:

1. Get API keys from services like CoinGecko or CryptoCompare
2. Add keys to `.env.local`
3. Replace mock data in `page.tsx` with API calls

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own cryptocurrency applications.
