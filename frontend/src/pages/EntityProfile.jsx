import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  AlertTriangle,
  GitBranch
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Progress } from '../components/ui/progress';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { getEntity, getTransactions } from '../lib/api';
import { 
  formatUSD, 
  formatAddress,
  formatTimeAgo,
  formatPercentage,
  getChainBadgeClass,
  getEntityTypeColor,
  copyToClipboard,
  cn
} from '../lib/utils';

const COLORS = ['#627EEA', '#F3BA2F', '#8247E5', '#2D374B', '#10b981', '#f59e0b'];

export default function EntityProfile() {
  const { address } = useParams();
  const [entity, setEntity] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [entityRes, txRes] = await Promise.all([
          getEntity(address),
          getTransactions({ address, limit: 20 })
        ]);
        setEntity(entityRes.data);
        setTransactions(txRes.data.transactions);
      } catch (error) {
        console.error('Error fetching entity:', error);
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

  if (!entity) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Entity not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pieData = entity.balances.map(b => ({
    name: b.symbol,
    value: b.usd_value
  }));

  return (
    <div className="p-6 space-y-6" data-testid="entity-profile-page">
      {/* Header Card */}
      <Card data-testid="entity-header">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Left side */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getEntityTypeColor(entity.entity_type)}20` }}
                >
                  <span className="text-2xl">
                    {entity.entity_type === 'exchange' ? '🏛️' : 
                     entity.entity_type === 'wallet' ? '👛' : 
                     entity.entity_type === 'contract' ? '📜' : 
                     entity.entity_type === 'pool' ? '💧' : '🔷'}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">
                    {entity.label || 'Unknown Entity'}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
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
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getChainBadgeClass(entity.network)}>
                  {entity.network}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {entity.entity_type}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {entity.confidence} confidence
                </Badge>
                {entity.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Right side - Balance */}
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Total Balance</span>
              <p className="text-4xl font-semibold">{formatUSD(entity.total_balance_usd)}</p>
              <div className="flex items-center justify-end gap-4 mt-2">
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">{formatUSD(entity.inflow_24h)} in</span>
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <ArrowDownRight className="w-4 h-4" />
                  <span className="text-sm">{formatUSD(entity.outflow_24h)} out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Score */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Risk Score</span>
              <span className={cn(
                "text-sm font-medium",
                entity.risk_score < 30 ? "text-emerald-600" :
                entity.risk_score < 70 ? "text-amber-600" : "text-red-600"
              )}>
                {entity.risk_score}/100
              </span>
            </div>
            <Progress 
              value={entity.risk_score} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Token Balances */}
        <Card className="lg:col-span-2" data-testid="token-balances">
          <CardHeader>
            <CardTitle>Token Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th className="text-right">Amount</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Value</th>
                    <th className="text-right">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {entity.balances.map((balance, i) => (
                    <tr key={i}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                            {balance.symbol.slice(0, 2)}
                          </div>
                          <span className="font-medium">{balance.symbol}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono">{balance.amount.toLocaleString()}</td>
                      <td className="text-right">${balance.price.toLocaleString()}</td>
                      <td className="text-right font-medium">{formatUSD(balance.usd_value)}</td>
                      <td className={cn(
                        "text-right",
                        balance.change_24h >= 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {formatPercentage(balance.change_24h)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Asset Distribution */}
        <Card data-testid="asset-distribution">
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => formatUSD(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
          <TabsTrigger value="counterparties" data-testid="tab-counterparties">Top Counterparties</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card data-testid="transactions-table">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/transactions?address=${address}`}>View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Value</th>
                      <th>Time</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="table-row-highlight">
                        <td>
                          <Badge variant="secondary" className="capitalize">
                            {tx.tx_type}
                          </Badge>
                        </td>
                        <td className="font-mono text-sm">
                          {tx.from_label || formatAddress(tx.from_address)}
                        </td>
                        <td className="font-mono text-sm">
                          {tx.to_label || formatAddress(tx.to_address)}
                        </td>
                        <td className="font-medium">{formatUSD(tx.usd_value)}</td>
                        <td className="text-muted-foreground">{formatTimeAgo(tx.timestamp)}</td>
                        <td>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <Link to={`/tx/${tx.hash}`}>
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

        <TabsContent value="counterparties">
          <Card data-testid="counterparties-list">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Top Counterparties</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/flow?entity=${address}`}>
                    <GitBranch className="w-4 h-4 mr-2" />
                    View in Flow Graph
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entity.top_counterparties.map((cp, i) => (
                  <Link
                    key={i}
                    to={`/entity/${cp.address}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/20 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${getEntityTypeColor(cp.entity_type)}20` }}
                      >
                        <span className="text-sm font-medium">
                          {(cp.label || cp.address).slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{cp.label || formatAddress(cp.address)}</p>
                        <p className="text-xs text-muted-foreground capitalize">{cp.entity_type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatUSD(cp.total_volume)}</p>
                      <p className="text-xs text-muted-foreground">{cp.tx_count} txs</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
