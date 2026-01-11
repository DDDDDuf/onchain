import { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown,
  Home,
  LayoutDashboard,
  Plus,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Star,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  BarChart3,
  PieChart,
  Grid3X3,
  Bookmark,
  Globe,
  Building2,
  Coins
} from 'lucide-react';

// Mock data for popular dashboards
const popularDashboards = [
  {
    id: 1,
    title: "ETF Flows Monitor",
    description: "Track Bitcoin ETF inflows and outflows across all major providers",
    author: "Arkham",
    views: "12.4K",
    stars: 892,
    tags: ["ETF", "Bitcoin"]
  },
  {
    id: 2,
    title: "Exchange Reserves",
    description: "Monitor exchange reserves across major CEXs in real-time",
    author: "Arkham",
    views: "8.2K",
    stars: 654,
    tags: ["Exchange", "Reserves"]
  },
  {
    id: 3,
    title: "Whale Tracker",
    description: "Track largest wallet movements and whale activity",
    author: "CryptoAnalyst",
    views: "15.1K",
    stars: 1243,
    tags: ["Whale", "Tracking"]
  },
  {
    id: 4,
    title: "DeFi TVL Monitor",
    description: "Total value locked across major DeFi protocols",
    author: "DeFiPro",
    views: "6.8K",
    stars: 421,
    tags: ["DeFi", "TVL"]
  },
  {
    id: 5,
    title: "Stablecoin Flows",
    description: "Track USDT, USDC, and DAI movements between chains",
    author: "Arkham",
    views: "9.3K",
    stars: 567,
    tags: ["Stablecoin", "Flows"]
  },
  {
    id: 6,
    title: "NFT Market Activity",
    description: "Monitor top NFT collections and whale purchases",
    author: "NFTWatcher",
    views: "4.5K",
    stars: 234,
    tags: ["NFT", "Market"]
  }
];

// Mock data for recent activity
const recentActivity = [
  {
    id: 1,
    type: "transfer",
    from: "Binance",
    to: "Unknown Wallet",
    amount: "$45.2M",
    token: "ETH",
    time: "2m ago",
    direction: "out"
  },
  {
    id: 2,
    type: "transfer",
    from: "Coinbase",
    to: "BlackRock",
    amount: "$23.8M",
    token: "BTC",
    time: "5m ago",
    direction: "out"
  },
  {
    id: 3,
    type: "transfer",
    from: "Jump Trading",
    to: "Binance",
    amount: "$12.4M",
    token: "USDT",
    time: "8m ago",
    direction: "in"
  },
  {
    id: 4,
    type: "transfer",
    from: "Unknown Wallet",
    to: "Kraken",
    amount: "$8.9M",
    token: "ETH",
    time: "12m ago",
    direction: "in"
  },
  {
    id: 5,
    type: "transfer",
    from: "Wintermute",
    to: "Uniswap V3",
    amount: "$5.6M",
    token: "USDC",
    time: "15m ago",
    direction: "out"
  }
];

// Mock data for top tokens
const topTokens = [
  { symbol: "BTC", name: "Bitcoin", price: "$67,234.56", change: 2.34, volume: "$42.1B" },
  { symbol: "ETH", name: "Ethereum", price: "$3,456.78", change: -1.23, volume: "$18.5B" },
  { symbol: "SOL", name: "Solana", price: "$178.92", change: 5.67, volume: "$4.2B" },
  { symbol: "BNB", name: "BNB", price: "$598.34", change: 0.89, volume: "$1.8B" },
  { symbol: "XRP", name: "XRP", price: "$0.5234", change: -2.45, volume: "$1.2B" }
];

// Mock data for top entities
const topEntities = [
  { name: "Binance", type: "Exchange", balance: "$89.2B", change: 1.2 },
  { name: "Coinbase", type: "Exchange", balance: "$45.6B", change: -0.8 },
  { name: "BlackRock", type: "Fund", balance: "$23.4B", change: 3.4 },
  { name: "Grayscale", type: "Fund", balance: "$18.9B", change: -1.2 },
  { name: "Jump Trading", type: "Market Maker", balance: "$12.3B", change: 2.1 }
];

// Sidebar component
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('home');
  
  return (
    <div className="arkham-sidebar arkham-scrollbar">
      {/* Logo area */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">INTEL</span>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="py-2">
        <div 
          className={`arkham-sidebar-item ${activeItem === 'home' ? 'arkham-sidebar-item-active' : ''}`}
          onClick={() => setActiveItem('home')}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </div>
        <div 
          className={`arkham-sidebar-item ${activeItem === 'dashboards' ? 'arkham-sidebar-item-active' : ''}`}
          onClick={() => setActiveItem('dashboards')}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboards</span>
        </div>
      </div>
      
      {/* My Dashboards */}
      <div className="py-2 border-t border-gray-100">
        <div className="arkham-sidebar-section">My Dashboards</div>
        <div className="arkham-sidebar-item">
          <Plus className="w-4 h-4" />
          <span>Create Dashboard</span>
        </div>
      </div>
      
      {/* Explore */}
      <div className="py-2 border-t border-gray-100">
        <div className="arkham-sidebar-section">Explore</div>
        <div className="arkham-sidebar-item">
          <Users className="w-4 h-4" />
          <span>Entities</span>
        </div>
        <div className="arkham-sidebar-item">
          <Coins className="w-4 h-4" />
          <span>Tokens</span>
        </div>
        <div className="arkham-sidebar-item">
          <Building2 className="w-4 h-4" />
          <span>Exchanges</span>
        </div>
        <div className="arkham-sidebar-item">
          <Activity className="w-4 h-4" />
          <span>Transactions</span>
        </div>
      </div>
      
      {/* Tools */}
      <div className="py-2 border-t border-gray-100">
        <div className="arkham-sidebar-section">Tools</div>
        <div className="arkham-sidebar-item">
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
        </div>
        <div className="arkham-sidebar-item">
          <Wallet className="w-4 h-4" />
          <span>Portfolio</span>
        </div>
        <div className="arkham-sidebar-item">
          <Bookmark className="w-4 h-4" />
          <span>Watchlist</span>
        </div>
      </div>
    </div>
  );
};

// Header component
const Header = () => {
  return (
    <header className="arkham-header">
      <div className="flex-1 flex items-center gap-4">
        {/* Search */}
        <div className="arkham-search w-96">
          <Search className="w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search addresses, entities, tokens, labels..."
            className="w-full"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-400">
            ⌘K
          </kbd>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Network selector */}
        <button className="arkham-btn arkham-btn-ghost gap-2">
          <Globe className="w-4 h-4" />
          <span>All Chains</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        
        {/* Notifications */}
        <button className="arkham-btn arkham-btn-ghost p-2 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Connect */}
        <button className="arkham-btn arkham-btn-primary">
          Connect
        </button>
      </div>
    </header>
  );
};

// Dashboard card component
const DashboardCard = ({ dashboard }) => {
  return (
    <div className="arkham-dashboard-card group" data-testid={`dashboard-${dashboard.id}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Grid3X3 className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <h3 className="arkham-dashboard-card-title">{dashboard.title}</h3>
            <p className="text-xs text-gray-400">by {dashboard.author}</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
        </button>
      </div>
      
      <p className="arkham-dashboard-card-desc">{dashboard.description}</p>
      
      <div className="flex items-center gap-2 mt-3">
        {dashboard.tags.map(tag => (
          <span key={tag} className="arkham-tag arkham-tag-gray">{tag}</span>
        ))}
      </div>
      
      <div className="arkham-dashboard-card-meta">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {dashboard.views}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          {dashboard.stars}
        </span>
      </div>
    </div>
  );
};

// Recent Activity component
const RecentActivityCard = () => {
  return (
    <div className="arkham-card" data-testid="recent-activity">
      <div className="arkham-card-header">
        <h3 className="arkham-card-title flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-400" />
          Recent Activity
        </h3>
        <button className="arkham-btn arkham-btn-ghost text-xs">View All</button>
      </div>
      <div className="divide-y divide-gray-50">
        {recentActivity.map(activity => (
          <div key={activity.id} className="arkham-flow-item">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.direction === 'out' ? 'bg-red-50' : 'bg-emerald-50'
              }`}>
                {activity.direction === 'out' ? (
                  <ArrowUpRight className="w-4 h-4 text-red-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {activity.from} → {activity.to}
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="arkham-flow-amount">{activity.amount}</div>
              <div className="text-xs text-gray-400">{activity.token}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Top Tokens component
const TopTokensCard = () => {
  return (
    <div className="arkham-card" data-testid="top-tokens">
      <div className="arkham-card-header">
        <h3 className="arkham-card-title flex items-center gap-2">
          <Coins className="w-4 h-4 text-gray-400" />
          Top Tokens
        </h3>
        <button className="arkham-btn arkham-btn-ghost text-xs">View All</button>
      </div>
      <table className="arkham-table">
        <thead>
          <tr>
            <th>Token</th>
            <th className="text-right">Price</th>
            <th className="text-right">24h</th>
            <th className="text-right">Volume</th>
          </tr>
        </thead>
        <tbody>
          {topTokens.map(token => (
            <tr key={token.symbol} className="cursor-pointer">
              <td>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">
                    {token.symbol.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{token.symbol}</div>
                    <div className="text-xs text-gray-400">{token.name}</div>
                  </div>
                </div>
              </td>
              <td className="text-right font-medium">{token.price}</td>
              <td className={`text-right font-medium ${token.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {token.change >= 0 ? '+' : ''}{token.change}%
              </td>
              <td className="text-right text-gray-500">{token.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Top Entities component
const TopEntitiesCard = () => {
  return (
    <div className="arkham-card" data-testid="top-entities">
      <div className="arkham-card-header">
        <h3 className="arkham-card-title flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          Top Entities
        </h3>
        <button className="arkham-btn arkham-btn-ghost text-xs">View All</button>
      </div>
      <div className="divide-y divide-gray-50">
        {topEntities.map((entity, index) => (
          <div key={entity.name} className="arkham-flow-item">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-xs font-bold text-white">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-900">{entity.name}</div>
                <div className="text-xs text-gray-400">{entity.type}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">{entity.balance}</div>
              <div className={`text-xs ${entity.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {entity.change >= 0 ? '+' : ''}{entity.change}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats overview component
const StatsOverview = () => {
  const stats = [
    { label: "Total Market Cap", value: "$2.54T", change: 1.23 },
    { label: "24h Volume", value: "$89.2B", change: -2.45 },
    { label: "BTC Dominance", value: "52.4%", change: 0.34 },
    { label: "Active Addresses", value: "1.2M", change: 5.67 }
  ];
  
  return (
    <div className="grid grid-cols-4 gap-4 mb-6" data-testid="stats-overview">
      {stats.map(stat => (
        <div key={stat.label} className="arkham-card p-4">
          <div className="arkham-stat">
            <span className="arkham-stat-label">{stat.label}</span>
            <div className="flex items-end gap-2">
              <span className="arkham-stat-value">{stat.value}</span>
              <span className={`arkham-stat-change ${stat.change >= 0 ? 'arkham-stat-change-positive' : 'arkham-stat-change-negative'}`}>
                {stat.change >= 0 ? '+' : ''}{stat.change}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Home Page
export default function ArkhamHome() {
  return (
    <div className="min-h-screen bg-gray-50/30" data-testid="arkham-home">
      <Header />
      <Sidebar />
      
      <main className="arkham-main">
        <div className="p-6">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Home</h1>
            <p className="text-gray-500">Discover popular dashboards and market insights</p>
          </div>
          
          {/* Stats Overview */}
          <StatsOverview />
          
          {/* Main content grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left column - Popular Dashboards */}
            <div className="col-span-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Popular Dashboards</h2>
                <button className="arkham-btn arkham-btn-ghost text-sm">View All</button>
              </div>
              
              <div className="grid grid-cols-2 gap-4" data-testid="popular-dashboards">
                {popularDashboards.map(dashboard => (
                  <DashboardCard key={dashboard.id} dashboard={dashboard} />
                ))}
              </div>
              
              {/* Arkham Team Dashboards */}
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Arkham Team</h2>
                  <button className="arkham-btn arkham-btn-ghost text-sm">View All</button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {['Exchange Monitor', 'ETF Tracker', 'Whale Alerts'].map(title => (
                    <div key={title} className="arkham-dashboard-card">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                          <Zap className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-semibold text-sm">{title}</span>
                      </div>
                      <p className="text-xs text-gray-500">Official dashboard by Arkham team</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right column - Activity & Stats */}
            <div className="col-span-4 space-y-6">
              <RecentActivityCard />
              <TopTokensCard />
              <TopEntitiesCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
