import React, { useState } from 'react';

const AboutUs = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="bg-white text-[#3b2e2a] px-4 sm:px-6 md:px-20 py-10 sm:py-16 font-sans">
      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center uppercase tracking-tight">
          About Us
        </h1>

        {/* What We Offer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-[#f7eee3] p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">What We Offer</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              The internet’s a maze of flashy deals and boring designs—we fix that. Our platform curates the freshest finds
              across <span className="font-semibold">Snapdeal</span>, <span className="font-semibold">Flipkart</span>,
              <span className="font-semibold"> ShopClues</span> and more — all in one sleek, scroll-worthy space.
              No ads. No clutter. Just the good stuff.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              If it’s trending, minimal, or just plain iconic—you’ll find it here before your friends do.
            </p>
          </div>
          <div className="h-64 sm:h-72 bg-[#e8ddd0] rounded-xl overflow-hidden border-4 border-[#5a4110] shadow-md">
            <img
              src="src/assets/About.png"
              alt="Product collage"
              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-[#f1e6d8] rounded-xl p-6 sm:p-8 text-center shadow-sm">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">Why Choose Us?</h3>
          <p className="text-sm sm:text-base max-w-3xl mx-auto">
            We're not a marketplace, we’re your shopping sidekick. Think: <b>Pinterest meets Amazon meets your stylish bestie. 🌟</b>
          </p>
        </div>

        {/* Why We're Different */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-[#f7e9d5] p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="h-64 sm:h-72 bg-[#e8ddd0] rounded-xl overflow-hidden border-4 border-[#5a4110] shadow-md relative">
            <img
              src="src/assets/About2.jpg"
              alt="Behind the scenes"
              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute bottom-2 left-2 text-xs text-[#a38a72] bg-white bg-opacity-80 px-2 py-1 rounded">[ Behind the scenes placeholder ]</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Why We're Different</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              We’re not trying to sell you something. We’re helping you discover what’s worth your screen time.
              Our backend runs custom scrapers powered by <strong>Puppeteer</strong> and <strong>Flask</strong>,
              so we only serve up what’s actually in stock and actually cool.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              Plus, the interface? Minimalist, aesthetic for a soothing scroll experience—just the way Gen Z likes it.
            </p>
          </div>
        </div>

        {/* Interactive Hover Panels */}
        <div className="relative h-64 sm:h-[500px] w-full bg-white overflow-hidden rounded-xl shadow-sm">
          {/* Center Logo and Tagline */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none transition-opacity duration-500 text-center px-4">
            <span className="text-xs sm:text-sm text-gray-500">Get it all here</span>
            <span className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#3b2e2a]">ShopMania</span>
          </div>

          {/* Left Expandable Panel */}
          <div
            onMouseEnter={() => setHovered('left')}
            onMouseLeave={() => setHovered(null)}
            className={`absolute top-0 left-0 h-full transition-all duration-500 ease-in-out
              ${hovered === 'left' ? 'w-full z-30' : 'w-20 z-20'}
              bg-[#f4eade] cursor-pointer flex items-center justify-center overflow-hidden`}
          >
            <img
              src="src/assets/image11.png"
              alt="Fashion"
              className={`absolute inset-0 w-full h-full z-30 object-cover transition-opacity duration-500
                ${hovered === 'left' ? 'opacity-100' : 'opacity-0'}`}
            />
            <h2 className="text-sm sm:text-xl font-bold text-[#3b2e2a] rotate-90 z-10 whitespace-nowrap">Trendy Fashion</h2>
          </div>

          {/* Right Expandable Panel */}
          <div
            onMouseEnter={() => setHovered('right')}
            onMouseLeave={() => setHovered(null)}
            className={`absolute top-0 right-0 h-full transition-all duration-500 ease-in-out
              ${hovered === 'right' ? 'w-full z-30' : 'w-20 z-20'}
              bg-[#f9f1e4] cursor-pointer flex items-center justify-center overflow-hidden`}
          >
            <img
              src="src/assets/image111.png"
              alt="Utility"
              className={`absolute inset-0 w-full z-30 h-full object-cover transition-opacity duration-500
                ${hovered === 'right' ? 'opacity-100' : 'opacity-0'}`}
            />
            <h2 className="text-sm sm:text-xl font-bold text-[#3b2e2a] rotate-90 z-10 whitespace-nowrap">Daily Utility</h2>
          </div>
        </div>

        {/* Callout Quote */}
        <div className="bg-[#f2e3cd] text-center rounded-2xl px-6 py-10 shadow-inner max-w-3xl mx-auto">
          <p className="text-lg sm:text-xl italic text-[#5c4a3a]">
            “It's not a marketplace. It’s a vibe check for your cart.”
          </p>
        </div>

        {/* Who’s Behind This */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start bg-[#f7eee3] p-6 sm:p-8 rounded-xl shadow-sm">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Who’s Behind This?</h2>
            <p className="text-sm sm:text-base leading-relaxed">
              A bunch of techies and shopaholics tired of seeing the same sponsored junk on every app. We built this as a side
              project, fueled by caffeine, chaos, and CSS.
            </p>
            <p className="text-sm sm:text-base leading-relaxed">
              We're constantly tweaking our algorithms and scraping logic to bring you the best of trending India.
            </p>
          </div>
          <div className="h-64 sm:h-72 bg-[#e8ddd0] rounded-xl overflow-hidden border-4 border-[#5a4110] shadow-md relative">
            <img
              src="src/assets/About5.jpg"
              alt="Team behind"
              className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
            />
            <span className="absolute bottom-2 left-2 text-xs text-[#a38a72] bg-white bg-opacity-80 px-2 py-1 rounded">[ Behind the scenes placeholder ]</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-6 sm:pt-10 border-t border-[#d8c7b2] text-xs sm:text-sm text-[#7c685b]">
          Built with love, scraped with bots. No affiliate spam. Just vibe-worthy finds.
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
