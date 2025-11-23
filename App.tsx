
import React, { useState, useRef, useEffect } from 'react';
import { AppState, TOPICS, Topic, IMAGE_TOPIC_ID } from './types';
import RichLadyView from './components/RichLadyView';
import Background from './components/Background';
import RitualScreen from './components/RitualScreen';
import WelcomeScreen from './components/WelcomeScreen';
import { GREETINGS, RICH_LADY_IMAGES, APP_NAME, DEFAULT_NICKNAME } from './constants';

const App: React.FC = () => {
  // Start at WELCOME screen
  const [currentView, setCurrentView] = useState<AppState>(AppState.WELCOME);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>('');
  const [userName, setUserName] = useState<string>(DEFAULT_NICKNAME);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Shuffle images once on mount to ensure each topic gets a unique random auntie
  const [shuffledImages] = useState<string[]>(() => {
    return [...RICH_LADY_IMAGES].sort(() => 0.5 - Math.random());
  });

  // Randomize greeting when entering selection view
  useEffect(() => {
    if (currentView === AppState.SELECTION) {
      const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setGreeting(randomGreeting.replace(/{{name}}/g, userName));
    }
  }, [currentView, userName]);

  const handleNameConfirm = (name: string) => {
    setUserName(name);
    // Transition to Ritual (Landing) after name input
    setCurrentView(AppState.LANDING);
  };

  const handleRitualComplete = () => {
    // Transition to Selection after ritual
    setCurrentView(AppState.SELECTION);
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setUploadedImage(null);
    setCurrentView(AppState.ADVICE);
  };

  const handleBack = () => {
    setCurrentView(AppState.SELECTION);
    setSelectedTopic(null);
    setUploadedImage(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedImage(base64String);
        
        setSelectedTopic({
          id: IMAGE_TOPIC_ID,
          label: '阿姨讀圖',
          icon: '📷'
        });
        setCurrentView(AppState.ADVICE);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Determine which image to show based on logic
  const getRichLadyImage = (): string => {
    // Use the first shuffled image for Welcome/Landing to be consistent
    if (currentView === AppState.WELCOME || currentView === AppState.LANDING) {
      return shuffledImages[0];
    }
    if (uploadedImage) {
      return shuffledImages[Math.floor(Math.random() * shuffledImages.length)];
    }
    if (selectedTopic) {
      const topicIndex = TOPICS.findIndex(t => t.id === selectedTopic.id);
      if (topicIndex >= 0) {
        // Map topic index to shuffled images index (modulo to prevent out of bounds)
        return shuffledImages[topicIndex % shuffledImages.length];
      }
    }
    return shuffledImages[0];
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col font-sans">
      <Background />

      {currentView === AppState.WELCOME && (
        <WelcomeScreen 
          imageSrc={getRichLadyImage()} 
          onConfirm={handleNameConfirm} 
        />
      )}

      {currentView === AppState.LANDING && (
        <RitualScreen 
          imageSrc={getRichLadyImage()}
          onComplete={handleRitualComplete} 
        />
      )}

      {currentView === AppState.SELECTION && (
        <main className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in max-w-4xl mx-auto w-full z-10 pb-20">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-illustration-navy mb-4 tracking-wider">
              {APP_NAME}
            </h1>
            <div className="h-1 w-24 bg-illustration-navy mx-auto rounded-full opacity-20 mb-4"></div>
            <p className="text-illustration-navyLight text-lg opacity-80 animate-slide-up">
              {greeting}
            </p>
          </header>

          <div className="w-full max-w-lg">
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  className="group relative overflow-hidden bg-white hover:bg-illustration-cream border-2 border-illustration-navy/10 hover:border-illustration-salmon transition-all duration-300 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 text-left flex flex-col items-center justify-center gap-3 aspect-[4/3]"
                >
                  <div className="text-4xl group-hover:scale-125 transition-transform duration-300 filter drop-shadow-sm">
                    {topic.icon}
                  </div>
                  <span className="font-bold text-illustration-navy text-lg tracking-wide">
                    {topic.label}
                  </span>
                </button>
              ))}
            </div>

             {/* Image Upload Button */}
             <div className="relative group mb-12">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button 
                  onClick={triggerFileUpload}
                  className="w-full bg-illustration-navy hover:bg-illustration-navyLight text-white font-bold py-4 rounded-2xl shadow-lg transform transition active:scale-[0.98] flex items-center justify-center gap-3 border-b-4 border-gray-800"
                >
                  <span className="text-2xl">📷</span>
                  <span className="tracking-widest">拿圖給阿姨看</span>
                </button>
             </div>
            
            <div className="text-center flex flex-col gap-4">
               {/* Author Links */}
               <div className="flex items-center justify-center gap-2">
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

              <span className="text-sm text-illustration-navy/50 italic">
                — 來自富婆阿姨的情緒價值 —
              </span>
            </div>
          </div>
        </main>
      )}

      {currentView === AppState.ADVICE && selectedTopic && (
        <RichLadyView 
          topicLabel={selectedTopic.label} 
          imageSrc={getRichLadyImage()}
          onBack={handleBack}
          uploadedImage={uploadedImage}
          userName={userName}
        />
      )}
    </div>
  );
};

export default App;
