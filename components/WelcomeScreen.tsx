
import React, { useState } from 'react';
import { APP_NAME, DEFAULT_NICKNAME } from '../constants';

interface WelcomeScreenProps {
  onConfirm: (name: string) => void;
  imageSrc: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onConfirm, imageSrc }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(name.trim() || DEFAULT_NICKNAME);
  };

  const handleSkip = () => {
    onConfirm(DEFAULT_NICKNAME);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-illustration-cream p-6 animate-fade-in overflow-hidden">
       {/* Background Logo View - Blurs when modal is open */}
       <div className={`transition-all duration-700 flex flex-col items-center w-full max-w-md ${showModal ? 'blur-sm scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
          
          {/* Logo / Avatar */}
          <div className="w-56 h-56 md:w-72 md:h-72 rounded-full border-[8px] border-white shadow-2xl overflow-hidden mb-8 relative bg-white animate-float">
             <img src={imageSrc} alt="Logo" className="w-full h-full object-cover" />
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black text-illustration-navy mb-4 tracking-wider text-center">{APP_NAME}</h1>
          <p className="text-illustration-salmon text-sm tracking-[0.3em] mb-12 font-bold">正在整理情緒價值...</p>
          
          {/* Main Action Button */}
          <button 
             onClick={() => setShowModal(true)}
             className="bg-white border-2 border-illustration-navy text-illustration-navy hover:bg-illustration-navy hover:text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition-all active:scale-95 tracking-widest"
          >
             準備躺平
          </button>
       </div>

       {/* Pop-out Modal Overlay */}
       {showModal && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-illustration-navy/10 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-[2rem] p-8 shadow-2xl w-full max-w-md border-4 border-illustration-cream relative animate-slide-up">
                
                {/* Close Button */}
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-6 text-illustration-sage hover:text-illustration-navy text-2xl font-bold transition-colors"
                >
                  ×
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-illustration-navy mb-2">阿姨想認識你</h2>
                    <p className="text-illustration-navyLight opacity-60 text-sm">告訴阿姨怎麼稱呼？</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="你的名字..."
                    className="w-full bg-illustration-cream border-2 border-illustration-navy/10 rounded-xl px-4 py-4 text-xl text-center text-illustration-navy focus:outline-none focus:border-illustration-salmon transition-colors font-bold placeholder:font-normal placeholder:text-gray-300"
                    autoFocus
                  />
                  
                  <button
                    type="submit"
                    className="w-full bg-illustration-navy hover:bg-illustration-navyLight text-white font-bold py-3 rounded-xl shadow-md transform transition active:scale-[0.98] mt-2"
                  >
                    告訴阿姨
                  </button>
                  
                   <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full text-illustration-sage hover:text-illustration-salmon font-medium py-2 text-xs text-center transition-colors"
                  >
                    保持神秘 (略過，叫我{DEFAULT_NICKNAME})
                  </button>
                </form>
            </div>
         </div>
       )}
    </div>
  );
}

export default WelcomeScreen;
