import { useState } from 'react';
import axios from 'axios';
import './AddPlayerModal.css';

export default function AddPlayerModal({ roomId, onClose, onSuccess }) {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`http://localhost:3000/api/rooms/${roomId}/players`, {
        gameName,
        tagLine
      });

      console.log('Player added:', response.data);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add player');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Add Your Riot ID</h2>
        <p className="modal-description">
          Enter your Valorant Game Name and Tag to join this squad
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Game Name</label>
            <input
              type="text"
              placeholder="e.g., TenZ"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Tag Line</label>
            <input
              type="text"
              placeholder="e.g., SEN"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying & Fetching Rank...' : 'Add to Squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
