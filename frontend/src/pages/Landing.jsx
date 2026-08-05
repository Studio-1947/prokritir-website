import React from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Source from "@/components/sections/Source";
import Process from "@/components/sections/Process";
import Bento from "@/components/sections/Bento";
import Bottles from "@/components/sections/Bottles";
import Impact from "@/components/sections/Impact";
import Voices from "@/components/sections/Voices";
import Faq from "@/components/sections/Faq";
import CtaBand from "@/components/sections/CtaBand";

/**
 * Single-page composition. Each section owns its own background treatment;
 * the page itself is just the ink base they sit on.
 */
const Landing = () => (
  <div className="relative z-10">
    <Nav />
    <main>
      <Hero />
      <Marquee />
      <Source />
      <Process />
      <Bento />
      <Bottles />
      <Impact />
      <Voices />
      <Faq />
      <CtaBand />
    </main>
    <Footer />
  </div>
);

export default Landing;
