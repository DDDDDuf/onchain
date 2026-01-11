import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Users,
  ArrowLeftRight,
  Droplets,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { globalSearch } from '../lib/api';
import { 
  formatAddress,
  getChainBadgeClass,
  getEntityTypeColor
} from '../lib/utils';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ entities: [], transactions: [], pools: [] });
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      setLoading(true);
      globalSearch(query, 20)
        .then(res => setResults(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const totalResults = results.entities.length + results.transactions.length + results.pools.length;

  return (
    <div className="p-6 space-y-6" data-testid="search-results-page">
      {/* Search Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Search Results</h1>
        <p className="text-muted-foreground mt-1">
          {loading ? 'Searching...' : `${totalResults} results for "${query}"`}
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search address, transaction, entity..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-12 h-12 text-lg"
            data-testid="search-input"
          />
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : totalResults === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-muted-foreground mt-1">
              Try searching with a different query
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="entities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="entities" className="gap-2" data-testid="tab-entities">
              <Users className="w-4 h-4" />
              Entities ({results.entities.length})
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2" data-testid="tab-transactions">
              <ArrowLeftRight className="w-4 h-4" />
              Transactions ({results.transactions.length})
            </TabsTrigger>
            <TabsTrigger value="pools" className="gap-2" data-testid="tab-pools">
              <Droplets className="w-4 h-4" />
              Pools ({results.pools.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entities">
            <Card data-testid="entities-results">
              <CardHeader>
                <CardTitle>Entities</CardTitle>
              </CardHeader>
              <CardContent>
                {results.entities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No entities found</p>
                ) : (
                  <div className="space-y-3">
                    {results.entities.map((entity, i) => (
                      <Link
                        key={i}
                        to={`/entity/${entity.address}`}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/20 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${getEntityTypeColor(entity.entity_type)}20` }}
                          >
                            <span className="text-sm font-medium">
                              {(entity.label || entity.address).slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {entity.label || formatAddress(entity.address)}
                            </p>
                            <p className="text-sm text-muted-foreground font-mono">
                              {formatAddress(entity.address)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {entity.entity_type}
                          </Badge>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card data-testid="transactions-results">
              <CardHeader>
                <CardTitle>Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {results.transactions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No transactions found</p>
                ) : (
                  <div className="space-y-3">
                    {results.transactions.map((tx, i) => (
                      <Link
                        key={i}
                        to={`/tx/${tx.hash}`}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/20 hover:bg-secondary/30 transition-colors"
                      >
                        <div>
                          <p className="font-mono text-sm">{formatAddress(tx.hash, 12)}</p>
                          <p className="text-sm text-muted-foreground">
                            {tx.from_label || formatAddress(tx.from_address)} → {tx.to_label || formatAddress(tx.to_address)}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pools">
            <Card data-testid="pools-results">
              <CardHeader>
                <CardTitle>Pools</CardTitle>
              </CardHeader>
              <CardContent>
                {results.pools.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No pools found</p>
                ) : (
                  <div className="space-y-3">
                    {results.pools.map((pool, i) => (
                      <Link
                        key={i}
                        to={`/pool/${pool.address}`}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/20 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{pool.name}</p>
                            <p className="text-sm text-muted-foreground">{pool.protocol}</p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
