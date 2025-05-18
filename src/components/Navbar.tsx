
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? 'py-3 glass' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-clash font-bold text-gradient">
            JobWise
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm text-white/80 hover:text-lilac transition-colors">
            Home
          </Link>
          <Link to="/#features" className="text-sm text-white/80 hover:text-lilac transition-colors">
            Features
          </Link>
          <Link to="/#about" className="text-sm text-white/80 hover:text-lilac transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="outline" className="glass glass-hover border-lilac/20 text-lilac hover:text-white transition-all">
              Login
            </Button>
          </Link>
          <Link to="/login" className="hidden md:block">
            <Button className="bg-gradient-lilac hover:opacity-90 transition-opacity text-charcoal">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
