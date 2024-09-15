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
  teamCommonName?: string;
}

interface Team {
  color: string;
  teamAbbrev: { default: string };
  teamCommonName: { default: string; fr: string };
}

const TeamRoster: React.FC = () => {
  const { teamCommonName } = useParams<{ teamCommonName: string }>();
  const [teamAbbrev, setTeamAbbrev] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerInfos[]>([]);
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch team abbreviation based on teamCommonName
  useEffect(() => {
    const fetchTeamAbbrev = async () => {
      try {
        const res = await fetch("https://api-web.nhle.com/v1/standings/now");
        if (!res.ok) throw new Error("Failed to fetch team data");
        const data = await res.json();
  
        // Accéder à la liste des équipes dans "standings"
        const teams = data.standings || [];
  
        const team = teams.find(
          (t: Team) =>
            t.teamCommonName.default.toLowerCase().replace(/\s+/g, "-") ===
            teamCommonName
        );
        if (team) {
          setTeamAbbrev(team.teamAbbrev.default);
        } else {
          throw new Error("Team not found");
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };
  
    fetchTeamAbbrev();
  }, [teamCommonName]);

  // Fetch players based on teamAbbrev
  useEffect(() => {
    if (teamAbbrev) {
      const fetchPlayers = async () => {
        setLoading(true);
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
          setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchPlayers();
    }
  }, [teamAbbrev]);

  // Fetch team color based on teamAbbrev
  useEffect(() => {
    if (teamAbbrev) {
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
          setError(error instanceof Error ? error.message : "An error occurred");
        }
      };

      fetchTeamColor();
    }
  }, [teamAbbrev]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

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
        <h1>Joueurs de l'équipe {teamCommonName}</h1>
        <div>
          <div className="player-position">
            <h2>Attaquants :</h2>
            <div className="cards">
              {forwards.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  teamColor={teamColor}
                  teamAbbrev={teamAbbrev ?? ""}
                  teamCommonName={teamCommonName}
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
                  teamColor={teamColor}
                  teamAbbrev={teamAbbrev ?? ""}
                  teamCommonName={teamCommonName}
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
                  teamColor={teamColor}
                  teamAbbrev={teamAbbrev ?? ""}
                  teamCommonName={teamCommonName}
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
