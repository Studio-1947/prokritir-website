import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Success from "@/pages/Success";
import Journal from "@/pages/Journal";
import OrderModal from "@/components/OrderModal";
import ScrollManager from "@/components/ScrollManager";
import SiteBackground from "@/components/SiteBackground";
import SmoothScroll from "@/components/SmoothScroll";
import { OrderProvider } from "@/lib/orderContext";

function App() {
  return (
    <SmoothScroll>
      <div className="App relative">
        {/* Background for every route, beneath all page content. */}
        <SiteBackground />
        <BrowserRouter>
          <OrderProvider>
            {/* Route changes start at the top; a /#section link finishes its
                scroll once the landing page has mounted. */}
            <ScrollManager />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/success/:orderId" element={<Success />} />
              {/* Old section URLs and anything else land on the single page. */}
              <Route path="*" element={<Landing />} />
            </Routes>
            <OrderModal />
          </OrderProvider>
        </BrowserRouter>
      </div>
    </SmoothScroll>
  );
}

export default App;
