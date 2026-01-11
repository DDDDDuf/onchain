import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell,
  AlertTriangle,
  TrendingUp,
  Building2,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter
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
import { getAlerts } from '../lib/api';
import { 
  formatUSD, 
  formatAddress,
  formatTimeAgo,
  getChainBadgeClass,
  getSeverityClass,
  getAlertTypeLabel,
  cn
} from '../lib/utils';

const AlertTypeIcon = ({ type }) => {
  const icons = {
    whale_movement: TrendingUp,
    liquidity_risk: AlertTriangle,
    exchange_inflow: Building2,
    suspicious_activity: ShieldAlert,
  };
  const Icon = icons[type] || Bell;
  return <Icon className="w-5 h-5" />;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
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
        if (selectedType !== 'all') params.alert_type = selectedType;
        if (selectedSeverity !== 'all') params.severity = selectedSeverity;

        const res = await getAlerts(params);
        setAlerts(res.data.alerts);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedNetwork, selectedType, selectedSeverity, page]);

  return (
    <div className="p-6 space-y-6" data-testid="alerts-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Alerts & Events</h1>
          <p className="text-muted-foreground mt-1">
            Monitor significant on-chain activity and warnings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length, color: 'text-red-600 bg-red-50' },
          { label: 'Important', count: alerts.filter(a => a.severity === 'important').length, color: 'text-amber-600 bg-amber-50' },
          { label: 'Normal', count: alerts.filter(a => a.severity === 'normal').length, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total', count: total, color: 'text-slate-600 bg-slate-50' },
        ].map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="p-4">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <p className={cn("text-2xl font-semibold mt-1", stat.color.split(' ')[0])}>
                {stat.count}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card data-testid="alert-filters">
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

            <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setPage(0); }}>
              <SelectTrigger className="w-44" data-testid="type-filter">
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="whale_movement">Whale Movement</SelectItem>
                <SelectItem value="liquidity_risk">Liquidity Risk</SelectItem>
                <SelectItem value="exchange_inflow">Exchange Inflow</SelectItem>
                <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={(v) => { setSelectedSeverity(v); setPage(0); }}>
              <SelectTrigger className="w-32" data-testid="severity-filter">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No alerts found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4" data-testid="alerts-list">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={cn(
                "card-hover border-l-4",
                alert.severity === 'critical' ? "border-l-red-500" :
                alert.severity === 'important' ? "border-l-amber-500" : "border-l-blue-500"
              )}
              data-testid={`alert-${alert.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    getSeverityClass(alert.severity)
                  )}>
                    <AlertTypeIcon type={alert.alert_type} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {alert.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className={getChainBadgeClass(alert.network)}>
                          {alert.network}
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={cn(
                            alert.severity === 'critical' ? "bg-red-100 text-red-700" :
                            alert.severity === 'important' ? "bg-amber-100 text-amber-700" : 
                            "bg-blue-100 text-blue-700"
                          )}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                      {alert.entity_address && (
                        <Link 
                          to={`/entity/${alert.entity_address}`}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {alert.entity_label || formatAddress(alert.entity_address)}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      {alert.usd_value && (
                        <span className="font-medium">{formatUSD(alert.usd_value)}</span>
                      )}
                      <span className="text-muted-foreground">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>

                    {/* Tags */}
                    {alert.tags && alert.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {alert.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {alert.transaction_hash && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/tx/${alert.transaction_hash}`}>
                          View TX
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
