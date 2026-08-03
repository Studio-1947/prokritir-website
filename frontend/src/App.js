import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Success from "@/pages/Success";
import OrderModal from "@/components/OrderModal";
import SectionTransition from "@/components/SectionTransition";
import { OrderProvider } from "@/lib/orderContext";
import { WaveNavProvider } from "@/lib/waveNav";

function App() {
  return (
    <div className="App text-white">
      <BrowserRouter>
        <OrderProvider>
          {/* Inside the router — it navigates — and wrapping the routes, since
              it holds the route change back until the wave has covered. */}
          <WaveNavProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/success/:orderId" element={<Success />} />
              {/* Old section URLs (/water, /masala, /chai) and anything else
                  land on the single page. */}
              <Route path="*" element={<Landing />} />
            </Routes>
            <OrderModal />
            {/* After the modal, so the wave draws above everything. */}
            <SectionTransition />
          </WaveNavProvider>
        </OrderProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
