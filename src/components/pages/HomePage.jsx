// src/components/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { NavLink } from "react-router-dom";
// Importing brand logos
import menImg from "../../assets/men.jpg";
import womenImg from "../../assets/women.jpg";
import kidsImg from "../../assets/kids.jpg";
import accessoriesImg from "../../assets/accessories.jpg";

import snapdeal from "../../assets/Snapdeal.png";
import Shopclues from "../../assets/Shopclues.png";
import FlipkartLogo from "../../assets/flipkart.png";


// Importing shopping illustration
import ShoppingIllustration from "../../assets/shopping-illustration.png";

// Importing slideshow images
import Slide1 from "../../assets/slide1.jpg";
import Slide2 from "../../assets/slide2.jpg";
import Slide3 from "../../assets/slide3.jpg";
import Slide4 from "../../assets/slide4.jpg";

const slides = [Slide1, Slide2, Slide3, Slide4];

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-change slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section with Illustration */}
      <div className="w-full max-w-6xl mx-auto mb-10 mt-10 p-6 pb-8 bg-gradient-to-r from-[#c7935a] to-[#e3b07b] rounded-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg">
      {/* Text Section */}
      <div className="flex-1 text-center right-100 md:text-left z-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4">
          One stop platform for <br /> all of your fashion needs
        </h2>
       <NavLink to="/dashboard">
  <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition">
    SHOP NOW
  </button>
</NavLink>
      </div>

      {/* Image Section */}
      <div className="flex-1 relative z-10">
        <img
          src="public\hero-cover-1.png" // Replace with your own image if needed
          alt="Fashion Model"
          className="w-full max-w-xl"
        />
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-5 right-0  h-full bg-white rounded-full z-0"></div>
      <div className="absolute top-5 right-5 w-4 h-4 bg-purple-400 rounded-full z-10"></div>
      <div className="absolute top-10 left-[60%] w-6 h-6 bg-[#d2b496] rounded-full z-10"></div>
      <div className="absolute bottom-[20%] right-10 w-4 h-4 bg-white rounded-full z-10"></div>
    </div>

      {/* Slideshow Section */}
      <section className="mt-16 px-6 mb-16">

        <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-lg">
          <img
            src={slides[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-[28rem] object-cover transition duration-700 ease-in-out"
          />

          <div className="absolute inset-0 flex justify-between items-center px-4">
            <button
              onClick={() =>
                setCurrentSlide(
                  (currentSlide - 1 + slides.length) % slides.length
                )
              }
              className="bg-white/70 hover:bg-white text-pink-500 font-bold p-2 rounded-full shadow"
            >
              &#8592;
            </button>
            <button
              onClick={() =>
                setCurrentSlide((currentSlide + 1) % slides.length)
              }
              className="bg-white/70 hover:bg-white text-pink-500 font-bold p-2 rounded-full shadow"
            >
              &#8594;
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full ${
                  currentSlide === idx ? "bg-pink-500" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 px-6 text-center bg-[#f5f0e6]">
        <h3 className="text-3xl font-semibold mb-10 text-gray-800">
          Supported Brands
        </h3>
        <div className="flex flex-wrap justify-center gap-20 items-center">
          {[snapdeal, Shopclues, FlipkartLogo].map(
            (logo, idx) => (
              <div
                key={idx}
                className="w-35 h-23 bg-white rounded-xl shadow-md p-4 flex items-center justify-center hover:scale-105 transform transition"
              >
                <img
                  src={logo}
                  alt="brand-logo"
                  className="max-h-full object-contain"
                />
              </div>
            )
          )}
        </div>
      </section>
      
      <section className="py-14 px-6 bg-[#f5f5f5]">
        <h3 className="text-3xl font-semibold text-center mb-10">
          Shop by Gender & Category
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Men */}
          <div className="group cursor-pointer overflow-hidden rounded-xl shadow bg-white hover:shadow-xl transition">
            <img
              src={menImg}
              alt="Men"
              className="w-full aspect-[4/3] object-cover object-[center_50%] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4 text-center font-semibold text-gray-800">
              Men
            </div>
          </div>

          {/* Women */}
          <div className="group cursor-pointer overflow-hidden rounded-xl shadow bg-white hover:shadow-xl transition">
            <img
              src={womenImg}
              alt="Women"
              className="w-full aspect-[4/3] object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4 text-center font-semibold text-gray-800">
              Women
            </div>
          </div>

          {/* Kids */}
          <div className="group cursor-pointer overflow-hidden rounded-xl shadow bg-white hover:shadow-xl transition">
            <img
              src={kidsImg}
              alt="Kids"
              className="w-full aspect-[4/3] object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4 text-center font-semibold text-gray-800">
              Kids
            </div>
          </div>

          {/* Accessories */}
          <div className="group cursor-pointer overflow-hidden rounded-xl shadow bg-white hover:shadow-xl transition">
            <img
              src={accessoriesImg}
              alt="Accessories"
              className="w-full aspect-[4/3] object-cover object-[center_35%] group-hover:scale-105 transition-transform duration-300"
            />
            <div className="p-4 text-center font-semibold text-gray-800">
              Accessories
            </div>
          </div>
        </div>
      </section>
      <div className="px-4 py-8 md:px-16 lg:px-32">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10">
                    A revolution to your online shopping experience
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left big image */}
                    <div className="md:col-span-2">
                        <img
                            src="col-md-4.png"
                            alt="Main fashion"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>

                    {/* Right stacked images */}
                    <div className="flex flex-col gap-6">
                        <img
                            src="card-item.png"
                            alt="fashion"
                            className="w-full h-full object-cover rounded-md"
                        />
                        <img
                            src="card-item (1).png"
                            alt="fashion"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                </div>
            </div>
    </div>
  );
};

export default HomePage;
