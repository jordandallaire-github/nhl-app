import React, { useEffect, useState } from 'react';
import PlayerCard from '../components/player/playerCard'; // Chemin correct vers PlayerCard

 export interface Player {
  sweaterNumber: string;
  positionCode: string;
  firstName: { default: string };
  lastName: { default: string };
  id: string;
  teamAbbrev?: string;
  headshot: string;
  teamLogo?: string;
  teamName: string;
  shootsCatches: string;
}

interface Team {
  teamAbbrev: { default: string };
  teamLogo: string;
  teamName: { default: string; fr: string };
}

const PlayerInfos: React.FC = () => {
  const [teams, setTeams] = useState<{ [key: string]: { teamLogo: string; teamName: string } }>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamsAndPlayers = async () => {
      try {
        // Fetch all teams
        const teamRes = await fetch('https://api-web.nhle.com/v1/standings/now');
        if (!teamRes.ok) throw new Error('Failed to fetch teams');
        const teamData = await teamRes.json();

        const teamMap: { [key: string]: { teamLogo: string, teamName: string } } = {};

        teamData.standings.forEach((team: Team) => {
          if (team.teamAbbrev.default !== 'ARI') {
            teamMap[team.teamAbbrev.default] = {
              teamLogo: team.teamLogo,
              teamName: team.teamName.fr,
            };
          }
        });

        setTeams(teamMap);

        // Fetch players for each team
        const playerPromises = Object.keys(teamMap).map(async (teamAbbrev) => {
          const playerRes = await fetch(`https://api-web.nhle.com/v1/roster/${teamAbbrev}/current`);
          if (!playerRes.ok) throw new Error(`Failed to fetch players for team ${teamAbbrev}`);
          const playerData = await playerRes.json();

          const playersArray: Player[] = [
            ...(playerData.forwards || []),
            ...(playerData.defensemen || []),
            ...(playerData.goalies || []),
          ];

          // Add teamAbbrev and teamLogo to each player
          return playersArray.map(player => ({
            ...player,
            sweaterNumber: player.sweaterNumber || '00', // Handle undefined sweaterNumber
            teamAbbrev: teamAbbrev,
            teamLogo: teamMap[teamAbbrev].teamLogo,
            teamName: teamMap[teamAbbrev].teamName,
          }));
        });

        const playersData = await Promise.all(playerPromises);
        setPlayers(playersData.flat());
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching data:', error.message);
          setError(error.message);
        } else {
          console.error('An unexpected error occurred');
          setError('An unexpected error occurred');
        }
      }
    };

    fetchTeamsAndPlayers();
  }, []);

  useEffect(() => {
    let filtered = players;

    if (selectedTeam) {
      filtered = filtered.filter(player => player.teamAbbrev === selectedTeam);
    }

    if (selectedPositions.length > 0) {
      filtered = filtered.filter(player => selectedPositions.includes(player.positionCode));
    }

    setFilteredPlayers(selectedTeam ? filtered : []); // Ensure no players are shown if none match
  }, [selectedTeam, selectedPositions, players]);

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeam(e.target.value);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedPositions: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        if (options[i].value === 'F') {
          selectedPositions.push('C', 'L', 'R');
        } else {
          selectedPositions.push(options[i].value);
        }
      }
    }
    setSelectedPositions(selectedPositions);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Joueur dans la LNH</h1>
      <div>
        <label>Select a Team: </label>
        <select onChange={handleTeamChange} value={selectedTeam}>
          <option value="">Sélectionné une équipe</option>
          {Object.keys(teams).map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Positions: </label>
        <select onChange={handlePositionChange}>
          <option value="F">Attaquant</option>
          <option value="C">Centre</option>
          <option value="L">Ailier gauche</option>
          <option value="R">Ailier droit</option>
          <option value="D">Defenseur</option>
          <option value="G">Gardien</option>
        </select>
      </div>

      <div className="players-cards">
        {filteredPlayers.map((player, index) => (
          <PlayerCard key={index} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayerInfos;
