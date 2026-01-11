import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitBranch, 
  Users, 
  ArrowLeftRight, 
  Droplets, 
  Bell,
  Search,
  Wallet,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Flow Graph', href: '/flow', icon: GitBranch },
  { name: 'Entities', href: '/entities', icon: Users },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Pools', href: '/pools', icon: Droplets },
  { name: 'Alerts', href: '/alerts', icon: Bell },
];

const networks = [
  { id: 'all', name: 'All Networks', color: '#64748b' },
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA' },
  { id: 'bsc', name: 'BNB Chain', color: '#F3BA2F' },
  { id: 'polygon', name: 'Polygon', color: '#8247E5' },
  { id: 'arbitrum', name: 'Arbitrum', color: '#2D374B' },
];

export const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [walletConnected, setWalletConnected] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-header h-16" data-testid="header">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-md"
              data-testid="mobile-menu-btn"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <Link to="/" className="flex items-center gap-2" data-testid="logo">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg hidden sm:block">LiquiFlow</span>
            </Link>
          </div>

          {/* Center - Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search address, transaction, entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50 border-0 focus:bg-white"
                data-testid="search-input"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Network Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 hidden sm:flex" data-testid="network-selector">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: networks.find(n => n.id === selectedNetwork)?.color }}
                  />
                  <span className="hidden md:inline">
                    {networks.find(n => n.id === selectedNetwork)?.name}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {networks.map((network) => (
                  <DropdownMenuItem
                    key={network.id}
                    onClick={() => setSelectedNetwork(network.id)}
                    className="gap-2"
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: network.color }}
                    />
                    {network.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Connect Wallet */}
            <Button
              onClick={handleConnectWallet}
              className={cn(
                "gap-2",
                walletConnected && "bg-emerald-600 hover:bg-emerald-700"
              )}
              data-testid="connect-wallet-btn"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">
                {walletConnected ? '0x7a25...8D7d' : 'Connect'}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-border transform transition-transform duration-200 lg:translate-x-0 pt-16 lg:pt-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
          data-testid="sidebar"
        >
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "sidebar-link",
                    isActive && "sidebar-link-active"
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats in Sidebar */}
          <div className="p-4 border-t border-border mt-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick Stats
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ETH Price</span>
                <span className="font-medium">$3,245.67</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas</span>
                <span className="font-medium">24 gwei</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Alerts</span>
                <span className="font-medium text-amber-600">12</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
