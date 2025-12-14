import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../config';

export default function AddPlayerModal({ roomId, onClose, onSuccess }) {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gameName.trim() || !tagLine.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Fetching player data from Riot API...');

    try {
      await axios.post(`${API_URL}/api/rooms/${roomId}/players`, {
        gameName: gameName.trim(),
        tagLine: tagLine.trim()
      });
      
      toast.update(toastId, {
        render: 'Player added successfully! 🎯',
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding player:', error);
      const message = error.response?.status === 404 
        ? 'Riot ID not found. Check spelling!'
        : 'Failed to add player. Try again!';
      
      toast.update(toastId, {
        render: message,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative p-1 bg-gradient-to-br from-[#ff4655]/50 to-[#0f1923]/30 rounded-lg shadow-2xl max-w-md w-full animate-slide-up">
        <div className="backdrop-blur-xl bg-[#1a2733]/90 border border-[#2a3a47]/50 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#0f1923] px-6 py-4 border-b border-[#ff4655] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-[#ff4655]"></div>
              <h3 className="font-valorant text-xl text-white tracking-wider">ADD PLAYER</h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-[#7a8a99] hover:text-white transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="text-center mb-4">
              <p className="text-[#7a8a99] text-sm font-inter">
                Enter your Valorant Riot ID to join the stack
              </p>
            </div>

            {/* Game Name Input */}
            <div>
              <label className="block text-[#7a8a99] text-xs font-inter font-semibold uppercase tracking-wider mb-3">
                Game Name
              </label>
              <input
                type="text"
                placeholder="e.g., Bablu"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-[#0f1923] border-2 border-[#2a3a47] rounded text-white font-inter text-base focus:border-[#ff4655] focus:outline-none transition-all duration-200 placeholder:text-[#4a5a67] disabled:opacity-50"
              />
            </div>

            {/* Tag Line Input with # outside */}
            <div>
              <label className="block text-[#7a8a99] text-xs font-inter font-semibold uppercase tracking-wider mb-3">
                Tagline
              </label>
              <div className="flex items-center gap-2">
                {/* Hashtag Box */}
                <div className="flex items-center justify-center w-12 h-12 bg-[#0f1923] border-2 border-[#2a3a47] rounded">
                  <span className="text-[#ff4655] text-2xl font-mono font-bold">#</span>
                </div>
                
                {/* Input Box */}
                <input
                  type="text"
                  placeholder="1005"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value.toUpperCase())}
                  required
                  maxLength={5}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-[#0f1923] border-2 border-[#2a3a47] rounded text-white font-inter text-base focus:border-[#ff4655] focus:outline-none transition-all duration-200 placeholder:text-[#4a5a67] disabled:opacity-50"
                />
              </div>
              <p className="text-[#7a8a99] text-xs mt-2 font-inter">
                Example: If your Riot ID is <span className="text-white">TenZ#SEN</span>, enter "TenZ" and "SEN"
              </p>
            </div>

            {/* Info Box */}
            {/* <div className="flex items-start gap-3 text-[#7a8a99] text-xs font-inter bg-[#0f1923]/50 px-4 py-3 rounded border-l-4 border-[#00d4aa]">
              <svg className="w-5 h-5 flex-shrink-0 text-[#00d4aa] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="tracking-wider">
                We'll automatically fetch your rank, stats, and match history from Riot's API
              </span>
            </div> */}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 bg-[#2a3a47] hover:bg-[#3a4554] font-valorant text-sm tracking-wider text-white rounded transition-all disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#ff4655] hover:bg-[#e63946] font-valorant text-sm tracking-wider text-white rounded transition-all disabled:opacity-50 shadow-lg shadow-[#ff4655]/30 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? 'ADDING...' : 'ADD PLAYER'}
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
