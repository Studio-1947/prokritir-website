import React from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useOrder } from "@/lib/orderContext";
import { Leaf, Award, Compass, ShieldCheck } from "lucide-react";

const Masala = () => {
  const { open } = useOrder();

  const handleOrderClick = (sku = null) => {
    open(sku, "masala");
  };

  const spiceProducts = [
    {
      sku: "PM-TRIO",
      name: "Essential Trio Combo",
      desc: "Turmeric + Chili + Cumin (100g each)",
      price: 199,
      img: "https://images.unsplash.com/photo-1596790011462-840c6b1f2351?auto=compress&cs=tinysrgb&w=500&q=80"
    },
    {
      sku: "PM-TURM-250",
      name: "Pure Turmeric Powder (হলুদ)",
      desc: "High curcumin content, slow-ground",
      price: 75,
      img: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=compress&cs=tinysrgb&w=500&q=80"
    },
    {
      sku: "PM-CHILI-250",
      name: "Spicy Red Chili Powder (লঙ্কা)",
      desc: "Bright red color and bold pungency",
      price: 95,
      img: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=compress&cs=tinysrgb&w=500&q=80"
    },
    {
      sku: "PM-CUMIN-250",
      name: "Roasted Cumin Powder (জিরে)",
      desc: "Rich earthy aroma, traditional recipe",
      price: 120,
      img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=compress&cs=tinysrgb&w=500&q=80"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#140b05] text-amber-50/90 font-sans selection:bg-amber-600 selection:text-white overflow-x-hidden">
      <Nav />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Warm Golden Gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-[1300px] px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md w-fit mx-auto lg:mx-0"
            >
              <Leaf className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-amber-400">100% Organic & Pure</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[44px] leading-[1.1] sm:text-6xl md:text-7xl font-bold tracking-tight text-amber-100"
            >
              <span className="font-bn text-3xl sm:text-4xl text-amber-400 font-medium block mb-2">প্রকৃতির মশলা</span>
              Rich Spices,<br />Ground with Reverence.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-amber-200/60 max-w-xl leading-relaxed"
            >
              Grown in the fertile delta soil of Bengal, our organic spices are slow-ground at low temperatures to preserve their natural oils, bold colors, and authentic flavor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => handleOrderClick()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-[14px] hover:from-amber-400 hover:to-amber-500 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/10"
              >
                Explore Spices Catalog
              </button>
              <a
                href="#process"
                className="px-6 py-4 rounded-full border border-amber-500/30 hover:border-amber-400 text-amber-200 text-[14px] transition-colors"
              >
                Our Traditional Process
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#140b05] via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1596790011462-840c6b1f2351?auto=compress&cs=tinysrgb&w=800&q=80"
                alt="Prokritir Masala spices"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="text-[10px] tracking-[0.25em] uppercase text-amber-400 font-bold mb-1">Featured</div>
                <div className="font-display text-xl text-amber-100">Essential Trio Spices Combo</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Traditional Process Section */}
      <section id="process" className="py-24 border-t border-amber-950 bg-black/20">
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-amber-100">Crafting Purity in Bengal</h2>
            <p className="text-amber-200/50 mt-4">Why Prokritir Masala brings the rich authentic taste back to your kitchen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-amber-950 bg-[#1e1008]/40 hover:border-amber-900/60 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                <Compass className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-amber-200 mb-3">Sourced Direct</h3>
              <p className="text-sm text-amber-200/50 leading-relaxed">
                We work closely with small-holder organic farmers in Nadia and adjoining districts of Bengal, ensuring fair wages and direct-to-mill sourcing.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-amber-950 bg-[#1e1008]/40 hover:border-amber-900/60 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-amber-200 mb-3">Slow-Ground Cold Process</h3>
              <p className="text-sm text-amber-200/50 leading-relaxed">
                Commercial mills burn out natural spice oils due to heavy machine friction. Our grinding process is slow and temperature-controlled to preserve natural oils.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-amber-950 bg-[#1e1008]/40 hover:border-amber-900/60 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-amber-200 mb-3">No Contaminants</h3>
              <p className="text-sm text-amber-200/50 leading-relaxed">
                We run batch-wise quality tests. Our spices have absolutely zero artificial colors, synthetic fragrances, potato starch, or chemical preservatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spice Catalogue Section */}
      <section className="py-24 border-t border-amber-950">
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-400 mb-2">Our Offerings</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-amber-100">Select & Order Your Spices</h2>
            <p className="text-amber-200/50 mt-4">Free courier delivery inside West Bengal for orders above ₹300.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spiceProducts.map((p) => (
              <div
                key={p.sku}
                className="group rounded-2xl border border-amber-950 bg-[#190d05] overflow-hidden flex flex-col justify-between hover:border-amber-500/20 transition-all hover:translate-y-[-4px]"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden relative border-b border-amber-950">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-medium text-amber-100 mb-1">{p.name}</h3>
                    <p className="text-xs text-amber-200/40 line-clamp-2 leading-relaxed">{p.desc}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between mt-4">
                  <div className="text-xl font-bold text-amber-200">₹{p.price}</div>
                  <button
                    onClick={() => handleOrderClick(p.sku)}
                    className="px-4 py-2 text-xs rounded-full bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Masala;
