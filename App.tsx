
import React, { useState, useEffect } from 'react';
import { AppState, TOPICS, Topic } from './types';
import Background from './components/Background';
import RitualScreen from './components/RitualScreen';
import WelcomeScreen from './components/WelcomeScreen';
import { APP_NAME, DEFAULT_NICKNAME, MONTHLY_THEMES } from './constants';
import { getRichLadyAdvice } from './services/geminiService';

const LOADING_TEXTS = [
  "阿姨正在為你準備...",
  "正在翻閱智慧存摺...",
  "讓阿姨好好看看...",
  "正在調製心靈雞湯...",
  "阿姨正在戴老花眼鏡...",
  "等一下，阿姨喝口茶...",
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppState>(AppState.WELCOME);
  const [greeting, setGreeting] = useState<string>('');
  const [bubbleText, setBubbleText] = useState<string>('');
  const [userName, setUserName] = useState<string>(DEFAULT_NICKNAME);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  
  const [currentTheme] = useState(() => {
    const currentMonth = new Date().getMonth() + 1;
    const theme = MONTHLY_THEMES.find(t => t.month === currentMonth);
    return theme || MONTHLY_THEMES[0];
  });

  useEffect(() => {
    if (currentView === AppState.SELECTION) {
      const personalGreeting = currentTheme.greeting.replace('小寶', userName);
      setGreeting(personalGreeting);
      if (!bubbleText) {
        setBubbleText(personalGreeting);
      }
    }
  }, [currentView, userName, currentTheme, bubbleText]);

  const handleNameConfirm = (name: string) => {
    setUserName(name);
    setCurrentView(AppState.LANDING);
  };

  const handleRitualComplete = () => {
    setCurrentView(AppState.SELECTION);
  };

  const handleTopicSelect = async (topic: Topic) => {
    setIsLoading(true);
    const randomLoading = LOADING_TEXTS[Math.floor(Math.random() * LOADING_TEXTS.length)];
    setBubbleText(randomLoading);

    // Fetch advice
    const text = await getRichLadyAdvice(topic.label, userName, false, history);
    
    setBubbleText(text);
    setHistory(prev => [...prev, text]);
    setIsLoading(false);
  };

  return (
    <div className="relative h-[100dvh] w-full flex flex-col font-sans overflow-hidden bg-white">
      <Background />

      <div className="flex-1 w-full h-full overflow-hidden relative z-10 flex flex-col">
        {currentView === AppState.WELCOME && (
          <WelcomeScreen 
            imageSrc={currentTheme.image} 
            onConfirm={handleNameConfirm} 
          />
        )}

        {currentView === AppState.LANDING && (
          <RitualScreen 
            imageSrc={currentTheme.image}
            onComplete={handleRitualComplete} 
          />
        )}

        {currentView === AppState.SELECTION && (
          <div className="flex flex-col h-full w-full relative">
            
            {/* TOP SECTION: Image & Bubble */}
            {/* Height set to 80% */}
            <div className="relative w-full h-[80%] shrink-0 overflow-hidden">
               <img 
                  src={currentTheme.image}
                  alt="Rich Lady Theme" 
                  className="w-full h-full object-cover select-none pointer-events-none"
               />
               
               {/* GRADIENT REMOVED per user request */}

               {/* Greeting Bubble - Centered */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 p-6 pb-16">
                 <div className={`
                    bg-white/95 backdrop-blur-md px-6 py-8 rounded-3xl shadow-2xl border border-white/60 
                    w-full max-w-xs md:max-w-sm relative transition-all duration-300 ease-out pointer-events-auto
                    flex flex-col
                    ${isLoading ? 'animate-pulse' : ''}
                 `}>
                    
                    {/* Decorative quote marks */}
                    <span className="absolute -top-4 left-4 text-5xl text-illustration-salmon/20 font-serif leading-none select-none">“</span>

                    {/* Text Container */}
                    {/* Fixed clipping issue: Removed 'flex items-center' which causes issues with scrolling overflow. 
                        Used 'my-auto' on the p tag instead for centering short text. */}
                    <div className="w-full min-h-[5rem] max-h-[50vh] overflow-y-auto no-scrollbar flex flex-col">
                        <p className="text-illustration-navy text-base md:text-lg font-bold leading-relaxed text-center animate-fade-in whitespace-pre-wrap w-full my-auto px-1 py-1">
                          {bubbleText}
                        </p>
                    </div>
                    
                    <span className="absolute -bottom-6 right-4 text-5xl text-illustration-salmon/20 font-serif leading-none rotate-180 select-none">“</span>

                    {/* Tag label */}
                    <div className="absolute -top-3 right-6 bg-illustration-salmon text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm tracking-wider">
                      {APP_NAME}
                    </div>
                 </div>
               </div>
            </div>

            {/* BOTTOM SECTION: Control Sheet - DARK NAVY */}
            <div className="flex-1 bg-illustration-darkNavy relative rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.2)] -mt-6 z-50 flex flex-col px-4 pt-3 pb-4">
              
              {/* Drag Handle - Light */}
              <div className="w-8 h-1 bg-white/20 rounded-full mx-auto mb-2 shrink-0" />
              
              <h2 className="text-center text-white font-bold text-base mb-3 tracking-wider shrink-0">
                想知道阿姨怎麼面對？
              </h2>

              {/* Topics Grid - 3+2 Layout */}
              <div className="flex flex-wrap justify-center gap-2 w-full max-w-sm mx-auto content-start overflow-y-auto no-scrollbar pb-2">
                {TOPICS.map((topic, index) => {
                  const isFirstRow = index < 3;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      disabled={isLoading}
                      style={{ 
                        backgroundColor: topic.color,
                        width: isFirstRow ? 'calc(33% - 0.4rem)' : 'calc(49% - 0.4rem)'
                      }}
                      className={`
                        group relative overflow-hidden transition-all duration-200 
                        rounded-xl py-2 px-1 shadow-md active:scale-95 active:shadow-inner
                        flex items-center justify-center min-h-[44px]
                        ${isLoading ? 'opacity-70 cursor-wait' : 'hover:brightness-110'}
                      `}
                    >
                      <span className="font-bold text-illustration-navy/90 text-sm tracking-widest whitespace-nowrap">
                        {topic.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Footer Links - Light */}
              <div className="mt-auto pt-2 text-center flex items-center justify-center gap-2 opacity-50 shrink-0">
                 <a href="https://richauntee.link/" target="_blank" className="text-[10px] font-bold text-white hover:text-illustration-salmon transition-colors">Be RICH!</a>
                 <span className="text-[10px] text-white">|</span>
                 <a href="https://lazymeg.com/m/" target="_blank" className="text-[10px] font-bold text-white hover:text-illustration-salmon transition-colors">Meg.Dai</a>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
