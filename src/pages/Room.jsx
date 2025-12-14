import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddPlayerModal from '../components/AddPlayerModal';
import PlayerCard from '../components/PlayerCard';
import TimeSlotCard from '../components/TimeSlotCard';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    loadRoomData();
    const interval = setInterval(loadRoomData, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  const loadRoomData = async () => {
    try {
      const [roomRes, playersRes, slotsRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/rooms/${roomId}`),
        axios.get(`http://localhost:3000/api/rooms/${roomId}/players`),
        axios.get(`http://localhost:3000/api/rooms/${roomId}/timeslots`)
      ]);

      setRoom(roomRes.data);
      setPlayers(playersRes.data);
      setTimeSlots(slotsRes.data);
    } catch (error) {
      console.error('Failed to load room data', error);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addTimeSlot = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/rooms/${roomId}/timeslots`, {
        date: newDate,
        time: newTime
      });
      setNewDate('');
      setNewTime('');
      setShowAddSlot(false);
      loadRoomData();
    } catch (error) {
      alert('Failed to add time slot');
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-[#0f1923] flex items-center justify-center">
        <div className="text-white font-valorant text-2xl">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1923] relative overflow-hidden font-inter">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 70, 85, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#ff4655] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#00d4aa] opacity-5 rounded-full blur-3xl"></div>

      {/* Top Accent */}
      <div className="absolute top-0 left-0 w-40 h-10 bg-[#ff4655] transform -skew-x-[30deg]"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-[#1f2e3b] backdrop-blur-sm bg-[#0f1923]/50">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Room Info */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-10 h-10 rounded bg-[#1a2733] border border-[#2a3a47] flex items-center justify-center hover:border-[#ff4655] transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h1 className="font-valorant text-3xl text-white tracking-wider">{room.name}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[#7a8a99] text-sm font-inter">Room Code:</span>
                    <code className="font-mono text-[#ff4655] text-lg tracking-widest">{roomId}</code>
                    <button
                      onClick={copyRoomCode}
                      className="px-3 py-1 bg-[#1a2733] border border-[#2a3a47] rounded text-xs text-white hover:border-[#ff4655] transition-colors"
                    >
                      {copied ? '✓ COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowAddPlayer(true)}
                className="px-6 py-3 bg-[#ff4655] hover:bg-[#e63946] font-valorant text-lg tracking-wider text-white rounded transition-all shadow-lg shadow-[#ff4655]/30"
              >
                + ADD PLAYER
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Squad Members */}
            <div className="lg:col-span-1 space-y-6">
              <div className="relative p-1 bg-gradient-to-br from-[#ff4655]/50 to-[#0f1923]/30 rounded-lg">
                <div className="backdrop-blur-xl bg-[#1a2733]/70 border border-[#2a3a47]/50 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-[#0f1923] px-6 py-4 border-b border-[#ff4655] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-6 bg-[#ff4655]"></div>
                      <h2 className="font-valorant text-xl text-white tracking-wider">SQUAD</h2>
                    </div>
                    <div className="px-3 py-1 bg-[#ff4655]/20 border border-[#ff4655]/50 rounded-full">
                      <span className="text-[#ff4655] font-valorant text-sm">{players.length}</span>
                    </div>
                  </div>

                  {/* Players List */}
                  <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                    {players.length === 0 ? (
                      <div className="text-center py-8 text-[#7a8a99] text-sm">
                        No players yet. Add yourself first!
                      </div>
                    ) : (
                      players.map((player) => (
                        <PlayerCard key={player.id} player={player} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Time Slots */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative p-1 bg-gradient-to-br from-[#00d4aa]/50 to-[#0f1923]/30 rounded-lg">
                <div className="backdrop-blur-xl bg-[#1a2733]/70 border border-[#2a3a47]/50 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-[#0f1923] px-6 py-4 border-b border-[#00d4aa] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-6 bg-[#00d4aa]"></div>
                      <h2 className="font-valorant text-xl text-white tracking-wider">GAME SESSIONS</h2>
                    </div>
                    <button
                      onClick={() => setShowAddSlot(!showAddSlot)}
                      className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00c29a] font-valorant text-sm tracking-wider text-[#0f1923] rounded transition-all"
                    >
                      + ADD SLOT
                    </button>
                  </div>

                  {/* Add Slot Form */}
                  {showAddSlot && (
                    <div className="p-6 border-b border-[#2a3a47] bg-[#0f1923]/50">
                      <form onSubmit={addTimeSlot} className="flex gap-4">
                        <input
                          type="date"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          required
                          className="flex-1 px-4 py-2 bg-[#0f1923] border border-[#2a3a47] rounded text-white focus:border-[#00d4aa] focus:outline-none"
                        />
                        <input
                          type="time"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          required
                          className="flex-1 px-4 py-2 bg-[#0f1923] border border-[#2a3a47] rounded text-white focus:border-[#00d4aa] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-6 py-2 bg-[#00d4aa] hover:bg-[#00c29a] font-valorant text-sm tracking-wider text-[#0f1923] rounded transition-all"
                        >
                          ADD
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Time Slots List */}
                  <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                    {timeSlots.length === 0 ? (
                      <div className="text-center py-12 text-[#7a8a99] text-sm">
                        No sessions scheduled. Create one!
                      </div>
                    ) : (
                      timeSlots.map((slot) => (
                        <TimeSlotCard
                          key={slot.id}
                          slot={slot}
                          players={players}
                          onUpdate={loadRoomData}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Player Modal */}
      {showAddPlayer && (
        <AddPlayerModal
          roomId={roomId}
          onClose={() => setShowAddPlayer(false)}
          onSuccess={loadRoomData}
        />
      )}

      {/* Bottom Accent */}
      <div className="absolute bottom-0 right-0 w-40 h-10 bg-[#00d4aa] transform skew-x-[30deg]"></div>
    </div>
  );
}
