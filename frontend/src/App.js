import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Success from "@/pages/Success";
import Journal from "@/pages/Journal";
import OrderModal from "@/components/OrderModal";
import Preloader from "@/components/Preloader";
import ScrollManager from "@/components/ScrollManager";
import SiteBackground from "@/components/SiteBackground";
import SmoothScroll from "@/components/SmoothScroll";
import { OrderProvider } from "@/lib/orderContext";
import { ReadyProvider } from "@/lib/readyContext";

function App() {
  return (
    <SmoothScroll>
      <div className="App relative">
        {/* Background for every route, beneath all page content. */}
        <SiteBackground />
        <BrowserRouter>
          <ReadyProvider>
          <OrderProvider>
            {/* Route changes start at the top; a /#section link finishes its
                scroll once the landing page has mounted. */}
            <ScrollManager />
            {/* Covers the page until the hero's 3D bottle has its assets. */}
            <Preloader />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/success/:orderId" element={<Success />} />
              {/* Old section URLs and anything else land on the single page. */}
              <Route path="*" element={<Landing />} />
            </Routes>
            <OrderModal />
          </OrderProvider>
          </ReadyProvider>
        </BrowserRouter>
      </div>
    </SmoothScroll>
  );
}

export default App;
