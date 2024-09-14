import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerCard from "../components/player/playerCard";

export interface PlayerInfos {
  sweaterNumber: string;
  positionCode: string;
  firstName: { default: string };
  lastName: { default: string };
  id: string;
  headshot: string;
}

interface Team {
  color: string;
  teamAbbrev: { default: string };
  teamName: { default: string; fr: string };
}

const TeamRoster: React.FC = () => {
  const { teamAbbrev } = useParams<{
    teamCommonName: string;
    teamAbbrev: string;
  }>();
  const [players, setPlayers] = useState<PlayerInfos[]>([]);
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playerRes = await fetch(
          `https://api-web.nhle.com/v1/roster/${teamAbbrev}/current`
        );
        if (!playerRes.ok) throw new Error("Failed to fetch players");
        const playerData = await playerRes.json();

        const playersArray: PlayerInfos[] = [
          ...(playerData.forwards || []),
          ...(playerData.defensemen || []),
          ...(playerData.goalies || []),
        ];

        setPlayers(playersArray);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching players:", error.message);
          setError(error.message);
        } else {
          console.error("An unexpected error occurred");
          setError("An unexpected error occurred");
        }
      }
    };

    const fetchTeamColor = async () => {
      try {
        const colorRes = await fetch("/teamColor.json");
        if (!colorRes.ok) throw new Error("Failed to fetch team colors");
        const colorData: Record<string, Team> = await colorRes.json();

        const teamInfo = colorData[teamAbbrev as keyof typeof colorData];
        if (teamInfo) {
          setTeamColor(teamInfo.color);
        } else {
          setError("Team color not found");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching team color:", error.message);
          setError(error.message);
        } else {
          console.error("An unexpected error occurred");
          setError("An unexpected error occurred");
        }
      }
    };

    fetchPlayers();
    fetchTeamColor();
  }, [teamAbbrev]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Separate players by position
  const forwards = players.filter(
    (player) =>
      player.positionCode === "C" ||
      player.positionCode === "L" ||
      player.positionCode === "R"
  );
  const defensemen = players.filter((player) => player.positionCode === "D");
  const goalies = players.filter((player) => player.positionCode === "G");

  return (
    <section className="hero">
      <div className="wrapper">
        <h1>Joueurs de l'équipe {teamAbbrev}</h1>
        <div>
          <div className="player-position">
            <h2>Attaquants :</h2>
            <div className="cards">
              {forwards.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  teamAbbrev={teamAbbrev}
                  teamColor={teamColor}
                />
              ))}
            </div>
          </div>
          <div className="player-position">
            <h2>Défenseurs :</h2>
            <div className="cards">
              {defensemen.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  teamAbbrev={teamAbbrev}
                  teamColor={teamColor}
                />
              ))}
            </div>
          </div>
          <div className="player-position">
            <h2>Gardiens :</h2>
            <div className="cards">
              {goalies.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  teamAbbrev={teamAbbrev}
                  teamColor={teamColor}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamRoster;
