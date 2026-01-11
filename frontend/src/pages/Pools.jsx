import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Droplets,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { getPools } from '../lib/api';
import { 
  formatUSD, 
  formatNumber,
  getChainBadgeClass,
  cn
} from '../lib/utils';

export default function Pools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [selectedProtocol, setSelectedProtocol] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          limit,
          offset: page * limit,
        };
        if (selectedNetwork !== 'all') params.network = selectedNetwork;
        if (selectedProtocol !== 'all') params.protocol = selectedProtocol;

        const res = await getPools(params);
        setPools(res.data.pools);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Error fetching pools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedNetwork, selectedProtocol, page]);

  return (
    <div className="p-6 space-y-6" data-testid="pools-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Liquidity Pools</h1>
        <p className="text-muted-foreground mt-1">
          Monitor DEX liquidity pools across networks
        </p>
      </div>

      {/* Filters */}
      <Card data-testid="pool-filters">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select value={selectedNetwork} onValueChange={(v) => { setSelectedNetwork(v); setPage(0); }}>
              <SelectTrigger className="w-36" data-testid="network-filter">
                <SelectValue placeholder="Network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Networks</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="bsc">BNB Chain</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedProtocol} onValueChange={(v) => { setSelectedProtocol(v); setPage(0); }}>
              <SelectTrigger className="w-40" data-testid="protocol-filter">
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Protocols</SelectItem>
                <SelectItem value="uniswap v3">Uniswap V3</SelectItem>
                <SelectItem value="uniswap v2">Uniswap V2</SelectItem>
                <SelectItem value="sushiswap">SushiSwap</SelectItem>
                <SelectItem value="curve">Curve</SelectItem>
                <SelectItem value="balancer">Balancer</SelectItem>
                <SelectItem value="pancakeswap">PancakeSwap</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pools Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : pools.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No pools found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="pools-grid">
          {pools.map((pool) => (
            <Link
              key={pool.id}
              to={`/pool/${pool.address}`}
              className="block"
            >
              <Card className="h-full card-hover" data-testid={`pool-card-${pool.address.slice(0, 8)}`}>
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{pool.name}</p>
                        <p className="text-xs text-muted-foreground">{pool.protocol}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getChainBadgeClass(pool.network)}>
                      {pool.network}
                    </Badge>
                  </div>

                  {/* Liquidity */}
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">Total Liquidity</span>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-semibold">
                        {formatUSD(pool.total_liquidity_usd)}
                      </span>
                      <span className={cn(
                        "text-sm flex items-center gap-0.5 mb-1",
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

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-secondary/50 rounded">
                      <span className="text-muted-foreground text-xs">Volume 24h</span>
                      <p className="font-medium">{formatUSD(pool.volume_24h)}</p>
                    </div>
                    <div className="p-2 bg-secondary/50 rounded">
                      <span className="text-muted-foreground text-xs">Fees 24h</span>
                      <p className="font-medium">{formatUSD(pool.fees_24h)}</p>
                    </div>
                    <div className="p-2 bg-secondary/50 rounded">
                      <span className="text-muted-foreground text-xs">APY</span>
                      <p className="font-medium text-emerald-600">{pool.apy.toFixed(2)}%</p>
                    </div>
                    <div className="p-2 bg-secondary/50 rounded">
                      <span className="text-muted-foreground text-xs">7d Change</span>
                      <p className={cn(
                        "font-medium",
                        pool.liquidity_change_7d >= 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {pool.liquidity_change_7d >= 0 ? '+' : ''}{pool.liquidity_change_7d.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Reserves */}
                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">{pool.token0_symbol}</span>
                        <p className="font-medium">{formatNumber(pool.token0_reserve)}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground">{pool.token1_symbol}</span>
                        <p className="font-medium">{formatNumber(pool.token1_reserve)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {page * limit + 1} - {Math.min((page + 1) * limit, total)} of {total}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            data-testid="prev-page-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * limit >= total}
            data-testid="next-page-btn"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
