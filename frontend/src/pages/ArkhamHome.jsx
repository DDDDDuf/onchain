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
  Globe
} from 'lucide-react';

// ============ MOCK DATA ============

// Top Entities for carousel
const topEntities = [
  { id: 1, name: "dingaling", portfolio: "$4.47M", change: 0.48, isPositive: true, image: "🎰" },
  { id: 2, name: "@Cbb0fe", portfolio: "$12.2M", change: 0.79, isPositive: true, image: "🔵" },
  { id: 3, name: "World Liberty Fi", portfolio: "$8B", change: -0.53, isPositive: false, image: "🗽" },
  { id: 4, name: "Ostium", portfolio: "$62.85M", change: 0.00028, isPositive: true, image: "⭕" },
  { id: 5, name: "Donald Trump", portfolio: "$1.02M", change: -0.5, isPositive: false, image: "🇺🇸" },
  { id: 6, name: "Multisig Exploit Hacker", portfolio: "$317.95M", change: 0.89, isPositive: true, image: "🏴‍☠️" },
  { id: 7, name: "Paradex", portfolio: "$192.27M", change: 1.23, isPositive: true, image: "📊" },
  { id: 8, name: "Binance", portfolio: "$89.2B", change: 0.34, isPositive: true, image: "🟡" },
];

// Transfers data with chain icons
const transfersData = [
  { id: 1, chain: "ethereum", time: "just now", from: "Velodrome Finance: CL Pool", fromAddr: "0x478", to: "Proxy (EIP-1967 Transparent)", toAddr: "0x63f", value: "7.388K", token: "USDC", tokenImg: "💵", usd: "$7.31K" },
  { id: 2, chain: "tron", time: "just now", from: "TXdYrzohqvab5EfJ...", fromAddr: "", to: "TCv8tMpkcQUlmzn...", toAddr: "", value: "7.526", token: "TRX", tokenImg: "🔴", usd: "$2.25" },
  { id: 3, chain: "tron", time: "just now", from: "TUvCAegEHMT8uo4...", fromAddr: "", to: "OKX Deposit", toAddr: "TGpSs", value: "83.333", token: "USDT", tokenImg: "💲", usd: "$83.33" },
  { id: 4, chain: "tron", time: "just now", from: "TPiuaL2olYsrf0Z...", fromAddr: "", to: "TUY88nShbzE4nhi...", toAddr: "", value: "100.73", token: "USDT", tokenImg: "💲", usd: "$100.73" },
  { id: 5, chain: "bsc", time: "just now", from: "PancakeSwap: V3 Pool", fromAddr: "0x74b", to: "0x1cb3b6813e382...", toAddr: "", value: "231.529", token: "VSN", tokenImg: "🟣", usd: "$20.49" },
  { id: 6, chain: "ethereum", time: "just now", from: "Proxy (EIP-1967 Transparent)", fromAddr: "0xe97", to: "Velodrome Finance: CL Pool", toAddr: "0x40C", value: "15.807", token: "WETH", tokenImg: "💎", usd: "$46.72K" },
  { id: 7, chain: "ethereum", time: "just now", from: "Velodrome Finance: CL Pool", fromAddr: "0x478", to: "Proxy (EIP-1967 Transparent)", toAddr: "0x63f", value: "6.886", token: "WETH", tokenImg: "💎", usd: "$18.7K" },
  { id: 8, chain: "ethereum", time: "just now", from: "0x278d85bf05b94576...", fromAddr: "", to: "Wrapped Ether (WETH)", toAddr: "0x428", value: "0.980998", token: "ETH", tokenImg: "⟠", usd: "$3.11" },
  { id: 9, chain: "sonic", time: "just now", from: "Fly (Prev. Magpie Protocol)", fromAddr: "0xdD8", to: "Null Address", toAddr: "0x000", value: "194.299", token: "WS", tokenImg: "🔷", usd: "$16.31" },
  { id: 10, chain: "bsc", time: "just now", from: "PancakeSwap: V3 Pool", fromAddr: "0x74b", to: "0x425531F1fd219...", toAddr: "", value: "2.039K", token: "VSN", tokenImg: "🟣", usd: "$180.6" },
  { id: 11, chain: "polygon", time: "31 seconds ago", from: "Polymarket: CTF Exchange", fromAddr: "0x4bF", to: "Polymarket: Conditional Tokens", toAddr: "0x4D9", value: "44", token: "USDC", tokenImg: "💵", usd: "$44" },
  { id: 12, chain: "polygon", time: "31 seconds ago", from: "ERC1967Proxy", fromAddr: "0x3E5", to: "0x00e7bC8C93D10e...", toAddr: "", value: "51.35", token: "USDC", tokenImg: "💵", usd: "$51.35" },
];

// Chain colors and icons
const chainConfig = {
  ethereum: { color: "#627EEA", name: "Ethereum", icon: "⟠" },
  bsc: { color: "#F3BA2F", name: "BSC", icon: "◈" },
  polygon: { color: "#8247E5", name: "Polygon", icon: "⬡" },
  arbitrum: { color: "#2D374B", name: "Arbitrum", icon: "◇" },
  tron: { color: "#FF0013", name: "Tron", icon: "◆" },
  sonic: { color: "#0066FF", name: "Sonic", icon: "🔵" },
};

// Token colors
const tokenColors = {
  "USDC": "#2775CA",
  "USDT": "#26A17B",
  "TRX": "#FF0013",
  "VSN": "#8B5CF6",
  "WETH": "#627EEA",
  "ETH": "#627EEA",
  "WS": "#0066FF",
};

// ============ COMPONENTS ============

// Top Banner
const TopBanner = ({ onClose }) => (
  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2 px-4 flex items-center justify-center relative" data-testid="top-banner">
    <div className="flex items-center gap-2 text-sm">
      <span>Sign Up to Earn Up To $100 on The Arkham Exchange</span>
      <button className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-medium transition-colors">
        Trade Now
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
    <button onClick={onClose} className="absolute right-4 p-1 hover:bg-white/10 rounded">
      <X className="w-4 h-4" />
    </button>
  </div>
);

// Header with full navigation
const Header = () => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50" data-testid="header">
    <div className="h-14 px-4 flex items-center justify-between">
      {/* Left - Logo and Nav */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-gray-900" data-testid="logo">
          <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          ARKHAM
        </a>
        
        {/* Main Nav */}
        <nav className="flex items-center gap-1">
          <a href="/" className="px-3 py-1.5 text-sm font-medium text-gray-900 bg-gray-100 rounded">Intel</a>
          <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">Exchange</a>
          <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded flex items-center gap-1">
            Swap
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded font-medium">New</span>
          </a>
          
          {/* Dropdowns */}
          {['Markets', 'Custom', 'Tools'].map(item => (
            <button key={item} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded flex items-center gap-1">
              {item}
              <ChevronDown className="w-3 h-3" />
            </button>
          ))}
        </nav>
      </div>
      
      {/* Center - Search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-100">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search for tokens, addresses, entities..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400"
            data-testid="search-input"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center px-1.5 rounded border bg-white text-[10px] font-medium text-gray-400">/</kbd>
        </div>
      </div>
      
      {/* Right - User Nav */}
      <div className="flex items-center gap-1">
        <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">Profile</a>
        <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">Points</a>
        <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">Private Labels</a>
        <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">API</a>
        <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded flex items-center gap-1">
          Help
          <ChevronDown className="w-3 h-3" />
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
          <Globe className="w-4 h-4" />
        </button>
        <a href="#" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded">Login</a>
        <a href="#" className="px-4 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded">Sign Up</a>
      </div>
    </div>
  </header>
);

// Entity Card for carousel
const EntityCard = ({ entity }) => (
  <a 
    href={`#entity-${entity.id}`}
    className="flex-shrink-0 w-[200px] bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
    data-testid={`entity-card-${entity.id}`}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
        {entity.image}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate text-sm">{entity.name}</div>
      </div>
      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
        <span className="text-white text-[8px]">✓</span>
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-gray-900">{entity.portfolio}</span>
      <span className={`text-xs font-medium flex items-center gap-0.5 ${entity.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
        {entity.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {entity.change}%
      </span>
    </div>
  </a>
);

// Entities Carousel
const EntitiesCarousel = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  return (
    <div className="relative" data-testid="entities-carousel">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
        {topEntities.map(entity => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </div>
  );
};

// Chain Icon
const ChainIcon = ({ chain }) => {
  const config = chainConfig[chain] || chainConfig.ethereum;
  return (
    <div 
      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
      style={{ backgroundColor: config.color }}
      title={config.name}
    >
      {config.icon}
    </div>
  );
};

// Transfers Table
const TransfersTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 625;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full" data-testid="transfers-table">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-3 h-3" />
            FILTER FOR TRANSFERS
          </h3>
          
          <div className="flex items-center gap-2">
            <button className="text-[10px] font-semibold px-2.5 py-1 rounded bg-gray-900 text-white">ALL</button>
            <button className="text-[10px] font-medium px-2.5 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">USD ≥ $1</button>
            <button className="text-[10px] font-medium px-2.5 py-1 rounded bg-blue-50 text-blue-600">SORT BY TIME</button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>TRANSFERS</span>
          <span className="text-gray-300">|</span>
          <span className="font-medium text-gray-700">{currentPage} / {totalPages}</span>
          <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-3 h-3" /></button>
          <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-3 h-3" /></button>
          <button className="p-1 hover:bg-gray-100 rounded"><RefreshCw className="w-3 h-3" /></button>
        </div>
      </div>
      
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm">
            <tr className="border-b border-gray-100">
              <th className="w-8 py-2 px-2"></th>
              <th className="text-left py-2 px-2 font-medium text-gray-400 text-[10px]">
                <Filter className="w-3 h-3 inline mr-1" />
                TIME
              </th>
              <th className="text-left py-2 px-2 font-medium text-gray-400 text-[10px]">
                <Filter className="w-3 h-3 inline mr-1" />
                FROM
              </th>
              <th className="text-left py-2 px-2 font-medium text-gray-400 text-[10px]">
                <Filter className="w-3 h-3 inline mr-1" />
                TO
              </th>
              <th className="text-right py-2 px-2 font-medium text-gray-400 text-[10px]">VALUE</th>
              <th className="text-right py-2 px-2 font-medium text-gray-400 text-[10px]">TOKEN</th>
              <th className="text-right py-2 px-2 font-medium text-gray-400 text-[10px]">USD</th>
            </tr>
          </thead>
          <tbody>
            {transfersData.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/70 cursor-pointer group">
                <td className="py-2 px-2">
                  <ChainIcon chain={tx.chain} />
                </td>
                <td className="py-2 px-2 text-gray-500 whitespace-nowrap">
                  <a href="#" className="hover:text-blue-600">{tx.time}</a>
                </td>
                <td className="py-2 px-2 max-w-[180px]">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600 hover:underline cursor-pointer font-medium truncate">
                      {tx.from}
                    </span>
                    {tx.fromAddr && <span className="text-gray-400">({tx.fromAddr})</span>}
                    <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded">
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </td>
                <td className="py-2 px-2 max-w-[180px]">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600 hover:underline cursor-pointer font-medium truncate">
                      {tx.to}
                    </span>
                    {tx.toAddr && <span className="text-gray-400">({tx.toAddr})</span>}
                    <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded">
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </td>
                <td className="py-2 px-2 text-right font-medium text-gray-900 whitespace-nowrap">{tx.value}</td>
                <td className="py-2 px-2 text-right">
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-white text-[10px] font-bold"
                    style={{ backgroundColor: tokenColors[tx.token] || '#6B7280' }}
                  >
                    {tx.token}
                  </span>
                </td>
                <td className="py-2 px-2 text-right font-medium text-gray-500 whitespace-nowrap">{tx.usd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Footer
const Footer = () => (
  <footer className="bg-white border-t border-gray-200 py-3 px-6" data-testid="footer">
    <div className="flex items-center justify-between text-xs text-gray-500">
      <div></div>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <a href="#" className="hover:text-gray-900">Arkham Codex</a>
        <span>·</span>
        <a href="#" className="hover:text-gray-900">API Docs</a>
        <span>·</span>
        <a href="mailto:support@arkm.com" className="hover:text-gray-900">support@arkm.com</a>
        <span>-</span>
        <span>ARKHAM INTELLIGENCE - © 2026</span>
        <span>-</span>
        <a href="#" className="hover:text-gray-900">terms of service</a>
        <span>-</span>
        <a href="#" className="hover:text-gray-900">privacy</a>
      </div>
      <div></div>
    </div>
  </footer>
);

// Chat Button
const ChatButton = () => (
  <div className="fixed bottom-4 right-4 z-50" data-testid="chat-button">
    <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors">
      <MessageCircle className="w-4 h-4" />
      <span className="text-sm font-medium">CHAT ROOM: home</span>
      <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">(9+)</span>
    </button>
  </div>
);

// Arkham Watermark
const Watermark = () => (
  <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
    <div className="text-6xl font-black text-gray-900">ARKHAM</div>
  </div>
);

// ============ MAIN PAGE ============

export default function ArkhamHome() {
  const [showBanner, setShowBanner] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-testid="arkham-home">
      {/* Top Banner */}
      {showBanner && <TopBanner onClose={() => setShowBanner(false)} />}
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Title */}
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-6" data-testid="main-title">
            ARKHAM INTEL
          </h1>
          
          {/* Entities Carousel */}
          <div className="mb-8">
            <EntitiesCarousel />
          </div>
          
          {/* Main Grid - Transfers Table */}
          <div className="h-[600px] relative">
            <TransfersTable />
            <Watermark />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Chat Button */}
      <ChatButton />
    </div>
  );
}
