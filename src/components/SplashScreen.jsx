import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState('entering'); // entering -> showing -> exiting

  useEffect(() => {
    // Fade in phase
    const showTimer = setTimeout(() => {
      setPhase('showing');
    }, 1200);

    // Start exit phase (zoom in past screen)
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 2800);

    // Complete and remove splash
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-700 ${
        phase === 'entering' ? 'bg-white opacity-0' : 'bg-white opacity-100'
      } ${phase === 'exiting' ? 'opacity-0' : ''}`}
      style={{ perspective: '1200px' }}
    >
      {/* Logo Container with 3D transform */}
      <div
        className="relative transition-all duration-1000"
        style={{
          transform: 
            phase === 'entering'
              ? 'scale(0.85) translateZ(-10px) translateY(30px)'
              : phase === 'showing'
              ? 'scale(1) translateZ(0px) translateY(0px)'
              : 'scale(5) translateZ(2000px) translateY(-50px)',
          opacity: phase === 'entering' ? 0 : 1,
          transformStyle: 'preserve-3d',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <img
          src="/valo.png"
          alt="Valorant Logo"
          className="w-64 h-auto md:w-96"
          style={{ backfaceVisibility: 'hidden' }}
        />
      </div>
    </div>
  );
}
