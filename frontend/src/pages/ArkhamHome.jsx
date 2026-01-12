import { useState, useEffect } from 'react';
import { 
  Search, 
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Filter,
  Copy,
  MessageCircle,
  Globe,
  Link2,
  ArrowUpRight
} from 'lucide-react';

// ============ MOCK DATA ============

// Trending Insights
const trendingInsights = [
  { 
    id: 1, 
    type: "On-Chain Trade", 
    title: "Ethereum: Whale Closes $15.1M Short on Hyperliquid Amidst...", 
    tokens: 7, 
    entities: 22,
    time: "1 day ago",
    updates: 5,
    tags: []
  },
  { 
    id: 2, 
    type: "News", 
    title: "Solana Surges on X Integration News: Volume Spikes to $68M as...", 
    tokens: 3, 
    entities: 8,
    time: "1 hour ago",
    updates: 8,
    tags: ["Important", "Bullish", "Partnership"]
  },
  { 
    id: 3, 
    type: "Macroeconomic", 
    title: "Bitcoin ETF Outflows Reach $500M as Institutional Investors...", 
    tokens: 6, 
    entities: 4,
    time: "3 hours ago",
    updates: 12,
    tags: []
  },
];

// Exchange Flows Data
const exchangeFlows = [
  { asset: "AWE", icon: "🔵", price: "$0.055", priceChange: -4.41, volume: "$814.9K", volumeChange: -39.5, netflow: "+$796.88K", netflowChange: -38.88 },
  { asset: "BARD", icon: "🟡", price: "$0.79", priceChange: 0.82, volume: "$627.94K", volumeChange: 131.24, netflow: "+$610.87K", netflowChange: 129.78 },
  { asset: "AXS", icon: "🔴", price: "$0.95", priceChange: -0.48, volume: "$419.26K", volumeChange: -38.44, netflow: "+$375.59K", netflowChange: -37.97 },
  { asset: "JASMY", icon: "🟠", price: "$0.0089", priceChange: 2.44, volume: "$2.81M", volumeChange: 149, netflow: "+$2.44M", netflowChange: 168.86 },
  { asset: "CTC", icon: "⚪", price: "$0.29", priceChange: 3.69, volume: "$2.83M", volumeChange: -14.34, netflow: "+$2.34M", netflowChange: -12.44 },
  { asset: "PYTH", icon: "🟣", price: "$0.066", priceChange: -1.85, volume: "$1.09M", volumeChange: -65.78, netflow: "+$890.46K", netflowChange: -65.47, hasLink: true },
  { asset: "ZRX", icon: "⬜", price: "$0.13", priceChange: -5.26, volume: "$1.16M", volumeChange: 129.21, netflow: "+$947.44K", netflowChange: 116.12 },
  { asset: "LPT", icon: "🟢", price: "$3.13", priceChange: -3.93, volume: "$1.07M", volumeChange: -67.07, netflow: "+$869.67K", netflowChange: -65.76 },
  { asset: "OETH", icon: "🔵", price: "$3.11K", priceChange: 1.34, volume: "$914.09K", volumeChange: 522.17, netflow: "+$736.63K", netflowChange: 8.42 },
  { asset: "ARKM", icon: "⬛", price: "$0.2", priceChange: -1.3, volume: "$367.39K", volumeChange: -94.64, netflow: "+$287.48K", netflowChange: -95.73, hasLink: true },
];

// Transfers data
const transfersData = [
  { id: 1, chain: "ethereum", time: "just now", type: "out" },
  { id: 2, chain: "tron", time: "just now", type: "out" },
  { id: 3, chain: "ethereum", time: "just now", type: "in" },
  { id: 4, chain: "tron", time: "just now", type: "out" },
  { id: 5, chain: "tron", time: "just now", type: "out" },
  { id: 6, chain: "ethereum", time: "just now", type: "out" },
  { id: 7, chain: "ethereum", time: "just now", type: "out" },
  { id: 8, chain: "bsc", time: "just now", type: "in" },
  { id: 9, chain: "polygon", time: "just now", type: "out" },
  { id: 10, chain: "ethereum", time: "just now", type: "out" },
  { id: 11, chain: "bsc", time: "just now", type: "out" },
  { id: 12, chain: "ethereum", time: "just now", type: "out" },
  { id: 13, chain: "tron", time: "just now", type: "in" },
  { id: 14, chain: "ethereum", time: "just now", type: "out" },
  { id: 15, chain: "polygon", time: "30 seconds ago", type: "out" },
];

// Chain config
const chainConfig = {
  ethereum: { color: "#627EEA", name: "Ethereum" },
  bsc: { color: "#F3BA2F", name: "BSC" },
  polygon: { color: "#8247E5", name: "Polygon" },
  tron: { color: "#FF0013", name: "Tron" },
};

// ============ COMPONENTS ============

// Top Banner
const TopBanner = ({ onClose }) => (
  <div className="bg-[#0d1117] text-white py-2.5 px-4 flex items-center justify-center relative border-b border-gray-800" data-testid="top-banner">
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-300">Sign Up to Earn Up To $100 on The Arkham Exchange</span>
      <button className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-medium transition-colors">
        Trade Now
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
    <button onClick={onClose} className="absolute right-4 p-1 hover:bg-white/10 rounded transition-colors">
      <X className="w-4 h-4 text-gray-400" />
    </button>
  </div>
);

// Header
const Header = () => (
  <header className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-50" data-testid="header">
    <div className="h-12 px-4 flex items-center justify-between">
      {/* Left - Logo and Nav */}
      <div className="flex items-center gap-5">
        <a href="/" className="flex items-center gap-2 text-lg font-black tracking-tight text-white" data-testid="logo">
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
            <span className="text-black text-xs font-black">A</span>
          </div>
          ARKHAM
        </a>
        
        <nav className="flex items-center gap-0.5">
          <a href="/" className="px-3 py-1.5 text-sm font-medium text-white">Intel</a>
          <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white">Exchange</a>
          <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1">
            Swap
            <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded font-medium">New</span>
          </a>
          {['Markets', 'Custom', 'Tools'].map(item => (
            <button key={item} className="px-3 py-1.5 text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1">
              {item}
              <ChevronDown className="w-3 h-3" />
            </button>
          ))}
        </nav>
      </div>
      
      {/* Center - Search */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="flex items-center gap-2 bg-[#161b22] rounded px-3 py-1.5 border border-gray-700">
          <Search className="w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search for tokens, addresses, entities..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
            data-testid="search-input"
          />
          <kbd className="h-5 px-1.5 rounded bg-gray-700 text-[10px] font-medium text-gray-400 flex items-center">/</kbd>
        </div>
      </div>
      
      {/* Right - User Nav */}
      <div className="flex items-center gap-0.5">
        <a href="#" className="px-2.5 py-1.5 text-sm font-medium text-gray-400 hover:text-white">Profile</a>
        <a href="#" className="px-2.5 py-1.5 text-sm font-medium text-gray-400 hover:text-white">Points</a>
        <a href="#" className="px-2.5 py-1.5 text-sm font-medium text-gray-400 hover:text-white">Private Labels</a>
        <a href="#" className="px-2.5 py-1.5 text-sm font-medium text-gray-400 hover:text-white">API</a>
        <button className="px-2.5 py-1.5 text-sm font-medium text-gray-400 hover:text-white flex items-center gap-1">
          Help
          <ChevronDown className="w-3 h-3" />
        </button>
        <button className="p-2 text-gray-400 hover:text-white">
          <Globe className="w-4 h-4" />
        </button>
        <a href="#" className="px-2.5 py-1.5 text-sm font-medium text-gray-400 hover:text-white">Login</a>
        <a href="#" className="ml-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded">Sign Up</a>
      </div>
    </div>
  </header>
);

// Trending Insights Section
const TrendingInsights = () => (
  <div className="mb-6" data-testid="trending-insights">
    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">TRENDING INSIGHTS</h2>
    <div className="grid grid-cols-3 gap-3">
      {trendingInsights.map(insight => (
        <div 
          key={insight.id} 
          className="bg-[#161b22] border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 bg-gray-700 text-gray-300 rounded">{insight.type}</span>
            {insight.tags.map(tag => (
              <span 
                key={tag} 
                className={`text-[10px] px-2 py-0.5 rounded ${
                  tag === 'Important' ? 'bg-orange-500/20 text-orange-400' :
                  tag === 'Bullish' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-sm text-white font-medium mb-3 line-clamp-2">{insight.title}</h3>
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <div className="flex items-center gap-3">
              <span>Tokens: <span className="text-cyan-400">{insight.tokens}</span></span>
              <span>Entities: <span className="text-purple-400 inline-flex items-center gap-0.5"><span className="w-2 h-2 bg-purple-400 rounded-sm"></span>{insight.entities}</span></span>
            </div>
            <span>{insight.time} | {insight.updates} updates</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Arkham Exchange Tokens (BTC Card)
const ExchangeTokens = () => (
  <div className="mb-6" data-testid="exchange-tokens">
    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">ARKHAM EXCHANGE TOKENS</h2>
    <div className="bg-[#161b22] border border-gray-800 rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* BTC Logo */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">₿</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">BTC</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-orange-400">$90,843.50</span>
              <span className="text-xs text-green-400">+0.5%</span>
            </div>
          </div>
        </div>
        <a href="#" className="flex items-center gap-1.5 text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
          Trade Now on Arkham Exchange
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-4 gap-6 mt-5 pt-4 border-t border-gray-700">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">24H VOLUME</div>
          <div className="text-sm text-white font-medium">$19,921,961,803.00</div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">MARKET CAP</div>
          <div className="text-sm text-white font-medium">$1,814,567,934,866.50</div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">ALL TIME HIGH</div>
          <div className="text-sm text-white font-medium">$126,080.00</div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">ALL TIME LOW</div>
          <div className="text-sm text-white font-medium">$67.81</div>
        </div>
      </div>
    </div>
  </div>
);

// Exchange Flows Table
const ExchangeFlowsTable = () => (
  <div data-testid="exchange-flows">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">EXCHANGE FLOWS</h2>
      <div className="flex items-center gap-2">
        <button className="text-[10px] px-2.5 py-1 rounded border border-cyan-500 text-cyan-400">CEX+DEX</button>
        <button className="text-[10px] px-2.5 py-1 rounded border border-cyan-500 text-cyan-400">MARKET CAP ≥ $100M</button>
        <button className="text-[10px] px-2.5 py-1 rounded border border-cyan-500 text-cyan-400">VOLUME ≥ $100K</button>
        <button className="text-[10px] px-2.5 py-1 rounded border border-orange-500 text-orange-400">SORT BY NETFLOW/VOLUME</button>
      </div>
    </div>
    
    <div className="bg-[#161b22] border border-gray-800 rounded-lg overflow-hidden">
      {/* Filter Row */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-800 text-[10px] text-gray-500">
        <Filter className="w-3 h-3" />
        <Link2 className="w-3 h-3" />
        <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> CEX/DEX</span>
        <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> MARKET CAP</span>
        <span className="ml-auto">24H <ChevronDown className="w-3 h-3 inline" /></span>
      </div>
      
      {/* Table */}
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-800 text-[10px] text-gray-500">
            <th className="text-left py-2 px-4 font-medium"><Filter className="w-3 h-3 inline mr-1" />ASSET</th>
            <th className="text-right py-2 px-4 font-medium">PRICE</th>
            <th className="text-right py-2 px-4 font-medium"><Filter className="w-3 h-3 inline mr-1" />VOLUME</th>
            <th className="text-right py-2 px-4 font-medium">NETFLOW <Filter className="w-3 h-3 inline ml-1" /></th>
          </tr>
        </thead>
        <tbody>
          {exchangeFlows.map((row, i) => (
            <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer">
              <td className="py-2.5 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">{row.icon}</span>
                  <span className="text-white font-medium">{row.asset}</span>
                  {row.hasLink && <ArrowUpRight className="w-3 h-3 text-gray-500" />}
                </div>
              </td>
              <td className="py-2.5 px-4 text-right">
                <span className="text-white">{row.price}</span>
                <span className={`ml-1 ${row.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {row.priceChange >= 0 ? '+' : ''}{row.priceChange}%
                </span>
              </td>
              <td className="py-2.5 px-4 text-right">
                <span className="text-white">{row.volume}</span>
                <span className={`ml-1 ${row.volumeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {row.volumeChange >= 0 ? '+' : ''}{row.volumeChange}%
                </span>
              </td>
              <td className="py-2.5 px-4 text-right">
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

// Filter for Transfers (Right Sidebar)
const TransfersFilter = () => (
  <div className="h-full flex flex-col" data-testid="transfers-filter">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">FILTER FOR TRANSFERS</h2>
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <Filter className="w-3 h-3" />
        <Link2 className="w-3 h-3" />
        <span className="w-4 h-4 rounded bg-gray-700 flex items-center justify-center">⊙</span>
        <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> TIME <ChevronDown className="w-3 h-3" /></span>
      </div>
    </div>
    
    <div className="bg-[#161b22] border border-gray-800 rounded-lg flex-1 overflow-hidden flex flex-col">
      {/* Transfer list */}
      <div className="flex-1 overflow-y-auto">
        {transfersData.map(transfer => (
          <div 
            key={transfer.id} 
            className="flex items-center gap-3 px-3 py-2 border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
          >
            {/* Chain indicator */}
            <div 
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                transfer.type === 'out' ? 'bg-red-500/20' : 'bg-blue-500/20'
              }`}
            >
              {transfer.type === 'out' ? (
                <TrendingDown className="w-3 h-3 text-red-400" />
              ) : (
                <TrendingUp className="w-3 h-3 text-blue-400" />
              )}
            </div>
            
            <span className="text-xs text-cyan-400">{transfer.time}</span>
            
            <div className="flex-1 flex items-center justify-end gap-1">
              <span className="text-[10px] text-gray-500 truncate">...</span>
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: chainConfig[transfer.chain]?.color || '#627EEA' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Footer
const Footer = () => (
  <footer className="bg-[#0d1117] border-t border-gray-800 py-2.5 px-4" data-testid="footer">
    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500">
      <a href="#" className="hover:text-white transition-colors">ARKHAM CODEX</a>
      <span>·</span>
      <a href="#" className="hover:text-white transition-colors">API DOCS</a>
      <span>·</span>
      <a href="mailto:support@arkm.com" className="hover:text-white transition-colors">SUPPORT@ARKM.COM</a>
      <span>-</span>
      <span>ARKHAM INTELLIGENCE</span>
    </div>
  </footer>
);

// Chat Button
const ChatButton = () => (
  <div className="fixed bottom-4 right-4 z-50" data-testid="chat-button">
    <button className="flex items-center gap-2 bg-[#161b22] text-white px-4 py-2 rounded-full border border-gray-700 shadow-lg hover:bg-gray-800 transition-colors">
      <MessageCircle className="w-4 h-4" />
      <span className="text-xs font-medium">CH...</span>
    </button>
  </div>
);

// Arkham Watermark
const Watermark = () => (
  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-[0.03] pointer-events-none">
    <div className="text-[200px] font-black text-white tracking-tight">ARKHAM</div>
  </div>
);

// ============ MAIN PAGE ============

export default function ArkhamHome() {
  const [showBanner, setShowBanner] = useState(true);
  
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col" data-testid="arkham-home">
      {/* Top Banner */}
      {showBanner && <TopBanner onClose={() => setShowBanner(false)} />}
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 flex relative overflow-hidden">
        {/* Left Content - Main Area */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="max-w-[1100px]">
            {/* Trending Insights */}
            <TrendingInsights />
            
            {/* Arkham Exchange Tokens */}
            <ExchangeTokens />
            
            {/* Exchange Flows */}
            <ExchangeFlowsTable />
          </div>
        </div>
        
        {/* Right Sidebar - Transfers */}
        <div className="w-[320px] border-l border-gray-800 p-4 flex flex-col">
          <TransfersFilter />
        </div>
        
        {/* Watermark */}
        <Watermark />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}
