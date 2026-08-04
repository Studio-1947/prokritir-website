import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Success from "@/pages/Success";
import OrderModal from "@/components/OrderModal";
import SiteBackground from "@/components/SiteBackground";
import { OrderProvider } from "@/lib/orderContext";

function App() {
  return (
    <div className="App relative">
      {/* Animated background for every route, beneath all page content. */}
      <SiteBackground />
      <BrowserRouter>
        <OrderProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/success/:orderId" element={<Success />} />
            {/* Old section URLs and anything else land on the single page. */}
            <Route path="*" element={<Landing />} />
          </Routes>
          <OrderModal />
        </OrderProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
