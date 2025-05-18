
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const DashboardPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll(".pulse-animation");
        const randomIndex = Math.floor(Math.random() * elements.length);
        
        elements.forEach((el, i) => {
          if (i === randomIndex) {
            el.classList.add("animate-pulse");
            setTimeout(() => {
              el.classList.remove("animate-pulse");
            }, 2000);
          }
        });
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      className="w-full h-full rounded-lg overflow-hidden glass lilac-glow relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Dashboard Nav */}
      <div className="h-12 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
          <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
        </div>
        <div className="ml-4 text-xs text-white/50">JobWise Dashboard</div>
      </div>
      
      {/* Dashboard Content */}
      <div className="p-4 bg-black/20">
        <div className="grid grid-cols-12 gap-4 h-full">
          {/* Left Sidebar */}
          <div className="col-span-3 bg-charcoal/60 backdrop-blur-lg rounded-lg border border-white/5 p-3 h-[240px]">
            <div className="w-3/4 h-6 bg-lilac/10 rounded mb-3 pulse-animation"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="flex items-center space-x-2 pulse-animation"
                >
                  <div className="w-4 h-4 rounded-full bg-lilac/20"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-9 space-y-4">
            {/* Top Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="bg-charcoal/60 backdrop-blur-lg rounded-lg border border-white/5 p-3 pulse-animation"
                >
                  <div className="h-4 w-1/2 bg-lilac/20 rounded mb-2"></div>
                  <div className="h-6 w-1/3 bg-lilac/30 rounded"></div>
                </div>
              ))}
            </div>
            
            {/* Main Chart */}
            <div className="bg-charcoal/60 backdrop-blur-lg rounded-lg border border-white/5 p-4 h-[140px] flex items-end justify-between pulse-animation">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-6 bg-gradient-to-t from-lilac/70 to-lilac/20 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${20 + Math.random() * 80}%` }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 10 + Math.random() * 5
                  }}
                ></motion.div>
              ))}
            </div>
            
            {/* Bottom Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-charcoal/60 backdrop-blur-lg rounded-lg border border-white/5 p-3 flex items-center pulse-animation">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-lilac/30 to-transparent flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-lilac/20 flex items-center justify-center">
                    <motion.div 
                      className="text-xs font-bold"
                      animate={{ 
                        color: ['#B9A6FF', '#9A84FF', '#B9A6FF'],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      76%
                    </motion.div>
                  </div>
                </div>
                <div className="ml-3 space-y-2">
                  <div className="h-4 w-20 bg-white/20 rounded"></div>
                  <div className="h-3 w-16 bg-white/10 rounded"></div>
                </div>
              </div>
              <div className="bg-charcoal/60 backdrop-blur-lg rounded-lg border border-white/5 p-3 pulse-animation">
                <div className="h-4 w-1/3 bg-white/20 rounded mb-2"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-3 bg-white/10 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Animated Elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-20 h-20 rounded-full bg-lilac/5"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-16 h-16 rounded-full bg-lilac/5"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Abstract animated decoration elements */}
      <motion.div 
        className="absolute top-[15%] left-[10%] w-24 h-1.5 rounded-full opacity-30"
        style={{ background: "linear-gradient(90deg, transparent, #B9A6FF, transparent)" }}
        animate={{ 
          x: [-10, 20, -10],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-[20%] right-[15%] w-1.5 h-24 rounded-full opacity-30"
        style={{ background: "linear-gradient(180deg, transparent, #9A84FF, transparent)" }}
        animate={{ 
          y: [-10, 20, -10],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* Floating data visualization elements */}
      <motion.div
        className="absolute top-[40%] right-[35%] h-12 w-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-md border border-lilac/30 rotate-45"></div>
          <div className="absolute inset-2 rounded-md border border-lilac/20 rotate-[30deg]"></div>
          <div className="absolute inset-4 rounded-md border border-lilac/10 rotate-[15deg]"></div>
        </div>
      </motion.div>
      
      {/* Cursor animation */}
      <motion.div
        className="absolute w-3 h-3 bg-white rounded-full shadow-lg shadow-lilac/20 z-10"
        initial={{ x: "70%", y: "30%" }}
        animate={{ 
          x: ["70%", "40%", "60%", "50%", "70%"], 
          y: ["30%", "50%", "60%", "40%", "30%"]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Additional UI feedback glows */}
      <motion.div 
        className="absolute w-20 h-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(185,166,255,0.2) 0%, rgba(185,166,255,0) 70%)",
          left: "60%",
          top: "70%"
        }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.div>
  );
};

export default DashboardPreview;
