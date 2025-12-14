export default function PlayerCard({ player }) {
  const getRankColor = (rankName) => {
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
    const rankBase = rankName?.split(' ')[0];
    return colors[rankBase] || '#5a6c7d';
  };

  return (
    <div className="bg-[#0f1923] border border-[#2a3a47] rounded p-4 hover:border-[#ff4655] transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="font-inter font-semibold text-white text-sm mb-1">
            {player.game_name}
            <span className="text-[#7a8a99]">#{player.tag_line}</span>
          </div>
          <div 
            className="text-xs font-valorant tracking-wider"
            style={{ color: getRankColor(player.rank_name) }}
          >
            {player.rank_name}
          </div>
        </div>
        {player.account_level > 0 && (
          <div className="px-2 py-1 bg-[#2a3a47] rounded text-[#7a8a99] text-xs font-mono">
            LVL {player.account_level}
          </div>
        )}
      </div>

      {player.total_matches > 0 && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-[#7a8a99] mb-1">K/D</div>
            <div className={`font-mono ${player.kd_ratio >= 1 ? 'text-[#00d4aa]' : 'text-[#ff4655]'}`}>
              {player.kd_ratio}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[#7a8a99] mb-1">W/L</div>
            <div className="font-mono text-white">
              {player.wins}/{player.losses}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[#7a8a99] mb-1">HS%</div>
            <div className="font-mono text-white">{player.headshot_percent}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
