# Flow Intel - Product Requirements Document

## Overview
Flow Intel is an on-chain analytics platform for visualizing liquidity movements between wallets, exchanges, contracts, and pools. The design is inspired by intel.arkm.com with a modern light theme using glassmorphism effects (Telegram 2026 style).

## Current Implementation Status

### ✅ Completed Features

#### Home Page (`/` - ArkhamHome.jsx)
- [x] Glassmorphism Header with logo, navigation, wallet connect
- [x] Market stats ticker (Market Cap, BTC/ETH Dominance, Volume, Fear & Greed)
- [x] Full-width search bar
- [x] Entities carousel with prices and changes
- [x] Exchange Tokens card (clickable, navigates to token detail)
- [x] Exchange Flows table with filters (CEX+DEX, Market Cap, Volume)
- [x] Filter for Transfers table with real-time feed

#### Token Detail Page (`/token/:tokenId` - TokenDetail.jsx)
- [x] Token header with name, symbol, price
- [x] Back button navigation
- [x] Entity Balance Changes table with tabs
- [x] Top Holders table with toggle (Addresses/Group by Entity)
- [x] Price History chart (Area chart)
- [x] Token stats bar (24H Volume, Market Cap, FDV, Supply)
- [x] Time period selector (1W, 1M, 3M, 1Y, ALL)
- [x] Chart tabs (Price History, On-Chain Exchange Flow, TradingView)
- [x] Bottom stats (24H, 7D, 30D, 180D changes, ATH, ATL)
- [x] Token Transfers table with pagination
- [x] Open Interest / CEX Volume / Funding Rate charts
- [x] Exchange filters (Binance, Bybit)
- [x] SPOT/PERP toggle for CEX Volume

### Backend API Endpoints
- [x] GET `/api/` - Health check
- [x] GET `/api/entities` - Top entities
- [x] GET `/api/exchange-flows` - Exchange flow data
- [x] GET `/api/transfers` - Recent transfers
- [x] GET `/api/tokens` - All tokens
- [x] GET `/api/tokens/{id}` - Token details
- [x] GET `/api/tokens/{id}/balance-changes` - Entity balances
- [x] GET `/api/tokens/{id}/holders` - Top holders
- [x] GET `/api/tokens/{id}/transfers` - Token transfers
- [x] GET `/api/tokens/{id}/price-history` - Price history
- [x] GET `/api/tokens/{id}/open-interest` - Open interest
- [x] GET `/api/tokens/{id}/cex-volume` - CEX volume
- [x] GET `/api/market-stats` - Market statistics

## Design System

### Colors
- Background: Gradient `from-gray-50 via-blue-50/30 to-purple-50/30`
- Primary: Blue `#3B82F6`
- Success: Emerald `#10B981`
- Warning: Yellow `#EAB308`
- Error: Red `#EF4444`
- Text Primary: Gray-900
- Text Secondary: Gray-500

### Components
- GlassCard: `bg-white/70 backdrop-blur-xl rounded-3xl`
- Buttons: `rounded-xl` or `rounded-lg`
- Filters: Pill-shaped with colored borders
- Tables: Clean with hover states

### Typography
- Headers: Bold, uppercase for section titles
- Body: Regular weight
- Data: Semibold for values

## File Structure (Clean)
```
/app
├── backend/
│   ├── server.py          # FastAPI app (cleaned)
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── pages/
│   │   │   ├── ArkhamHome.jsx   # Home page
│   │   │   └── TokenDetail.jsx  # Token detail
│   │   └── components/ui/       # Shadcn components
│   └── package.json
├── README.md
└── memory/
    └── PRD.md
```

## Future Enhancements (Backlog)

### P1 - High Priority
- [ ] Connect to real blockchain data APIs
- [ ] User authentication system
- [ ] Wallet connection (Web3)
- [ ] Real-time WebSocket updates
- [ ] Responsive mobile design optimization

### P2 - Medium Priority
- [ ] Entity Profile page
- [ ] Transaction Detail page
- [ ] Pool Detail page
- [ ] Alerts & Notifications system
- [ ] Search functionality (backend integration)

### P3 - Low Priority
- [ ] Flow Graph visualization (D3.js)
- [ ] Dark theme toggle
- [ ] Export data (CSV/PDF)
- [ ] API key management
- [ ] Favorites/Watchlist

## Technical Notes

### Mock Data
All data is currently mocked in the frontend and backend. The structure is ready for real API integration.

### Charts
Using Recharts library:
- AreaChart for price history and open interest
- BarChart for CEX volume

### Routing
- `/` - Home page (ArkhamHome)
- `/token/:tokenId` - Token detail page

---
Last Updated: January 12, 2026
