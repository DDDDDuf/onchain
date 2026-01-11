from fastapi import FastAPI, APIRouter, Query, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="LiquiFlow Analytics API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ MODELS ============

class NetworkInfo(BaseModel):
    id: str
    name: str
    symbol: str
    color: str
    icon: str

class TokenBalance(BaseModel):
    symbol: str
    name: str
    amount: float
    usd_value: float
    price: float
    change_24h: float

class Entity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    address: str
    label: Optional[str] = None
    entity_type: str  # wallet, exchange, contract, pool, protocol
    confidence: str  # high, medium, low
    network: str
    total_balance_usd: float
    balances: List[TokenBalance] = []
    inflow_24h: float = 0
    outflow_24h: float = 0
    inflow_7d: float = 0
    outflow_7d: float = 0
    transaction_count: int = 0
    first_seen: str
    last_active: str
    tags: List[str] = []
    risk_score: int = 0  # 0-100
    top_counterparties: List[Dict[str, Any]] = []

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hash: str
    block_number: int
    timestamp: str
    network: str
    tx_type: str  # transfer, swap, mint, burn, contract_interaction
    from_address: str
    from_label: Optional[str] = None
    to_address: str
    to_label: Optional[str] = None
    token_symbol: str
    token_amount: float
    usd_value: float
    gas_used: float
    gas_price: float
    status: str  # success, failed, pending
    internal_txs: List[Dict[str, Any]] = []
    tags: List[str] = []

class Pool(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    address: str
    name: str
    protocol: str
    network: str
    token0_symbol: str
    token0_reserve: float
    token1_symbol: str
    token1_reserve: float
    total_liquidity_usd: float
    volume_24h: float
    fees_24h: float
    apy: float
    liquidity_change_24h: float
    liquidity_change_7d: float
    top_lp_holders: List[Dict[str, Any]] = []
    recent_events: List[Dict[str, Any]] = []

class Alert(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: str
    alert_type: str  # whale_movement, liquidity_risk, exchange_inflow, suspicious_activity
    severity: str  # normal, important, critical
    title: str
    description: str
    entity_address: Optional[str] = None
    entity_label: Optional[str] = None
    transaction_hash: Optional[str] = None
    network: str
    usd_value: Optional[float] = None
    tags: List[str] = []

class FlowNode(BaseModel):
    id: str
    label: str
    entity_type: str
    network: str
    total_volume: float

class FlowLink(BaseModel):
    source: str
    target: str
    value: float
    tx_count: int

class FlowGraph(BaseModel):
    nodes: List[FlowNode]
    links: List[FlowLink]

class DashboardStats(BaseModel):
    total_volume_24h: float
    total_transactions_24h: int
    active_entities: int
    active_pools: int
    whale_movements: int
    avg_tx_value: float

# ============ MOCK DATA GENERATORS ============

NETWORKS = [
    {"id": "ethereum", "name": "Ethereum", "symbol": "ETH", "color": "#627EEA", "icon": "⟠"},
    {"id": "bsc", "name": "BNB Chain", "symbol": "BNB", "color": "#F3BA2F", "icon": "◈"},
    {"id": "polygon", "name": "Polygon", "symbol": "MATIC", "color": "#8247E5", "icon": "⬡"},
    {"id": "arbitrum", "name": "Arbitrum", "symbol": "ARB", "color": "#2D374B", "icon": "◇"},
]

TOKENS = [
    {"symbol": "ETH", "name": "Ethereum", "price": 3245.67},
    {"symbol": "BTC", "name": "Bitcoin", "price": 67890.12},
    {"symbol": "USDT", "name": "Tether", "price": 1.00},
    {"symbol": "USDC", "name": "USD Coin", "price": 1.00},
    {"symbol": "BNB", "name": "BNB", "price": 598.34},
    {"symbol": "MATIC", "name": "Polygon", "price": 0.89},
    {"symbol": "ARB", "name": "Arbitrum", "price": 1.23},
    {"symbol": "LINK", "name": "Chainlink", "price": 14.56},
    {"symbol": "UNI", "name": "Uniswap", "price": 7.89},
    {"symbol": "AAVE", "name": "Aave", "price": 156.78},
]

KNOWN_ENTITIES = [
    {"address": "0x28C6c06298d514Db089934071355E5743bf21d60", "label": "Binance 14", "type": "exchange"},
    {"address": "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549", "label": "Binance 15", "type": "exchange"},
    {"address": "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d", "label": "Binance 16", "type": "exchange"},
    {"address": "0x503828976D22510aad0201ac7EC88293211D23Da", "label": "Coinbase 1", "type": "exchange"},
    {"address": "0x71660c4005BA85c37ccec55d0C4493E66Fe775d3", "label": "Coinbase 2", "type": "exchange"},
    {"address": "0x2FAF487A4414Fe77e2327F0bf4AE2a264a776AD2", "label": "FTX Exchange", "type": "exchange"},
    {"address": "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503", "label": "Binance Hot Wallet", "type": "exchange"},
    {"address": "0x1111111254EEB25477B68fb85Ed929f73A960582", "label": "1inch v5 Router", "type": "contract"},
    {"address": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", "label": "Uniswap V2 Router", "type": "contract"},
    {"address": "0xE592427A0AEce92De3Edee1F18E0157C05861564", "label": "Uniswap V3 Router", "type": "contract"},
    {"address": "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", "label": "Uniswap Universal Router", "type": "contract"},
    {"address": "0xdef1c0ded9bec7f1a1670819833240f027b25eff", "label": "0x Exchange Proxy", "type": "contract"},
    {"address": "0x5777d92f208679DB4b9778590Fa3CAB3aC9e2168", "label": "Uniswap ETH/USDT Pool", "type": "pool"},
    {"address": "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640", "label": "Uniswap ETH/USDC Pool", "type": "pool"},
    {"address": "0xCBCdF9626bC03E24f779434178A73a0B4bad62eD", "label": "Curve 3pool", "type": "pool"},
    {"address": "0xbeefbabeea323f07c59926295205d3b7a17e8638", "label": "Alameda Research", "type": "wallet"},
    {"address": "0x0716a17FBAeE714f1E6aB0f9d59edbC5f09815C0", "label": "Jump Trading", "type": "wallet"},
    {"address": "0x56Eddb7aa87536c09CCc2793473599fD21A8b17F", "label": "Three Arrows Capital", "type": "wallet"},
    {"address": "0xB1AdceddB2941033a090dD166a462fe1c2029484", "label": "Aave: Lending Pool V3", "type": "protocol"},
    {"address": "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", "label": "Aave V3 Pool", "type": "protocol"},
]

def generate_address():
    return "0x" + "".join(random.choices("0123456789abcdef", k=40))

def generate_hash():
    return "0x" + "".join(random.choices("0123456789abcdef", k=64))

def generate_mock_entity(network: str = None) -> dict:
    if random.random() < 0.4:
        known = random.choice(KNOWN_ENTITIES)
        address = known["address"]
        label = known["label"]
        entity_type = known["type"]
        confidence = "high"
    else:
        address = generate_address()
        label = None
        entity_type = random.choice(["wallet", "wallet", "wallet", "contract"])
        confidence = random.choice(["high", "medium", "low"])
    
    net = network or random.choice(NETWORKS)["id"]
    balances = []
    total_balance = 0
    
    for _ in range(random.randint(1, 5)):
        token = random.choice(TOKENS)
        amount = random.uniform(0.1, 10000)
        usd_value = amount * token["price"]
        total_balance += usd_value
        balances.append({
            "symbol": token["symbol"],
            "name": token["name"],
            "amount": round(amount, 4),
            "usd_value": round(usd_value, 2),
            "price": token["price"],
            "change_24h": round(random.uniform(-15, 15), 2)
        })
    
    now = datetime.now(timezone.utc)
    first_seen = now - timedelta(days=random.randint(30, 1000))
    last_active = now - timedelta(hours=random.randint(0, 72))
    
    inflow_24h = random.uniform(1000, 5000000)
    outflow_24h = random.uniform(1000, 5000000)
    
    tags = []
    if total_balance > 1000000:
        tags.append("whale")
    if entity_type == "exchange":
        tags.append("cex")
    if entity_type == "contract":
        tags.append("smart_contract")
    if random.random() < 0.1:
        tags.append("suspicious")
    
    return {
        "id": str(uuid.uuid4()),
        "address": address,
        "label": label,
        "entity_type": entity_type,
        "confidence": confidence,
        "network": net,
        "total_balance_usd": round(total_balance, 2),
        "balances": balances,
        "inflow_24h": round(inflow_24h, 2),
        "outflow_24h": round(outflow_24h, 2),
        "inflow_7d": round(inflow_24h * random.uniform(3, 7), 2),
        "outflow_7d": round(outflow_24h * random.uniform(3, 7), 2),
        "transaction_count": random.randint(10, 10000),
        "first_seen": first_seen.isoformat(),
        "last_active": last_active.isoformat(),
        "tags": tags,
        "risk_score": random.randint(0, 100),
        "top_counterparties": []
    }

def generate_mock_transaction(network: str = None) -> dict:
    net = network or random.choice(NETWORKS)["id"]
    token = random.choice(TOKENS)
    amount = random.uniform(0.01, 5000)
    usd_value = amount * token["price"]
    
    from_entity = random.choice(KNOWN_ENTITIES) if random.random() < 0.3 else None
    to_entity = random.choice(KNOWN_ENTITIES) if random.random() < 0.3 else None
    
    now = datetime.now(timezone.utc)
    timestamp = now - timedelta(minutes=random.randint(0, 1440))
    
    tx_types = ["transfer", "transfer", "transfer", "swap", "swap", "mint", "burn", "contract_interaction"]
    tx_type = random.choice(tx_types)
    
    tags = []
    if usd_value > 100000:
        tags.append("large_transfer")
    if usd_value > 1000000:
        tags.append("whale_movement")
    if tx_type == "swap":
        tags.append("dex_trade")
    
    return {
        "id": str(uuid.uuid4()),
        "hash": generate_hash(),
        "block_number": random.randint(18000000, 19000000),
        "timestamp": timestamp.isoformat(),
        "network": net,
        "tx_type": tx_type,
        "from_address": from_entity["address"] if from_entity else generate_address(),
        "from_label": from_entity["label"] if from_entity else None,
        "to_address": to_entity["address"] if to_entity else generate_address(),
        "to_label": to_entity["label"] if to_entity else None,
        "token_symbol": token["symbol"],
        "token_amount": round(amount, 6),
        "usd_value": round(usd_value, 2),
        "gas_used": random.randint(21000, 500000),
        "gas_price": round(random.uniform(10, 100), 2),
        "status": "success" if random.random() > 0.02 else "failed",
        "internal_txs": [],
        "tags": tags
    }

def generate_mock_pool(network: str = None) -> dict:
    net = network or random.choice(NETWORKS)["id"]
    tokens = random.sample(TOKENS, 2)
    
    protocols = ["Uniswap V3", "Uniswap V2", "SushiSwap", "Curve", "Balancer", "PancakeSwap"]
    protocol = random.choice(protocols)
    
    reserve0 = random.uniform(100, 100000)
    reserve1 = random.uniform(100, 100000)
    total_liquidity = reserve0 * tokens[0]["price"] + reserve1 * tokens[1]["price"]
    
    return {
        "id": str(uuid.uuid4()),
        "address": generate_address(),
        "name": f"{tokens[0]['symbol']}/{tokens[1]['symbol']}",
        "protocol": protocol,
        "network": net,
        "token0_symbol": tokens[0]["symbol"],
        "token0_reserve": round(reserve0, 4),
        "token1_symbol": tokens[1]["symbol"],
        "token1_reserve": round(reserve1, 4),
        "total_liquidity_usd": round(total_liquidity, 2),
        "volume_24h": round(total_liquidity * random.uniform(0.01, 0.5), 2),
        "fees_24h": round(total_liquidity * random.uniform(0.0001, 0.005), 2),
        "apy": round(random.uniform(1, 50), 2),
        "liquidity_change_24h": round(random.uniform(-10, 10), 2),
        "liquidity_change_7d": round(random.uniform(-25, 25), 2),
        "top_lp_holders": [],
        "recent_events": []
    }

def generate_mock_alert() -> dict:
    alert_types = [
        ("whale_movement", "Whale Movement", "Large transfer detected", "important"),
        ("liquidity_risk", "Liquidity Risk", "Significant liquidity withdrawal", "critical"),
        ("exchange_inflow", "Exchange Inflow", "Large deposit to exchange", "normal"),
        ("suspicious_activity", "Suspicious Activity", "Unusual transaction pattern detected", "critical"),
    ]
    
    alert = random.choice(alert_types)
    entity = random.choice(KNOWN_ENTITIES)
    net = random.choice(NETWORKS)
    now = datetime.now(timezone.utc)
    timestamp = now - timedelta(minutes=random.randint(0, 1440))
    
    return {
        "id": str(uuid.uuid4()),
        "timestamp": timestamp.isoformat(),
        "alert_type": alert[0],
        "severity": alert[3],
        "title": alert[1],
        "description": f"{alert[2]} from {entity['label'] or 'Unknown Wallet'}",
        "entity_address": entity["address"],
        "entity_label": entity["label"],
        "transaction_hash": generate_hash(),
        "network": net["id"],
        "usd_value": round(random.uniform(100000, 10000000), 2),
        "tags": [alert[0], net["id"]]
    }

def generate_flow_graph(network: str = None, limit: int = 20) -> dict:
    nodes = []
    links = []
    
    # Generate nodes from known entities
    selected_entities = random.sample(KNOWN_ENTITIES, min(limit, len(KNOWN_ENTITIES)))
    
    for entity in selected_entities:
        nodes.append({
            "id": entity["address"][:10],
            "label": entity["label"] or entity["address"][:10],
            "entity_type": entity["type"],
            "network": network or random.choice(NETWORKS)["id"],
            "total_volume": round(random.uniform(100000, 10000000), 2)
        })
    
    # Generate links between nodes
    for i in range(len(nodes)):
        num_links = random.randint(1, 3)
        targets = random.sample([n for n in nodes if n["id"] != nodes[i]["id"]], min(num_links, len(nodes) - 1))
        for target in targets:
            links.append({
                "source": nodes[i]["id"],
                "target": target["id"],
                "value": round(random.uniform(10000, 1000000), 2),
                "tx_count": random.randint(1, 100)
            })
    
    return {"nodes": nodes, "links": links}

# ============ API ENDPOINTS ============

@api_router.get("/")
async def root():
    return {"message": "LiquiFlow Analytics API", "version": "1.0.0"}

@api_router.get("/networks", response_model=List[NetworkInfo])
async def get_networks():
    return NETWORKS

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    return DashboardStats(
        total_volume_24h=random.uniform(500000000, 2000000000),
        total_transactions_24h=random.randint(100000, 500000),
        active_entities=random.randint(50000, 200000),
        active_pools=random.randint(1000, 5000),
        whale_movements=random.randint(50, 200),
        avg_tx_value=random.uniform(1000, 10000)
    )

@api_router.get("/entities")
async def get_entities(
    network: Optional[str] = None,
    entity_type: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    offset: int = 0,
    search: Optional[str] = None
):
    entities = [generate_mock_entity(network) for _ in range(limit)]
    
    if entity_type:
        entities = [e for e in entities if e["entity_type"] == entity_type]
    
    if search:
        search_lower = search.lower()
        entities = [e for e in entities if 
                   search_lower in e["address"].lower() or 
                   (e["label"] and search_lower in e["label"].lower())]
    
    return {"entities": entities, "total": len(entities), "limit": limit, "offset": offset}

@api_router.get("/entities/{address}")
async def get_entity(address: str):
    # Check if it's a known entity
    known = next((e for e in KNOWN_ENTITIES if e["address"].lower() == address.lower()), None)
    
    entity = generate_mock_entity()
    entity["address"] = address
    
    if known:
        entity["label"] = known["label"]
        entity["entity_type"] = known["type"]
        entity["confidence"] = "high"
    
    # Generate top counterparties
    counterparties = []
    for _ in range(5):
        cp_entity = random.choice(KNOWN_ENTITIES)
        counterparties.append({
            "address": cp_entity["address"],
            "label": cp_entity["label"],
            "entity_type": cp_entity["type"],
            "total_volume": round(random.uniform(100000, 5000000), 2),
            "tx_count": random.randint(10, 500)
        })
    entity["top_counterparties"] = counterparties
    
    return entity

@api_router.get("/transactions")
async def get_transactions(
    network: Optional[str] = None,
    tx_type: Optional[str] = None,
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    address: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    offset: int = 0
):
    transactions = [generate_mock_transaction(network) for _ in range(limit)]
    
    if tx_type:
        transactions = [t for t in transactions if t["tx_type"] == tx_type]
    
    if min_value:
        transactions = [t for t in transactions if t["usd_value"] >= min_value]
    
    if max_value:
        transactions = [t for t in transactions if t["usd_value"] <= max_value]
    
    if address:
        transactions = [t for t in transactions if 
                       t["from_address"].lower() == address.lower() or 
                       t["to_address"].lower() == address.lower()]
    
    # Sort by timestamp descending
    transactions.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return {"transactions": transactions, "total": len(transactions), "limit": limit, "offset": offset}

@api_router.get("/transactions/{hash}")
async def get_transaction(hash: str):
    tx = generate_mock_transaction()
    tx["hash"] = hash
    
    # Generate internal transactions
    internal_txs = []
    for i in range(random.randint(1, 5)):
        token = random.choice(TOKENS)
        internal_txs.append({
            "step": i + 1,
            "from_address": generate_address(),
            "from_label": random.choice(KNOWN_ENTITIES)["label"] if random.random() < 0.3 else None,
            "to_address": generate_address(),
            "to_label": random.choice(KNOWN_ENTITIES)["label"] if random.random() < 0.3 else None,
            "token_symbol": token["symbol"],
            "token_amount": round(random.uniform(0.1, 1000), 4),
            "action": random.choice(["transfer", "swap", "approve", "deposit", "withdraw"])
        })
    tx["internal_txs"] = internal_txs
    
    return tx

@api_router.get("/pools")
async def get_pools(
    network: Optional[str] = None,
    protocol: Optional[str] = None,
    min_liquidity: Optional[float] = None,
    limit: int = Query(default=20, le=100),
    offset: int = 0
):
    pools = [generate_mock_pool(network) for _ in range(limit)]
    
    if protocol:
        pools = [p for p in pools if p["protocol"].lower() == protocol.lower()]
    
    if min_liquidity:
        pools = [p for p in pools if p["total_liquidity_usd"] >= min_liquidity]
    
    # Sort by liquidity descending
    pools.sort(key=lambda x: x["total_liquidity_usd"], reverse=True)
    
    return {"pools": pools, "total": len(pools), "limit": limit, "offset": offset}

@api_router.get("/pools/{address}")
async def get_pool(address: str):
    pool = generate_mock_pool()
    pool["address"] = address
    
    # Generate top LP holders
    lp_holders = []
    for _ in range(10):
        entity = random.choice(KNOWN_ENTITIES)
        lp_holders.append({
            "address": entity["address"],
            "label": entity["label"],
            "share_percentage": round(random.uniform(0.1, 15), 2),
            "liquidity_usd": round(pool["total_liquidity_usd"] * random.uniform(0.01, 0.15), 2)
        })
    pool["top_lp_holders"] = sorted(lp_holders, key=lambda x: x["share_percentage"], reverse=True)
    
    # Generate recent events
    events = []
    now = datetime.now(timezone.utc)
    for i in range(10):
        timestamp = now - timedelta(hours=random.randint(0, 72))
        event_type = random.choice(["add_liquidity", "remove_liquidity", "swap"])
        events.append({
            "id": str(uuid.uuid4()),
            "timestamp": timestamp.isoformat(),
            "event_type": event_type,
            "address": generate_address(),
            "label": random.choice(KNOWN_ENTITIES)["label"] if random.random() < 0.2 else None,
            "amount_usd": round(random.uniform(1000, 500000), 2)
        })
    pool["recent_events"] = sorted(events, key=lambda x: x["timestamp"], reverse=True)
    
    return pool

@api_router.get("/alerts")
async def get_alerts(
    network: Optional[str] = None,
    alert_type: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    offset: int = 0
):
    alerts = [generate_mock_alert() for _ in range(limit)]
    
    if network:
        alerts = [a for a in alerts if a["network"] == network]
    
    if alert_type:
        alerts = [a for a in alerts if a["alert_type"] == alert_type]
    
    if severity:
        alerts = [a for a in alerts if a["severity"] == severity]
    
    # Sort by timestamp descending
    alerts.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return {"alerts": alerts, "total": len(alerts), "limit": limit, "offset": offset}

@api_router.get("/flow-graph")
async def get_flow_graph(
    network: Optional[str] = None,
    limit: int = Query(default=15, le=50)
):
    return generate_flow_graph(network, limit)

@api_router.get("/search")
async def global_search(
    q: str = Query(..., min_length=2),
    limit: int = Query(default=10, le=50)
):
    results = {
        "entities": [],
        "transactions": [],
        "pools": []
    }
    
    q_lower = q.lower()
    
    # Search known entities
    for entity in KNOWN_ENTITIES:
        if q_lower in entity["address"].lower() or (entity["label"] and q_lower in entity["label"].lower()):
            results["entities"].append({
                "address": entity["address"],
                "label": entity["label"],
                "entity_type": entity["type"]
            })
    
    # Add some mock results if needed
    if len(results["entities"]) < limit:
        for _ in range(limit - len(results["entities"])):
            entity = generate_mock_entity()
            results["entities"].append({
                "address": entity["address"],
                "label": entity["label"],
                "entity_type": entity["entity_type"]
            })
    
    results["entities"] = results["entities"][:limit]
    
    return results

@api_router.get("/price-history/{symbol}")
async def get_price_history(
    symbol: str,
    period: str = "7d"  # 1d, 7d, 30d, 90d
):
    periods = {"1d": 24, "7d": 168, "30d": 720, "90d": 2160}
    hours = periods.get(period, 168)
    
    token = next((t for t in TOKENS if t["symbol"] == symbol.upper()), TOKENS[0])
    base_price = token["price"]
    
    now = datetime.now(timezone.utc)
    data_points = []
    
    for i in range(hours):
        timestamp = now - timedelta(hours=hours - i)
        price = base_price * (1 + random.uniform(-0.05, 0.05))
        volume = random.uniform(1000000, 50000000)
        data_points.append({
            "timestamp": timestamp.isoformat(),
            "price": round(price, 2),
            "volume": round(volume, 2)
        })
    
    return {
        "symbol": symbol.upper(),
        "period": period,
        "data": data_points
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
