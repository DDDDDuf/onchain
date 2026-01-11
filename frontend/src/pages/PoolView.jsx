import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Copy, 
  ExternalLink, 
  Droplets,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { getPool, getPriceHistory } from '../lib/api';
import { 
  formatUSD, 
  formatNumber,
  formatAddress,
  formatTimeAgo,
  getChainBadgeClass,
  copyToClipboard,
  cn
} from '../lib/utils';

// Generate mock liquidity history
const generateLiquidityHistory = (currentLiquidity) => {
  const data = [];
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const variation = 1 + (Math.random() - 0.5) * 0.1;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      liquidity: currentLiquidity * variation * (0.9 + i * 0.003)
    });
  }
  return data;
};

export default function PoolView() {
  const { address } = useParams();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liquidityHistory, setLiquidityHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPool(address);
        setPool(res.data);
        setLiquidityHistory(generateLiquidityHistory(res.data.total_liquidity_usd));
      } catch (error) {
        console.error('Error fetching pool:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const handleCopyAddress = () => {
    copyToClipboard(address);
    toast.success('Address copied to clipboard');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-40" />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Pool not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" data-testid="pool-view-page">
      {/* Header Card */}
      <Card data-testid="pool-header">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left side */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">{pool.name}</h1>
                  <p className="text-muted-foreground">{pool.protocol}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <code className="text-sm text-muted-foreground font-mono">
                  {formatAddress(address, 10)}
                </code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyAddress}>
                  <Copy className="w-3 h-3" />
                </Button>
                <a 
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <Badge variant="outline" className={getChainBadgeClass(pool.network)}>
                {pool.network}
              </Badge>
            </div>

            {/* Right side - Stats */}
            <div className="grid grid-cols-2 gap-4 text-right">
              <div>
                <span className="text-sm text-muted-foreground">Total Liquidity</span>
                <p className="text-2xl font-semibold">{formatUSD(pool.total_liquidity_usd)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Volume 24h</span>
                <p className="text-2xl font-semibold">{formatUSD(pool.volume_24h)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">APY</span>
                <p className="text-xl font-semibold text-emerald-600">{pool.apy.toFixed(2)}%</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Fees 24h</span>
                <p className="text-xl font-semibold">{formatUSD(pool.fees_24h)}</p>
              </div>
            </div>
          </div>

          {/* Reserves */}
          <div className="mt-6 pt-4 border-t grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{pool.token0_symbol} Reserve</span>
                <Badge variant="secondary">{pool.token0_symbol}</Badge>
              </div>
              <p className="text-2xl font-semibold mt-2">{formatNumber(pool.token0_reserve)}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{pool.token1_symbol} Reserve</span>
                <Badge variant="secondary">{pool.token1_symbol}</Badge>
              </div>
              <p className="text-2xl font-semibold mt-2">{formatNumber(pool.token1_reserve)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" data-testid="liquidity-chart">
          <CardHeader>
            <CardTitle>Liquidity History (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liquidityHistory}>
                  <defs>
                    <linearGradient id="liquidityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => formatUSD(value)}
                  />
                  <RechartsTooltip 
                    formatter={(value) => [formatUSD(value), 'Liquidity']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="liquidity"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#liquidityGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Changes */}
        <Card data-testid="pool-changes">
          <CardHeader>
            <CardTitle>Liquidity Changes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">24h Change</span>
                <span className={cn(
                  "flex items-center gap-1 font-semibold",
                  pool.liquidity_change_24h >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {pool.liquidity_change_24h >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(pool.liquidity_change_24h).toFixed(2)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    pool.liquidity_change_24h >= 0 ? "bg-emerald-500" : "bg-red-500"
                  )}
                  style={{ 
                    width: `${Math.min(Math.abs(pool.liquidity_change_24h) * 5, 100)}%` 
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">7d Change</span>
                <span className={cn(
                  "flex items-center gap-1 font-semibold",
                  pool.liquidity_change_7d >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {pool.liquidity_change_7d >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(pool.liquidity_change_7d).toFixed(2)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    pool.liquidity_change_7d >= 0 ? "bg-emerald-500" : "bg-red-500"
                  )}
                  style={{ 
                    width: `${Math.min(Math.abs(pool.liquidity_change_7d) * 2, 100)}%` 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="holders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="holders" data-testid="tab-holders">Top LP Holders</TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">Recent Events</TabsTrigger>
        </TabsList>

        <TabsContent value="holders">
          <Card data-testid="lp-holders-list">
            <CardHeader>
              <CardTitle>Top Liquidity Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Address</th>
                      <th className="text-right">Share</th>
                      <th className="text-right">Liquidity</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pool.top_lp_holders.map((holder, index) => (
                      <tr key={index} className="table-row-highlight">
                        <td className="font-medium">{index + 1}</td>
                        <td>
                          <Link 
                            to={`/entity/${holder.address}`}
                            className="font-mono text-sm hover:text-primary"
                          >
                            {holder.label || formatAddress(holder.address)}
                          </Link>
                        </td>
                        <td className="text-right font-medium">{holder.share_percentage.toFixed(2)}%</td>
                        <td className="text-right">{formatUSD(holder.liquidity_usd)}</td>
                        <td>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link to={`/entity/${holder.address}`}>
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card data-testid="pool-events-list">
            <CardHeader>
              <CardTitle>Recent Liquidity Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pool.recent_events.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        event.event_type === 'add_liquidity' ? "bg-emerald-100" :
                        event.event_type === 'remove_liquidity' ? "bg-red-100" : "bg-blue-100"
                      )}>
                        {event.event_type === 'add_liquidity' ? (
                          <Plus className="w-5 h-5 text-emerald-600" />
                        ) : event.event_type === 'remove_liquidity' ? (
                          <Minus className="w-5 h-5 text-red-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {event.event_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.label || formatAddress(event.address)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatUSD(event.amount_usd)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimeAgo(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
