import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Wallet,
  Menu,
  ExternalLink,
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

// ============ MOCK DATA ============

// Price history data
const priceHistoryData = [
  { date: '2020', price: 0.05 },
  { date: '2020.5', price: 0.07 },
  { date: '2021', price: 0.03 },
  { date: '2021.3', price: 0.08 },
  { date: '2021.5', price: 0.12 },
  { date: '2021.7', price: 0.18 },
  { date: '2021.9', price: 0.09 },
  { date: '2022', price: 0.05 },
  { date: '2022.5', price: 0.03 },
  { date: '2023', price: 0.04 },
  { date: '2023.5', price: 0.05 },
  { date: '2024', price: 0.06 },
  { date: '2024.5', price: 0.08 },
  { date: '2025', price: 0.14 },
  { date: '2025.5', price: 0.09 },
  { date: '2026', price: 0.12 },
];

// Token stats
const tokenStats = {
  volume24h: "$5,909,008",
  marketCap: "$107,683,895.65",
  fdv: "$107,683,895.65",
  currentSupply: "1,942,420,283,027",
  maxSupply: "1,942,420,283,027",
  change24h: "-2.41%",
  change7d: "-2.03%",
  change30d: "-5.98%",
  change180d: "-7.81%",
  ath: "$0.270",
  atl: "$0.00647",
};

const tokenData = {
  awe: {
    name: "AWE Network",
    symbol: "AWE",
    price: "$0.0554",
    icon: "🔷",
    color: "#3B82F6",
  },
  xpl: {
    name: "XPL Token", 
    symbol: "XPL",
    price: "$0.203",
    icon: "🌀",
    color: "#10B981",
  },
};

const entityBalanceChanges = [
  { name: "CoinDCX", type: "CEX", icon: "⚪", value: "2.1M", valueChange: "+117.6%", usd: "$120.96K", usdChange: "+119.45%" },
  { name: "Bithumb", type: "CEX", icon: "🟠", value: "28.45M", valueChange: "+1.28%", usd: "$1.64M", usdChange: "+2.14%" },
  { name: "HTX", type: "CEX", icon: "🔵", value: "5.15M", valueChange: "+1.07%", usd: "$296.7K", usdChange: "+1.93%" },
  { name: "Binance", type: "CEX", icon: "🟡", value: "412.81M", valueChange: "+0.77%", usd: "$23.79M", usdChange: "+1.63%" },
  { name: "Poloniex", type: "CEX", icon: "🟢", value: "1.95M", valueChange: "±0%", usd: "$112.54K", usdChange: "+0.85%" },
  { name: "Aerodrome Finance", type: "DEX", icon: "🔷", value: "5M", valueChange: "-0.39%", usd: "$288.36K", usdChange: "+0.46%" },
  { name: "OKX", type: "CEX", icon: "⚫", value: "89.2M", valueChange: "+2.45%", usd: "$5.14M", usdChange: "+3.31%" },
  { name: "Kraken", type: "CEX", icon: "🟣", value: "15.67M", valueChange: "-0.12%", usd: "$903.5K", usdChange: "+0.74%" },
];

const topFlows = [
  { from: "Binance", to: "Unknown Wallet", value: "5.2M", usd: "$299.8K", time: "2 hours ago" },
  { from: "CoinDCX", to: "Whale 0x8f2...", value: "1.8M", usd: "$103.7K", time: "4 hours ago" },
  { from: "HTX", to: "DEX Router", value: "890K", usd: "$51.3K", time: "6 hours ago" },
];

// Token Transfers Data
const tokenTransfers = [
  { id: 1, chain: "ethereum", time: "8 minutes ago", from: "0x52C76F669ab5b8a60616d4...", to: "0x2934692564e562A9Dd47cf...", value: "1", token: "AWE" },
  { id: 2, chain: "ethereum", time: "13 minutes ago", from: "0x0bE41D9DE729a9C9a833ca...", to: "0xc9411FBB3499d4292e269a...", value: "1", token: "AWE" },
  { id: 3, chain: "ethereum", time: "14 minutes ago", from: "0xD06058C1dFE21a0E63f78a...", to: "0x2934692564e562A9Dd47cf...", value: "1", token: "AWE" },
  { id: 4, chain: "base", time: "16 minutes ago", from: "0x7F825c15dbEB16328b7D85...", to: "0xc9411FBB3499d4292e269a...", value: "1", token: "AWE" },
  { id: 5, chain: "ethereum", time: "23 minutes ago", from: "0xF45B2AD8e5170557c7ee9F...", to: "0x2934692564e562A9Dd47cf...", value: "1", token: "AWE" },
  { id: 6, chain: "base", time: "24 minutes ago", from: "0xa1b5FB1301C56f89404EBB...", to: "0x2934692564e562A9Dd47cf...", value: "1", token: "AWE" },
  { id: 7, chain: "ethereum", time: "25 minutes ago", from: "0x34C1D98AF85e4Be117b618...", to: "0xc9411FBB3499d4292e269a...", value: "1", token: "AWE" },
  { id: 8, chain: "ethereum", time: "27 minutes ago", from: "0x4f4C0646e69da9b878Eb39...", to: "0x2934692564e562A9Dd47cf...", value: "1", token: "AWE" },
  { id: 9, chain: "base", time: "36 minutes ago", from: "Bitget Deposit (0xfed)", fromLabel: "Bitget Deposit", to: "Bitget: Hot Wallet (0x...", toLabel: "Bitget: Hot Wallet", value: "41.956K", token: "AWE" },
  { id: 10, chain: "ethereum", time: "42 minutes ago", from: "Binance: Hot Wallet (0...", fromLabel: "Binance: Hot Wallet", to: "Bitget Deposit (0xfed)", toLabel: "Bitget Deposit", value: "41.956K", token: "AWE" },
];

const chainColors = {
  ethereum: "#627EEA",
  base: "#0052FF",
  polygon: "#8247E5",
  bsc: "#F3BA2F",
};

// Top Holders Data
const topHolders = [
  { name: "Binance: Cold Wallet (0xF97)", isEntity: true, icon: "◇", value: "398,417,870.95", pct: "19.92%", usd: "$22.09M" },
  { name: "0xa2B741C8b4c840082c14A4aDEBFA3F2eAE45d022", isEntity: false, icon: null, value: "293,116,664", pct: "14.66%", usd: "$16.25M" },
  { name: "Upbit: Cold Wallet (0xb93)", isEntity: true, icon: "UP", value: "229,965,767.73", pct: "11.5%", usd: "$12.75M" },
  { name: "0x74f50212ac259BA648F0BF4f0C02FaaB098cf7d6", isEntity: false, icon: null, value: "133,362,169.33", pct: "6.67%", usd: "$7.39M" },
  { name: "0x18051a9c643077DC1A14d49E1B804dC857750287", isEntity: false, icon: null, value: "119,638,020.93", pct: "5.98%", usd: "$6.63M" },
  { name: "0x5d2A3ceF08bDD89b6AE9713b18E8F010dAC2950a", isEntity: false, icon: null, value: "115,349,900", pct: "5.77%", usd: "$6.39M" },
  { name: "0x48c9b9313daF9310e85b114710e92bf2f4FB1b74", isEntity: false, icon: null, value: "68,329,830.18", pct: "3.42%", usd: "$3.79M" },
];

// ============ COMPONENTS ============

// Glass Card Component
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
  <header className="sticky top-0 z-50 px-6 py-4">
    <GlassCard className="px-5 py-3" hover={false}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-black">F</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">Flow Intel</span>
          </Link>
          
          <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
        
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

// Token Header
const TokenHeader = ({ token }) => (
  <div className="px-6 py-6">
    <div className="flex items-center gap-5">
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-3xl"
        style={{ backgroundColor: token.color + '20' }}
      >
        {token.icon}
      </div>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{token.name}</h1>
          <span className="text-lg text-gray-500">({token.symbol})</span>
          <a href="#" className="text-blue-500 hover:text-blue-600">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="text-3xl font-bold text-gray-900 mt-1">{token.price}</div>
      </div>
    </div>
  </div>
);

// Tabs
const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="px-6 mb-4">
    <GlassCard className="p-1 inline-flex" hover={false}>
      <button 
        onClick={() => setActiveTab('balance')}
        className={`px-6 py-3 text-sm font-semibold rounded-2xl transition-all ${
          activeTab === 'balance' 
            ? 'bg-white text-gray-900 shadow-md' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        ENTITY BALANCE CHANGES
      </button>
      <button 
        onClick={() => setActiveTab('flows')}
        className={`px-6 py-3 text-sm font-semibold rounded-2xl transition-all ${
          activeTab === 'flows' 
            ? 'bg-white text-gray-900 shadow-md' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        TOP FLOWS
      </button>
    </GlassCard>
  </div>
);

// Filters
const Filters = ({ timePeriod, setTimePeriod }) => (
  <div className="px-6 mb-4 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <button className="px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-blue-500 text-blue-600 bg-blue-50">
        USD ≥ 100 000
      </button>
      <button className="px-3 py-1.5 text-xs font-bold rounded-xl border-2 border-orange-400 text-orange-500 bg-orange-50">
        SORT BY USD CHANGE %
      </button>
    </div>
    
    <div className="relative">
      <select 
        value={timePeriod}
        onChange={(e) => setTimePeriod(e.target.value)}
        className="appearance-none bg-gray-800 text-white px-4 py-2 pr-8 rounded-xl text-sm font-semibold cursor-pointer"
      >
        <option value="1D">1D</option>
        <option value="7D">7D</option>
        <option value="30D">30D</option>
        <option value="ALL">ALL</option>
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  </div>
);

// Entity Balance Table
const EntityBalanceTable = () => (
  <div className="px-6 pb-8">
    <GlassCard className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100/50">
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">
              <Filter className="w-3 h-3 inline mr-1" /> ENTITY
            </th>
            <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase">VALUE</th>
            <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase">CHANGE</th>
            <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase">
              <Filter className="w-3 h-3 inline mr-1" /> USD
            </th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase">
              CHANGE ▼ <Filter className="w-3 h-3 inline ml-1" />
            </th>
          </tr>
        </thead>
        <tbody>
          {entityBalanceChanges.map((entity, i) => (
            <tr 
              key={i} 
              className="border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors"
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                    {entity.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{entity.name}</div>
                    <div className="text-xs text-gray-500">{entity.type}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="font-semibold text-gray-900">{entity.value}</span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className={`font-semibold ${
                  entity.valueChange.startsWith('+') ? 'text-emerald-500' : 
                  entity.valueChange.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {entity.valueChange}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="font-semibold text-gray-900">{entity.usd}</span>
              </td>
              <td className="py-4 px-6 text-right">
                <span className={`font-semibold ${
                  entity.usdChange.startsWith('+') ? 'text-emerald-500' : 
                  entity.usdChange.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {entity.usdChange}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  </div>
);

// Top Flows Table
const TopFlowsTable = () => (
  <div className="px-6 pb-8">
    <GlassCard className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100/50">
            <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase">FROM</th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase">TO</th>
            <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase">VALUE</th>
            <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase">USD</th>
            <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase">TIME</th>
          </tr>
        </thead>
        <tbody>
          {topFlows.map((flow, i) => (
            <tr 
              key={i} 
              className="border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors"
            >
              <td className="py-4 px-6">
                <span className="font-semibold text-blue-600">{flow.from}</span>
              </td>
              <td className="py-4 px-4">
                <span className="font-semibold text-blue-600">{flow.to}</span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="font-semibold text-gray-900">{flow.value}</span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="font-semibold text-gray-900">{flow.usd}</span>
              </td>
              <td className="py-4 px-6 text-right">
                <span className="text-gray-500">{flow.time}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  </div>
);

// Top Holders Table
const TopHoldersTable = ({ token }) => {
  const [groupByEntity, setGroupByEntity] = useState(false);
  
  return (
    <div className="px-6 pb-8">
      {/* Title and Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
          {token.symbol} TOP HOLDERS
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">ADDRESSES</span>
          <button 
            onClick={() => setGroupByEntity(!groupByEntity)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              groupByEntity ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              groupByEntity ? 'left-7' : 'left-1'
            }`} />
          </button>
          <span className="text-xs text-gray-500">GROUP BY ENTITY</span>
        </div>
      </div>
      
      <GlassCard className="overflow-hidden relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <div className="text-[150px] font-black text-gray-900 tracking-tight">FLOW</div>
        </div>
        
        <table className="w-full relative z-10">
          <thead>
            <tr className="border-b border-gray-100/50">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase w-1/2">
                <Filter className="w-3 h-3 inline mr-1" /> {groupByEntity ? 'ENTITY' : 'ADDRESS'}
              </th>
              <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase">
                <Filter className="w-3 h-3 inline mr-1" /> VALUE
              </th>
              <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase">PCT</th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase">USD</th>
            </tr>
          </thead>
          <tbody>
            {topHolders.map((holder, i) => (
              <tr 
                key={i} 
                className="border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {holder.isEntity ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                        {holder.icon}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">?</span>
                      </div>
                    )}
                    <span className={`font-medium ${holder.isEntity ? 'text-blue-600' : 'text-gray-600'} truncate max-w-[350px]`}>
                      {holder.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-semibold text-gray-900">{holder.value}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-semibold text-gray-900">{holder.pct}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="font-semibold text-gray-900">{holder.usd}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

// Price Chart Component
const PriceChart = ({ token }) => {
  const [chartTab, setChartTab] = useState('price');
  const [chartPeriod, setChartPeriod] = useState('ALL');
  
  return (
    <div className="h-full flex flex-col">
      {/* Stats Bar */}
      <GlassCard className="p-4 mb-4">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
              24H VOLUME <Info className="w-3 h-3" />
            </div>
            <div className="text-sm font-bold text-gray-900">{tokenStats.volume24h}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
              MARKET CAP <Info className="w-3 h-3" />
            </div>
            <div className="text-sm font-bold text-gray-900">{tokenStats.marketCap}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
              FDV <Info className="w-3 h-3" />
            </div>
            <div className="text-sm font-bold text-gray-900">{tokenStats.fdv}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
              CURRENT SUPPLY <Info className="w-3 h-3" />
            </div>
            <div className="text-sm font-bold text-gray-900">{tokenStats.currentSupply}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
              MAX SUPPLY <Info className="w-3 h-3" />
            </div>
            <div className="text-sm font-bold text-gray-900">{tokenStats.maxSupply}</div>
          </div>
        </div>
      </GlassCard>
      
      {/* Chart Tabs */}
      <div className="flex items-center justify-between mb-4">
        <GlassCard className="p-1 inline-flex" hover={false}>
          {['PRICE HISTORY', 'ON-CHAIN EXCHANGE FLOW', 'TRADINGVIEW'].map((tab) => (
            <button
              key={tab}
              onClick={() => setChartTab(tab.toLowerCase().replace(/ /g, '_'))}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                chartTab === tab.toLowerCase().replace(/ /g, '_')
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </GlassCard>
        
        <div className="flex items-center gap-1">
          {['1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
            <button
              key={period}
              onClick={() => setChartPeriod(period)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                chartPeriod === period
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <GlassCard className="flex-1 p-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={priceHistoryData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [`$${value.toFixed(4)}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#3B82F6" 
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
      
      {/* Bottom Stats */}
      <GlassCard className="p-4 mt-4">
        <div className="grid grid-cols-6 gap-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">24H</div>
            <div className={`text-sm font-bold ${tokenStats.change24h.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
              {tokenStats.change24h}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">7D</div>
            <div className={`text-sm font-bold ${tokenStats.change7d.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
              {tokenStats.change7d}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">30D</div>
            <div className={`text-sm font-bold ${tokenStats.change30d.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
              {tokenStats.change30d}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">180D</div>
            <div className={`text-sm font-bold ${tokenStats.change180d.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
              {tokenStats.change180d}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">ATH</div>
            <div className="text-sm font-bold text-gray-900">{tokenStats.ath}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">ATL</div>
            <div className="text-sm font-bold text-gray-900">{tokenStats.atl}</div>
          </div>
        </div>
      </GlassCard>
      
      {/* Token Transfers Table */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-semibold rounded-lg">
            COINS
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">TRANSFERS</span>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-3 h-3 text-gray-500" />
              </button>
              <span className="text-xs font-semibold text-gray-900">1 / 625</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        
        <GlassCard className="overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100/50">
                <th className="w-8 py-2 px-3"></th>
                <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase">
                  <Filter className="w-2.5 h-2.5 inline mr-1" /> TIME
                </th>
                <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase">
                  <Filter className="w-2.5 h-2.5 inline mr-1" /> FROM
                </th>
                <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase">
                  <Filter className="w-2.5 h-2.5 inline mr-1" /> TO
                </th>
                <th className="text-right py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase">
                  <Filter className="w-2.5 h-2.5 inline mr-1" /> VALUE
                </th>
                <th className="text-right py-2 px-3 text-[10px] font-semibold text-gray-500 uppercase">TOKEN</th>
              </tr>
            </thead>
            <tbody>
              {tokenTransfers.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors">
                  <td className="py-2 px-3">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: chainColors[tx.chain] || '#627EEA' }}
                    >
                      <span className="text-white text-[8px]">⟠</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <span className="text-blue-600 font-medium">{tx.time}</span>
                  </td>
                  <td className="py-2 px-2 max-w-[140px]">
                    <span className="text-blue-600 truncate block">{tx.fromLabel || tx.from}</span>
                  </td>
                  <td className="py-2 px-2 max-w-[140px]">
                    <span className="text-blue-600 truncate block">{tx.toLabel || tx.to}</span>
                  </td>
                  <td className="py-2 px-2 text-right font-semibold text-gray-900">{tx.value}</td>
                  <td className="py-2 px-3 text-right">
                    <span className="inline-block px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded">
                      {tx.token}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
};

// ============ MAIN PAGE ============

export default function TokenDetail() {
  const { tokenId } = useParams();
  const [activeTab, setActiveTab] = useState('balance');
  const [timePeriod, setTimePeriod] = useState('7D');
  
  // Get token data or use default
  const token = tokenData[tokenId] || tokenData.awe;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30" data-testid="token-detail-page">
      {/* Header */}
      <Header />
      
      {/* Token Header */}
      <TokenHeader token={token} />
      
      {/* Main Content - Two Column Layout */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Tables */}
          <div className="col-span-12 lg:col-span-6">
            {/* Tabs */}
            <div className="mb-4">
              <GlassCard className="p-1 inline-flex" hover={false}>
                <button 
                  onClick={() => setActiveTab('balance')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === 'balance' 
                      ? 'bg-white text-gray-900 shadow-md' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ENTITY BALANCE CHANGES
                </button>
                <button 
                  onClick={() => setActiveTab('flows')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === 'flows' 
                      ? 'bg-white text-gray-900 shadow-md' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  TOP FLOWS
                </button>
              </GlassCard>
            </div>
            
            {/* Filters */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 text-[10px] font-bold rounded-lg border border-blue-500 text-blue-600 bg-blue-50">
                  USD ≥ 100 000
                </button>
                <button className="px-2 py-1 text-[10px] font-bold rounded-lg border border-orange-400 text-orange-500 bg-orange-50">
                  SORT BY USD CHANGE %
                </button>
              </div>
              
              <div className="relative">
                <select 
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="appearance-none bg-gray-800 text-white px-3 py-1.5 pr-7 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <option value="1D">1D</option>
                  <option value="7D">7D</option>
                  <option value="30D">30D</option>
                  <option value="ALL">ALL</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            
            {/* Entity Table */}
            <GlassCard className="overflow-hidden mb-6">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100/50">
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase">
                      <Filter className="w-2.5 h-2.5 inline mr-1" /> ENTITY
                    </th>
                    <th className="text-right py-3 px-3 text-[10px] font-semibold text-gray-500 uppercase">VALUE</th>
                    <th className="text-right py-3 px-3 text-[10px] font-semibold text-gray-500 uppercase">CHANGE</th>
                    <th className="text-right py-3 px-3 text-[10px] font-semibold text-gray-500 uppercase">USD</th>
                    <th className="text-right py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase">CHANGE ▼</th>
                  </tr>
                </thead>
                <tbody>
                  {entityBalanceChanges.slice(0, 6).map((entity, i) => (
                    <tr key={i} className="border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                            {entity.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-xs">{entity.name}</div>
                            <div className="text-[10px] text-gray-500">{entity.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{entity.value}</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${
                        entity.valueChange.startsWith('+') ? 'text-emerald-500' : 
                        entity.valueChange.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                      }`}>{entity.valueChange}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{entity.usd}</td>
                      <td className={`py-2.5 px-4 text-right font-semibold ${
                        entity.usdChange.startsWith('+') ? 'text-emerald-500' : 
                        entity.usdChange.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                      }`}>{entity.usdChange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
            
            {/* Top Holders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  {token.symbol} TOP HOLDERS
                </h2>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <span>ADDRESSES</span>
                  <div className="w-8 h-4 rounded-full bg-gray-300 relative">
                    <span className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow" />
                  </div>
                  <span>GROUP BY ENTITY</span>
                </div>
              </div>
              
              <GlassCard className="overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                  <div className="text-[100px] font-black text-gray-900 tracking-tight">FLOW</div>
                </div>
                
                <table className="w-full text-xs relative z-10">
                  <thead>
                    <tr className="border-b border-gray-100/50">
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase">ADDRESS</th>
                      <th className="text-right py-3 px-3 text-[10px] font-semibold text-gray-500 uppercase">VALUE</th>
                      <th className="text-right py-3 px-3 text-[10px] font-semibold text-gray-500 uppercase">PCT</th>
                      <th className="text-right py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase">USD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topHolders.slice(0, 5).map((holder, i) => (
                      <tr key={i} className="border-b border-gray-50/50 hover:bg-gray-50/50 cursor-pointer transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            {holder.isEntity ? (
                              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-[8px] font-bold">
                                {holder.icon}
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-[8px]">?</span>
                              </div>
                            )}
                            <span className={`font-medium ${holder.isEntity ? 'text-blue-600' : 'text-gray-600'} truncate max-w-[200px] text-xs`}>
                              {holder.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{holder.value}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-gray-900">{holder.pct}</td>
                        <td className="py-2.5 px-4 text-right font-semibold text-gray-900">{holder.usd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          </div>
          
          {/* Right Column - Chart */}
          <div className="col-span-12 lg:col-span-6">
            <PriceChart token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}
