import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronDown,
  ChevronLeft,
  Filter,
  ArrowUpRight,
  Wallet,
  Menu,
  ExternalLink
} from 'lucide-react';

// ============ MOCK DATA ============

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
      
      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Filters */}
      <Filters timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
      
      {/* Content based on active tab */}
      {activeTab === 'balance' ? (
        <EntityBalanceTable />
      ) : (
        <TopFlowsTable />
      )}
    </div>
  );
}
