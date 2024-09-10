import React, { useEffect, useState } from 'react';

interface Player {
  sweaterNumber: string;
  positionCode: string;
  firstName: { default: string };
  lastName: { default: string };
  id: string;
  teamAbbrev?: string;
  headshot: string;
  teamLogo: string;
}

interface Team {
  teamAbbrev: { default: string };
  teamLogo : string;
}

const NHLTeams: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
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

        const teamCodes = teamData.standings
          .map((team: Team) => team.teamAbbrev.default)
          .filter((teamCode: string) => teamCode !== 'ARI'); // Exclude Arizona team

        setTeams(teamCodes);

        // Fetch players for each team
        const playerPromises = teamCodes.map(async (team : Team) => {
          const playerRes = await fetch(`https://api-web.nhle.com/v1/roster/${team}/current`);
          if (!playerRes.ok) throw new Error(`Failed to fetch players for team ${team}`);
          const playerData = await playerRes.json();

          const playersArray: Player[] = [
            ...(playerData.forwards || []),
            ...(playerData.defensemen || []),
            ...(playerData.goalies || []),
          ];

          // Add teamAbbrev to each player
          return playersArray.map(player => ({
            ...player,
            sweaterNumber: player.sweaterNumber || '00', // Handle undefined sweaterNumber
            teamAbbrev: team,
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
      <h1>NHL Teams and Players</h1>
      <div>
        <label>Select a Team: </label>
        <select onChange={handleTeamChange} value={selectedTeam}>
          <option value="">Select a team</option>
          {teams.map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Select Positions: </label>
        <select onChange={handlePositionChange}>
          <option value="F">Forwards</option>
          <option value="C">Centre</option>
          <option value="L">Left Wing</option>
          <option value="R">Right Wing</option>
          <option value="D">Defensemen</option>
          <option value="G">Goalie</option>
        </select>
      </div>

      <ul>
        {filteredPlayers.map((player, index) => (
          <li key={index}>
            {player.teamAbbrev} | #{player.sweaterNumber} {player.positionCode} {player.firstName.default} {player.lastName.default}
            <img src={`${player.headshot}`} alt={`${player.firstName.default} ${player.lastName.default}`} />
            <img src={`${player.teamLogo}`} alt={`${player.teamAbbrev} logo`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NHLTeams;
