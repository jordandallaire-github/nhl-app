import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SingleTeamPlayerGroup from "../components/team/single/single-team-player";
import { PlayerDetailsType } from "../interfaces/player/playerDetails";
import { TeamDetail } from "../interfaces/team/teamDetails";
import { TeamScoreboard } from "../interfaces/team/teamScoreboard";
import { INTeamSchedule } from "../interfaces/team/teamSchedule";
import { TeamPlayerStats } from "../interfaces/team/teamPlayerStats";
import SingleTeamScoreboard from "../components/team/single/single-team-scoreboard";
import SingleTeamHero from "../components/team/single/single-team-hero";
import SingleTeamSchedule from "../components/team/single/single-team-schedule";
import SingleTeamPlayerStats from "../components/team/single/single-team-player-stats";

const TeamDetails: React.FC = () => {
  const { teamCommonName } = useParams<{ teamCommonName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [teamAbbrev, setTeamAbbrev] = useState<string | null>(null);
  const [playersPosition, setPlayersPosition] = useState<PlayerDetailsType[]>([]);
  const [scoreBoard, setScoreBoard] = useState<TeamScoreboard | null>(null);
  const [schedule, setSchedule] = useState<INTeamSchedule | null>(null);
  const [playerStats, setTeamPlayerStats] = useState<TeamPlayerStats | null>(null);
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const activeSection = searchParams.get('section') || 'accueil';
  const showCalendar = activeSection === "calendrier";
  const showPlayerStats = activeSection === "statistiques";

  const isBuildProduction = true;
  const path = isBuildProduction ? "/projets/dist/" : "/";
  const apiWeb = isBuildProduction ? "/proxy.php/" : "https://api-web.nhle.com/"

  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiWeb}v1/standings/now`);
      if (!res.ok) throw new Error("Failed to fetch team data");
      const data = await res.json();
      const team = data.standings?.find(
        (t: TeamDetail) =>
          t.teamCommonName.default.toLowerCase().replace(/\s+/g, "-") ===
          teamCommonName
      );

      if (team) {
        const teamAbbrev = team.teamAbbrev.default;
        setTeamAbbrev(teamAbbrev);

        const playerRes = await fetch(
          `${apiWeb}v1/roster/${teamAbbrev}/current`
        );
        if (!playerRes.ok) throw new Error("Failed to fetch players");
        const playerData = await playerRes.json();

        const playersArray: PlayerDetailsType[] = [
          ...(playerData.forwards || []),
          ...(playerData.defensemen || []),
          ...(playerData.goalies || []),
        ];
        setPlayersPosition(playersArray);

        const gameDataResponse = await fetch(
          `${apiWeb}v1/scoreboard/${teamAbbrev}/now`
        );
        if (!gameDataResponse.ok) throw new Error("Failed to fetch game data");
        const gameData: TeamScoreboard = await gameDataResponse.json();
        setScoreBoard(gameData);

        const scheduleResponse = await fetch(
          `${apiWeb}v1/club-schedule/${teamAbbrev}/month/now`
        );
        if (!scheduleResponse.ok) throw new Error("Failed to fetch game data");
        const scheduleData: INTeamSchedule = await scheduleResponse.json();
        setSchedule(scheduleData);

        const playerStatsResponse = await fetch(
          `${apiWeb}v1/club-stats/${teamAbbrev}/now`
        );
        if (!playerStatsResponse.ok)
          throw new Error("Failed to fetch game data");
        const playerStatsData: TeamPlayerStats =
          await playerStatsResponse.json();
        setTeamPlayerStats(playerStatsData);

        const colorRes = await fetch(`${path}teamColor.json`);
        if (!colorRes.ok) throw new Error("Failed to fetch team colors");
        const colorData: Record<string, TeamDetail> = await colorRes.json();
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
  }, [apiWeb, path, teamCommonName]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const forwards = playersPosition.filter((player) =>
    ["C", "L", "R"].includes(player.positionCode)
  );
  const defensemen = playersPosition.filter(
    (player) => player.positionCode === "D"
  );
  const goalies = playersPosition.filter(
    (player) => player.positionCode === "G"
  );

  const handleNavClick = (section: string) => {
    if (section === "accueil") {
      searchParams.delete('section');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ section });
    }
  };

  return (
    <>
      <SingleTeamHero
        teamName={teamCommonName ?? ""}
        abr={teamAbbrev}
      />
      <section className="nav-section">
        <div className="wrapper">
          <div className={`nav-container ${activeSection}`}>
            <p
              className={activeSection === "accueil" ? "active" : ""}
              onClick={() => handleNavClick("accueil")}
            >
              Accueil
            </p>
            <p
              className={activeSection === "calendrier" ? "active" : ""}
              onClick={() => handleNavClick("calendrier")}
            >
              Calendrier
            </p>
            <p
              className={activeSection === "statistiques" ? "active" : ""}
              onClick={() => handleNavClick("statistiques")}
            >
              Statistiques
            </p>
          </div>
        </div>
      </section>

      {!showCalendar && !showPlayerStats && (
        <>
          <SingleTeamScoreboard
            teamColor={teamColor}
            teamScoreboard={scoreBoard}
          />
          <section className="roster">
            <div className="wrapper">
              <h2>Joueurs de l'équipe des {teamCommonName}</h2>
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
        </>
      )}
      {showCalendar && !showPlayerStats && (
        <SingleTeamSchedule
          abr={teamAbbrev}
          teamColor={teamColor}
          schedule={schedule}
        />
      )}
      {!showCalendar && showPlayerStats && (
        <SingleTeamPlayerStats
          teamColor={teamColor}
          playerOtherInfos={[...forwards, ...defensemen, ...goalies]}
          playerStats={playerStats}
          abr={teamAbbrev}
          teamName={teamCommonName}
        />
      )}
    </>
  );
};

export default TeamDetails;