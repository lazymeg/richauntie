import React, { useState, useEffect } from 'react';
import { getRichLadyAdvice, analyzeImageAndGetAdvice } from '../services/geminiService';

interface RichLadyViewProps {
  topicLabel: string;
  onBack: () => void;
  uploadedImage?: string | null;
  imageSrc: string;
  userName: string;
}

const LOADING_TEXTS = [
  "阿姨正在為你準備...",
  "正在翻閱智慧存摺...",
  "讓阿姨好好看看...",
  "正在調製心靈雞湯...",
];

const RichLadyView: React.FC<RichLadyViewProps> = ({ topicLabel, onBack, uploadedImage, imageSrc, userName }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [loadingText, setLoadingText] = useState<string>(LOADING_TEXTS[0]);
  const [history, setHistory] = useState<string[]>([]);

  const fetchAdvice = async (isContinuation: boolean) => {
    setLoading(true);
    setDisplayedText(''); 
    
    let text = "";

    if (uploadedImage && !isContinuation) {
      setLoadingText("阿姨正在戴老花眼鏡看圖...");
      const mimeType = uploadedImage.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
      const base64Data = uploadedImage.replace(/^data:image\/\w+;base64,/, "");
      text = await analyzeImageAndGetAdvice(base64Data, mimeType, userName);
    } else {
      setLoadingText(LOADING_TEXTS[Math.floor(Math.random() * LOADING_TEXTS.length)]);
      // Pass history to avoid repetition
      text = await getRichLadyAdvice(topicLabel, userName, isContinuation, history);
    }

    setAdvice(text);
    // Add to history
    setHistory(prev => [...prev, text]);
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch initial advice if history is empty or if the topic changed (implicit via component remount usually)
    if (history.length === 0) {
      fetchAdvice(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicLabel, uploadedImage]);

  useEffect(() => {
    if (!loading && advice) {
      let i = 0;
      const speed = 20; // Fast typing speed (20ms)
      const timer = setInterval(() => {
        setDisplayedText(advice.slice(0, i + 1));
        i++;
        if (i > advice.length) {
          clearInterval(timer);
        }
      }, speed);
      return () => clearInterval(timer);
    }
  }, [loading, advice]);

  const handleMoreComfort = () => {
    fetchAdvice(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full max-w-4xl mx-auto animate-slide-up relative z-0">
      
      {/* Rich Lady Avatar Area */}
      <div className={`relative mb-8 transition-all duration-1000 group ${loading ? 'scale-110' : 'scale-100'}`}>
        
        {/* Glow - Explicitly placed with negative z-index to be BEHIND image */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-illustration-salmon/40 rounded-full blur-3xl -z-10 ${loading ? 'animate-breathe' : ''}`}></div>
        
        {/* Image Container - z-index 10 to sit on top of glow */}
        <div className={`relative z-10 rounded-full border-[6px] border-illustration-cream shadow-2xl overflow-hidden bg-white transition-all duration-700 ${loading ? 'w-64 h-64 md:w-80 md:h-80' : 'w-48 h-48 md:w-56 md:h-56'}`}>
          <img 
            src={imageSrc} 
            alt="Rich Lady" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Loading Status Overlay */}
        {loading && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20">
                <span className="bg-illustration-navy text-illustration-cream px-6 py-2 rounded-full shadow-lg tracking-widest text-lg border border-illustration-cream/20">
                    {loadingText}
                </span>
            </div>
        )}
      </div>

      {/* Dialog Box */}
      <div className={`bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border-2 border-illustration-navy/10 w-full max-w-2xl relative min-h-[220px] flex flex-col items-center justify-center text-center transition-opacity duration-500 ${loading ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
        
        {/* Uploaded Image Preview (Mini) inside dialog */}
        {uploadedImage && !loading && (
            <div className="mb-6 rounded-lg overflow-hidden border-4 border-illustration-cream shadow-md rotate-2 w-32 mx-auto">
                <img src={uploadedImage} alt="User Upload" className="w-full h-auto" />
            </div>
        )}

        {/* Quote Marks */}
        <div className="absolute top-6 left-8 text-6xl text-illustration-salmon/30 font-bold leading-none">“</div>
        
        <div className="relative z-10 py-4">
             {/* Typography Update: text-2xl and leading-snug for mobile */}
             <p className="text-2xl md:text-3xl font-bold text-illustration-navy leading-snug tracking-wide text-justify md:text-center">
               {displayedText}
             </p>
        </div>
        
        <div className="absolute bottom-6 right-8 text-6xl text-illustration-salmon/30 font-bold leading-none rotate-180">“</div>
      </div>

      {/* Action Buttons */}
      {!loading && (
        <div className="flex flex-col w-full max-w-md items-center animate-fade-in gap-6 mt-8">
            <div className="flex flex-row gap-4 w-full justify-center">
                <button 
                    onClick={onBack}
                    className="flex-1 bg-illustration-cream hover:bg-white text-illustration-navy border-2 border-illustration-navy/20 font-bold py-3 px-4 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-lg"
                >
                    回到主畫面
                </button>
                <button 
                    onClick={handleMoreComfort}
                    className="flex-1 bg-illustration-salmon hover:bg-illustration-salmonDark text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 border-b-4 border-red-300 text-lg"
                >
                    繼續聽阿姨說
                </button>
            </div>
            
            {/* Author Footer */}
            <div className="flex flex-col items-center gap-2">
                 <div className="flex items-center gap-2">
                    <a 
                        href="https://lazymeg.com/m/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-illustration-sage hover:text-illustration-salmon transition-colors font-bold tracking-wide border-b border-transparent hover:border-illustration-salmon"
                    >
                        Designed by meg.dai
                    </a>
                    <span className="text-illustration-sage/50">|</span>
                    <a href="https://www.instagram.com/lazy2meg/" target="_blank" rel="noopener noreferrer" className="text-illustration-sage hover:text-illustration-salmon transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RichLadyView;