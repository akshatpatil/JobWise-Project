
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-charcoal px-6">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-lilac/10 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-lilac/10 rounded-full filter blur-[100px]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-10 max-w-md w-full text-center"
      >
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-lilac/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-lilac/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-4 glass rounded-full flex items-center justify-center">
            <h1 className="text-4xl font-clash font-bold text-gradient">404</h1>
          </div>
        </div>
        
        <h2 className="text-2xl font-space font-medium mb-2">Page Not Found</h2>
        <p className="text-white/70 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button className="bg-gradient-lilac hover:opacity-90 transition-opacity text-charcoal">
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
