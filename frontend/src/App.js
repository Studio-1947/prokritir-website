import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Success from "@/pages/Success";
import OrderModal from "@/components/OrderModal";
import { OrderProvider } from "@/lib/orderContext";

function App() {
  return (
    <div className="App bg-[#061021] text-white">
      <BrowserRouter>
        <OrderProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/success/:orderId" element={<Success />} />
          </Routes>
          <OrderModal />
        </OrderProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
