import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

export default function TimeSlotCard({ slot, players, onUpdate }) {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVotes();
  }, [slot.id]);

  const fetchVotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/timeslots/${slotId}/votes`);
      console.log('Fetched votes:', response.data);
      setVotes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch votes:', error);
      setVotes([]);
    }
  };

  const handleVote = async (available) => {
    if (!selectedPlayer) {
      alert('Please select your player name first');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/timeslots/${slot.id}/vote`, {
        playerName: selectedPlayer,
        available
      });
      await fetchVotes();
      onUpdate();
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this time slot?')) return;

    try {
      await axios.delete(`${API_URL}/api/timeslots/${slot.id}`);
      onUpdate();
    } catch (error) {
      alert('Failed to delete time slot');
    }
  };

  // Filter players who voted - handle both boolean and integer values
  const availablePlayers = votes.filter(v => v.available === true || v.available === 1 || v.available === '1');
  const unavailablePlayers = votes.filter(v => v.available === false || v.available === 0 || v.available === '0');

  console.log('Available players:', availablePlayers);
  console.log('Unavailable players:', unavailablePlayers);

  return (
    <div className="bg-[#0f1923] border border-[#2a3a47] rounded-lg p-6 hover:border-[#00d4aa]/50 transition-all relative group">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 w-8 h-8 bg-[#ff4655]/20 border border-[#ff4655]/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff4655] hover:border-[#ff4655]"
        title="Delete time slot"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Time Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="font-valorant text-2xl text-white tracking-wider mb-1">
            {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-[#7a8a99] font-mono text-lg">{slot.time}</div>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#00d4aa]/20 border-2 border-[#00d4aa] flex items-center justify-center">
              <span className="font-valorant text-xl text-[#00d4aa]">{availablePlayers.length}</span>
            </div>
            <div className="text-[#7a8a99] text-xs mt-1">IN</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#ff4655]/20 border-2 border-[#ff4655] flex items-center justify-center">
              <span className="font-valorant text-xl text-[#ff4655]">{unavailablePlayers.length}</span>
            </div>
            <div className="text-[#7a8a99] text-xs mt-1">OUT</div>
          </div>
        </div>
      </div>

      {/* Player Selection */}
      <div className="mb-4">
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="w-full px-4 py-2 bg-[#1a2733] border border-[#2a3a47] rounded text-white font-inter text-sm focus:border-[#00d4aa] focus:outline-none"
        >
          <option value="">Select your name to vote</option>
          {players.map(p => (
            <option key={p.id} value={`${p.game_name}#${p.tag_line}`}>
              {p.game_name}#{p.tag_line}
            </option>
          ))}
        </select>
      </div>

      {/* Vote Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => handleVote(true)}
          disabled={loading}
          className="py-3 bg-[#00d4aa] hover:bg-[#00c29a] disabled:opacity-50 font-valorant tracking-wider text-[#0f1923] rounded transition-all"
        >
          {loading ? 'VOTING...' : "I'M IN"}
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={loading}
          className="py-3 bg-[#ff4655] hover:bg-[#e63946] disabled:opacity-50 font-valorant tracking-wider text-white rounded transition-all"
        >
          {loading ? 'VOTING...' : "CAN'T PLAY"}
        </button>
      </div>

      {/* Players Lists */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2a3a47]">
        {/* Available Players */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#00d4aa]"></div>
            <span className="text-[#00d4aa] text-xs font-valorant tracking-wider">PLAYING ({availablePlayers.length})</span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availablePlayers.length === 0 ? (
              <div className="text-[#4a5a67] text-xs italic">No one yet</div>
            ) : (
              availablePlayers.map((vote, idx) => (
                <div key={idx} className="text-white text-xs font-inter bg-[#00d4aa]/10 px-2 py-1.5 rounded border border-[#00d4aa]/30 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]"></div>
                  {vote.player_name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Unavailable Players */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#ff4655]"></div>
            <span className="text-[#ff4655] text-xs font-valorant tracking-wider">NOT PLAYING ({unavailablePlayers.length})</span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {unavailablePlayers.length === 0 ? (
              <div className="text-[#4a5a67] text-xs italic">No one yet</div>
            ) : (
              unavailablePlayers.map((vote, idx) => (
                <div key={idx} className="text-white text-xs font-inter bg-[#ff4655]/10 px-2 py-1.5 rounded border border-[#ff4655]/30 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff4655]"></div>
                  {vote.player_name}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
