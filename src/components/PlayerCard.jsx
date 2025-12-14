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

  const getRankImage = (rankName) => {
    if (!rankName || rankName === 'Unranked') return null;
    const formattedRank = rankName.replace(' ', '-');
    return `https://img.rankedboost.com/wp-content/uploads/2020/04/${formattedRank}-Valorant-Rank.png`;
  };

  const getAgentImage = (agentName) => {
    if (!agentName || agentName === 'Unknown') return null;
    
    // Map agent names to their UUID/identifier
    const agentMap = {
      'Jett': 'jett',
      'Reyna': 'reyna',
      'Raze': 'raze',
      'Phoenix': 'phoenix',
      'Sage': 'sage',
      'Sova': 'sova',
      'Viper': 'viper',
      'Cypher': 'cypher',
      'Brimstone': 'brimstone',
      'Omen': 'omen',
      'Killjoy': 'killjoy',
      'Breach': 'breach',
      'Skye': 'skye',
      'Yoru': 'yoru',
      'Astra': 'astra',
      'KAY/O': 'kayo',
      'Chamber': 'chamber',
      'Neon': 'neon',
      'Fade': 'fade',
      'Harbor': 'harbor',
      'Gekko': 'gekko',
      'Deadlock': 'deadlock',
      'Iso': 'iso',
      'Clove': 'clove',
      'Vyse': 'vyse'
    };
    
    const agentKey = agentMap[agentName];
    if (!agentKey) return null;
    
    // Using multiple CDN fallbacks
    return `https://media.valorant-api.com/agents/${agentKey}/displayicon.png`;
  };

  // Alternative agent image source
  const getAgentImageAlt = (agentName) => {
    if (!agentName || agentName === 'Unknown') return null;
    const formatted = agentName.toLowerCase().replace(/[\/\s]/g, '');
    return `https://trackercdn.com/cdn/tracker.gg/valorant/db/agents/${formatted}_portrait.png`;
  };

  return (
    <div className="relative group">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#ff4655]/0 via-[#ff4655]/5 to-[#ff4655]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative bg-[#0f1923] border-2 border-[#2a3a47] rounded-lg overflow-hidden hover:border-[#ff4655] transition-all duration-300">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff4655] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Agent Background (if available) */}
        {player.most_played_agent !== 'Unknown' && (
          <div className="absolute top-0 right-0 w-36 h-36 opacity-30 overflow-hidden">
            <img
              src={getAgentImage(player.most_played_agent)}
              alt={player.most_played_agent}
              className="w-full h-full object-cover object-top scale-110"
              onError={(e) => {
                // Try alternative source
                e.target.src = getAgentImageAlt(player.most_played_agent);
                e.target.onerror = () => e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="relative p-4">
          {/* Player Info Section */}
          <div className="flex items-start gap-3 mb-4">
            {/* Rank Image */}
            <div className="relative flex-shrink-0">
              {getRankImage(player.rank_name) ? (
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <img
                    src={getRankImage(player.rank_name)}
                    alt={player.rank_name}
                    className="w-full h-full object-contain drop-shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback icon */}
                  <div 
                    className="absolute inset-0 hidden items-center justify-center rounded-full border-2"
                    style={{ 
                      borderColor: getRankColor(player.rank_name),
                      backgroundColor: `${getRankColor(player.rank_name)}20`
                    }}
                  >
                    <svg className="w-8 h-8" style={{ color: getRankColor(player.rank_name) }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div 
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
                  style={{ 
                    borderColor: getRankColor(player.rank_name),
                    backgroundColor: `${getRankColor(player.rank_name)}20`
                  }}
                >
                  <svg className="w-8 h-8" style={{ color: getRankColor(player.rank_name) }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Player Details */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-inter font-bold text-white text-base truncate">
                  {player.game_name}
                </span>
                <span className="font-mono text-[#7a8a99] text-sm flex-shrink-0">
                  #{player.tag_line}
                </span>
              </div>

              {/* Rank */}
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="px-2 py-0.5 rounded text-xs font-valorant tracking-wider"
                  style={{ 
                    backgroundColor: `${getRankColor(player.rank_name)}20`,
                    color: getRankColor(player.rank_name),
                    border: `1px solid ${getRankColor(player.rank_name)}40`
                  }}
                >
                  {player.rank_name}
                </div>
                {player.account_level > 0 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-[#2a3a47] rounded">
            <Trophy className="w-3 h-3 text-[#00d4aa]" />
            <span className="text-[#7a8a99] text-xs font-mono">{player.account_level}</span>
          </div>
                )}
              </div>

              {/* Most Played Agent with Image */}
              {player.most_played_agent !== 'Unknown' && (
                <div className="flex items-center gap-2">
                  {/* <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-[#2a3a47] bg-[#1a2733] flex-shrink-0">
                    <img
                      src={getAgentImage(player.most_played_agent)}
                      alt={player.most_played_agent}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Try alternative source
                        e.target.src = getAgentImageAlt(player.most_played_agent);
                        e.target.onerror = () => {
                          // Show fallback icon
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-[#2a3a47]">
                              <svg class="w-4 h-4 text-[#7a8a99]" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                              </svg>
                            </div>
                          `;
                        };
                      }}
                    />
                  </div> */}
                  <div className="text-[#7a8a99] text-xs font-inter">
                    <span className="opacity-60">Main:</span>{' '}
                    <span className="text-white font-medium">{player.most_played_agent}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          {player.total_matches > 0 && (
            <>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2a3a47] to-transparent mb-3"></div>
              
              <div className="grid grid-cols-4 gap-2">
                {/* K/D Ratio */}
                <div className="text-center">
                  <div className="text-[#7a8a99] text-[10px] uppercase tracking-wider mb-1">K/D</div>
                  <div className={`font-mono text-sm font-bold ${player.kd_ratio >= 1 ? 'text-[#00d4aa]' : 'text-[#ff4655]'}`}>
                    {player.kd_ratio}
                  </div>
                </div>

                {/* Win Rate */}
                <div className="text-center">
                  <div className="text-[#7a8a99] text-[10px] uppercase tracking-wider mb-1">WR</div>
                  <div className="font-mono text-sm font-bold text-white">
                    {player.win_rate}%
                  </div>
                </div>

                {/* Matches */}
                <div className="text-center">
                  <div className="text-[#7a8a99] text-[10px] uppercase tracking-wider mb-1">W/L</div>
                  <div className="font-mono text-sm font-bold text-white">
                    {player.wins}/{player.losses}
                  </div>
                </div>

                {/* Headshot % */}
                <div className="text-center">
                  <div className="text-[#7a8a99] text-[10px] uppercase tracking-wider mb-1">HS%</div>
                  <div className="font-mono text-sm font-bold text-[#ffd700]">
                    {player.headshot_percent}%
                  </div>
                </div>
              </div>

              {/* Additional Stats Row */}
              {/* <div className="mt-3 pt-3 border-t border-[#2a3a47]/50">
                <div className="flex justify-around text-xs">
                  <div className="text-center">
                    <span className="text-[#7a8a99]">Avg Kills: </span>
                    <span className="text-white font-mono">{player.avg_kills}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[#7a8a99]">Avg Score: </span>
                    <span className="text-white font-mono">{player.avg_score}</span>
                  </div>
                </div>
              </div> */}
            </>
          )}

          {/* No stats message */}
          {player.total_matches === 0 && (
            <div className="text-center py-2 text-[#7a8a99] text-xs italic">
              No competitive matches played yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
