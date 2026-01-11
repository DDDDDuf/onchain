import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import ArkhamHome from "./pages/ArkhamHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArkhamHome />} />
        <Route path="/*" element={<ArkhamHome />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
