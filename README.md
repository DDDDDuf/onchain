# Flow Intel - On-Chain Analytics Platform

A modern on-chain analytics platform for tracking liquidity movements between wallets, exchanges, contracts, and pools. Built with React and FastAPI.

![Flow Intel](https://via.placeholder.com/800x400?text=Flow+Intel+Analytics)

## 🚀 Features

### Home Page (`/`)
- **Header** with navigation and wallet connect button
- **Market Ticker** with real-time stats (Market Cap, BTC/ETH Dominance, Fear & Greed Index)
- **Search Bar** for tokens, addresses, and entities
- **Entities Carousel** showing top entities with prices
- **Exchange Token Card** featuring a highlighted token
- **Exchange Flows Table** with CEX+DEX data, filtering options
- **Transfers Table** with real-time transfer feed

### Token Detail Page (`/token/:tokenId`)
- **Token Header** with name, symbol, and current price
- **Entity Balance Changes** table showing CEX/DEX holdings
- **Top Holders** table with addresses and percentages
- **Price History Chart** with multiple time periods (1W, 1M, 3M, 1Y, ALL)
- **Token Stats** (24H Volume, Market Cap, FDV, Supply)
- **Open Interest / CEX Volume / Funding Rate** charts
- **Token Transfers** table with pagination

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS** - Styling
- **Recharts** - Charts and visualizations
- **Lucide React** - Icons
- **React Router** - Navigation

### Backend
- **FastAPI** - Python web framework
- **MongoDB** - Database (via Motor async driver)
- **Pydantic** - Data validation

### Design System
- **Glassmorphism** - Modern glass effect UI (Telegram 2026 style)
- **Light Theme** - Clean white/gray color palette
- **Large Border Radius** - Rounded corners (rounded-2xl, rounded-3xl)
- **Soft Shadows** - Subtle depth effects

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py          # FastAPI application with all endpoints
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── App.js              # Main app with routing
│   │   ├── App.css             # Global styles
│   │   ├── index.js            # Entry point
│   │   ├── index.css           # Tailwind + custom styles
│   │   ├── pages/
│   │   │   ├── ArkhamHome.jsx  # Home page component
│   │   │   └── TokenDetail.jsx # Token detail page
│   │   ├── components/
│   │   │   └── ui/             # Shadcn UI components
│   │   ├── lib/
│   │   │   └── utils.js        # Utility functions
│   │   └── hooks/
│   │       └── use-toast.js    # Toast hook
│   ├── package.json
│   └── .env
│
└── memory/
    └── PRD.md                  # Product Requirements Document
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | Health check |
| GET | `/api/entities` | Get top entities for carousel |
| GET | `/api/exchange-flows` | Get exchange flow data |
| GET | `/api/transfers` | Get recent transfers |
| GET | `/api/tokens` | Get all tokens |
| GET | `/api/tokens/{id}` | Get token details |
| GET | `/api/tokens/{id}/balance-changes` | Get entity balance changes |
| GET | `/api/tokens/{id}/holders` | Get top holders |
| GET | `/api/tokens/{id}/transfers` | Get token transfers |
| GET | `/api/tokens/{id}/price-history` | Get price history for chart |
| GET | `/api/tokens/{id}/open-interest` | Get open interest data |
| GET | `/api/tokens/{id}/cex-volume` | Get CEX volume data |
| GET | `/api/market-stats` | Get market statistics |

## 🎨 Design Principles

### Glass Card Component
```jsx
const GlassCard = ({ children, className = "" }) => (
  <div className={`
    bg-white/70 backdrop-blur-xl 
    border border-white/50 
    rounded-3xl 
    shadow-[0_8px_32px_rgba(0,0,0,0.06)]
    hover:shadow-[0_12px_48px_rgba(0,0,0,0.1)]
    ${className}
  `}>
    {children}
  </div>
);
```

### Color Palette
- **Background**: `from-gray-50 via-blue-50/30 to-purple-50/30`
- **Primary**: Blue (`#3B82F6`)
- **Success**: Emerald (`#10B981`)
- **Error**: Red (`#EF4444`)
- **Text**: Gray-900, Gray-600, Gray-500

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/flow-intel.git
cd flow-intel
```

2. **Install frontend dependencies**
```bash
cd frontend
yarn install
```

3. **Install backend dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Set up environment variables**

Frontend `.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

Backend `.env`:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=flow_intel
```

5. **Start the servers**

Backend:
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Frontend:
```bash
cd frontend
yarn start
```

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React, FastAPI, and modern design principles.
