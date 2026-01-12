"""
Flow Intel Analytics API
========================
A FastAPI backend for the Flow Intel on-chain analytics platform.

Current endpoints:
- /api/ - API health check
- /api/tokens - Get list of tokens
- /api/tokens/{tokenId} - Get token details
- /api/entities - Get list of entities (exchanges, wallets)
- /api/transfers - Get transfer transactions
"""

from fastapi import FastAPI, APIRouter, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
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
app = FastAPI(
    title="Flow Intel Analytics API",
    description="On-chain analytics platform for tracking liquidity movements",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============ PYDANTIC MODELS ============

class TokenInfo(BaseModel):
    id: str
    name: str
    symbol: str
    price: float
    change_24h: float
    volume_24h: float
    market_cap: float
    icon: str
    color: str

class EntityBalanceChange(BaseModel):
    name: str
    type: str  # CEX, DEX
    icon: str
    value: str
    value_change: str
    usd: str
    usd_change: str

class TopHolder(BaseModel):
    name: str
    is_entity: bool
    icon: Optional[str]
    value: str
    pct: str
    usd: str

class Transfer(BaseModel):
    id: str
    chain: str
    time: str
    from_address: str
    from_label: Optional[str]
    to_address: str
    to_label: Optional[str]
    value: str
    token: str
    token_color: str
    usd: str

class ExchangeFlow(BaseModel):
    asset: str
    icon: str
    price: str
    price_change: float
    volume: str
    volume_change: float
    netflow: str
    netflow_change: float

# ============ MOCK DATA ============

# Top Entities for carousel
TOP_ENTITIES = [
    {"name": "Bybit", "price": "$28.41B", "change": "+0.38%", "is_positive": True, "icon": "🟡"},
    {"name": "MetaPlanet", "price": "$3.19B", "change": "-0.47%", "is_positive": False, "icon": "🔵"},
    {"name": "ARK Invest", "price": "$3.39B", "change": "+9.49%", "is_positive": True, "icon": "📊"},
    {"name": "Donald Trump", "price": "$1.02M", "change": "-0.5%", "is_positive": False, "icon": "🇺🇸"},
    {"name": "Multisig Exploit", "price": "$318.9M", "change": "-1.17%", "is_positive": False, "icon": "☠️"},
    {"name": "Exchange", "price": "$34.89M", "change": "-0.45%", "is_positive": False, "icon": "⬛"},
    {"name": "Wintermute", "price": "$205.4M", "change": "-0.23%", "is_positive": False, "icon": "❄️"},
    {"name": "Kraken", "price": "$12.4B", "change": "+0.12%", "is_positive": True, "icon": "🐙"},
]

# Featured tokens
FEATURED_TOKENS = {
    "xpl": {
        "id": "xpl",
        "name": "XPL Token",
        "symbol": "XPL",
        "price": 0.203,
        "change_24h": 26.07,
        "volume_24h": 60470396,
        "market_cap": 419533333.33,
        "fdv": 419533333.33,
        "current_supply": "1,942,420,283,027",
        "max_supply": "1,942,420,283,027",
        "ath": 1.68,
        "atl": 0.12,
        "icon": "🌀",
        "color": "#10B981"
    },
    "awe": {
        "id": "awe",
        "name": "AWE Network",
        "symbol": "AWE",
        "price": 0.0554,
        "change_24h": -3.64,
        "volume_24h": 5909008,
        "market_cap": 107683895.65,
        "fdv": 107683895.65,
        "current_supply": "1,942,420,283,027",
        "max_supply": "1,942,420,283,027",
        "ath": 0.270,
        "atl": 0.00647,
        "icon": "🔷",
        "color": "#3B82F6"
    }
}

# Exchange flows data
EXCHANGE_FLOWS = [
    {"asset": "AWE", "icon": "🔵", "price": "$0.055", "price_change": -3.64, "volume": "$890.92K", "volume_change": -33.92, "netflow": "+$870.44K", "netflow_change": -33.22},
    {"asset": "BARD", "icon": "🟡", "price": "$0.79", "price_change": 1.11, "volume": "$660.87K", "volume_change": 163.78, "netflow": "+$643.82K", "netflow_change": 162.97},
    {"asset": "AXS", "icon": "🔴", "price": "$0.95", "price_change": 0.07, "volume": "$419.45K", "volume_change": -24.83, "netflow": "+$375.8K", "netflow_change": -22.1},
    {"asset": "JASMY", "icon": "🟠", "price": "$0.0089", "price_change": 3.28, "volume": "$2.84M", "volume_change": 156.45, "netflow": "+$2.44M", "netflow_change": 177.69},
    {"asset": "PYTH", "icon": "🟣", "price": "$0.066", "price_change": -1.29, "volume": "$1.11M", "volume_change": -64.9, "netflow": "+$914.37K", "netflow_change": -64.4},
    {"asset": "CTC", "icon": "⚪", "price": "$0.03", "price_change": -1.48, "volume": "$2.75M", "volume_change": -30.37, "netflow": "+$2.26M", "netflow_change": -22.35},
]

# Entity balance changes for token detail page
ENTITY_BALANCE_CHANGES = [
    {"name": "CoinDCX", "type": "CEX", "icon": "⚪", "value": "2.1M", "value_change": "+117.6%", "usd": "$120.96K", "usd_change": "+119.45%"},
    {"name": "Bithumb", "type": "CEX", "icon": "🟠", "value": "28.45M", "value_change": "+1.28%", "usd": "$1.64M", "usd_change": "+2.14%"},
    {"name": "HTX", "type": "CEX", "icon": "🔵", "value": "5.15M", "value_change": "+1.07%", "usd": "$296.7K", "usd_change": "+1.93%"},
    {"name": "Binance", "type": "CEX", "icon": "🟡", "value": "412.81M", "value_change": "+0.77%", "usd": "$23.79M", "usd_change": "+1.63%"},
    {"name": "Poloniex", "type": "CEX", "icon": "🟢", "value": "1.95M", "value_change": "±0%", "usd": "$112.54K", "usd_change": "+0.85%"},
    {"name": "Aerodrome Finance", "type": "DEX", "icon": "🔷", "value": "5M", "value_change": "-0.39%", "usd": "$288.36K", "usd_change": "+0.46%"},
    {"name": "OKX", "type": "CEX", "icon": "⚫", "value": "89.2M", "value_change": "+2.45%", "usd": "$5.14M", "usd_change": "+3.31%"},
    {"name": "Kraken", "type": "CEX", "icon": "🟣", "value": "15.67M", "value_change": "-0.12%", "usd": "$903.5K", "usd_change": "+0.74%"},
]

# Top holders for token detail page
TOP_HOLDERS = [
    {"name": "Binance: Cold Wallet (0xF97)", "is_entity": True, "icon": "◇", "value": "398,417,870.95", "pct": "19.92%", "usd": "$22.09M"},
    {"name": "0xa2B741C8b4c840082c14A4aDEBFA3F2eAE45d022", "is_entity": False, "icon": None, "value": "293,116,664", "pct": "14.66%", "usd": "$16.25M"},
    {"name": "Upbit: Cold Wallet (0xb93)", "is_entity": True, "icon": "UP", "value": "229,965,767.73", "pct": "11.5%", "usd": "$12.75M"},
    {"name": "0x74f50212ac259BA648F0BF4f0C02FaaB098cf7d6", "is_entity": False, "icon": None, "value": "133,362,169.33", "pct": "6.67%", "usd": "$7.39M"},
    {"name": "0x18051a9c643077DC1A14d49E1B804dC857750287", "is_entity": False, "icon": None, "value": "119,638,020.93", "pct": "5.98%", "usd": "$6.63M"},
]

# Chain configuration
CHAINS = {
    "ethereum": {"color": "#627EEA", "icon": "⟠"},
    "base": {"color": "#0052FF", "icon": "⟠"},
    "polygon": {"color": "#8247E5", "icon": "⬡"},
    "tron": {"color": "#FF0013", "icon": "◆"},
    "bsc": {"color": "#F3BA2F", "icon": "◈"},
}

# ============ HELPER FUNCTIONS ============

def generate_address():
    """Generate a random Ethereum-style address"""
    return "0x" + "".join(random.choices("0123456789abcdef", k=40))

def generate_transfer():
    """Generate a mock transfer transaction"""
    chain = random.choice(list(CHAINS.keys()))
    tokens = ["AWE", "USDT", "USDC", "ETH", "TRX"]
    token = random.choice(tokens)
    token_colors = {"AWE": "#3B82F6", "USDT": "#26A17B", "USDC": "#2775CA", "ETH": "#627EEA", "TRX": "#FF0013"}
    
    times = ["just now", "1 minute ago", "5 minutes ago", "10 minutes ago", "30 minutes ago", "1 hour ago"]
    
    labels = [
        ("Binance Deposit", "Binance: Hot Wallet"),
        ("HTX Deposit", "HTX: Hot Wallet"),
        (None, None),
        ("Kraken Deposit", "Kraken: Hot Wallet"),
    ]
    label_pair = random.choice(labels)
    
    return {
        "id": str(uuid.uuid4()),
        "chain": chain,
        "time": random.choice(times),
        "from_address": generate_address()[:25] + "...",
        "from_label": label_pair[0],
        "to_address": generate_address()[:25] + "...",
        "to_label": label_pair[1],
        "value": f"{random.randint(1, 1000)}",
        "token": token,
        "token_color": token_colors.get(token, "#627EEA"),
        "usd": f"${random.randint(1, 10000)}"
    }

# ============ API ENDPOINTS ============

@api_router.get("/")
async def root():
    """API health check"""
    return {
        "message": "Flow Intel Analytics API",
        "version": "1.0.0",
        "status": "healthy"
    }

@api_router.get("/entities")
async def get_entities():
    """Get top entities for carousel"""
    return {"entities": TOP_ENTITIES}

@api_router.get("/exchange-flows")
async def get_exchange_flows():
    """Get exchange flow data for home page table"""
    return {"flows": EXCHANGE_FLOWS}

@api_router.get("/transfers")
async def get_transfers(limit: int = Query(default=15, le=50)):
    """Get recent transfers"""
    transfers = [generate_transfer() for _ in range(limit)]
    return {"transfers": transfers, "total": 625, "page": 1}

@api_router.get("/tokens")
async def get_tokens():
    """Get all featured tokens"""
    return {"tokens": list(FEATURED_TOKENS.values())}

@api_router.get("/tokens/{token_id}")
async def get_token(token_id: str):
    """Get token details by ID"""
    token = FEATURED_TOKENS.get(token_id.lower())
    if not token:
        token = FEATURED_TOKENS["xpl"]  # Default fallback
    return token

@api_router.get("/tokens/{token_id}/balance-changes")
async def get_token_balance_changes(token_id: str):
    """Get entity balance changes for a token"""
    return {"changes": ENTITY_BALANCE_CHANGES}

@api_router.get("/tokens/{token_id}/holders")
async def get_token_holders(token_id: str):
    """Get top holders for a token"""
    return {"holders": TOP_HOLDERS}

@api_router.get("/tokens/{token_id}/transfers")
async def get_token_transfers(token_id: str, limit: int = Query(default=10, le=50)):
    """Get transfers for a specific token"""
    transfers = [generate_transfer() for _ in range(limit)]
    # Set token to match request
    token = FEATURED_TOKENS.get(token_id.lower(), FEATURED_TOKENS["xpl"])
    for t in transfers:
        t["token"] = token["symbol"]
    return {"transfers": transfers, "total": 625, "page": 1}

@api_router.get("/tokens/{token_id}/price-history")
async def get_price_history(token_id: str, period: str = "ALL"):
    """Get price history for charting"""
    token = FEATURED_TOKENS.get(token_id.lower(), FEATURED_TOKENS["xpl"])
    base_price = token["price"]
    
    # Generate mock price history
    data = []
    years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"]
    for year in years:
        price = base_price * random.uniform(0.5, 2.5)
        data.append({"date": year, "price": round(price, 4)})
    
    return {
        "token_id": token_id,
        "period": period,
        "data": data
    }

@api_router.get("/tokens/{token_id}/open-interest")
async def get_open_interest(token_id: str, period: str = "1M"):
    """Get open interest data for charting"""
    data = []
    for i in range(12):
        data.append({
            "date": str(i * 3),
            "binance": round(random.uniform(1.5, 3.0), 2),
            "bybit": round(random.uniform(0.5, 1.2), 2)
        })
    return {"data": data, "period": period}

@api_router.get("/tokens/{token_id}/cex-volume")
async def get_cex_volume(token_id: str, period: str = "24H", volume_type: str = "spot"):
    """Get CEX volume data for charting"""
    data = []
    for i in range(20):
        hour = f"{(i % 24):02d}:00"
        data.append({
            "time": hour,
            "binance": random.randint(30, 700),
            "bybit": random.randint(20, 150)
        })
    return {"data": data, "period": period, "type": volume_type}

@api_router.get("/market-stats")
async def get_market_stats():
    """Get market statistics"""
    return {
        "total_market_cap": "$3.102.5B",
        "market_cap_change": "+0.49%",
        "btc_dominance": "58.47%",
        "btc_change": "-0.01%",
        "eth_dominance": "12.13%",
        "eth_change": "+0.08%",
        "volume_24h": "$58.3B",
        "volume_change": "+28.19%",
        "fear_greed": 40
    }

# ============ APP CONFIGURATION ============

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
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
    """Close MongoDB connection on shutdown"""
    client.close()
