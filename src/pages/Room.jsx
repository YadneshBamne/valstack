import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddPlayerModal from "../components/AddPlayerModal";
import PlayerCard from "../components/PlayerCard";
import TimeSlotCard from "../components/TimeSlotCard";
import DateTimePicker from "../components/DateTimePicker";
import { API_URL } from "../config";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadRoomData();
    const interval = setInterval(loadRoomData, 5000);
    return () => clearInterval(interval);
  }, [roomId]);

  const loadRoomData = async () => {
    try {
      const [roomRes, playersRes, slotsRes] = await Promise.all([
        axios.get(`${API_URL}/api/rooms/${roomId}`),
        axios.get(`${API_URL}/api/rooms/${roomId}/players`),
        axios.get(`${API_URL}/api/rooms/${roomId}/timeslots`)
      ]);

      setRoom(roomRes.data);

      setPlayers(
        Array.isArray(playersRes.data)
          ? playersRes.data
          : playersRes.data?.players || []
      );

      setTimeSlots(
        Array.isArray(slotsRes.data)
          ? slotsRes.data
          : slotsRes.data?.timeslots || []
      );

    } catch (error) {
      console.error("Failed to load room data:", error);

      if (error.response?.status === 404) {
        toast.error("Room not found");
        navigate("/");
      } else {
        toast.error("Failed to load room data");
      }
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    toast.success("Room code copied 📋");
    setTimeout(() => setCopied(false), 2000);
  };

  const addTimeSlot = async (date, time) => {
    const toastId = toast.loading("Adding game session...");
    try {
      await axios.post(`${API_URL}/api/rooms/${roomId}/timeslots`, {
        date,
        time
      });

      setShowAddSlot(false);
      toast.update(toastId, {
        render: "Session added 🎮",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      loadRoomData();
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to add session",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-[#0f1923] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#00d4aa] border-t-transparent mb-4"></div>
          <div className="text-white font-valorant text-2xl tracking-wider">
            LOADING...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1923] relative overflow-hidden font-inter">
      {/* Header */}
      <div className="border-b border-[#1f2e3b] backdrop-blur-sm bg-[#0f1923]/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="font-valorant text-3xl text-white">
              {room.name}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[#7a8a99] text-sm">Room Code:</span>
              <code className="text-[#ff4655] text-lg tracking-widest">
                {roomId}
              </code>
              <button
                onClick={copyRoomCode}
                className="px-3 py-1 bg-[#1a2733] border border-[#2a3a47] rounded text-xs text-white hover:border-[#ff4655]"
              >
                {copied ? "✓ COPIED" : "COPY"}
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowAddPlayer(true)}
            className="px-6 py-3 bg-[#ff4655] hover:bg-[#e63946] font-valorant text-lg text-white rounded"
          >
            + ADD PLAYER
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Players */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a2733] rounded-lg border border-[#2a3a47]">
            <div className="p-4 border-b border-[#ff4655] flex justify-between">
              <h2 className="font-valorant text-white">STACK MEMBERS</h2>
              <span className="text-[#ff4655]">{players.length}</span>
            </div>

            <div className="p-4 space-y-3">
              {Array.isArray(players) && players.length > 0 ? (
                players.map((player) => (
                  <PlayerCard
                    key={player.id || player._id}
                    player={player}
                  />
                ))
              ) : (
                <div className="text-center text-[#7a8a99]">
                  No players yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a2733] rounded-lg border border-[#2a3a47]">
            <div className="p-4 border-b border-[#00d4aa] flex justify-between">
              <h2 className="font-valorant text-white">GAME SESSIONS</h2>
              <button
                onClick={() => setShowAddSlot(!showAddSlot)}
                className="px-4 py-2 bg-[#00d4aa] text-[#0f1923] rounded"
              >
                {showAddSlot ? "CANCEL" : "+ ADD SLOT"}
              </button>
            </div>

            {showAddSlot && (
              <div className="p-4 border-b border-[#2a3a47]">
                <DateTimePicker
                  onSubmit={addTimeSlot}
                  onCancel={() => setShowAddSlot(false)}
                />
              </div>
            )}

            <div className="p-4 space-y-4">
              {Array.isArray(timeSlots) && timeSlots.length > 0 ? (
                timeSlots.map((slot) => (
                  <TimeSlotCard
                    key={slot.id || slot._id}
                    slot={slot}
                    players={players}
                    onUpdate={loadRoomData}
                  />
                ))
              ) : (
                <div className="text-center text-[#7a8a99]">
                  No sessions scheduled
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddPlayer && (
        <AddPlayerModal
          roomId={roomId}
          onClose={() => setShowAddPlayer(false)}
          onSuccess={loadRoomData}
        />
      )}
    </div>
  );
}
