
import React, { useEffect, useState } from 'react';
import { APP_NAME } from '../constants';

interface RitualScreenProps {
  onComplete: () => void;
  imageSrc: string;
}

const RitualScreen: React.FC<RitualScreenProps> = ({ onComplete, imageSrc }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Show for 3 seconds, then fade out
    const timer = setTimeout(() => {
      setFadingOut(true);
      // Wait for fade out animation to finish before calling onComplete
      setTimeout(onComplete, 800); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-illustration-cream transition-opacity duration-1000 ${fadingOut ? 'opacity-0' : 'opacity-100'}`}>
      
      <div className="relative animate-breathe">
         {/* Glow Effect - Behind image */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-illustration-salmon/20 rounded-full blur-3xl -z-10"></div>
         
         {/* Main Image */}
         <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[8px] border-white shadow-2xl overflow-hidden relative z-10">
            <img 
              src={imageSrc} 
              alt="Rich Lady Ritual" 
              className="w-full h-full object-cover"
            />
         </div>
      </div>

      <div className="mt-12 text-center animate-pulse">
        <h2 className="text-2xl font-bold text-illustration-navy tracking-widest mb-2">{APP_NAME}</h2>
        <p className="text-illustration-salmon text-sm tracking-[0.2em]">正在整理情緒價值...</p>
      </div>
    </div>
  );
};

export default RitualScreen;
