import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter,
  RefreshCw,
  Info
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
import { Sankey, Rectangle, Layer } from 'recharts';
import { getFlowGraph } from '../lib/api';
import { 
  formatUSD, 
  formatAddress,
  getEntityTypeColor,
  getNetworkColor,
  cn
} from '../lib/utils';

const CustomNode = ({ x, y, width, height, index, payload, containerWidth }) => {
  const isOut = x + width + 6 > containerWidth;
  const color = getEntityTypeColor(payload.entity_type);
  
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity="0.9"
        rx={4}
        ry={4}
        className="cursor-pointer hover:opacity-80 transition-opacity"
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="12"
        fontFamily="IBM Plex Sans"
        fontWeight="500"
        fill="#0f172a"
        dominantBaseline="middle"
      >
        {payload.label?.length > 15 ? payload.label.slice(0, 15) + '...' : payload.label}
      </text>
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 14}
        fontSize="10"
        fontFamily="Manrope"
        fill="#64748b"
        dominantBaseline="middle"
      >
        {formatUSD(payload.total_volume)}
      </text>
    </Layer>
  );
};

const CustomLink = ({ sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index, payload }) => {
  const gradientId = `gradient-${index}`;
  
  return (
    <Layer key={`CustomLink${index}`}>
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0%" stopColor="#627EEA" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8247E5" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path
        d={`
          M${sourceX},${sourceY + linkWidth / 2}
          C${sourceControlX},${sourceY + linkWidth / 2}
            ${targetControlX},${targetY + linkWidth / 2}
            ${targetX},${targetY + linkWidth / 2}
          L${targetX},${targetY - linkWidth / 2}
          C${targetControlX},${targetY - linkWidth / 2}
            ${sourceControlX},${sourceY - linkWidth / 2}
            ${sourceX},${sourceY - linkWidth / 2}
          Z
        `}
        fill={`url(#${gradientId})`}
        className="sankey-link cursor-pointer"
        strokeWidth="0"
      />
    </Layer>
  );
};

export default function FlowGraph() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [nodeLimit, setNodeLimit] = useState([15]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(100);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: nodeLimit[0] };
      if (selectedNetwork !== 'all') {
        params.network = selectedNetwork;
      }
      const res = await getFlowGraph(params);
      
      // Transform data for Sankey
      const sankeyData = {
        nodes: res.data.nodes.map(node => ({
          name: node.id,
          label: node.label,
          entity_type: node.entity_type,
          network: node.network,
          total_volume: node.total_volume
        })),
        links: res.data.links.map(link => ({
          source: res.data.nodes.findIndex(n => n.id === link.source),
          target: res.data.nodes.findIndex(n => n.id === link.target),
          value: link.value,
          tx_count: link.tx_count
        })).filter(link => link.source !== -1 && link.target !== -1 && link.source !== link.target)
      };
      
      setGraphData(sankeyData);
    } catch (error) {
      console.error('Error fetching flow graph:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedNetwork, nodeLimit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 50));
  const handleReset = () => {
    setZoom(100);
    setSelectedNode(null);
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
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <span className="text-sm text-muted-foreground">{zoom}%</span>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
            <div 
              className="flow-container overflow-auto"
              style={{ 
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top left',
                height: `${500 * (100 / zoom)}px`
              }}
            >
              <Sankey
                width={900}
                height={500}
                data={graphData}
                node={<CustomNode containerWidth={900} />}
                link={<CustomLink />}
                nodePadding={50}
                nodeWidth={10}
                margin={{ top: 20, right: 200, bottom: 20, left: 20 }}
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
                  className="entity-dot"
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
            <CardTitle className="text-lg">Node Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Label</span>
                <p className="font-medium">{selectedNode.label}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Type</span>
                <p className="font-medium capitalize">{selectedNode.entity_type}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Network</span>
                <Badge variant="outline" className={cn(
                  "mt-1",
                  `chain-badge-${selectedNode.network}`
                )}>
                  {selectedNode.network}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Total Volume</span>
                <p className="font-medium">{formatUSD(selectedNode.total_volume)}</p>
              </div>
            </div>
            <Button className="mt-4" asChild>
              <Link to={`/entity/${selectedNode.id}`}>View Entity Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
