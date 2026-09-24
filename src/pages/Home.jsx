import React from "react";
import Hero from "@/components/sections/Hero";
import FeaturedDestinations from "@/components/sections/FeaturedDestinations";
import PopularHotels from "@/components/sections/PopularHotels";
import LastMinuteDeals from "@/components/sections/LastMinuteDeals";
import WhyBookWithUs from "@/components/sections/WhyBookWithUs";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <div id="search" />
      <Hero />
      <FeaturedDestinations />
      <PopularHotels />
      <LastMinuteDeals />
      <div id="why" />
      <WhyBookWithUs />
      <Testimonials />
      <Contact />
    </>
  );
}