import { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleComplete();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.error('Error playing video:', err);
        handleComplete();
      });
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSkip();
        }
      }}
    >
      <video
        ref={videoRef}
        className="max-w-full max-h-full object-contain"
        onEnded={handleComplete}
        muted
        playsInline
      >
        <source src="/jiggle-modaflicks.mp4" type="video/mp4" />
      </video>

      <button
        className="absolute bottom-8 right-8 text-white text-sm font-medium px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 backdrop-blur-sm"
        onClick={handleSkip}
      >
        Skip
      </button>
    </div>
  );
}
