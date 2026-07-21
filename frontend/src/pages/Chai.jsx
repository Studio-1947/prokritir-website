import React from "react";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useOrder } from "@/lib/orderContext";
import { Leaf } from "lucide-react";
import { PRODUCT_IMAGES } from "@/lib/brand";

// Photography for the "Grown by the Himalayan Mist" pillars.
const gardenPillars = [
  {
    title: "High Altitude Estates",
    img: "https://media.istockphoto.com/id/1483315452/photo/tea-plantations.webp?a=1&b=1&s=612x612&w=0&k=20&c=KEz540zyAvN8ZkGj9ChkdY_V2_JtCknpdgRkscRfd3M=",
    alt: "Tea bushes on a hillside estate with mist over the valley beyond",
    body: "Plucked from premium heritage estates in Darjeeling and the foothills of Dooars, where cool mountain air naturally slows leaf growth to concentrate flavor.",
  },
  {
    title: "Orthodox Processing",
    img: "https://images.unsplash.com/photo-1742967420200-3ea367a5e52f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8T3J0aG9kb3glMjBQcm9jZXNzaW5nfGVufDB8fDB8fHww",
    alt: "A worker tending a processing line at a tea factory",
    body: "Our premium Darjeeling selection is rolled and processed using orthodox methods, keeping the whole leaf intact to deliver the ultimate aromatic tea experience.",
  },
  {
    title: "Chemical Free",
    img: "https://imgs.search.brave.com/DPV23vA5P-NZrk1M5OpNyPchSWrf2FsjSKZQT9jZlbw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdw/cm94eS5kaXZlY2Ru/LmNvbS9ZZnhuQ2pi/aHYxTkJFTVJtY3VL/ZVNGc3RLX0tqclNn/a0duX3gyTllES084/L2c6Y2UvcnM6Zmls/bDoxMjAwOjY3NTox/L1ozTTZMeTlrYVha/bGMybDBaUzF6ZEc5/eVlXZGxMMlJwZG1W/cGJXRm5aUzlIWlhS/MGVVbHRZV2RsY3kw/eE5EUXdPVGM1Tnpj/MUxtcHdadz09Lndl/YnA",
    alt: "A hand pointing at a product label listing what it does not contain",
    body: "Absolutely no synthetic flavors, dust fillers, or color coatings. Just pure, clean tea leaves processed to the highest safety and nutritional standards.",
  },
];

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
      img: PRODUCT_IMAGES["PC-CTC-250"]
    },
    {
      sku: "PC-ORTH-250",
      name: "Darjeeling Orthodox Leaf",
      desc: "Delicate musk flavor, floral aroma, hand-plucked",
      price: 240,
      img: PRODUCT_IMAGES["PC-ORTH-250"]
    },
    {
      sku: "PC-MASALA-250",
      name: "Spiced Masala Chai",
      desc: "Infused with organic cardamom, cinnamon, and dry ginger",
      price: 165,
      img: PRODUCT_IMAGES["PC-MASALA-250"]
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
                src={PRODUCT_IMAGES["PC-ORTH-250"]}
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
            {gardenPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative aspect-[4/5] rounded-2xl border border-emerald-950 hover:border-emerald-900/60 transition-colors overflow-hidden"
              >
                <img
                  src={pillar.img}
                  alt={pillar.alt}
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                />
                {/* Scrim: opaque under the copy, clearing toward the top so the
                    photograph still reads. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <h3 className="text-lg font-medium text-emerald-100 mb-2 drop-shadow">{pillar.title}</h3>
                  <p className="text-sm text-emerald-100/75 leading-relaxed drop-shadow">{pillar.body}</p>
                </div>
              </div>
            ))}
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
