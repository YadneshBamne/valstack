import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import SplashScreen from '../components/SplashScreen';
import OnboardingTutorial from '../components/OnBoardingTutorial';
import { API_URL } from '../config';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle ESC key to skip tutorial
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showTutorial) {
        setShowTutorial(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showTutorial]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Show tutorial only if user hasn't seen it before
    if (localStorage.getItem('onboardingComplete') !== 'true') {
      setShowTutorial(true);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      toast.error('Please enter a squad name');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating squad room...');
    
    try {
      const response = await axios.post(`${API_URL}/api/rooms`, {
        name: roomName
      });
      
      toast.update(toastId, {
        render: 'Squad room created! 🎮',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
      
      setTimeout(() => navigate(`/room/${response.data.id}`), 500);
    } catch (error) {
      toast.update(toastId, {
        render: 'Failed to create room. Try again!',
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = (e) => {
    e.preventDefault();
    
    if (!joinCode) {
      toast.error('Please enter a room code');
      return;
    }
    
    if (joinCode.length !== 6) {
      toast.error('Room code must be 6 characters');
      return;
    }
    
    toast.success('Joining squad...', { autoClose: 1000 });
    setTimeout(() => navigate(`/room/${joinCode}`), 500);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (showTutorial) {
    return <OnboardingTutorial onComplete={() => setShowTutorial(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0f1923] relative overflow-hidden font-inter">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 70, 85, 0.2) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[#ff4655] opacity-[0.08] rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[#00d4aa] opacity-[0.08] rounded-full blur-[100px]"></div>

      {/* Top Left Corner Accent */}
      <div className="absolute top-0 left-0 w-40 h-10 bg-[#ff4655] transform -skew-x-[30deg] origin-top-left"></div>
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-5xl">
            {/* Cards Container */}
            <div className="grid md:grid-cols-2 gap-10">
              {/* Create Room Card */}
              <div className="relative p-1 bg-gradient-to-br from-[#ff4655]/50 to-[#0f1923]/30 rounded-lg shadow-2xl">
                <div className="backdrop-blur-xl bg-[#1a2733]/70 border border-[#2a3a47]/50 rounded-lg overflow-hidden transition-all duration-300 shadow-inner shadow-[#000000]/50">
                  {/* Card Header */}
                  <div className="relative bg-[#0f1923] px-8 py-5 flex items-center gap-4 border-b border-[#ff4655]">
                    <div className="absolute inset-0 bg-[#ff4655]/20 clip-path-polygon-[0_0,95%_0,100%_100%,0_100%]"></div>
                    <div className="w-2 h-7 bg-[#ff4655] z-10"></div>
                    <h3 className="font-valorant text-2xl text-white tracking-wider z-10">
                      CREATE A STACK
                    </h3>
                  </div>

                  {/* Card Content */}
                  <form onSubmit={createRoom} className="p-8 space-y-8">
                    <div>
                      <label className="block text-[#ff4655] text-sm font-valorant uppercase tracking-widest mb-3">
                        Name your stack
                      </label>
                      <input
                        type="text"
                        placeholder="eg. valo ke 14"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                        className="w-full px-5 py-3.5 bg-[#0f1923] border-2 border-[#2a3a47] rounded-sm text-white font-inter text-base focus:border-[#ff4655] focus:outline-none transition-all duration-200 placeholder:text-[#4a5a67] placeholder:uppercase tracking-widest"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#ff4655] hover:bg-[#e63946] active:bg-[#bd1f2d] font-valorant text-xl tracking-widest text-[#0f1923] rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/btn shadow-xl shadow-[#ff4655]/40"
                    >
                      <span className="relative z-10">
                        {loading ? 'CREATING...' : 'ADD YOUR STACK'}
                      </span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                    </button>

                    <div className="flex items-center gap-3 text-[#7a8a99] text-xs font-inter bg-[#0f1923]/50 px-4 py-3 rounded-sm border-l-4 border-[#ff4655]">
                      <svg className="w-5 h-5 flex-shrink-0 text-[#ff4655]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="tracking-wider">A unique 6-digit access code will be generated for your squad.</span>
                    </div>
                  </form>
                </div>
              </div>

              {/* Join Room Card */}
              <div className="relative p-1 bg-gradient-to-br from-[#00d4aa]/50 to-[#0f1923]/30 rounded-lg shadow-2xl">
                <div className="backdrop-blur-xl bg-[#1a2733]/70 border border-[#2a3a47]/50 rounded-lg overflow-hidden transition-all duration-300 shadow-inner shadow-[#000000]/50">
                  {/* Card Header */}
                  <div className="relative bg-[#0f1923] px-8 py-5 flex items-center gap-4 border-b border-[#00d4aa]">
                    <div className="absolute inset-0 bg-[#00d4aa]/20 clip-path-polygon-[0_0,95%_0,100%_100%,0_100%]"></div>
                    <div className="w-2 h-7 bg-[#00d4aa] z-10"></div>
                    <h3 className="font-valorant text-2xl text-white tracking-wider z-10">
                      JOIN A STACK
                    </h3>
                  </div>

                  {/* Card Content */}
                  <form onSubmit={joinRoom} className="p-8 space-y-8">
                    <div>
                      <label className="block text-[#00d4aa] text-sm font-valorant uppercase tracking-widest mb-3">
                        Stack room Code
                      </label>
                      <input
                        type="text"
                        placeholder="A B C D E F"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                        required
                        maxLength={6}
                        className="w-full px-5 py-3.5 bg-[#0f1923] border-2 border-[#2a3a47] rounded-sm text-white font-mono text-3xl tracking-[0.5em] text-center focus:border-[#00d4aa] focus:outline-none transition-all duration-200 placeholder:text-[#4a5a67] placeholder:tracking-[0.5em]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#00d4aa] hover:bg-[#00c29a] active:bg-[#00a080] font-valorant text-xl tracking-widest text-[#0f1923] rounded-sm transition-all duration-200 relative overflow-hidden group/btn shadow-xl shadow-[#00d4aa]/40"
                    >
                      <span className="relative z-10">JOIN ROOM</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                    </button>

                    <div className="flex items-center gap-3 text-[#7a8a99] text-xs font-inter bg-[#0f1923]/50 px-4 py-3 rounded-sm border-l-4 border-[#00d4aa]">
                      <svg className="w-5 h-5 flex-shrink-0 text-[#00d4aa]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="tracking-wider">Enter the 6-digit access code provided by the squad leader.</span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Corner Accent */}
      <div className="absolute bottom-0 right-0 w-40 h-10 bg-[#00d4aa] transform skew-x-[30deg] origin-bottom-right"></div>
    </div>
  );
}
