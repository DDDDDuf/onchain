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
  ArrowUpRight
} from 'lucide-react';

// ============ MOCK DATA ============

// Top Entities Carousel
const topEntities = [
  { name: "Bybit", price: "$28.41B", change: "+0.38%", isPositive: true, icon: "🟡" },
  { name: "MetaPlanet", price: "$3.19B", change: "-0.47%", isPositive: false, icon: "🔵" },
  { name: "ARK Invest", price: "$3.39B", change: "+9.49%", isPositive: true, icon: "📊" },
  { name: "Donald Trump", price: "$1.02M", change: "-0.5%", isPositive: false, icon: "🇺🇸" },
  { name: "Multisig Exploit Hacker", price: "$318.9M", change: "-1.17%", isPositive: false, icon: "☠️" },
  { name: "Arkham Exchange", price: "$34.89M", change: "-0.45%", isPositive: false, icon: "⬛" },
  { name: "Wintermute Hacker", price: "$205.4M", change: "-0.23%", isPositive: false, icon: "❄️" },
  { name: "Kraken", price: "$12.4B", change: "+0.12%", isPositive: true, icon: "🐙" },
];

// Trending Insights
const trendingInsights = [
  { 
    id: 1, 
    tags: ["On-Chain Trade"],
    title: "Ethereum: Whale Closes $15.1M Short on Hyperliquid Amidst...", 
    tokens: 7, 
    entities: 22,
    time: "1 day ago",
    updates: 5,
  },
  { 
    id: 2, 
    tags: ["Important", "Bullish", "Partnership"],
    title: "Solana Surges on X Integration News: Volume Spikes to $68M as...", 
    tokens: 8, 
    entities: 3,
    time: "1 hour ago",
    updates: 8,
  },
  { 
    id: 3, 
    tags: ["Macroeconomic"],
    title: "Bitcoin: Saylor Highlights Inflation Hedge as Options Market...", 
    tokens: 1, 
    entities: null,
    time: "17 hours ago",
    updates: 1,
  },
  { 
    id: 4, 
    tags: ["Important", "Bullish", "Partnership", "On-Chain Trade"],
    title: "ETH Bullish as Robinhood Builds Layer-2 and Whale Covers $11.4...", 
    tokens: 6, 
    entities: 64,
    time: "5 hours ago",
    updates: 3,
  },
];

// Exchange Flows Data
const exchangeFlows = [
  { asset: "AWE", icon: "🔵", price: "$0.055", priceChange: -3.64, volume: "$890.92K", volumeChange: -33.92, netflow: "+$870.44K", netflowChange: -33.22 },
  { asset: "BARD", icon: "🟡", price: "$0.79", priceChange: 1.11, volume: "$660.87K", volumeChange: 163.78, netflow: "+$643.82K", netflowChange: 162.97 },
  { asset: "AXS", icon: "🔴", price: "$0.95", priceChange: -0.07, volume: "$419.45K", volumeChange: -24.83, netflow: "+$375.8K", netflowChange: -22.1 },
  { asset: "JASMY", icon: "🟠", price: "$0.0089", priceChange: 3.28, volume: "$2.34M", volumeChange: 156.45, netflow: "+$2.44M", netflowChange: 177.69 },
  { asset: "PYTH", icon: "🟣", price: "$0.066", priceChange: -1.29, volume: "$1.11M", volumeChange: -64.9, netflow: "+$914.37K", netflowChange: -64.4, hasLink: true },
];

// Transfers data
const transfersData = [
  { id: 1, chain: "ethereum", time: "just now", from: "0x99b36ec83FF94d3392e97d43d58bF5cDBd886", fromLabel: "", to: "Etherex: Pool (0xAd9)", toLabel: "Etherex: Pool", value: "158.902", token: "USDC", tokenColor: "#2775CA", usd: "$158.9" },
  { id: 2, chain: "tron", time: "just now", from: "TEVhdHZTuAF2nUr3TSFBR6AVflgkwvviMg", fromLabel: "", to: "TDY1CGTaPgeY7Xi3Jc76NZaKLnQCDXE1bxF", toLabel: "", value: "10.631", token: "TRX", tokenColor: "#FF0013", usd: "$3.18" },
  { id: 3, chain: "tron", time: "just now", from: "Binance Deposit (TF4E6)", fromLabel: "Binance Deposit", to: "Binance: Hot Wallet (TDqSq)", toLabel: "Binance: Hot Wallet", value: "199", token: "USDT", tokenColor: "#26A17B", usd: "$199" },
  { id: 4, chain: "tron", time: "just now", from: "TTR5DKakXJXKyHKiZsCVy6u0EhaCCN6KeV", fromLabel: "", to: "SUN.io: UniswapV2Router02 (TXF1x)", toLabel: "SUN.io: UniswapV2Router02", value: "3.719", token: "TRX", tokenColor: "#FF0013", usd: "$1.11" },
  { id: 5, chain: "tron", time: "just now", from: "SUN.io: UniswapV2Router02 (TXF1x)", fromLabel: "SUN.io: UniswapV2Router02", to: "TRON: Wrapped TRX (WTRX) (TNU09)", toLabel: "TRON: Wrapped TRX", value: "3.682", token: "TRX", tokenColor: "#FF0013", usd: "$1.1" },
  { id: 6, chain: "tron", time: "just now", from: "Binance Deposit (TVByM)", fromLabel: "Binance Deposit", to: "Binance: Hot Wallet (TDqSq)", toLabel: "Binance: Hot Wallet", value: "451.292", token: "USDT", tokenColor: "#26A17B", usd: "$451.29" },
  { id: 7, chain: "tron", time: "just now", from: "TDYPg7BhtPMnp2j685dFVCUSaU1uLnPKVY", fromLabel: "", to: "TTEwMKRjP631DL37jxCGbcAhrzdrVSDn2f0", toLabel: "", value: "87", token: "TRX", tokenColor: "#FF0013", usd: "$26.01" },
  { id: 8, chain: "tron", time: "just now", from: "Binance Deposit (TGZuc)", fromLabel: "Binance Deposit", to: "Binance: Hot Wallet (TDqSq)", toLabel: "Binance: Hot Wallet", value: "831.802", token: "USDT", tokenColor: "#26A17B", usd: "$831.8" },
  { id: 9, chain: "tron", time: "just now", from: "Binance Deposit (TGVhs)", fromLabel: "Binance Deposit", to: "Binance: Hot Wallet (TDqSq)", toLabel: "Binance: Hot Wallet", value: "1.813K", token: "USDT", tokenColor: "#26A17B", usd: "$1.81K" },
  { id: 10, chain: "ethereum", time: "just now", from: "HunterContract (0x481)", fromLabel: "HunterContract", to: "Velodrome Finance: CL Pool (0x478)", toLabel: "Velodrome Finance: CL Pool", value: "8.8313", token: "METH", tokenColor: "#627EEA", usd: "$97.25" },
  { id: 11, chain: "ethereum", time: "just now", from: "Proxy (EIP-1967 Transparent) (0x129)", fromLabel: "Proxy (EIP-1967 Transparent)", to: "Velodrome Finance: CL Pool (0xeB0)", toLabel: "Velodrome Finance: CL Pool", value: "1.637K", token: "USDC", tokenColor: "#2775CA", usd: "$1.64K" },
  { id: 12, chain: "bsc", time: "just now", from: "0xa3f98c9A9572daa11386918b8f4ae6E31218743d", fromLabel: "", to: "XD (XI) (0x986)", toLabel: "XD (XI)", value: "8.604", token: "WBNB", tokenColor: "#F3BA2F", usd: "$545.78" },
];

// Chain config
const chainConfig = {
  ethereum: { color: "#627EEA", icon: "⟠" },
  bsc: { color: "#F3BA2F", icon: "◈" },
  polygon: { color: "#8247E5", icon: "⬡" },
  tron: { color: "#FF0013", icon: "◆" },
};

// ============ COMPONENTS ============

// Entities Carousel
const EntitiesCarousel = () => (
  <div className="flex items-center gap-4 overflow-x-auto py-3 px-1 scrollbar-hide" data-testid="entities-carousel">
    {topEntities.map((entity, i) => (
      <a 
        key={i}
        href="#"
        className="flex items-center gap-2 whitespace-nowrap text-sm hover:opacity-80 transition-opacity"
      >
        <span className="text-base">{entity.icon}</span>
        <span className="text-white font-medium">{entity.name}</span>
        <span className="text-gray-400">{entity.price}</span>
        <span className={entity.isPositive ? 'text-green-400' : 'text-red-400'}>
          {entity.change}
        </span>
      </a>
    ))}
  </div>
);

// Search Bar
const SearchBar = () => (
  <div className="flex items-center gap-3 bg-[#161b22] rounded-lg px-4 py-3 border border-gray-700 mb-6" data-testid="search-bar">
    <Search className="w-5 h-5 text-gray-500" />
    <input 
      type="text" 
      placeholder="Search for tokens, addresses, entities..."
      className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
    />
    <div className="flex items-center gap-2 text-gray-500">
      <Filter className="w-4 h-4" />
      <Link2 className="w-4 h-4" />
      <span className="text-xs">ALL NETWORKS</span>
    </div>
  </div>
);

// Trending Insights
const TrendingInsights = () => (
  <div className="mb-6" data-testid="trending-insights">
    <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">TRENDING INSIGHTS</h2>
    <div className="grid grid-cols-4 gap-3">
      {trendingInsights.map(insight => (
        <div 
          key={insight.id} 
          className="bg-[#161b22] border border-gray-800 rounded-lg p-3 hover:border-gray-600 transition-colors cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {insight.tags.map((tag, i) => (
              <span 
                key={i}
                className={`text-[9px] px-1.5 py-0.5 rounded ${
                  tag === 'Important' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  tag === 'Bullish' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  tag === 'Partnership' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  tag === 'On-Chain Trade' ? 'bg-gray-700 text-gray-300' :
                  'bg-gray-700 text-gray-300'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xs text-white font-medium mb-3 line-clamp-2 leading-relaxed">{insight.title}</h3>
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex items-center gap-2">
              <span>Tokens: <span className="text-cyan-400">{insight.tokens}</span></span>
              {insight.entities && (
                <span>Entities: <span className="text-purple-400 inline-flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-purple-400 rounded-sm inline-block"></span>{insight.entities}</span></span>
              )}
            </div>
            <span className="text-gray-600">{insight.time} | {insight.updates} updates</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Arkham Exchange Tokens (TON Card)
const ExchangeTokens = () => (
  <div className="mb-5" data-testid="exchange-tokens">
    <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">ARKHAM EXCHANGE TOKENS</h2>
    <div className="bg-[#161b22] border border-gray-800 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-white text-lg font-bold">◇</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">TON</h3>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">$1.75</span>
              <span className="text-xs text-green-400">+0.57%</span>
            </div>
          </div>
        </div>
        <a href="#" className="flex items-center gap-1 text-cyan-400 text-xs hover:text-cyan-300 transition-colors border border-cyan-400/30 rounded px-2 py-1">
          Trade Now on Arkham Exchange
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
      
      <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-700/50">
        <div>
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">24H VOLUME</div>
          <div className="text-xs text-white font-medium">$73,384,128.00</div>
        </div>
        <div>
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">MARKET CAP</div>
          <div className="text-xs text-white font-medium">$4,234,447,994.63</div>
        </div>
        <div>
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">ALL TIME HIGH</div>
          <div className="text-xs text-white font-medium">$8.25</div>
        </div>
        <div>
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">ALL TIME LOW</div>
          <div className="text-xs text-white font-medium">$0.52</div>
        </div>
      </div>
    </div>
  </div>
);

// Exchange Flows Table
const ExchangeFlowsTable = () => (
  <div data-testid="exchange-flows">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">EXCHANGE FLOWS</h2>
      <div className="flex items-center gap-1.5">
        <button className="text-[9px] px-2 py-0.5 rounded border border-cyan-500/50 text-cyan-400 bg-cyan-500/10">CEX+DEX</button>
        <button className="text-[9px] px-2 py-0.5 rounded border border-cyan-500/50 text-cyan-400 bg-cyan-500/10">MARKET CAP ≥ $100M</button>
        <button className="text-[9px] px-2 py-0.5 rounded border border-cyan-500/50 text-cyan-400 bg-cyan-500/10">VOLUME ≥ $100K</button>
        <button className="text-[9px] px-2 py-0.5 rounded border border-orange-500/50 text-orange-400 bg-orange-500/10">SORT BY NETFLOW/VOLUME</button>
      </div>
    </div>
    
    <div className="bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-800 text-[9px] text-gray-500">
        <Filter className="w-3 h-3" />
        <Link2 className="w-3 h-3" />
        <span>CEX/DEX</span>
        <span><Filter className="w-2.5 h-2.5 inline" /> MARKET CAP</span>
        <span className="ml-auto">24H <ChevronDown className="w-2.5 h-2.5 inline" /></span>
      </div>
      
      <table className="w-full text-[11px]">
        <thead>
          <tr className="border-b border-gray-800 text-[9px] text-gray-500">
            <th className="text-left py-2 px-3 font-medium"><Filter className="w-2.5 h-2.5 inline mr-1" />ASSET</th>
            <th className="text-right py-2 px-3 font-medium">PRICE</th>
            <th className="text-right py-2 px-3 font-medium"><Filter className="w-2.5 h-2.5 inline mr-1" />VOLUME</th>
            <th className="text-right py-2 px-3 font-medium">NETFLOW <Filter className="w-2.5 h-2.5 inline ml-1" /></th>
          </tr>
        </thead>
        <tbody>
          {exchangeFlows.map((row, i) => (
            <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer">
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{row.icon}</span>
                  <span className="text-white font-medium">{row.asset}</span>
                  {row.hasLink && <ArrowUpRight className="w-2.5 h-2.5 text-gray-500" />}
                </div>
              </td>
              <td className="py-2 px-3 text-right">
                <span className="text-white">{row.price}</span>
                <span className={`ml-1 ${row.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {row.priceChange >= 0 ? '+' : ''}{row.priceChange}%
                </span>
              </td>
              <td className="py-2 px-3 text-right">
                <span className="text-white">{row.volume}</span>
                <span className={`ml-1 ${row.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {row.volumeChange >= 0 ? '+' : ''}{row.volumeChange}%
                </span>
              </td>
              <td className="py-2 px-3 text-right">
                <span className="text-green-400">{row.netflow}</span>
                <span className={`ml-1 ${row.netflowChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {row.netflowChange >= 0 ? '+' : ''}{row.netflowChange}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Transfers Table (Right Column)
const TransfersTable = () => (
  <div className="h-full flex flex-col" data-testid="transfers-table">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">FILTER FOR TRANSFERS</h2>
      <div className="flex items-center gap-1.5">
        <button className="text-[9px] px-2 py-0.5 rounded bg-cyan-500 text-white">ALL</button>
        <button className="text-[9px] px-2 py-0.5 rounded border border-gray-600 text-gray-400">USD ≥ $1</button>
        <button className="text-[9px] px-2 py-0.5 rounded border border-cyan-500/50 text-cyan-400 bg-cyan-500/10">SORT BY TIME</button>
      </div>
    </div>
    
    <div className="flex items-center gap-2 mb-2 text-[10px] text-gray-500">
      <span>TRANSFERS</span>
      <span className="flex items-center gap-1">
        <ChevronLeft className="w-3 h-3" />
        <span className="text-white">1 / 625</span>
        <ChevronRight className="w-3 h-3" />
      </span>
      <RefreshCw className="w-3 h-3" />
    </div>
    
    <div className="bg-[#161b22] border border-gray-800 rounded-lg flex-1 overflow-hidden">
      <table className="w-full text-[10px]">
        <thead className="sticky top-0 bg-[#161b22]">
          <tr className="border-b border-gray-800 text-[9px] text-gray-500">
            <th className="w-6 py-1.5 px-2"></th>
            <th className="text-left py-1.5 px-1 font-medium"><Filter className="w-2.5 h-2.5 inline" /> TIME <ChevronDown className="w-2.5 h-2.5 inline" /></th>
            <th className="text-left py-1.5 px-1 font-medium"><Filter className="w-2.5 h-2.5 inline" /> FROM</th>
            <th className="text-left py-1.5 px-1 font-medium"><Filter className="w-2.5 h-2.5 inline" /> TO</th>
            <th className="text-right py-1.5 px-1 font-medium"><Filter className="w-2.5 h-2.5 inline" /> VALUE</th>
            <th className="text-right py-1.5 px-1 font-medium"><Filter className="w-2.5 h-2.5 inline" /> TOKEN</th>
            <th className="text-right py-1.5 px-2 font-medium">USD</th>
          </tr>
        </thead>
        <tbody>
          {transfersData.map((tx) => (
            <tr key={tx.id} className="border-b border-gray-800/30 hover:bg-gray-800/30 cursor-pointer">
              <td className="py-1.5 px-2">
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                  style={{ backgroundColor: chainConfig[tx.chain]?.color || '#627EEA' }}
                >
                  {chainConfig[tx.chain]?.icon}
                </div>
              </td>
              <td className="py-1.5 px-1">
                <span className="text-cyan-400">{tx.time}</span>
              </td>
              <td className="py-1.5 px-1 max-w-[140px]">
                <span className="text-cyan-400 truncate block">{tx.fromLabel || tx.from.substring(0, 20)}...</span>
              </td>
              <td className="py-1.5 px-1 max-w-[140px]">
                <span className="text-cyan-400 truncate block">{tx.toLabel || tx.to.substring(0, 20)}...</span>
              </td>
              <td className="py-1.5 px-1 text-right text-white whitespace-nowrap">{tx.value}</td>
              <td className="py-1.5 px-1 text-right">
                <span 
                  className="inline-block px-1.5 py-0.5 rounded text-white text-[8px] font-medium"
                  style={{ backgroundColor: tx.tokenColor }}
                >
                  {tx.token}
                </span>
              </td>
              <td className="py-1.5 px-2 text-right text-gray-400 whitespace-nowrap">{tx.usd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Arkham Watermark
const Watermark = () => (
  <div className="absolute bottom-10 left-1/4 opacity-[0.03] pointer-events-none select-none">
    <div className="text-[180px] font-black text-white tracking-tight leading-none">ARKHAM</div>
  </div>
);

// ============ MAIN PAGE ============

export default function ArkhamHome() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col" data-testid="arkham-home">
      {/* Main Content */}
      <main className="flex-1 p-5 relative">
        <div className="max-w-[1800px] mx-auto">
          {/* Title */}
          <h1 className="text-3xl font-black text-white tracking-tight mb-2" data-testid="main-title">
            ARKHAM INTEL
          </h1>
          
          {/* Entities Carousel */}
          <EntitiesCarousel />
          
          {/* Search Bar */}
          <SearchBar />
          
          {/* Trending Insights */}
          <TrendingInsights />
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-[400px_1fr] gap-5">
            {/* Left Column */}
            <div>
              <ExchangeTokens />
              <ExchangeFlowsTable />
            </div>
            
            {/* Right Column */}
            <div>
              <TransfersTable />
            </div>
          </div>
        </div>
        
        {/* Watermark */}
        <Watermark />
      </main>
    </div>
  );
}
