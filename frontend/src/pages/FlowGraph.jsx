import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter,
  RefreshCw,
  Info,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { Skeleton } from '../components/ui/skeleton';
import { getFlowGraph } from '../lib/api';
import { 
  formatUSD, 
  formatAddress,
  getEntityTypeColor,
  cn
} from '../lib/utils';

// Simple Flow Visualization Component using SVG
const FlowVisualization = ({ nodes, links, onNodeClick }) => {
  const width = 900;
  const height = 500;
  const nodeWidth = 20;
  const nodeHeight = 30;
  const padding = 60;

  // Position nodes in columns based on connections
  const positionedNodes = nodes.map((node, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
      ...node,
      x: padding + col * ((width - 2 * padding) / 2),
      y: padding + row * (nodeHeight + 40),
    };
  });

  // Create a map for quick node lookup
  const nodeMap = new Map(positionedNodes.map((n, i) => [i, n]));

  return (
    <svg width={width} height={height} className="bg-white">
      {/* Links */}
      <g>
        {links.map((link, index) => {
          const source = nodeMap.get(link.source);
          const target = nodeMap.get(link.target);
          if (!source || !target) return null;

          const sourceX = source.x + nodeWidth;
          const sourceY = source.y + nodeHeight / 2;
          const targetX = target.x;
          const targetY = target.y + nodeHeight / 2;
          
          const midX = (sourceX + targetX) / 2;
          const strokeWidth = Math.max(2, Math.min(10, link.value / 100000));
          const opacity = Math.min(0.6, 0.2 + link.value / 1000000);

          return (
            <g key={`link-${index}`}>
              <path
                d={`M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`}
                fill="none"
                stroke="#627EEA"
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                className="transition-all hover:stroke-opacity-80"
              />
              <title>{`${formatUSD(link.value)} (${link.tx_count} txs)`}</title>
            </g>
          );
        })}
      </g>

      {/* Nodes */}
      <g>
        {positionedNodes.map((node, index) => {
          const color = getEntityTypeColor(node.entity_type);
          return (
            <g 
              key={`node-${index}`} 
              className="cursor-pointer"
              onClick={() => onNodeClick?.(node)}
            >
              <rect
                x={node.x}
                y={node.y}
                width={nodeWidth}
                height={nodeHeight}
                fill={color}
                rx={4}
                className="transition-opacity hover:opacity-80"
              />
              <text
                x={node.x + nodeWidth + 8}
                y={node.y + nodeHeight / 2}
                fontSize="12"
                fontFamily="IBM Plex Sans"
                fontWeight="500"
                fill="#0f172a"
                dominantBaseline="middle"
              >
                {node.label?.length > 20 ? node.label.slice(0, 20) + '...' : node.label}
              </text>
              <text
                x={node.x + nodeWidth + 8}
                y={node.y + nodeHeight / 2 + 14}
                fontSize="10"
                fontFamily="Manrope"
                fill="#64748b"
                dominantBaseline="middle"
              >
                {formatUSD(node.total_volume)}
              </text>
              <title>{`${node.label}: ${formatUSD(node.total_volume)}`}</title>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default function FlowGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [nodeLimit, setNodeLimit] = useState([15]);
  const [selectedNode, setSelectedNode] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: nodeLimit[0] };
      if (selectedNetwork !== 'all') {
        params.network = selectedNetwork;
      }
      const res = await getFlowGraph(params);
      setGraphData(res.data);
    } catch (error) {
      console.error('Error fetching flow graph:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedNetwork, nodeLimit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  return (
    <div className="p-6 space-y-6" data-testid="flow-graph-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Flow Graph</h1>
          <p className="text-muted-foreground mt-1">
            Visualize liquidity movement between entities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card data-testid="flow-filters">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger className="w-40" data-testid="network-filter">
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

            <div className="flex items-center gap-3 min-w-[200px]">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Nodes:</span>
              <Slider
                value={nodeLimit}
                onValueChange={setNodeLimit}
                min={5}
                max={30}
                step={5}
                className="flex-1"
                data-testid="node-limit-slider"
              />
              <span className="text-sm font-medium w-6">{nodeLimit[0]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graph Container */}
      <Card className="overflow-hidden" data-testid="flow-graph-container">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <CardTitle className="text-lg">Liquidity Flow</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{graphData.nodes.length} entities</span>
            <span>•</span>
            <span>{graphData.links.length} connections</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Loading flow data...</p>
              </div>
            </div>
          ) : graphData.nodes.length === 0 ? (
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <Info className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">No flow data available</p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto p-4">
              <FlowVisualization 
                nodes={graphData.nodes} 
                links={graphData.links}
                onNodeClick={handleNodeClick}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card data-testid="flow-legend">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-sm font-medium">Entity Types:</span>
            {[
              { type: 'exchange', label: 'Exchange' },
              { type: 'wallet', label: 'Wallet' },
              { type: 'contract', label: 'Contract' },
              { type: 'pool', label: 'Pool' },
              { type: 'protocol', label: 'Protocol' },
            ].map(({ type, label }) => (
              <div key={type} className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: getEntityTypeColor(type) }}
                />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Details */}
      {selectedNode && (
        <Card className="animate-slide-in-up" data-testid="selected-node-details">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Entity Details</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedNode(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Label</span>
                <p className="font-medium">{selectedNode.label}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Type</span>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="w-2 h-2 rounded"
                    style={{ backgroundColor: getEntityTypeColor(selectedNode.entity_type) }}
                  />
                  <p className="font-medium capitalize">{selectedNode.entity_type}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Network</span>
                <Badge variant="outline" className="mt-1">
                  {selectedNode.network}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total Volume</span>
                <p className="font-medium">{formatUSD(selectedNode.total_volume)}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button asChild>
                <Link to={`/entity/${selectedNode.id}`}>
                  View Full Profile
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entity List */}
      <Card data-testid="flow-entity-list">
        <CardHeader>
          <CardTitle className="text-lg">Entities in Graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {graphData.nodes.map((node, index) => (
              <Link
                key={index}
                to={`/entity/${node.id}`}
                className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/20 hover:bg-secondary/30 transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${getEntityTypeColor(node.entity_type)}20` }}
                >
                  <span 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getEntityTypeColor(node.entity_type) }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{node.label}</p>
                  <p className="text-xs text-muted-foreground">{formatUSD(node.total_volume)}</p>
                </div>
                <Badge variant="secondary" className="text-xs capitalize shrink-0">
                  {node.entity_type}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
