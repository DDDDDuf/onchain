# LiquiFlow - On-Chain Analytics Platform PRD

## Original Problem Statement
Система on-chain аналітики, яка показує рух ліквідності між гаманцями, біржами, контрактами та пулами. Структура платформи включає: Dashboard, Flow Graph, Entity Profile, Transaction View, Liquidity Pool View, Alerts & Events, Search & Filters.

## User Personas
1. **Crypto Trader** - відстежує whale movements, великі перекази, ліквідність пулів
2. **Blockchain Researcher** - аналізує потоки між entities, досліджує транзакції
3. **DeFi Analyst** - моніторить пули ліквідності, APY, зміни резервів
4. **Risk Manager** - отримує алерти про підозрілу активність

## Core Requirements
- [x] Dashboard з інсайтами та статистикою
- [x] Flow Graph візуалізація потоків ліквідності
- [x] Entity Profile (профіль адреси/біржі/контракту)
- [x] Transaction View з деталями транзакцій
- [x] Liquidity Pool View зі станом пулів
- [x] Alerts & Events система попереджень
- [x] Search & Filters глобальний пошук
- [x] Підтримка мереж: Ethereum, BSC, Polygon, Arbitrum
- [x] Connect Wallet (mock для перегляду)
- [x] Світла тема дизайну

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Database**: MongoDB
- **Charts**: Recharts, Custom SVG

## What's Been Implemented (January 2026)

### Backend API Endpoints
- `GET /api/dashboard/stats` - статистика dashboard
- `GET /api/networks` - список підтримуваних мереж
- `GET /api/entities` - список entities з фільтрами
- `GET /api/entities/{address}` - деталі entity
- `GET /api/transactions` - список транзакцій
- `GET /api/transactions/{hash}` - деталі транзакції
- `GET /api/pools` - список пулів ліквідності
- `GET /api/pools/{address}` - деталі пулу
- `GET /api/alerts` - список алертів
- `GET /api/flow-graph` - дані для графу потоків
- `GET /api/search` - глобальний пошук
- `GET /api/price-history/{symbol}` - історія цін

### Frontend Pages
1. **Dashboard** - статистика, останні перекази, активні алерти, топ пули
2. **Flow Graph** - SVG візуалізація потоків з фільтрами та легендою
3. **Entities** - картки entities з балансами, inflow/outflow
4. **Entity Profile** - баланси токенів, pie chart, транзакції, counterparties
5. **Transactions** - таблиця транзакцій з фільтрами
6. **Transaction View** - деталі, internal txs, gas info
7. **Pools** - картки пулів з liquidity, volume, APY
8. **Pool View** - графік ліквідності, LP holders, events
9. **Alerts** - алерти за severity, типом, мережею
10. **Search Results** - результати пошуку по категоріях

### UI Components
- Glass header з пошуком
- Responsive sidebar з навігацією
- Network selector dropdown
- Connect Wallet button
- Data tables з пагінацією
- Stats cards з трендами
- Chain badges (Ethereum, BSC, Polygon, Arbitrum)
- Severity badges (critical, important, normal)

## Prioritized Backlog

### P0 (Critical) - DONE
- [x] Core navigation and routing
- [x] Dashboard with stats
- [x] Flow Graph visualization
- [x] Entity list and profile
- [x] Transaction list and details
- [x] Pool list and details
- [x] Alerts system

### P1 (High Priority)
- [ ] Real blockchain API integration (Etherscan, Alchemy)
- [ ] Real-time WebSocket updates for alerts
- [ ] User authentication
- [ ] Saved searches / watchlists
- [ ] Export data to CSV/PDF

### P2 (Medium Priority)
- [ ] Advanced flow graph with D3.js for complex visualizations
- [ ] Historical data comparison
- [ ] Custom alert rules creation
- [ ] Dark theme option
- [ ] Multi-wallet portfolio tracking

### P3 (Nice to have)
- [ ] Telegram/Discord notifications
- [ ] AI-powered anomaly detection
- [ ] API rate limiting and caching
- [ ] Mobile app version

## Next Tasks
1. Integrate real blockchain APIs (Etherscan, Alchemy, CoinGecko)
2. Add WebSocket for real-time alerts
3. Implement user authentication (JWT or Google OAuth)
4. Add watchlist/favorites functionality
5. Create export functionality

## Known Limitations
- All data is currently **MOCKED** - no real blockchain integration
- Connect Wallet is visual only
- No user persistence between sessions
