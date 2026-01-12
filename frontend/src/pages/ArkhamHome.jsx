import { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Filter,
  Link2,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  X,
  Wallet,
  Menu
} from 'lucide-react';

// ============ MOCK DATA ============

// Top Entities Carousel
const topEntities = [
  { name: "Bybit", price: "$28.41B", change: "+0.38%", isPositive: true, icon: "🟡" },
  { name: "MetaPlanet", price: "$3.19B", change: "-0.47%", isPositive: false, icon: "🔵" },
  { name: "ARK Invest", price: "$3.39B", change: "+9.49%", isPositive: true, icon: "📊" },
  { name: "Donald Trump", price: "$1.02M", change: "-0.5%", isPositive: false, icon: "🇺🇸" },
  { name: "Multisig Exploit", price: "$318.9M", change: "-1.17%", isPositive: false, icon: "☠️" },
  { name: "Exchange", price: "$34.89M", change: "-0.45%", isPositive: false, icon: "⬛" },
  { name: "Wintermute", price: "$205.4M", change: "-0.23%", isPositive: false, icon: "❄️" },
  { name: "Kraken", price: "$12.4B", change: "+0.12%", isPositive: true, icon: "🐙" },
];

// Market Stats
const marketStats = {
  totalMarketCap: "$3.102.5B",
  marketCapChange: "+0.49%",
  btcDominance: "58.47%",
  btcChange: "-0.01%",
  ethDominance: "12.13%",
  ethChange: "+0.08%",
  volume24h: "$58.3B",
  volumeChange: "+28.19%",
  fearGreed: 40,
};

// Featured Token (Exchange Token Card)
const featuredToken = {
  name: "XPL",
  icon: "🌀",
  price: "$0.203",
  change: "+26.07%",
  isPositive: true,
  volume24h: "$60,470,396.00",
  marketCap: "$419,533,333.33",
  allTimeHigh: "$1.68",
  allTimeLow: "$0.12",
};

// Exchange Flows Data
const exchangeFlows = [
  { asset: "AWE", icon: "🔵", price: "$0.055", priceChange: -3.64, volume: "$890.92K", volumeChange: -33.92, netflow: "+$870.44K", netflowChange: -33.22 },
  { asset: "BARD", icon: "🟡", price: "$0.79", priceChange: 1.11, volume: "$660.87K", volumeChange: 163.78, netflow: "+$643.82K", netflowChange: 162.97 },
  { asset: "AXS", icon: "🔴", price: "$0.95", priceChange: 0.071, volume: "$419.45K", volumeChange: -24.83, netflow: "+$375.8K", netflowChange: -22.1 },
  { asset: "JASMY", icon: "🟠", price: "$0.0089", priceChange: 3.28, volume: "$2.84M", volumeChange: 156.45, netflow: "+$2.44M", netflowChange: 177.69 },
  { asset: "PYTH", icon: "🟣", price: "$0.066", priceChange: -1.29, volume: "$1.11M", volumeChange: -64.9, netflow: "+$914.37K", netflowChange: -64.4, hasLink: true },
  { asset: "CTC", icon: "⚪", price: "$0.03", priceChange: -1.48, volume: "$2.75M", volumeChange: -30.37, netflow: "+$2.26M", netflowChange: -22.35 },
];

// Top Projects
const topProjects = [
  { name: "Bitcoin", symbol: "BTC", price: "$90,860", change1h: "+0.29%", change24h: "+0.51%", change7d: "-0.56%", marketCap: "$1.812.4B", volume: "$20.5B", icon: "https://static.images.dropstab.com/images/bitcoin.svg" },
  { name: "Ethereum", symbol: "ETH", price: "$3,114.07", change1h: "+0.20%", change24h: "+0.96%", change7d: "-0.80%", marketCap: "$375.0B", volume: "$11.0B", icon: "https://static.images.dropstab.com/images/ethereum.svg" },
  { name: "Tether", symbol: "USDT", price: "$1", change1h: "-0.01%", change24h: "-0.01%", change7d: "-0.10%", marketCap: "$186.7B", volume: "$38.0B", icon: "https://static.images.dropstab.com/images/tether.svg" },
  { name: "XRP", symbol: "XRP", price: "$2.06", change1h: "+0.03%", change24h: "-1.31%", change7d: "-1.48%", marketCap: "$125.4B", volume: "$1.8B", icon: "https://static.images.dropstab.com/images/ripple.svg" },
  { name: "Solana", symbol: "SOL", price: "$139.08", change1h: "+0.53%", change24h: "+2.38%", change7d: "+3.90%", marketCap: "$78.5B", volume: "$3.5B", icon: "https://static.images.dropstab.com/images/solana.svg" },
];

// Top Gainers
const topGainers = [
  { name: "Story", symbol: "IP", price: "$0", change: "+26.28%", icon: "🟣" },
  { name: "World", symbol: "WLD", price: "$1.85", change: "+19.51%", icon: "🌍" },
  { name: "MYX Finance", symbol: "MYX", price: "$5.55", change: "+13.09%", icon: "🔷" },
  { name: "Mantle", symbol: "MNT", price: "$0.98", change: "+9.08%", icon: "🟢" },
];

// ============ COMPONENTS ============

// Glass Card Component (Telegram 2026 style)
const GlassCard = ({ children, className = "", hover = true }) => (
  <div className={`
    bg-white/70 backdrop-blur-xl 
    border border-white/50 
    rounded-3xl 
    shadow-[0_8px_32px_rgba(0,0,0,0.06)]
    ${hover ? 'hover:shadow-[0_12px_48px_rgba(0,0,0,0.1)] hover:bg-white/80 transition-all duration-300' : ''}
    ${className}
  `}>
    {children}
  </div>
);

// Header
const Header = () => (
  <header className="sticky top-0 z-50 px-6 py-4" data-testid="header">
    <GlassCard className="px-5 py-3" hover={false}>
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3" data-testid="logo">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-black">F</span>
          </div>
          <span className="text-xl font-bold text-gray-800 hidden sm:block">Flow Intel</span>
        </a>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {['Market', 'Funding', 'Echo', 'Tools'].map(item => (
            <button key={item} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all">
              {item}
            </button>
          ))}
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25">
            <Wallet className="w-4 h-4" />
            Connect
          </button>
          <button className="p-2.5 hover:bg-gray-100/50 rounded-xl md:hidden">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </GlassCard>
  </header>
);

// Market Stats Ticker
const MarketTicker = () => (
  <div className="overflow-hidden py-3 px-6 mb-4">
    <div className="flex items-center gap-8 animate-scroll">
      {[
        { label: "Market Cap", value: marketStats.totalMarketCap, change: marketStats.marketCapChange, isPositive: true },
        { label: "BTC Dom", value: marketStats.btcDominance, change: marketStats.btcChange, isPositive: false },
        { label: "ETH Dom", value: marketStats.ethDominance, change: marketStats.ethChange, isPositive: true },
        { label: "24H Volume", value: marketStats.volume24h, change: marketStats.volumeChange, isPositive: true },
        { label: "Fear & Greed", value: `${marketStats.fearGreed}/100`, change: "Neutral", isPositive: null },
      ].map((stat, i) => (
        <div key={i} className="flex items-center gap-2 text-sm whitespace-nowrap">
          <span className="text-gray-500">{stat.label}:</span>
          <span className="font-semibold text-gray-900">{stat.value}</span>
          {stat.isPositive !== null && (
            <span className={stat.isPositive ? 'text-emerald-500' : 'text-red-500'}>
              {stat.change}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Search Bar (Telegram style - big rounded)
const SearchBar = () => (
  <div className="px-6 mb-6">
    <GlassCard className="p-1.5" hover={false}>
      <div className="flex items-center gap-3 bg-gray-50/80 rounded-2xl px-5 py-3.5">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search for tokens, addresses, entities..."
          className="flex-1 bg-transparent border-none outline-none text-base text-gray-800 placeholder-gray-400"
          data-testid="search-input"
        />
        <kbd className="hidden sm:flex items-center px-2 py-1 rounded-lg bg-white/80 text-xs font-medium text-gray-400 shadow-sm">/</kbd>
      </div>
    </GlassCard>
  </div>
);

// Entities Carousel
const EntitiesCarousel = () => (
  <div className="px-6 mb-6">
    <GlassCard className="p-4">
      <div className="flex items-center gap-5 overflow-x-auto scrollbar-hide" data-testid="entities-carousel">
        {topEntities.map((entity, i) => (
          <a 
            key={i}
            href="#"
            className="flex items-center gap-2.5 whitespace-nowrap group"
          >
            <span className="text-xl">{entity.icon}</span>
            <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{entity.name}</span>
            <span className="text-gray-500">{entity.price}</span>
            <span className={`text-sm font-medium ${entity.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
              {entity.change}
            </span>
          </a>
        ))}
      </div>
    </GlassCard>
  </div>
);

// Exchange Token Card (NEW - from Arkham design)
const ExchangeTokenCard = () => (
  <GlassCard className="p-5 mb-5">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        {/* Token Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span className="text-white text-2xl">{featuredToken.icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{featuredToken.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-gray-900">{featuredToken.price}</span>
            <span className={`text-sm font-semibold px-2 py-0.5 rounded-lg ${
              featuredToken.isPositive 
                ? 'text-emerald-600 bg-emerald-100' 
                : 'text-red-600 bg-red-100'
            }`}>
              {featuredToken.change}
            </span>
          </div>
        </div>
      </div>
      <a 
        href="#" 
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-blue-500 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors"
      >
        Trade Now on Exchange
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">24H VOLUME</div>
        <div className="text-sm font-semibold text-gray-900">{featuredToken.volume24h}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">MARKET CAP</div>
        <div className="text-sm font-semibold text-gray-900">{featuredToken.marketCap}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">ALL TIME HIGH</div>
        <div className="text-sm font-semibold text-gray-900">{featuredToken.allTimeHigh}</div>
      </div>
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">ALL TIME LOW</div>
        <div className="text-sm font-semibold text-gray-900">{featuredToken.allTimeLow}</div>
      </div>
    </div>
  </GlassCard>
);

// Exchange Flows Table (NEW - from Arkham design)
const ExchangeFlowsTable = () => (
  <div className="mb-5">
    {/* Header with filters */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">EXCHANGE FLOWS</h2>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 text-xs font-semibold rounded-xl border-2 border-blue-500 text-blue-600 bg-blue-50">
          CEX+DEX
        </button>
        <button className="px-3 py-1.5 text-xs font-semibold rounded-xl border-2 border-blue-500 text-blue-600 bg-blue-50">
          MARKET CAP ≥ $100M
        </button>
        <button className="px-3 py-1.5 text-xs font-semibold rounded-xl border-2 border-blue-500 text-blue-600 bg-blue-50">
          VOLUME ≥ $100K
        </button>
        <button className="px-3 py-1.5 text-xs font-semibold rounded-xl border-2 border-amber-500 text-amber-600 bg-amber-50">
          SORT BY NETFLOW/VOLUME
        </button>
      </div>
    </div>
    
    <GlassCard className="overflow-hidden">
      {/* Filter Row */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-gray-100/50 text-xs text-gray-500">
        <Filter className="w-3.5 h-3.5" />
        <Link2 className="w-3.5 h-3.5" />
        <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> CEX/DEX</span>
        <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> MARKET CAP</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="px-3 py-1.5 bg-gray-100 rounded-lg font-medium text-gray-700">24H</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      
      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100/50 text-xs text-gray-500 uppercase">
            <th className="text-left py-3 px-5 font-semibold"><Filter className="w-3 h-3 inline mr-1" />ASSET</th>
            <th className="text-right py-3 px-4 font-semibold">PRICE</th>
            <th className="text-right py-3 px-4 font-semibold"><Filter className="w-3 h-3 inline mr-1" />VOLUME</th>
            <th className="text-right py-3 px-5 font-semibold">NETFLOW <Filter className="w-3 h-3 inline ml-1" /></th>
          </tr>
        </thead>
        <tbody>
          {exchangeFlows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors">
              <td className="py-3.5 px-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                    {row.icon}
                  </div>
                  <span className="font-semibold text-gray-900">{row.asset}</span>
                  {row.hasLink && <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />}
                </div>
              </td>
              <td className="py-3.5 px-4 text-right">
                <span className="font-semibold text-gray-900">{row.price}</span>
                <span className={`ml-2 text-sm ${row.priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {row.priceChange >= 0 ? '+' : ''}{row.priceChange}%
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                <span className="font-semibold text-gray-900">{row.volume}</span>
                <span className={`ml-2 text-sm ${row.volumeChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {row.volumeChange >= 0 ? '+' : ''}{row.volumeChange}%
                </span>
              </td>
              <td className="py-3.5 px-5 text-right">
                <span className="font-semibold text-emerald-600">{row.netflow}</span>
                <span className={`ml-2 text-sm ${row.netflowChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {row.netflowChange >= 0 ? '+' : ''}{row.netflowChange}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  </div>
);

// Projects Table
const ProjectsTable = () => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Projects</h2>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-xl">All</button>
        <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-200 transition-colors">Trending</button>
        <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-200 transition-colors">New (7d)</button>
      </div>
    </div>
    
    <GlassCard className="overflow-hidden">
      <table className="w-full text-sm" data-testid="projects-table">
        <thead>
          <tr className="border-b border-gray-100/50">
            <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase">#</th>
            <th className="text-left py-4 px-3 text-xs font-semibold text-gray-500 uppercase">Asset</th>
            <th className="text-right py-4 px-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
            <th className="text-right py-4 px-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">1h</th>
            <th className="text-right py-4 px-3 text-xs font-semibold text-gray-500 uppercase">24h</th>
            <th className="text-right py-4 px-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">7d</th>
            <th className="text-right py-4 px-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Market Cap</th>
            <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase hidden xl:table-cell">Volume</th>
          </tr>
        </thead>
        <tbody>
          {topProjects.map((project, i) => (
            <tr key={i} className="border-b border-gray-50/50 hover:bg-gray-50/30 cursor-pointer transition-colors">
              <td className="py-4 px-5 text-gray-400 font-medium">{i + 1}</td>
              <td className="py-4 px-3">
                <div className="flex items-center gap-3">
                  <img src={project.icon} alt={project.name} className="w-9 h-9 rounded-xl" />
                  <div>
                    <div className="font-semibold text-gray-900">{project.name}</div>
                    <div className="text-xs text-gray-500">{project.symbol}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-3 text-right font-semibold text-gray-900">{project.price}</td>
              <td className={`py-4 px-3 text-right hidden sm:table-cell ${project.change1h.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{project.change1h}</td>
              <td className={`py-4 px-3 text-right ${project.change24h.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{project.change24h}</td>
              <td className={`py-4 px-3 text-right hidden md:table-cell ${project.change7d.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{project.change7d}</td>
              <td className="py-4 px-3 text-right text-gray-600 hidden lg:table-cell">{project.marketCap}</td>
              <td className="py-4 px-5 text-right text-gray-600 hidden xl:table-cell">{project.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  </div>
);

// Sidebar Component
const Sidebar = () => (
  <div className="space-y-5">
    {/* Market Stats Card */}
    <GlassCard className="p-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Total M. Cap</h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl font-bold text-gray-900">{marketStats.totalMarketCap}</span>
        <span className="flex items-center gap-1 text-sm text-emerald-500">
          <TrendingUp className="w-4 h-4" />
          {marketStats.marketCapChange}
        </span>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">BTC Dominance</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{marketStats.btcDominance}</span>
            <span className="text-xs text-red-500">{marketStats.btcChange}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">ETH Dominance</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">{marketStats.ethDominance}</span>
            <span className="text-xs text-emerald-500">{marketStats.ethChange}</span>
          </div>
        </div>
      </div>
    </GlassCard>
    
    {/* Fear & Greed */}
    <GlassCard className="p-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Fear & Greed Index</h3>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <span className="text-xl font-bold text-white">{marketStats.fearGreed}</span>
        </div>
        <div>
          <div className="text-lg font-bold text-gray-900">Neutral</div>
          <div className="text-sm text-gray-500">Updated just now</div>
        </div>
      </div>
    </GlassCard>
    
    {/* Top Gainers */}
    <GlassCard className="p-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">TOP Gainers (24h)</h3>
      <div className="space-y-3">
        {topGainers.map((gainer, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-base">
                {gainer.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">{gainer.name}</div>
                <div className="text-xs text-gray-500">{gainer.price}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-semibold text-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              {gainer.change}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  </div>
);

// ============ MAIN PAGE ============

export default function ArkhamHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30" data-testid="flow-intel-home">
      {/* Header */}
      <Header />
      
      {/* Market Ticker */}
      <MarketTicker />
      
      {/* Search Bar */}
      <SearchBar />
      
      {/* Entities Carousel */}
      <EntitiesCarousel />
      
      {/* Main Content */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-12 gap-5">
          {/* Left Column - Main Content */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            {/* Title */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Market</h1>
              <p className="text-gray-500 text-sm">Explore real-time data on all tokens</p>
            </div>
            
            {/* Exchange Token Card (NEW) */}
            <ExchangeTokenCard />
            
            {/* Exchange Flows Table (NEW) */}
            <ExchangeFlowsTable />
            
            {/* Projects Table */}
            <ProjectsTable />
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
