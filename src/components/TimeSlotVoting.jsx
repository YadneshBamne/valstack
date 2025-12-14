
import { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './TimeSlotVoting.css';

export default function TimeSlotVoting({ roomId, timeSlots, players, onUpdate }) {
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [playerName, setPlayerName] = useState('');

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
      onUpdate();
    } catch (error) {
      alert('Failed to add time slot');
    }
  };

  const voteForSlot = async (slotId, available) => {
    if (!playerName) {
      alert('Please enter your game name to vote');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/api/timeslots/${slotId}/vote`, {
        playerName,
        available
      });
      onUpdate();
    } catch (error) {
      alert('Failed to vote');
    }
  };

  return (
    <div className="timeslot-section">
      <div className="section-header">
        <h2>Available Time Slots</h2>
        <button onClick={() => setShowAddSlot(!showAddSlot)} className="add-slot-btn">
          + Add Time Slot
        </button>
      </div>

      {showAddSlot && (
        <form onSubmit={addTimeSlot} className="add-slot-form">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            required
          />
          <button type="submit">Add</button>
        </form>
      )}

      <div className="player-name-input">
        <input
          type="text"
          placeholder="Your game name (to vote)"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>

      <div className="timeslots-list">
        {timeSlots.map((slot) => (
          <div key={slot.id} className="timeslot-card">
            <div className="timeslot-info">
              <h3>{slot.date}</h3>
              <p>{slot.time}</p>
              <div className="vote-counts">
                <span className="available-count">✅ {slot.available_count || 0}</span>
                <span className="unavailable-count">❌ {slot.unavailable_count || 0}</span>
              </div>
            </div>
            <div className="vote-actions">
              <button 
                onClick={() => voteForSlot(slot.id, true)}
                className="vote-btn available"
              >
                I'm In
              </button>
              <button 
                onClick={() => voteForSlot(slot.id, false)}
                className="vote-btn unavailable"
              >
                Can't Play
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
