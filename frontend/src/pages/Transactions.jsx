import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight
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
import { getTransactions } from '../lib/api';
import { 
  formatUSD, 
  formatAddress,
  formatTimeAgo,
  getChainBadgeClass,
  getTxTypeLabel,
  cn
} from '../lib/utils';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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
        if (selectedType !== 'all') params.tx_type = selectedType;

        const res = await getTransactions(params);
        setTransactions(res.data.transactions);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedNetwork, selectedType, page]);

  return (
    <div className="p-6 space-y-6" data-testid="transactions-page">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          Browse all on-chain transactions across networks
        </p>
      </div>

      {/* Filters */}
      <Card data-testid="transaction-filters">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2 flex-1">
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
                <SelectTrigger className="w-36" data-testid="type-filter">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                  <SelectItem value="mint">Mint</SelectItem>
                  <SelectItem value="burn">Burn</SelectItem>
                  <SelectItem value="contract_interaction">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card data-testid="transactions-table">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Hash</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Value</th>
                    <th>Token</th>
                    <th>Network</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="table-row-highlight">
                      <td>
                        <Link 
                          to={`/tx/${tx.hash}`}
                          className="font-mono text-sm text-primary hover:underline"
                        >
                          {formatAddress(tx.hash, 8)}
                        </Link>
                      </td>
                      <td>
                        <Badge variant="secondary" className="capitalize">
                          {getTxTypeLabel(tx.tx_type)}
                        </Badge>
                      </td>
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
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{tx.token_amount.toFixed(4)}</span>
                          <span className="text-muted-foreground text-sm">{tx.token_symbol}</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant="outline" className={getChainBadgeClass(tx.network)}>
                          {tx.network}
                        </Badge>
                      </td>
                      <td className="text-muted-foreground text-sm whitespace-nowrap">
                        {formatTimeAgo(tx.timestamp)}
                      </td>
                      <td>
                        <Badge 
                          variant={tx.status === 'success' ? 'default' : 'destructive'}
                          className={tx.status === 'success' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                        >
                          {tx.status}
                        </Badge>
                      </td>
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
          )}
        </CardContent>
      </Card>

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
