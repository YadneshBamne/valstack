import './PlayerList.css';

export default function PlayerList({ players }) {
  const getRankColor = (rankName) => {
    if (!rankName) return '#5a6c7d';
    
    const colors = {
      'Iron': '#4a4a4a',
      'Bronze': '#cd7f32',
      'Silver': '#c0c0c0',
      'Gold': '#ffd700',
      'Platinum': '#00d4aa',
      'Diamond': '#b9f2ff',
      'Ascendant': '#0f7b6f',
      'Immortal': '#ff3d55',
      'Radiant': '#ffffaa',
      'Unranked': '#5a6c7d'
    };
    
    const rankBase = rankName.split(' ')[0];
    return colors[rankBase] || '#5a6c7d';
  };

  const getRankEmoji = (rankName) => {
    if (!rankName || rankName === 'Unranked') return '❓';
    
    const rankBase = rankName.split(' ')[0];
    const emojis = {
      'Iron': '⚫',
      'Bronze': '🟤',
      'Silver': '⚪',
      'Gold': '🟡',
      'Platinum': '🟢',
      'Diamond': '🔷',
      'Ascendant': '🟩',
      'Immortal': '🔴',
      'Radiant': '⭐'
    };
    
    return emojis[rankBase] || '🏆';
  };

  return (
    <div className="player-list-section">
      <h2>Stack Members ({players.length})</h2>
      <div className="players-grid">
        {players.length === 0 ? (
          <div className="empty-state">
            <p>No players yet. Be the first to join!</p>
          </div>
        ) : (
          players.map((player) => (
            <div key={player.id} className="player-card">
              <div className="player-header">
                <span className="player-name">
                  {player.game_name}#{player.tag_line}
                </span>
                <div className="rank-info">
                  <div className="player-rank" style={{ color: getRankColor(player.rank_name) }}>
                    <span className="rank-badge">
                      {getRankEmoji(player.rank_name)} {player.rank_name}
                    </span>
                    {player.rr > 0 && player.rank_name !== 'Unranked' && (
                      <span className="rank-rr">{player.rr} RR</span>
                    )}
                  </div>
                  {player.peak_rank && player.peak_rank !== 'Unknown' && (
                    <div className="peak-rank">
                      Peak: {player.peak_rank}
                    </div>
                  )}
                </div>
              </div>

              {player.total_matches > 0 ? (
                <div className="player-stats">
                  <div className="stat-row">
                    <span className="stat-label">Record:</span>
                    <span className="stat-value">
                      <span className="wins">{player.wins}W</span> - 
                      <span className="losses">{player.losses}L</span> 
                      ({player.win_rate}%)
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">K/D/A:</span>
                    <span className="stat-value">
                      {player.avg_kills} / {player.avg_deaths} / {player.avg_assists}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">KD Ratio:</span>
                    <span className={`stat-value ${player.kd_ratio >= 1 ? 'positive' : 'negative'}`}>
                      {player.kd_ratio}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">HS%:</span>
                    <span className="stat-value">{player.headshot_percent}%</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Avg Score:</span>
                    <span className="stat-value">{player.avg_score}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Main:</span>
                    <span className="stat-value agent">{player.most_played_agent}</span>
                  </div>
                  <div className="stat-info">
                    📊 Based on last {player.total_matches} matches
                  </div>
                </div>
              ) : (
                <div className="no-stats">
                  <p>No recent match data available</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
