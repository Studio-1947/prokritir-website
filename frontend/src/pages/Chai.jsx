import React from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useOrder } from "@/lib/orderContext";
import { Leaf, Award, Sun, ShieldCheck } from "lucide-react";

const Chai = () => {
  const { open } = useOrder();

  const handleOrderClick = (sku = null) => {
    open(sku, "chai");
  };

  const teaProducts = [
    {
      sku: "PC-CTC-250",
      name: "Premium Assam CTC Chai",
      desc: "Bold taste, deep golden color, perfect for milk tea",
      price: 110,
      img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=compress&cs=tinysrgb&w=500&q=80"
    },
    {
      sku: "PC-ORTH-250",
      name: "Darjeeling Orthodox Leaf",
      desc: "Delicate musk flavor, floral aroma, hand-plucked",
      price: 240,
      img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=compress&cs=tinysrgb&w=500&q=80"
    },
    {
      sku: "PC-MASALA-250",
      name: "Spiced Masala Chai",
      desc: "Infused with organic cardamom, cinnamon, and dry ginger",
      price: 165,
      img: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=compress&cs=tinysrgb&w=500&q=80"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#07130c] text-emerald-50/90 font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      <Nav />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Deep Emerald Gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-teal-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-[1300px] px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md w-fit mx-auto lg:mx-0"
            >
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-emerald-400">Pure Himalayan Origin</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-[44px] leading-[1.1] sm:text-6xl md:text-7xl font-bold tracking-tight text-emerald-100"
            >
              <span className="font-bn text-3xl sm:text-4xl text-emerald-400 font-medium block mb-2">প্রকৃতির চা</span>
              Hand-Plucked Leaf,<br />Crafted Blend.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-emerald-200/60 max-w-xl leading-relaxed"
            >
              Plucked at dawn from the mist-covered valleys of Darjeeling and Assam, our tea is hand-sorted and roasted to deliver a clean, aromatic, and deeply restorative liquor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => handleOrderClick()}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-semibold text-[14px] hover:from-emerald-400 hover:to-emerald-500 transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/10"
              >
                Explore Tea Blends
              </button>
              <a
                href="#gardens"
                className="px-6 py-4 rounded-full border border-emerald-500/30 hover:border-emerald-400 text-emerald-200 text-[14px] transition-colors"
              >
                Our Tea Estates
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border border-emerald-500/20 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#07130c] via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=compress&cs=tinysrgb&w=800&q=80"
                alt="Prokritir Chai tea leaves"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="text-[10px] tracking-[0.25em] uppercase text-emerald-400 font-bold mb-1">Estate Blend</div>
                <div className="font-display text-xl text-emerald-100">Premium Darjeeling Orthodox</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Traditional Process Section */}
      <section id="gardens" className="py-24 border-t border-emerald-950 bg-black/20">
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-100">Grown by the Himalayan Mist</h2>
            <p className="text-emerald-200/50 mt-4">Pure, orthodox leaf and robust CTC teas crafted with environmental care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-emerald-950 bg-[#0c1e13]/40 hover:border-emerald-900/60 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Sun className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-emerald-200 mb-3">High Altitude Estates</h3>
              <p className="text-sm text-emerald-200/50 leading-relaxed">
                Plucked from premium heritage estates in Darjeeling and the foothills of Dooars, where cool mountain air naturally slows leaf growth to concentrate flavor.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-emerald-950 bg-[#0c1e13]/40 hover:border-emerald-900/60 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-emerald-200 mb-3">Orthodox Processing</h3>
              <p className="text-sm text-emerald-200/50 leading-relaxed">
                Our premium Darjeeling selection is rolled and processed using orthodox methods, keeping the whole leaf intact to deliver the ultimate aromatic tea experience.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-emerald-950 bg-[#0c1e13]/40 hover:border-emerald-900/60 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-emerald-200 mb-3">Chemical Free</h3>
              <p className="text-sm text-emerald-200/50 leading-relaxed">
                Absolutely no synthetic flavors, dust fillers, or color coatings. Just pure, clean tea leaves processed to the highest safety and nutritional standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tea Catalogue Section */}
      <section className="py-24 border-t border-emerald-950">
        <div className="mx-auto max-w-[1300px] px-6 md:px-12">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-emerald-400 mb-2">Our Selection</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-emerald-100">Select & Order Your Blends</h2>
            <p className="text-emerald-200/50 mt-4">Free courier delivery inside West Bengal for orders above ₹300.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {teaProducts.map((p) => (
              <div
                key={p.sku}
                className="group rounded-2xl border border-emerald-950 bg-[#09170e] overflow-hidden flex flex-col justify-between hover:border-emerald-500/20 transition-all hover:translate-y-[-4px]"
              >
                <div>
                  <div className="aspect-[4/3] w-full overflow-hidden relative border-b border-emerald-950">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-medium text-emerald-100 mb-1">{p.name}</h3>
                    <p className="text-xs text-emerald-200/40 line-clamp-2 leading-relaxed">{p.desc}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between mt-4">
                  <div className="text-xl font-bold text-emerald-200">₹{p.price}</div>
                  <button
                    onClick={() => handleOrderClick(p.sku)}
                    className="px-4 py-2 text-xs rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors"
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

export default Chai;
