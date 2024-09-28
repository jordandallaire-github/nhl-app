import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  const [teamAbbrev, setTeamAbbrev] = useState<string | null>(null);
  const [playersPosition, setPlayersPosition] = useState<PlayerDetailsType[]>(
    []
  );
  const [scoreBoard, setScoreBoard] = useState<TeamScoreboard | null>(null);
  const [schedule, setSchedule] = useState<INTeamSchedule | null>(null);
  const [playerStats, setTeamPlayerStats] = useState<TeamPlayerStats | null>(
    null
  );
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showPlayerStats, setShowPlayerStats] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("accueil");
  const location = useLocation();

  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api-web.nhle.com/v1/standings/now");
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
          `https://api-web.nhle.com/v1/roster/${teamAbbrev}/current`
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
          `https://api-web.nhle.com/v1/scoreboard/${teamAbbrev}/now`
        );
        if (!gameDataResponse.ok) throw new Error("Failed to fetch game data");
        const gameData: TeamScoreboard = await gameDataResponse.json();
        setScoreBoard(gameData);

        const scheduleResponse = await fetch(
          `https://api-web.nhle.com/v1/club-schedule/${teamAbbrev}/month/2024-09`
        );
        if (!scheduleResponse.ok) throw new Error("Failed to fetch game data");
        const scheduleData: INTeamSchedule = await scheduleResponse.json();
        setSchedule(scheduleData);

        const playerStatsResponse = await fetch(
          `https://api-web.nhle.com/v1/club-stats/${teamAbbrev}/now`
        );
        if (!playerStatsResponse.ok)
          throw new Error("Failed to fetch game data");
        const playerStatsData: TeamPlayerStats =
          await playerStatsResponse.json();
        setTeamPlayerStats(playerStatsData);

        const colorRes = await fetch("/teamColor.json");
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
  }, [teamCommonName]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  useEffect(() => {
    const mainElement = document.querySelector("main");
    const navPill = document.querySelector(".indicator-page-top");
    console.log(`Applying styles for ${teamCommonName}`);

    if (
      location.pathname.startsWith(`/equipes/${teamCommonName}`) &&
      teamColor &&
      mainElement &&
      navPill
    ) {
      const rgb = parseInt(teamColor.slice(1), 16);
      const r = (rgb >> 16) & 255;
      const g = (rgb >> 8) & 255;
      const b = rgb & 255;

      (navPill as HTMLDivElement).style.backgroundColor = `${teamColor}`;
      (
        navPill as HTMLDivElement
      ).style.boxShadow = `0 2px 25px 2px ${teamColor}`;
      mainElement.style.backgroundImage = `radial-gradient(circle closest-corner at 50% 0, rgba(${r}, ${g}, ${b}, 0.6) 0%, #0000 60%)`;
    } else {
      if (mainElement) {
        mainElement.style.backgroundImage = "";
      }
      if (navPill) {
        (navPill as HTMLDivElement).style.backgroundColor = "";
        (navPill as HTMLDivElement).style.boxShadow = "";
      }
    }
  }, [location.pathname, teamCommonName, teamColor]);

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

  const handleNavClick = (type: string) => {
    if (type === "calendrier") {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
    }
    if (type === "statistiques") {
      setShowPlayerStats(true);
    } else {
      setShowPlayerStats(false);
    }

    const navContainer = document.querySelector(".nav-container");
    if (navContainer) {
      navContainer.className = `nav-container ${type}`;
      setActiveTab(type);
    }
  };

  return (
    <>
      <SingleTeamHero
        teamName={teamCommonName ?? ""}
        abr={teamAbbrev}
      ></SingleTeamHero>
      <section className="nav-section">
        <div className="wrapper">
          <div className={`nav-container ${activeTab}`}>
            <p
              className={activeTab === "accueil" ? "active" : ""}
              onClick={() => handleNavClick("accueil")}
            >
              Accueil
            </p>
            <p
              className={activeTab === "calendrier" ? "active" : ""}
              onClick={() => handleNavClick("calendrier")}
            >
              Calendrier
            </p>
            <p
              className={activeTab === "statistiques" ? "active" : ""}
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
          ></SingleTeamScoreboard>
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
        ></SingleTeamSchedule>
      )}
      {!showCalendar && showPlayerStats && (
        <SingleTeamPlayerStats
          playerOtherInfos={[...forwards, ...defensemen, ...goalies]}
          playerStats={playerStats}
          abr={teamAbbrev}
          teamName={teamCommonName}
        ></SingleTeamPlayerStats>
      )}
    </>
  );
};

export default TeamDetails;
