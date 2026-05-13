import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const heroSlides = [
    {
      id: 1,
      bg: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=2000",
      logoTop: "hustlr",
      logoBottom: "MELLER",
      title: "DO MORE, BE MORE.",
      subtitle: "CONTEMPORARY. GENUINE. CREATIVE.",
      extra: "As seen on Shark Tank India",
      buttonText: "Shop Now",
      link: "/products"
    },
    {
      id: 2,
      bg: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000",
      logoTop: "",
      logoBottom: "MAXVISION STORES",
      title: "EXPERIENCE LUXURY IN-STORE",
      subtitle: "Find your nearest store today.",
      extra: "Over 2500+ locations",
      buttonText: "Shop Now",
      link: "/stores"
    },
    {
      id: 3,
      bg: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=2000",
      logoTop: "PREMIUM",
      logoBottom: "EYEWEAR",
      title: "CRAFTED FOR PERFECTION",
      subtitle: "Try frames at home or in-store.",
      extra: "Free Eye Checkup Included",
      buttonText: "Shop Now",
      link: "/products"
    },
    {
      id: 4,
      bg: "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=2000",
      logoTop: "hustlr",
      logoBottom: "Z",
      title: "Bolder. Brighter. Unfiltered.",
      subtitle: "The New Collection is out now.",
      extra: "",
      buttonText: "Shop Now",
      link: "/products"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="bg-white text-gray-800 min-h-screen pb-16">
      
      {/* 1. Hero Auto-Sliding Banner */}
      <section className="w-full relative h-[70vh] bg-[#111] overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={heroSlides[currentSlide].bg} 
              alt="slide bg" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full text-center text-white px-4 flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-baseline justify-center mb-4">
                {heroSlides[currentSlide].logoTop && <span className="text-4xl md:text-6xl font-light tracking-tight lowercase mr-2 text-gray-100">{heroSlides[currentSlide].logoTop}</span>}
                {heroSlides[currentSlide].logoBottom && <span className="text-5xl md:text-7xl font-black uppercase tracking-widest text-white">{heroSlides[currentSlide].logoBottom}</span>}
              </div>
              <h2 className="text-3xl md:text-6xl font-black mb-3 uppercase tracking-tighter drop-shadow-xl text-white">
                {heroSlides[currentSlide].title}
              </h2>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 uppercase text-white drop-shadow-md">
                {heroSlides[currentSlide].subtitle}
              </h3>
              {heroSlides[currentSlide].extra && (
                <p className="text-lg md:text-xl font-light mb-10 tracking-wide text-white">
                  {heroSlides[currentSlide].extra}
                </p>
              )}
              <Link to={heroSlides[currentSlide].link} className="bg-white text-black hover:bg-gray-200 px-12 py-3 rounded-full text-lg font-bold transition-all inline-block shadow-md">
                {heroSlides[currentSlide].buttonText}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Top Categories */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="py-12 bg-white mt-8 mx-4 md:mx-12 rounded-2xl"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-10 tracking-tight">
            Top Categories
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8 text-center">
            {[
              { name: 'Eyeglasses', img: '/images/eyeglasses_rectangle_1778585167025.png', link: '/products?category=eyeglasses' },
              { name: 'Sunglasses', img: '/images/sunglasses_aviator_1778585307519.png', link: '/products?category=sunglasses' },
              { name: 'Special Power', img: '/images/cat_special_1778585473281.png', link: '/products?category=special' },
              { name: 'Contact Lenses', img: '/images/cat_contact_1778585441079.png', link: '/products?category=contact_lenses' },
              { name: 'Kids Glasses', img: '/images/cat_kids_1778585455862.png', link: '/products?category=kids' },
              { name: 'Sale', img: '/images/eyeglasses_cateye_1778585181224.png', link: '/products?discount=true', tag: '60% OFF' },
            ].map((cat) => (
              <Link to={cat.link} key={cat.name} className="group block">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -4 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="bg-[#f5f5f7] rounded-3xl mb-5 h-44 flex items-center justify-center relative overflow-hidden shadow-sm border border-gray-100"
                >
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity" />
                  {cat.tag && (
                    <div className="absolute bottom-3 bg-[#007aff] text-white text-[11px] font-black px-4 py-1.5 rounded-full tracking-wider uppercase">{cat.tag}</div>
                  )}
                </motion.div>
                <h3 className="text-primary group-hover:text-secondary font-black text-base md:text-lg tracking-wide transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. Find Store Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="mx-4 md:mx-16 mt-20 py-8 flex flex-col md:flex-row items-center justify-between gap-12 bg-white"
      >
        {/* Image on Left */}
        <div className="w-full md:w-1/2">
           <img 
             src="/maxvision-store.png" 
             alt="MAXVISION Store" 
             className="w-full h-auto object-contain rounded-3xl shadow-md transition-transform hover:scale-[1.01]" 
           />
        </div>
        
        {/* Text & Locator on Right */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left md:pl-16">
          <h2 className="text-3xl md:text-5xl font-black text-primary mb-10 tracking-tight leading-tight max-w-lg">
            Find your nearest MAXVISION Store – over 2500+ locations
          </h2>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-10 mb-12">
            {['Daily Market', 'Over Bridge', 'Argora', 'Harmu', 'Taxi Stand'].map(area => (
              <div key={area} className="flex flex-col items-center gap-2 cursor-pointer transition-all group">
                <div className="w-14 h-14 flex items-center justify-center text-primary/70 group-hover:text-primary bg-gray-50 rounded-full shadow-sm">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span className="text-sm font-extrabold text-gray-700 group-hover:text-primary">{area}</span>
              </div>
            ))}
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="self-center md:self-start">
            <Link 
              to="/stores" 
              className="inline-flex items-center justify-center bg-[#000042] text-white font-black py-4 px-12 rounded-xl text-lg hover:bg-black transition-all shadow-md"
            >
              Locate a Store
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-16 bg-gradient-to-r from-[#003B73] to-[#0074B7] py-16 px-4 md:px-12 relative overflow-hidden"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center relative z-10">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:w-1/2 text-left mb-8 md:mb-0"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-2 uppercase tracking-tighter text-white">FREE LENS</h2>
            <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter text-white opacity-90">REPLACEMENT</h2>
            <p className="text-xl md:text-2xl mb-10 text-white font-light leading-relaxed">Any Frame | Any Power | Any Reason.</p>
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Link to="/stores" className="bg-white text-primary font-black py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
                SECURE OFFER
              </Link>
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:w-1/2 relative"
          >
             <img src="https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=2000" alt="Free Lens" className="w-full h-auto object-cover scale-110" />
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-white mt-8 mx-4 md:mx-12"
      >
        <div className="max-w-[1600px] mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-primary mb-14 tracking-tight text-center">Get the Perfect Shape – <span className="text-secondary">Eyeglasses</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8 justify-items-center">
            {[
              { name: 'Rectangle', img: '/images/eyeglasses_rectangle_1778585167025.png' },
              { name: 'Cateye', img: '/images/eyeglasses_cateye_1778585181224.png' },
              { name: 'Aviator', img: '/images/eyeglasses_aviator_1778585200650.png' },
              { name: 'Geometric', img: '/images/eyeglasses_geometric_1778585220940.png' },
              { name: 'Round', img: '/images/eyeglasses_round_1778585243803.png' },
              { name: 'Clubmaster', img: '/images/eyeglasses_clubmaster_1778585256926.png' },
              { name: 'Square', img: '/images/eyeglasses_square_1778585274768.png' },
            ].map((shape) => (
              <Link to={`/products?shape=${shape.name.toLowerCase()}`} key={shape.name} className="group flex flex-col items-center w-full">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-50 flex items-center justify-center mb-6 overflow-hidden border border-gray-100 shadow-sm"
                >
                  <img src={shape.img} alt={shape.name} className="w-[100%] h-[100%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </motion.div>
                <h3 className="text-primary font-black group-hover:text-secondary text-2xl md:text-3xl transition-colors text-center">{shape.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="py-16 bg-white mt-8 mx-4 md:mx-12 border-t border-gray-50"
      >
        <div className="max-w-[1600px] mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-primary mb-14 tracking-tight text-center">Get the Perfect Shape – <span className="text-secondary">Sunglasses</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8 justify-items-center">
            {[
              { name: 'Aviator', img: '/images/sunglasses_aviator_1778585307519.png' },
              { name: 'Round', img: '/images/sunglasses_round_1778585321001.png' },
              { name: 'Rectangle', img: '/images/sunglasses_rectangle_1778585337465.png' },
              { name: 'Cat Eye', img: '/images/sunglasses_cateye_1778585356948.png' },
              { name: 'Geometric', img: '/images/sunglasses_geometric_1778585376931.png' },
              { name: 'Clubmaster', img: '/images/sunglasses_clubmaster_1778585391348.png' },
              { name: 'Square', img: '/images/sunglasses_square_1778585405954.png' },
            ].map((shape) => (
              <Link to={`/products?shape=${shape.name.toLowerCase()}&category=sunglasses`} key={shape.name} className="group flex flex-col items-center w-full">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-50 flex items-center justify-center mb-6 overflow-hidden border border-gray-100 shadow-sm"
                >
                  <img src={shape.img} alt={shape.name} className="w-[100%] h-[100%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                </motion.div>
                <h3 className="text-primary font-black group-hover:text-secondary text-2xl md:text-3xl transition-colors text-center">{shape.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 6. Get a FREE Eye Check Up */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-white mt-12 mx-4 md:mx-12 rounded-2xl"
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-black text-primary tracking-tight">Premium Eye Care Services</h2>
            <div className="hidden md:block h-px flex-1 mx-8 bg-gray-100"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer transition-all shadow-sm hover:shadow-lg"
            >
              <div className="relative h-72 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800" alt="Store Visit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-primary text-2xl md:text-3xl mb-2">Visit Store</h3>
                  <p className="text-gray-500 text-base md:text-lg font-bold">VIP in-person assessment</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer transition-all shadow-sm hover:shadow-lg"
            >
              <div className="relative h-72 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800" alt="Home Visit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-primary text-2xl md:text-3xl mb-2">Home Visit</h3>
                  <p className="text-gray-500 text-base md:text-lg font-bold">We bring the suite to you</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer transition-all shadow-sm hover:shadow-lg"
            >
              <div className="relative h-72 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" alt="Online Test" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-primary text-2xl md:text-3xl mb-2">Online Test</h3>
                  <p className="text-gray-500 text-base md:text-lg font-bold">AI-Assisted screening</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* Floating WhatsApp Button (Optional as seen in screenshots) */}
      <a href="#" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.082 21.583c-1.632 0-3.136-.43-4.425-1.162l-5.32 1.397 1.423-5.185c-.81-1.332-1.275-2.894-1.275-4.557 0-4.962 4.038-9 9-9s9 4.038 9 9-4.038 9-9 9z"/></svg>
      </a>
    </div>
  );
};

export default Home;
