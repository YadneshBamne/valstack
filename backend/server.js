const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const HENRIK_API = 'https://api.henrikdev.xyz';
const HENRIK_KEY = process.env.HENRIK_API_KEY;

// Helper function for Henrik API requests
async function henrikRequest(url) {
  try {
    const response = await axios.get(url, {
      headers: { 'Authorization': HENRIK_KEY },
      timeout: 15000
    });
    return response.data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    return null;
  }
}

// Get comprehensive player data
async function getPlayerData(gameName, tagLine) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Fetching data for: ${gameName}#${tagLine}`);
  console.log('='.repeat(60));

  let accountData = {
    puuid: '',
    region: 'unknown',
    account_level: 0,
    card_small: null
  };

  let rankData = {
    currenttier: 0,
    currenttierpatched: 'Unranked',
    ranking_in_tier: 0,
    elo: 0,
    peak_rank: 'Unknown'
  };

  let matchStats = getDefaultStats();

  // Get Account Info
  console.log('\n[Step 1] Fetching account info...');
  const accountUrl = `${HENRIK_API}/valorant/v1/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  const accResponse = await henrikRequest(accountUrl);
  
  if (accResponse && accResponse.data) {
    accountData.puuid = accResponse.data.puuid || '';
    accountData.region = accResponse.data.region || 'unknown';
    accountData.account_level = accResponse.data.account_level || 0;
    accountData.card_small = accResponse.data.card?.small || null;
    console.log(`✓ Account found! Region: ${accountData.region}, Level: ${accountData.account_level}`);
  }

  // Get MMR/Rank
  console.log('\n[Step 2] Fetching rank data...');
  const regions = ['na', 'eu', 'ap', 'kr', 'latam', 'br'];
  
  for (const region of regions) {
    const mmrUrl = `${HENRIK_API}/valorant/v2/mmr/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    const mmrResponse = await henrikRequest(mmrUrl);
    
    if (mmrResponse && mmrResponse.data) {
      const current = mmrResponse.data.current_data || {};
      const highest = mmrResponse.data.highest_rank || {};
      
      rankData = {
        currenttier: current.currenttier || 0,
        currenttierpatched: current.currenttierpatched || 'Unranked',
        ranking_in_tier: current.ranking_in_tier || 0,
        elo: current.elo || 0,
        peak_rank: highest.patched_tier || 'Unknown'
      };
      
      console.log(`✓ Rank found in ${region}: ${rankData.currenttierpatched} (Peak: ${rankData.peak_rank})`);
      break;
    }
  }

  // Get Match History
  console.log('\n[Step 3] Fetching match history...');
  let matchesUrl = `${HENRIK_API}/valorant/v3/matches/${accountData.region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  let matchResponse = await henrikRequest(matchesUrl);
  
  if (!matchResponse || !matchResponse.data) {
    matchesUrl = `${HENRIK_API}/valorant/v3/by-puuid/matches/${accountData.region}/${accountData.puuid}`;
    matchResponse = await henrikRequest(matchesUrl);
  }

  if (matchResponse && matchResponse.data && matchResponse.data.length > 0) {
    console.log(`✓ Found ${matchResponse.data.length} matches!`);
    matchStats = calculateStats(matchResponse.data, gameName, tagLine);
  }

  console.log('='.repeat(60));
  return { accountData, rankData, matchStats };
}

function calculateStats(matches, gameName, tagLine) {
  if (!matches || matches.length === 0) return getDefaultStats();

  let totalKills = 0, totalDeaths = 0, totalAssists = 0, totalScore = 0;
  let totalHeadshots = 0, totalBodyshots = 0, totalLegshots = 0;
  let wins = 0, losses = 0;
  let agentCounts = {};
  let validMatches = 0;

  matches.forEach(match => {
    const allPlayers = match.players?.all_players || [];
    const player = allPlayers.find(p => 
      p.name?.toLowerCase() === gameName.toLowerCase() && 
      p.tag?.toLowerCase() === tagLine.toLowerCase()
    );

    if (!player) return;
    validMatches++;

    const stats = player.stats || {};
    totalKills += stats.kills || 0;
    totalDeaths += stats.deaths || 0;
    totalAssists += stats.assists || 0;
    totalScore += stats.score || 0;
    totalHeadshots += stats.headshots || 0;
    totalBodyshots += stats.bodyshots || 0;
    totalLegshots += stats.legshots || 0;

    const agent = player.character || 'Unknown';
    agentCounts[agent] = (agentCounts[agent] || 0) + 1;

    const playerTeam = player.team?.toLowerCase();
    const hasWon = match.teams?.[playerTeam]?.has_won === true;
    if (hasWon) wins++;
    else losses++;
  });

  if (validMatches === 0) return getDefaultStats();

  const avgKills = (totalKills / validMatches).toFixed(1);
  const avgDeaths = (totalDeaths / validMatches).toFixed(1);
  const avgAssists = (totalAssists / validMatches).toFixed(1);
  const avgScore = Math.floor(totalScore / validMatches);
  const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2);
  const winRate = ((wins / validMatches) * 100).toFixed(1);

  const totalShots = totalHeadshots + totalBodyshots + totalLegshots;
  const headshotPercent = totalShots > 0 ? ((totalHeadshots / totalShots) * 100).toFixed(1) : 0;

  const mostPlayedAgent = Object.keys(agentCounts).length > 0 
    ? Object.keys(agentCounts).reduce((a, b) => agentCounts[a] > agentCounts[b] ? a : b)
    : 'Unknown';

  return {
    total_matches: validMatches,
    wins,
    losses,
    win_rate: parseFloat(winRate),
    avg_score: avgScore,
    avg_kills: parseFloat(avgKills),
    avg_deaths: parseFloat(avgDeaths),
    avg_assists: parseFloat(avgAssists),
    kd_ratio: parseFloat(kdRatio),
    headshot_percent: parseFloat(headshotPercent),
    most_played_agent: mostPlayedAgent
  };
}

function getDefaultStats() {
  return {
    total_matches: 0, wins: 0, losses: 0, win_rate: 0,
    avg_score: 0, avg_kills: 0, avg_deaths: 0, avg_assists: 0,
    kd_ratio: 0, headshot_percent: 0, most_played_agent: 'Unknown'
  };
}

// ==================== API ROUTES ====================

// Create room
app.post('/api/rooms', async (req, res) => {
  const { name } = req.body;
  const id = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from('rooms')
    .insert([{ id, name }])
    .select()
    .single();

  if (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ error: 'Failed to create room' });
  }

  res.json(data);
});

// Get room
app.get('/api/rooms/:roomId', async (req, res) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', req.params.roomId)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json(data);
});

// Add player to room
app.post('/api/rooms/:roomId/players', async (req, res) => {
  const { roomId } = req.params;
  const { gameName, tagLine } = req.body;

  try {
    console.log(`\n🎮 Adding Player: ${gameName}#${tagLine} to room ${roomId}`);
    
    // Verify with Riot API
    console.log('\n✓ Verifying with Riot API...');
    const riotResponse = await axios.get(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      { headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }, timeout: 10000 }
    );
    const riotPuuid = riotResponse.data.puuid;
    console.log(`✓ Riot verification passed: ${riotPuuid.slice(0, 12)}...`);

    // Get comprehensive data from Henrik
    const { accountData, rankData, matchStats } = await getPlayerData(gameName, tagLine);
    const finalPuuid = accountData.puuid || riotPuuid;

    // Save to Supabase
    const { data, error } = await supabase
      .from('players')
      .insert([{
        room_id: roomId,
        game_name: gameName,
        tag_line: tagLine,
        puuid: finalPuuid,
        region: accountData.region,
        account_level: accountData.account_level,
        card_small: accountData.card_small,
        rank_tier: rankData.currenttier,
        rank_name: rankData.currenttierpatched,
        rr: rankData.ranking_in_tier,
        elo: rankData.elo,
        peak_rank: rankData.peak_rank,
        total_matches: matchStats.total_matches,
        wins: matchStats.wins,
        losses: matchStats.losses,
        win_rate: matchStats.win_rate,
        avg_score: matchStats.avg_score,
        avg_kills: matchStats.avg_kills,
        avg_deaths: matchStats.avg_deaths,
        avg_assists: matchStats.avg_assists,
        kd_ratio: matchStats.kd_ratio,
        headshot_percent: matchStats.headshot_percent,
        most_played_agent: matchStats.most_played_agent
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save player' });
    }

    console.log(`\n✅ Player added successfully!\n`);
    res.json({ 
      success: true, 
      player: { gameName, tagLine, rank: rankData.currenttierpatched, stats: matchStats } 
    });
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Riot ID not found' });
    } else {
      res.status(500).json({ error: 'Failed to add player' });
    }
  }
});

// Get players in room
app.get('/api/rooms/:roomId/players', async (req, res) => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('room_id', req.params.roomId)
    .order('elo', { ascending: false });

  if (error) {
    console.error('Error fetching players:', error);
    return res.status(500).json({ error: 'Failed to fetch players' });
  }

  res.json(data);
});

// Add time slot
app.post('/api/rooms/:roomId/timeslots', async (req, res) => {
  const { roomId } = req.params;
  const { date, time } = req.body;

  const { data, error } = await supabase
    .from('time_slots')
    .insert([{ room_id: roomId, date, time }])
    .select()
    .single();

  if (error) {
    console.error('Error adding time slot:', error);
    return res.status(500).json({ error: 'Failed to add time slot' });
  }

  res.json(data);
});

// Get time slots with vote counts
app.get('/api/rooms/:roomId/timeslots', async (req, res) => {
  const { data: slots, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('room_id', req.params.roomId)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) {
    console.error('Error fetching time slots:', error);
    return res.status(500).json({ error: 'Failed to fetch time slots' });
  }

  // Get vote counts for each slot
  const slotsWithCounts = await Promise.all(slots.map(async (slot) => {
    const { data: votes } = await supabase
      .from('votes')
      .select('available')
      .eq('slot_id', slot.id);

    const available_count = votes?.filter(v => v.available).length || 0;
    const unavailable_count = votes?.filter(v => !v.available).length || 0;

    return { ...slot, available_count, unavailable_count };
  }));

  res.json(slotsWithCounts);
});

// Get votes for a specific time slot
app.get('/api/timeslots/:slotId/votes', async (req, res) => {
  const { data, error } = await supabase
    .from('votes')
    .select('player_name, available')
    .eq('slot_id', req.params.slotId)
    .order('voted_at', { ascending: false });

  if (error) {
    console.error('Error fetching votes:', error);
    return res.status(500).json({ error: 'Failed to fetch votes' });
  }

  res.json(data);
});

// Vote on time slot
app.post('/api/timeslots/:slotId/vote', async (req, res) => {
  const { slotId } = req.params;
  const { playerName, available } = req.body;

  const { data, error } = await supabase
    .from('votes')
    .upsert(
      { slot_id: parseInt(slotId), player_name: playerName, available },
      { onConflict: 'slot_id,player_name' }
    )
    .select();

  if (error) {
    console.error('Error voting:', error);
    return res.status(500).json({ error: 'Failed to vote' });
  }

  res.json({ success: true });
});

// Delete a time slot
app.delete('/api/timeslots/:slotId', async (req, res) => {
  const { slotId } = req.params;

  // Votes will be automatically deleted due to CASCADE
  const { error } = await supabase
    .from('time_slots')
    .delete()
    .eq('id', slotId);

  if (error) {
    console.error('Error deleting time slot:', error);
    return res.status(500).json({ error: 'Failed to delete time slot' });
  }

  res.json({ success: true, message: 'Time slot deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Valorant Squad Scheduler`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✓ Server: http://localhost:${PORT}`);
  console.log(`✓ Riot API: ${process.env.RIOT_API_KEY ? '✅ Connected' : '❌ Missing'}`);
  console.log(`✓ Henrik API: ${HENRIK_KEY ? '✅ Connected' : '❌ Missing'}`);
  console.log(`✓ Supabase: ${process.env.SUPABASE_URL ? '✅ Connected' : '❌ Missing'}`);
  console.log(`${'='.repeat(60)}\n`);
});
