import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Copy, 
  ExternalLink, 
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { getTransaction } from '../lib/api';
import { 
  formatUSD, 
  formatAddress,
  formatTimeAgo,
  getChainBadgeClass,
  getTxTypeLabel,
  copyToClipboard,
  cn
} from '../lib/utils';

export default function TransactionView() {
  const { hash } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getTransaction(hash);
        setTransaction(res.data);
      } catch (error) {
        console.error('Error fetching transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hash]);

  const handleCopyHash = () => {
    copyToClipboard(hash);
    toast.success('Hash copied to clipboard');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Transaction not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatusIcon = transaction.status === 'success' ? CheckCircle2 : 
                     transaction.status === 'failed' ? XCircle : Clock;
  const statusColor = transaction.status === 'success' ? 'text-emerald-600' : 
                      transaction.status === 'failed' ? 'text-red-600' : 'text-amber-600';

  return (
    <div className="p-6 space-y-6" data-testid="transaction-view-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Transaction Details</h1>
          <div className="flex items-center gap-2 mt-2">
            <code className="text-sm text-muted-foreground font-mono">
              {formatAddress(hash, 12)}
            </code>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyHash}>
              <Copy className="w-3 h-3" />
            </Button>
            <a 
              href={`https://etherscan.io/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getChainBadgeClass(transaction.network)}>
            {transaction.network}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {getTxTypeLabel(transaction.tx_type)}
          </Badge>
        </div>
      </div>

      {/* Status Card */}
      <Card data-testid="tx-status-card">
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <div className={cn("flex items-center gap-2 mt-1", statusColor)}>
                <StatusIcon className="w-5 h-5" />
                <span className="font-semibold capitalize">{transaction.status}</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Block</span>
              <p className="font-semibold mt-1 font-mono">{transaction.block_number.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Timestamp</span>
              <p className="font-semibold mt-1">{formatTimeAgo(transaction.timestamp)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(transaction.timestamp).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Value</span>
              <p className="text-2xl font-semibold mt-1">{formatUSD(transaction.usd_value)}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.token_amount.toFixed(6)} {transaction.token_symbol}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Flow */}
      <Card data-testid="tx-flow-card">
        <CardHeader>
          <CardTitle>Transfer Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6">
            {/* From */}
            <div className="flex-1 p-4 rounded-lg border bg-secondary/30 text-center">
              <span className="text-sm text-muted-foreground block mb-1">From</span>
              <Link 
                to={`/entity/${transaction.from_address}`}
                className="font-semibold hover:text-primary block"
              >
                {transaction.from_label || formatAddress(transaction.from_address, 8)}
              </Link>
              <code className="text-xs text-muted-foreground font-mono">
                {formatAddress(transaction.from_address)}
              </code>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shrink-0">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* To */}
            <div className="flex-1 p-4 rounded-lg border bg-secondary/30 text-center">
              <span className="text-sm text-muted-foreground block mb-1">To</span>
              <Link 
                to={`/entity/${transaction.to_address}`}
                className="font-semibold hover:text-primary block"
              >
                {transaction.to_label || formatAddress(transaction.to_address, 8)}
              </Link>
              <code className="text-xs text-muted-foreground font-mono">
                {formatAddress(transaction.to_address)}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Internal Transactions */}
      {transaction.internal_txs && transaction.internal_txs.length > 0 && (
        <Card data-testid="internal-txs-card">
          <CardHeader>
            <CardTitle>Internal Transactions ({transaction.internal_txs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transaction.internal_txs.map((itx, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-secondary/20"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                    {itx.step}
                  </div>
                  <div className="flex-1 grid sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">From</span>
                      <p className="text-sm font-mono">
                        {itx.from_label || formatAddress(itx.from_address)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">To</span>
                      <p className="text-sm font-mono">
                        {itx.to_label || formatAddress(itx.to_address)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Value</span>
                      <p className="text-sm font-medium">
                        {itx.token_amount.toFixed(4)} {itx.token_symbol}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {itx.action}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gas Info */}
      <Card data-testid="gas-info-card">
        <CardHeader>
          <CardTitle>Gas Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <span className="text-sm text-muted-foreground">Gas Used</span>
              <p className="font-semibold mt-1">{transaction.gas_used.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Gas Price</span>
              <p className="font-semibold mt-1">{transaction.gas_price} gwei</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Transaction Fee</span>
              <p className="font-semibold mt-1">
                {((transaction.gas_used * transaction.gas_price) / 1e9).toFixed(6)} ETH
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {transaction.tags && transaction.tags.length > 0 && (
        <Card data-testid="tx-tags-card">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {transaction.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
