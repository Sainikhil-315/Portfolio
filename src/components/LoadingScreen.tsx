import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const greetings = [
  { text: 'నమస్తే', language: 'Telugu', translation: 'Namaste' },
  { text: 'Hello', language: 'English', translation: 'Hello' },
  { text: 'नमस्ते', language: 'Hindi', translation: 'Namaste' },
  { text: 'こんにちは', language: 'Japanese', translation: 'Konnichiwa' },
  { text: 'नमस्कार', language: 'Marathi', translation: 'Namaskar' },
  { text: 'নমস্কার', language: 'Bengali', translation: 'Namaskar' },
  { text: '你好', language: 'Chinese', translation: 'Nǐ hǎo' },
  { text: 'Hola', language: 'Spanish', translation: 'Hola' },
  { text: 'Bonjour', language: 'French', translation: 'Bonjour' },
  { text: 'Hallo', language: 'German', translation: 'Hallo' },
];

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 3000; // Reduced to 3 seconds for faster loading
    const greetingDuration = totalDuration / greetings.length;
    
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (totalDuration / 50));
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 200); // Small delay before showing main content
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Greeting cycling
    const greetingInterval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= greetings.length) {
          clearInterval(greetingInterval);
          return prev;
        }
        return nextIndex;
      });
    }, greetingDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(greetingInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main content */}
      <div className="text-center space-y-8 z-10">
        {/* Greeting display */}
        <div className="h-32 flex flex-col items-center justify-center">
          <div 
            key={currentIndex}
            className="animate-fade-in"
          >
            <h1 className="text-6xl md:text-8xl font-playfair font-bold text-gradient mb-2">
              {greetings[currentIndex]?.text}
            </h1>
            <p className="text-lg text-muted-foreground font-inter">
              {greetings[currentIndex]?.language}
            </p>
          </div>
        </div>

        {/* Progress section */}
        <div className="w-80 md:w-96 mx-auto space-y-4">
          {/* Progress bar */}
          <div className="w-full bg-muted/20 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Loading text */}
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="font-inter">Loading Portfolio</span>
          </div>
        </div>

        {/* Welcome message */}
        <div className="opacity-80">
          <p className="text-muted-foreground font-inter">
            Welcome to Sai Nikhil's Portfolio
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;