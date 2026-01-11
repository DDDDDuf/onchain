import { useState, useEffect } from 'react';
import { 
  Search, 
  Link2,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Zap,
  BarChart2
} from 'lucide-react';

// Mock data for Trending Insights
const trendingInsights = [
  {
    id: 1,
    category: "On-Chain Trade",
    tags: [],
    headline: "Ethereum: Whale Closes $15.1M Short on Hyperliquid Amidst...",
    tokens: 8,
    entities: 1,
    time: "23 hours ago",
    updates: 5
  },
  {
    id: 2,
    category: "Important",
    tags: ["Bullish", "Partnership"],
    headline: "Solana Surges on X Integration News: Volume Spikes to $68M as...",
    tokens: 8,
    entities: 11,
    time: "52 minutes ago",
    updates: 8
  },
  {
    id: 3,
    category: "Macroeconomic",
    tags: [],
    headline: "Bitcoin: Saylor Highlights Inflation Hedge as Options Market...",
    tokens: null,
    tokenIcon: "🔥",
    time: "17 hours ago",
    updates: 1
  },
  {
    id: 4,
    category: "Important",
    tags: ["Bullish", "Partnership", "On-Chain Trade"],
    headline: "ETH Bullish as Robinhood Builds Layer-2 and Whale Covers $11.4...",
    tokens: 7,
    entities: null,
    entityIcon: "🔷",
    time: "4 hours ago",
    updates: 3
  }
];

// Mock transfers data
const transfersData = [
  { id: 1, time: "just now", from: "Velodrome Finance: CL Pool (0x478)", to: "Proxy (EIP-1967 Transparent) (0x63f)", value: "7.388K", token: "USDC", tokenColor: "#2775CA", usd: "$7.31K" },
  { id: 2, time: "just now", from: "TXdYrzohqvab5EfJ8dWa81zKCSeHn7qDCLQE", to: "TCv8tMpkcQUlmzn0YzEc00CH20WqvcJtNB1G", value: "7.526", token: "TRX", tokenColor: "#FF0013", usd: "$2.25" },
  { id: 3, time: "just now", from: "TUvCAegEHMT8uo4ZnjUVYheEnuUSSPY3va", to: "OKX Deposit (TGpSs)", value: "83.333", token: "USDT", tokenColor: "#26A17B", usd: "$83.33" },
  { id: 4, time: "just now", from: "TPiuaL2olYsrf0ZEkxaz6P4vqDnptsSFg", to: "TUY88nShbzE4nhisL8KxFaWFrC7iKcQA2a", value: "100.73", token: "USDT", tokenColor: "#26A17B", usd: "$100.73" },
  { id: 5, time: "just now", from: "PancakeSwap: V3 Pool (0x74b)", to: "0x1cb3b6813e3828E38B7e9293FEcA5a7FBA86F319", value: "231.529", token: "VSN", tokenColor: "#8B5CF6", usd: "$20.49" },
  { id: 6, time: "just now", from: "Proxy (EIP-1967 Transparent) (0xe97)", to: "Velodrome Finance: CL Pool (0x40C)", value: "15.807", token: "WETH", tokenColor: "#627EEA", usd: "$46.72K" },
  { id: 7, time: "just now", from: "Velodrome Finance: CL Pool (0x478)", to: "Proxy (EIP-1967 Transparent) (0x63f)", value: "6.886", token: "WETH", tokenColor: "#627EEA", usd: "$18.7K" },
  { id: 8, time: "just now", from: "0x278d85bf05b94576c1E64C1E6b6f7328E9B87e6D2", to: "Wrapped Ether (WETH) (0x428)", value: "0.980998", token: "ETH", tokenColor: "#627EEA", usd: "$3.11" },
  { id: 9, time: "just now", from: "Fly (Prev. Magpie Protocol) (0xdD8)", to: "Null Address (0x000)", value: "194.299", token: "WS", tokenColor: "#6B7280", usd: "$16.31" },
  { id: 10, time: "just now", from: "PancakeSwap: V3 Pool (0x74b)", to: "0x425531F1fd219D02C7965AF9b0E46B3F9B5A8087", value: "2.039K", token: "VSN", tokenColor: "#8B5CF6", usd: "$180.6" }
];

// Mock exchange flows data
const exchangeFlowsData = [
  { asset: "AWE", price: "$0.055", priceChange: -4.41, volume: "$814.9K", volumeChange: -39.5, netflow: "+$796.88K", netflowChange: -38.88 },
  { asset: "BARD", price: "$0.79", priceChange: -0.82, volume: "$627.94K", volumeChange: +131.24, netflow: "+$610.87K", netflowChange: +12.5, hasAnalyze: true },
  { asset: "AXS", price: "$4.95", priceChange: -0.48, volume: "$419.26K", volumeChange: -38.44, netflow: "+$375.59K", netflowChange: -37.97 },
  { asset: "JASMY", price: "$0.0089", priceChange: +2.44, volume: "$2.81M", volumeChange: +149, netflow: "+$2.44M", netflowChange: +168.86 },
  { asset: "CTC", price: "$0.29", priceChange: +3.69, volume: "$2.83M", volumeChange: -14.34, netflow: "+$2.34M", netflowChange: -12.44 },
  { asset: "PYTH", price: "$0.066", priceChange: -1.85, volume: "$1.89M", volumeChange: +65.78, netflow: "+$890.4K", netflowChange: +65.47 },
  { asset: "ZRX", price: "$0.13", priceChange: -5.26, volume: "$1.14M", volumeChange: +129.21, netflow: "+$947.44K", netflowChange: +116.12 },
  { asset: "LPT", price: "$3.13", priceChange: -3.93, volume: "$1.07M", volumeChange: -67.97, netflow: "+$869.67K", netflowChange: -65.76 },
  { asset: "OETH", price: "$3.11K", priceChange: +1.34, volume: "$914.89K", volumeChange: +522.17, netflow: "+$736.63K", netflowChange: +8.42 }
];

// Header Component
const Header = () => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50" data-testid="header">
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5 w-[420px] border border-gray-100">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search for tokens, addresses, entities..."
            className="bg-transparent border-none outline-none flex-1 text-sm text-gray-900 placeholder-gray-400"
            data-testid="search-input"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Filter className="w-4 h-4 text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Link2 className="w-4 h-4 text-gray-500" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800" data-testid="all-networks-btn">
          <Globe className="w-4 h-4" />
          ALL NETWORKS
        </button>
      </div>
    </header>
  );
};

// Trending Insights Section
const TrendingInsights = () => {
  return (
    <section className="px-6 py-4 border-b border-gray-100" data-testid="trending-insights">
      <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">TRENDING INSIGHTS</h2>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {trendingInsights.map((insight) => (
          <div 
            key={insight.id} 
            className="flex-shrink-0 w-[280px] bg-white border border-gray-100 rounded-lg p-4 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
            data-testid={`insight-${insight.id}`}
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                {insight.category}
              </span>
              {insight.tags.map(tag => (
                <span 
                  key={tag}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                    tag === 'Bullish' ? 'bg-emerald-50 text-emerald-600' :
                    tag === 'Partnership' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Headline */}
            <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-3">
              {insight.headline}
            </p>
            
            {/* Meta */}
            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              {insight.tokens && (
                <span>Tokens: <span className="text-gray-600">{insight.tokens}</span></span>
              )}
              {insight.entities && (
                <span>Entities: <span className="text-gray-600">{insight.entities}</span></span>
              )}
              {insight.tokenIcon && <span>{insight.tokenIcon}</span>}
              {insight.entityIcon && <span>{insight.entityIcon}</span>}
              <span className="ml-auto">{insight.time} | {insight.updates} updates</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Main Token Display (LINK)
const MainTokenDisplay = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5" data-testid="main-token">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">ARKHAM EXCHANGE TOKENS</h3>
      
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Token Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">LINK</h4>
          </div>
        </div>
        
        <a 
          href="#" 
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Trade Now on Arkham Exchange
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      
      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">$13.19</span>
          <span className="text-sm font-medium text-emerald-500">+0.44%</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs text-gray-400 uppercase">24H VOLUME</span>
          <p className="text-sm font-semibold text-gray-900 mt-1">$233,867,279.00</p>
        </div>
        <div>
          <span className="text-xs text-gray-400 uppercase">MARKET CAP</span>
          <p className="text-sm font-semibold text-gray-900 mt-1">$9,338,422,410.33</p>
        </div>
        <div>
          <span className="text-xs text-gray-400 uppercase">ALL TIME HIGH</span>
          <p className="text-sm font-semibold text-gray-900 mt-1">$52.70</p>
        </div>
        <div>
          <span className="text-xs text-gray-400 uppercase">ALL TIME LOW</span>
          <p className="text-sm font-semibold text-gray-900 mt-1">$0.15</p>
        </div>
      </div>
    </div>
  );
};

// Exchange Flows Table
const ExchangeFlows = () => {
  // Token colors for each asset
  const getTokenColor = (asset) => {
    const colors = {
      'AWE': '#F59E0B',
      'BARD': '#EC4899',
      'AXS': '#F59E0B',
      'JASMY': '#F97316',
      'CTC': '#6366F1',
      'PYTH': '#8B5CF6',
      'ZRX': '#3B82F6',
      'LPT': '#10B981',
      'OETH': '#627EEA'
    };
    return colors[asset] || '#6B7280';
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl" data-testid="exchange-flows">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">EXCHANGE FLOWS</h3>
          <select className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1 text-gray-600">
            <option>24H</option>
            <option>7D</option>
            <option>30D</option>
          </select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button className="text-[10px] font-medium px-2 py-1 rounded bg-gray-900 text-white">CEX+DEX</button>
          <button className="text-[10px] font-medium px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">MARKET CAP ≥ $100M</button>
          <button className="text-[10px] font-medium px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">VOLUME ≥ $100K</button>
          <button className="text-[10px] font-medium px-2 py-1 rounded bg-blue-50 text-blue-600">SORT BY NETFLOW/VOLUME</button>
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[400px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm">
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-3 font-medium text-gray-400 text-[10px]">
                <Filter className="w-3 h-3 inline mr-1" />
                ASSET
              </th>
              <th className="text-right py-2 px-3 font-medium text-gray-400 text-[10px]">PRICE</th>
              <th className="text-right py-2 px-3 font-medium text-gray-400 text-[10px]">VOLUME</th>
              <th className="text-right py-2 px-3 font-medium text-gray-400 text-[10px]">NETFLOW</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {exchangeFlowsData.map((row, index) => (
              <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/70 cursor-pointer group">
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] text-white font-bold"
                      style={{ backgroundColor: getTokenColor(row.asset) }}
                    >
                      {row.asset.slice(0, 1)}
                    </div>
                    <span className="font-semibold text-gray-900">{row.asset}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <span className="font-medium text-gray-900">{row.price}</span>
                  <span className={`ml-1 text-[10px] ${row.priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {row.priceChange >= 0 ? '+' : ''}{row.priceChange}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <span className="font-medium text-gray-900">{row.volume}</span>
                  <span className={`ml-1 text-[10px] ${row.volumeChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {row.volumeChange >= 0 ? '+' : ''}{row.volumeChange}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <span className={`font-semibold ${row.netflow.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {row.netflow}
                  </span>
                  <span className={`ml-1 text-[10px] ${row.netflowChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {row.netflowChange >= 0 ? '+' : ''}{row.netflowChange}%
                  </span>
                </td>
                <td className="py-2.5 px-1">
                  {row.hasAnalyze && (
                    <button className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-medium rounded hover:bg-blue-100">
                      Analyze
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Filter for Transfers Section
const FilterForTransfers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 625;
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl h-full flex flex-col" data-testid="transfers-filter">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">FILTER FOR TRANSFERS</h3>
          
          <div className="flex items-center gap-2">
            <button className="text-[10px] font-medium px-2 py-1 rounded bg-gray-900 text-white">ALL</button>
            <button className="text-[10px] font-medium px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">USD ≥ $1</button>
            <button className="text-[10px] font-medium px-2 py-1 rounded bg-blue-50 text-blue-600">SORT BY TIME</button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>TRANSFERS</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">{currentPage} / {totalPages}</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-3 h-3" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-50/90 backdrop-blur-sm">
            <tr>
              <th className="text-left py-2 px-3 font-medium text-gray-400">
                <Filter className="w-3 h-3 inline mr-1" />
                ⊙
              </th>
              <th className="text-left py-2 px-3 font-medium text-gray-400">
                <Filter className="w-3 h-3 inline mr-1" />
                TIME ▼
              </th>
              <th className="text-left py-2 px-3 font-medium text-gray-400">
                <Filter className="w-3 h-3 inline mr-1" />
                FROM
              </th>
              <th className="text-left py-2 px-3 font-medium text-gray-400">
                <Filter className="w-3 h-3 inline mr-1" />
                TO
              </th>
              <th className="text-right py-2 px-3 font-medium text-gray-400">VALUE</th>
              <th className="text-right py-2 px-3 font-medium text-gray-400">TOKEN</th>
              <th className="text-right py-2 px-3 font-medium text-gray-400">USD</th>
            </tr>
          </thead>
          <tbody>
            {transfersData.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                <td className="py-2 px-3">
                  <div className={`w-2 h-2 rounded-full ${tx.id % 2 === 0 ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                </td>
                <td className="py-2 px-3 text-gray-500">{tx.time}</td>
                <td className="py-2 px-3">
                  <span className="text-blue-600 hover:underline cursor-pointer font-medium truncate max-w-[160px] block">
                    {tx.from}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className="text-blue-600 hover:underline cursor-pointer font-medium truncate max-w-[160px] block">
                    {tx.to}
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-medium text-gray-900">{tx.value}</td>
                <td className="py-2 px-3 text-right">
                  <span 
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-white text-[10px] font-bold"
                    style={{ backgroundColor: tx.tokenColor }}
                  >
                    {tx.token}
                  </span>
                </td>
                <td className="py-2 px-3 text-right font-medium text-gray-900">{tx.usd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Home Page
export default function ArkhamHome() {
  return (
    <div className="min-h-screen bg-gray-50/30" data-testid="arkham-home">
      <Header />
      
      <main>
        {/* Trending Insights */}
        <TrendingInsights />
        
        {/* Main Content Grid */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Token & Exchange Flows */}
            <div className="col-span-5 space-y-6">
              <MainTokenDisplay />
              <ExchangeFlows />
            </div>
            
            {/* Right Column - Transfers */}
            <div className="col-span-7">
              <FilterForTransfers />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
