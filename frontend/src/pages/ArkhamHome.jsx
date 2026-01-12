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
  Menu,
  Clock
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

// Transfers Data (NEW)
const transfersData = [
  { id: 1, chain: "ethereum", time: "just now", from: "0x990636ecB3FF04d33D92e970d...", fromIcon: "🔷", to: "Etherex: Pool (0xAd9)", toIcon: "🟡", value: "158.902", token: "USDC", tokenColor: "#2775CA", usd: "$158.9" },
  { id: 2, chain: "tron", time: "just now", from: "TEVhdHZTuAF2nUr3TSFBRGAVflgkw...", fromIcon: "🔴", to: "TDYjCGTaPgg7XiJc7J6NZaKLmQCDX...", toIcon: "", value: "10.631", token: "TRX", tokenColor: "#FF0013", usd: "$3.18" },
  { id: 3, chain: "tron", time: "just now", from: "Binance Deposit (TF4E6)", fromIcon: "🔴", to: "Binance: Hot Wallet (TDqSq)", toIcon: "💎", value: "199", token: "USDT", tokenColor: "#26A17B", usd: "$199" },
  { id: 4, chain: "tron", time: "just now", from: "TTR5DKekXJXKyhKiZsCVy6u0EhaCC...", fromIcon: "🔴", to: "SUN.io: UniswapV2Router02...", toIcon: "🟢", value: "3.719", token: "TRX", tokenColor: "#FF0013", usd: "$1.11" },
  { id: 5, chain: "tron", time: "just now", from: "SUN.io: UniswapV2Router02...", fromIcon: "🟢", to: "TRON: Wrapped TRX (WTRX)...", toIcon: "🔴", value: "3.682", token: "TRX", tokenColor: "#FF0013", usd: "$1.1" },
  { id: 6, chain: "tron", time: "just now", from: "Binance Deposit (TVByM)", fromIcon: "🔴", to: "Binance: Hot Wallet (TDqSq)", toIcon: "💎", value: "451.292", token: "USDT", tokenColor: "#26A17B", usd: "$451.29" },
  { id: 7, chain: "tron", time: "just now", from: "TDYPg7BhtPMnp2j685dF...", fromIcon: "🔴", to: "TTEwMKRjP631DL37jxCG...", toIcon: "", value: "87", token: "TRX", tokenColor: "#FF0013", usd: "$26.01" },
  { id: 8, chain: "tron", time: "just now", from: "Binance Deposit (TGZuc)", fromIcon: "🔴", to: "Binance: Hot Wallet (TDqSq)", toIcon: "💎", value: "831.802", token: "USDT", tokenColor: "#26A17B", usd: "$831.8" },
];

// Chain config
const chainConfig = {
  ethereum: { color: "#627EEA", icon: "⟠" },
  tron: { color: "#FF0013", icon: "◆" },
  bsc: { color: "#F3BA2F", icon: "◈" },
};

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
        <a href="/" className="flex items-center gap-3" data-testid="logo">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-black">F</span>
          </div>
          <span className="text-xl font-bold text-gray-800 hidden sm:block">Flow Intel</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-1">
          {['Market', 'Funding', 'Echo', 'Tools'].map(item => (
            <button key={item} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 rounded-xl transition-all">
              {item}
            </button>
          ))}
        </nav>
        
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
    <div className="flex items-center gap-8">
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

// Search Bar
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
          <a key={i} href="#" className="flex items-center gap-2.5 whitespace-nowrap group">
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

// Exchange Token Card
const ExchangeTokenCard = () => (
  <GlassCard className="p-5 mb-5">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
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
      <a href="#" className="flex items-center gap-2 px-4 py-2.5 border-2 border-blue-500 text-blue-600 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-colors">
        Trade Now on Exchange
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
    
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

// Asset icon colors
const assetColors = {
  AWE: "#3B82F6",
  BARD: "#EAB308", 
  AXS: "#EF4444",
  JASMY: "#F97316",
  PYTH: "#A855F7",
  CTC: "#D1D5DB",
};

// Exchange Flows Table
const ExchangeFlowsTable = () => (
  <div>
    <div className="flex items-center gap-3 mb-3 flex-wrap">
      <h2 className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">EXCHANGE FLOWS</h2>
      <div className="flex items-center gap-1">
        <button className="px-2 py-0.5 text-[8px] font-bold rounded-lg bg-blue-500 text-white whitespace-nowrap">CEX+DEX</button>
        <button className="px-2 py-0.5 text-[8px] font-bold rounded-lg border border-yellow-400 text-yellow-600 bg-yellow-50 whitespace-nowrap">MARKET CAP ≥ $100M</button>
        <button className="px-2 py-0.5 text-[8px] font-bold rounded-lg border border-yellow-400 text-yellow-600 bg-yellow-50 whitespace-nowrap">VOLUME ≥ $100K</button>
        <button className="px-2 py-0.5 text-[8px] font-bold rounded-lg border border-orange-400 text-orange-500 bg-orange-50 whitespace-nowrap">SORT BY NETFLOW/VOLUME</button>
      </div>
    </div>
    
    <GlassCard className="overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100/50 text-[10px] text-gray-500">
        <Filter className="w-3 h-3" />
        <Link2 className="w-3 h-3" />
        <span className="font-medium">CEX/DEX</span>
        <span className="flex items-center gap-1"><Filter className="w-2.5 h-2.5" /> MARKET CAP</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="px-2.5 py-1 bg-gray-100 rounded-lg font-semibold text-gray-700 text-[10px]">24H</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>
      
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100/50 text-[10px] text-gray-500">
            <th className="text-left py-2 px-4 font-semibold"><Filter className="w-2.5 h-2.5 inline mr-0.5" />ASSET</th>
            <th className="text-center py-2 px-3 font-semibold">PRICE</th>
            <th className="text-center py-2 px-3 font-semibold"><Filter className="w-2.5 h-2.5 inline mr-0.5" />VOLUME</th>
            <th className="text-right py-2 px-4 font-semibold">NETFLOW</th>
          </tr>
        </thead>
        <tbody>
          {exchangeFlows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors">
              <td className="py-2.5 px-4">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: assetColors[row.asset] || '#6B7280' }}
                  >
                    <span className="text-white text-[9px] font-bold">{row.asset[0]}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{row.asset}</span>
                  {row.hasLink && <ArrowUpRight className="w-3 h-3 text-gray-400" />}
                </div>
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className="text-sm font-semibold text-gray-900">{row.price}</span>
                <span className={`ml-1.5 text-xs ${row.priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {row.priceChange >= 0 ? '+' : ''}{row.priceChange}%
                </span>
              </td>
              <td className="py-2.5 px-3 text-center">
                <span className="text-sm font-semibold text-gray-900">{row.volume}</span>
                <span className={`ml-1.5 text-xs ${row.volumeChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {row.volumeChange >= 0 ? '+' : ''}{row.volumeChange}%
                </span>
              </td>
              <td className="py-2.5 px-4 text-right">
                <span className="text-sm font-semibold text-emerald-600">{row.netflow}</span>
                <span className={`ml-1.5 text-xs ${row.netflowChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
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

// Filter for Transfers Table (NEW)
const TransfersTable = () => (
  <div className="h-full flex flex-col">
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">FILTER FOR TRANSFERS</h2>
      <div className="flex items-center gap-1.5">
        <button className="px-2.5 py-1 text-[10px] font-bold rounded-xl bg-blue-500 text-white">ALL</button>
        <button className="px-2.5 py-1 text-[10px] font-bold rounded-xl border border-purple-400 text-purple-600 bg-purple-50">USD ≥ $1</button>
        <button className="px-2.5 py-1 text-[10px] font-bold rounded-xl border border-blue-400 text-blue-600 bg-blue-50">SORT BY TIME</button>
      </div>
    </div>
    
    <GlassCard className="flex-1 overflow-hidden flex flex-col min-h-0">
      {/* Pagination */}
      <div className="flex items-center justify-center gap-3 py-2 border-b border-gray-100/50 flex-shrink-0">
        <span className="text-xs text-gray-500">TRANSFERS</span>
        <div className="flex items-center gap-1.5">
          <ChevronLeft className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
          <span className="text-xs font-semibold text-gray-900">1 / 625</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
        <RefreshCw className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>
      
      {/* Table Header */}
      <div className="flex items-center px-3 py-2 border-b border-gray-100/50 text-[9px] text-gray-500 uppercase font-semibold flex-shrink-0">
        <div className="w-8 flex items-center gap-0.5">
          <Filter className="w-2 h-2" />
          <Link2 className="w-2 h-2" />
        </div>
        <div className="w-14"><Filter className="w-2 h-2 inline" /> TIME</div>
        <div className="flex-1 min-w-0"><Filter className="w-2 h-2 inline" /> FROM</div>
        <div className="flex-1 min-w-0"><Filter className="w-2 h-2 inline" /> TO</div>
        <div className="w-16 text-right"><Filter className="w-2 h-2 inline" /> VALUE</div>
        <div className="w-14 text-right"><Filter className="w-2 h-2 inline" /> TOKEN</div>
        <div className="w-16 text-right">USD</div>
      </div>
      
      {/* Table Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {transfersData.map((tx) => (
          <div 
            key={tx.id} 
            className="flex items-center px-3 py-2 border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors text-xs"
          >
            {/* Chain Icon */}
            <div className="w-8 flex-shrink-0">
              <div 
                className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px]"
                style={{ backgroundColor: chainConfig[tx.chain]?.color || '#627EEA' }}
              >
                {chainConfig[tx.chain]?.icon}
              </div>
            </div>
            
            {/* Time */}
            <div className="w-14 flex-shrink-0">
              <span className="text-blue-600 font-medium text-[11px]">{tx.time}</span>
            </div>
            
            {/* From */}
            <div className="flex-1 min-w-0 flex items-center gap-1 pr-2">
              <span className="text-sm">{tx.fromIcon}</span>
              <span className="text-blue-600 truncate text-[11px]">{tx.from}</span>
            </div>
            
            {/* To */}
            <div className="flex-1 min-w-0 flex items-center gap-1 pr-2">
              {tx.toIcon && <span className="text-sm">{tx.toIcon}</span>}
              <span className="text-blue-600 truncate text-[11px]">{tx.to}</span>
            </div>
            
            {/* Value */}
            <div className="w-16 text-right font-semibold text-gray-900 text-[11px] flex-shrink-0">
              {tx.value}
            </div>
            
            {/* Token */}
            <div className="w-14 text-right flex-shrink-0">
              <span 
                className="inline-block px-1.5 py-0.5 rounded text-white text-[9px] font-bold"
                style={{ backgroundColor: tx.tokenColor }}
              >
                {tx.token}
              </span>
            </div>
            
            {/* USD */}
            <div className="w-16 text-right text-gray-500 font-medium text-[11px] flex-shrink-0">
              {tx.usd}
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
      
      {/* Main Content - Two Column Layout */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-12 gap-5">
          {/* Left Column - Token Card + Exchange Flows */}
          <div className="col-span-12 lg:col-span-5">
            {/* Section Title */}
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">EXCHANGE TOKENS</h2>
            
            {/* Exchange Token Card */}
            <ExchangeTokenCard />
            
            {/* Exchange Flows Table */}
            <ExchangeFlowsTable />
          </div>
          
          {/* Right Column - Transfers Table */}
          <div className="col-span-12 lg:col-span-7">
            <TransfersTable />
          </div>
        </div>
      </div>
    </div>
  );
}
