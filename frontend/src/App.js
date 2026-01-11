import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FlowGraph from "./pages/FlowGraph";
import Entities from "./pages/Entities";
import EntityProfile from "./pages/EntityProfile";
import Transactions from "./pages/Transactions";
import TransactionView from "./pages/TransactionView";
import Pools from "./pages/Pools";
import PoolView from "./pages/PoolView";
import Alerts from "./pages/Alerts";
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flow" element={<FlowGraph />} />
          <Route path="/entities" element={<Entities />} />
          <Route path="/entity/:address" element={<EntityProfile />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/tx/:hash" element={<TransactionView />} />
          <Route path="/pools" element={<Pools />} />
          <Route path="/pool/:address" element={<PoolView />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
