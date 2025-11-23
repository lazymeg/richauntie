
import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-illustration-cream">
      {/* Decorative Blobs */}
      <div className="absolute -top-[10%] -right-[10%] w-[70vh] h-[70vh] rounded-full bg-illustration-salmon/10 blur-3xl animate-float"></div>
      <div className="absolute top-[30%] -left-[10%] w-[60vh] h-[60vh] rounded-full bg-illustration-sage/10 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute -bottom-[20%] right-[20%] w-[50vh] h-[50vh] rounded-full bg-illustration-navy/5 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Texture overlay (noise) */}
      <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")` }}></div>
    </div>
  );
};

export default Background;
