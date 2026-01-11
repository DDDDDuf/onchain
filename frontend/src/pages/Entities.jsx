import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Building2, 
  Wallet, 
  FileCode, 
  Droplets,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { getEntities } from '../lib/api';
import { 
  formatUSD, 
  formatAddress,
  formatTimeAgo,
  getChainBadgeClass,
  getEntityTypeColor,
  cn
} from '../lib/utils';

const EntityTypeIcon = ({ type }) => {
  const icons = {
    exchange: Building2,
    wallet: Wallet,
    contract: FileCode,
    pool: Droplets,
    protocol: FileCode,
  };
  const Icon = icons[type] || Wallet;
  return <Icon className="w-4 h-4" />;
};

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          limit,
          offset: page * limit,
        };
        if (selectedNetwork !== 'all') params.network = selectedNetwork;
        if (selectedType !== 'all') params.entity_type = selectedType;
        if (searchQuery) params.search = searchQuery;

        const res = await getEntities(params);
        setEntities(res.data.entities);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Error fetching entities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedNetwork, selectedType, page, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
  };

  return (
    <div className="p-6 space-y-6" data-testid="entities-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Entities</h1>
        <p className="text-muted-foreground mt-1">
          Browse wallets, exchanges, contracts, and protocols
        </p>
      </div>

      {/* Filters */}
      <Card data-testid="entity-filters">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by address or label..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="entity-search-input"
                />
              </div>
            </form>

            <div className="flex gap-2">
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

              <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setPage(0); }}>
                <SelectTrigger className="w-32" data-testid="type-filter">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="pool">Pool</SelectItem>
                  <SelectItem value="protocol">Protocol</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entities Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : entities.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No entities found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="entities-grid">
          {entities.map((entity) => (
            <Link
              key={entity.id}
              to={`/entity/${entity.address}`}
              className="block"
            >
              <Card className="h-full card-hover" data-testid={`entity-card-${entity.address.slice(0, 8)}`}>
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: `${getEntityTypeColor(entity.entity_type)}20` }}
                      >
                        <EntityTypeIcon type={entity.entity_type} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {entity.label || formatAddress(entity.address)}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {formatAddress(entity.address)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={getChainBadgeClass(entity.network)}>
                      {entity.network}
                    </Badge>
                  </div>

                  {/* Balance */}
                  <div className="mb-3">
                    <span className="text-2xl font-semibold">
                      {formatUSD(entity.total_balance_usd)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-secondary/50 rounded">
                      <span className="text-muted-foreground text-xs">Inflow 24h</span>
                      <p className="font-medium text-emerald-600">
                        +{formatUSD(entity.inflow_24h)}
                      </p>
                    </div>
                    <div className="p-2 bg-secondary/50 rounded">
                      <span className="text-muted-foreground text-xs">Outflow 24h</span>
                      <p className="font-medium text-red-600">
                        -{formatUSD(entity.outflow_24h)}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                    <span className="capitalize">{entity.entity_type}</span>
                    <span>Last active: {formatTimeAgo(entity.last_active)}</span>
                  </div>

                  {/* Tags */}
                  {entity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entity.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
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
