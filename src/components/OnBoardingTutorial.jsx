import { useState } from 'react';

export default function OnboardingTutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      title: "WELCOME TO THE DEPRESSION CENTER",
      description: "Coordinate your Valorant game sessions with your friends and track everyone's stats!",
      icon: (
        <img
  src="/valo.png"
  alt="Icon"
  className="w-20 h-20 text-[#ff4655]"
/>

      )
    },
    {
      title: "CREATE OR JOIN A ROOM",
      description: "Create a new room and share the 6-digit code with your friends, or join an existing room using their code.",
      icon: (
        <svg className="w-16 h-16 text-[#00d4aa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "ADD YOUR RIOT ID",
      description: "Enter your Valorant Game Name and Tagline. We'll automatically fetch your rank, stats, and match history from Riot's API!",
      icon: (
        <svg className="w-16 h-16 text-[#ffd700]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "SCHEDULE GAME SESSIONS",
      description: "Create time slots for your gaming sessions and vote on when you're available. Coordinate the perfect 5-stack!",
      icon: (
        <svg className="w-16 h-16 text-[#7c4dff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "READY TO PLAY!",
      description: "That's it! Create your room now and start coordinating with your stack. Good luck, have fun!",
      icon: (
        <svg className="w-16 h-16 text-[#00d4aa]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
      // Save to localStorage so it doesn't show again
      localStorage.setItem('onboardingComplete', 'true');
    }, 300);
  };

  // Check if user has already seen the tutorial
  if (localStorage.getItem('onboardingComplete') === 'true') {
    onComplete();
    return null;
  }

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 70, 85, 0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl animate-slide-up">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#7a8a99] text-xs font-valorant tracking-wider">
              STEP {currentStep + 1} OF {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-[#7a8a99] hover:text-white text-xs font-inter tracking-wider transition-colors"
            >
              SKIP TUTORIAL
            </button>
          </div>
          <div className="w-full h-1 bg-[#1a2733] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ff4655] to-[#00d4aa] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="relative p-1 bg-gradient-to-br from-[#ff4655]/50 to-[#00d4aa]/30 rounded-lg shadow-2xl">
          <div className="backdrop-blur-xl bg-[#1a2733]/95 border border-[#2a3a47]/50 rounded-lg overflow-hidden">
            {/* Header with Icon */}
            <div className="bg-[#0f1923] px-8 py-6 border-b border-[#2a3a47] text-center">
              <div className="flex justify-center mb-4">
                {currentStepData.icon}
              </div>
              <h2 className="font-valorant text-3xl text-white tracking-wider mb-2">
                {currentStepData.title}
              </h2>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[#ff4655] to-transparent"></div>
            </div>

            {/* Body */}
            <div className="p-8">
              <p className="text-[#e0e0e0] text-center text-lg font-inter leading-relaxed mb-8">
                {currentStepData.description}
              </p>

              {/* Step Indicators */}
              <div className="flex justify-center gap-2 mb-8">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'w-8 bg-[#ff4655]' 
                        : index < currentStep 
                        ? 'w-2 bg-[#00d4aa]' 
                        : 'w-2 bg-[#2a3a47]'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex-1 py-3 bg-[#2a3a47] hover:bg-[#3a4554] font-valorant text-sm tracking-wider text-white rounded transition-all"
                  >
                    ← PREVIOUS
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`${currentStep === 0 ? 'w-full' : 'flex-1'} py-3 bg-gradient-to-r from-[#ff4655] to-[#e63946] hover:from-[#e63946] hover:to-[#bd1f2d] font-valorant text-sm tracking-wider text-white rounded transition-all shadow-lg shadow-[#ff4655]/30`}
                >
                  {currentStep === steps.length - 1 ? "LET'S GO! →" : "NEXT →"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-center">
          <p className="text-[#7a8a99] text-xs font-inter">
            Press ESC or click "Skip Tutorial" to skip
          </p>
        </div>
      </div>
    </div>
  );
}
