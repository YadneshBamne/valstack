import { useState } from 'react';
import './Dashboard.css';

export default function Dashboard({ user, onLogout }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleStatus = () => {
    setIsPlaying(!isPlaying);
    // TODO: Save status to your backend
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Valorant Availability</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="user-card">
        <h2>Welcome, {user.gameName}#{user.tagLine}</h2>
        <p className="puuid">PUUID: {user.puuid}</p>
        
        <div className="status-section">
          <h3>Your Status</h3>
          <div className={`status-indicator ${isPlaying ? 'playing' : 'not-playing'}`}>
            {isPlaying ? '🎮 Playing' : '💤 Not Playing'}
          </div>
          <button onClick={toggleStatus} className="toggle-btn">
            {isPlaying ? 'Set as Not Playing' : 'Set as Playing'}
          </button>
        </div>
      </div>
    </div>
  );
}
