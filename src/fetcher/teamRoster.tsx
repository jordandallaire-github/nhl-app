import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import SingleTeamPlayerGroup from "../components/team/single/single-team-player";
import { PlayerDetailsType } from "../interfaces/player/playerDetails";
import { TeamDetails } from "../interfaces/team/teamDetails";

const TeamRoster: React.FC = () => {
  const { teamCommonName } = useParams<{ teamCommonName: string }>();
  const [teamAbbrev, setTeamAbbrev] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerDetailsType[]>([]);
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api-web.nhle.com/v1/standings/now");
      if (!res.ok) throw new Error("Failed to fetch team data");
      const data = await res.json();
      const team = data.standings?.find(
        (t: TeamDetails) =>
          t.teamCommonName.default.toLowerCase().replace(/\s+/g, "-") ===
          teamCommonName
      );

      if (team) {
        const teamAbbrev = team.teamAbbrev.default;
        setTeamAbbrev(teamAbbrev);

        const playerRes = await fetch(
          `https://api-web.nhle.com/v1/roster/${teamAbbrev}/current`
        );
        if (!playerRes.ok) throw new Error("Failed to fetch players");
        const playerData = await playerRes.json();

        const playersArray: PlayerDetailsType[] = [
          ...(playerData.forwards || []),
          ...(playerData.defensemen || []),
          ...(playerData.goalies || []),
        ];
        setPlayers(playersArray);

        const colorRes = await fetch("/teamColor.json");
        if (!colorRes.ok) throw new Error("Failed to fetch team colors");
        const colorData: Record<string, TeamDetails> = await colorRes.json();
        const teamInfo = colorData[teamAbbrev as keyof typeof colorData];
        if (teamInfo) {
          setTeamColor(teamInfo.color);
        } else {
          setError("Team color not found");
        }
      } else {
        throw new Error("Team not found");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [teamCommonName]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const forwards = players.filter((player) =>
    ["C", "L", "R"].includes(player.positionCode)
  );
  const defensemen = players.filter((player) => player.positionCode === "D");
  const goalies = players.filter((player) => player.positionCode === "G");

  return (
    <section className="hero">
      <div className="wrapper">
        <h1>Joueurs de l'équipe {teamCommonName}</h1>
        <SingleTeamPlayerGroup
          title="Attaquants"
          players={forwards}
          teamColor={teamColor}
          teamAbbrev={teamAbbrev ?? ""}
          teamCommonName={teamCommonName}
        />
        <SingleTeamPlayerGroup
          title="Défenseurs"
          players={defensemen}
          teamColor={teamColor}
          teamAbbrev={teamAbbrev ?? ""}
          teamCommonName={teamCommonName}
        />
        <SingleTeamPlayerGroup
          title="Gardiens"
          players={goalies}
          teamColor={teamColor}
          teamAbbrev={teamAbbrev ?? ""}
          teamCommonName={teamCommonName}
        />
      </div>
    </section>
  );
};

export default TeamRoster;
