import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Droplets, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { 
  getDashboardStats, 
  getTransactions, 
  getAlerts, 
  getPools 
} from '../lib/api';
import { 
  formatUSD, 
  formatNumber, 
  formatAddress, 
  formatTimeAgo,
  getChainBadgeClass,
  getSeverityClass,
  getAlertTypeLabel,
  cn
} from '../lib/utils';

const StatCard = ({ title, value, change, icon: Icon, loading }) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="stat-card" data-testid={`stat-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <CardContent className="p-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{title}</span>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold">{value}</span>
              {change !== undefined && (
                <span className={cn(
                  "text-sm flex items-center gap-0.5 mb-1",
                  isPositive ? "text-emerald-600" : "text-red-600"
                )}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(change).toFixed(1)}%
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, txRes, alertsRes, poolsRes] = await Promise.all([
          getDashboardStats(),
          getTransactions({ limit: 10 }),
          getAlerts({ limit: 5 }),
          getPools({ limit: 5 })
        ]);
        
        setStats(statsRes.data);
        setTransactions(txRes.data.transactions);
        setAlerts(alertsRes.data.alerts);
        setPools(poolsRes.data.pools);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of on-chain activity across all networks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/flow">View Flow Graph</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/alerts">View All Alerts</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Volume 24h"
          value={stats ? formatUSD(stats.total_volume_24h) : '-'}
          change={12.5}
          icon={Activity}
          loading={loading}
        />
        <StatCard
          title="Transactions 24h"
          value={stats ? formatNumber(stats.total_transactions_24h) : '-'}
          change={8.3}
          icon={ArrowUpRight}
          loading={loading}
        />
        <StatCard
          title="Active Entities"
          value={stats ? formatNumber(stats.active_entities) : '-'}
          change={-2.1}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Whale Movements"
          value={stats ? stats.whale_movements : '-'}
          change={15.7}
          icon={AlertTriangle}
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2" data-testid="recent-transactions">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Large Transfers</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/transactions" className="flex items-center gap-1">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>To</th>
                      <th>Value</th>
                      <th>Network</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 8).map((tx) => (
                      <tr key={tx.id} className="table-row-highlight">
                        <td>
                          <Link 
                            to={`/entity/${tx.from_address}`}
                            className="font-mono text-sm hover:text-primary"
                          >
                            {tx.from_label || formatAddress(tx.from_address)}
                          </Link>
                        </td>
                        <td>
                          <Link 
                            to={`/entity/${tx.to_address}`}
                            className="font-mono text-sm hover:text-primary"
                          >
                            {tx.to_label || formatAddress(tx.to_address)}
                          </Link>
                        </td>
                        <td className="font-medium">{formatUSD(tx.usd_value)}</td>
                        <td>
                          <Badge variant="outline" className={getChainBadgeClass(tx.network)}>
                            {tx.network}
                          </Badge>
                        </td>
                        <td className="text-muted-foreground text-sm">
                          {formatTimeAgo(tx.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card data-testid="alerts-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/alerts" className="flex items-center gap-1">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg border",
                      getSeverityClass(alert.severity)
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{alert.title}</p>
                        <p className="text-xs mt-0.5 truncate opacity-80">
                          {alert.entity_label || formatAddress(alert.entity_address)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {getAlertTypeLabel(alert.alert_type).split(' ')[0]}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span>{formatUSD(alert.usd_value)}</span>
                      <span className="opacity-70">{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Pools */}
      <Card data-testid="active-pools">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Top Liquidity Pools</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/pools" className="flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pools.slice(0, 6).map((pool) => (
                <Link 
                  key={pool.id} 
                  to={`/pool/${pool.address}`}
                  className="block p-4 rounded-lg border hover:border-primary/20 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{pool.name}</span>
                    <Badge variant="outline" className={getChainBadgeClass(pool.network)}>
                      {pool.network}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Liquidity</span>
                      <span className="font-medium">{formatUSD(pool.total_liquidity_usd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume 24h</span>
                      <span className="font-medium">{formatUSD(pool.volume_24h)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Change 24h</span>
                      <span className={cn(
                        "font-medium flex items-center gap-0.5",
                        pool.liquidity_change_24h >= 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {pool.liquidity_change_24h >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(pool.liquidity_change_24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
