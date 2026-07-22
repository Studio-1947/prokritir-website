import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Masala from "@/pages/Masala";
import Chai from "@/pages/Chai";
import Success from "@/pages/Success";
import OrderModal from "@/components/OrderModal";
import SectionTransition from "@/components/SectionTransition";
import { OrderProvider } from "@/lib/orderContext";

function App() {
  return (
    <div className="App text-white">
      <BrowserRouter>
        <OrderProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/water" element={<Landing />} />
            <Route path="/masala" element={<Masala />} />
            <Route path="/chai" element={<Chai />} />
            <Route path="/success/:orderId" element={<Success />} />
          </Routes>
          <OrderModal />
          {/* Must sit inside the router — it reads the location — and after the
              modal so its curtain draws above everything. */}
          <SectionTransition />
        </OrderProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
