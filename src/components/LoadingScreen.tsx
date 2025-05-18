
import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-charcoal flex flex-col items-center justify-center z-50">
      <div className="mb-8">
        <h1 className="text-4xl md:text-6xl font-clash font-bold text-gradient">
          JobWise
        </h1>
        <p className="text-sm md:text-base text-lilac/70 mt-2 font-spaceMono tracking-wide">
          Intelligence meets design
        </p>
      </div>
      
      <div className="relative w-64 h-1 bg-secondary rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-lilac animate-gradient-flow bg-[length:200%_auto]"
          style={{ width: `${progress}%`, transition: 'width 0.2s ease' }}
        ></div>
      </div>
      
      <p className="mt-4 text-sm text-lilac/50 font-spaceMono">
        {progress < 100 ? 'Loading experience...' : 'Ready'}
      </p>
    </div>
  );
};

export default LoadingScreen;
