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
import { loaderComponent } from "../components/utils/loader";

interface TeamRanking {
  divisionRank: number;
  conferenceRank: number;
  leagueRank: number;
}

const TeamDetails: React.FC = () => {
  const { teamCommonName } = useParams<{ teamCommonName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [teamRecord, setTeamRecord] = useState<TeamDetail>();
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
  const [teamRanking, setTeamRanking] = useState<TeamRanking>({
    divisionRank: 0,
    conferenceRank: 0,
    leagueRank: 0,
  });

  const activeSection = searchParams.get("section") || "accueil";
  const showCalendar = activeSection === "calendrier";
  const showPlayerStats = activeSection === "statistiques";

  const isBuildProduction = true;
  const path = isBuildProduction ? "/projets/jdh/" : "/";
  const apiWeb = isBuildProduction
    ? "/proxy.php/"
    : "https://api-web.nhle.com/";

  const calculateRankings = (
    standings: TeamDetail[],
    currentTeam: TeamDetail
  ): TeamRanking => {
    const sortedTeams = [...standings].sort((a, b) => {
      const pointsDiff = (b.points || 0) - (a.points || 0);
      if (pointsDiff !== 0) return pointsDiff;

      const winsDiff = (b.wins || 0) - (a.wins || 0);
      if (winsDiff !== 0) return winsDiff;

      return (b.goalDifferential || 0) - (a.goalDifferential || 0);
    });

    const divisionTeams = sortedTeams.filter(
      (team) => team.divisionName === currentTeam.divisionName
    );
    const conferenceTeams = sortedTeams.filter(
      (team) => team.conferenceName === currentTeam.conferenceName
    );

    return {
      divisionRank:
        divisionTeams.findIndex(
          (team) => team.teamAbbrev.default === currentTeam.teamAbbrev.default
        ) + 1,
      conferenceRank:
        conferenceTeams.findIndex(
          (team) => team.teamAbbrev.default === currentTeam.teamAbbrev.default
        ) + 1,
      leagueRank:
        sortedTeams.findIndex(
          (team) => team.teamAbbrev.default === currentTeam.teamAbbrev.default
        ) + 1,
    };
  };

  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiWeb}v1/standings/now`);
      if (!res.ok) throw new Error("Failed to fetch team data");
      const data = await res.json();
      const team = data.standings?.find(
        (t: TeamDetail) =>
          t.teamCommonName?.default?.toLowerCase().replace(/\s+/g, "-") ===
          teamCommonName
      );

      if (team) {
        setTeamRecord(team);
        const teamAbbrev = team.teamAbbrev.default;
        setTeamAbbrev(teamAbbrev);

        const rankings = calculateRankings(data.standings, team);
        setTeamRanking(rankings);

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

  const handleMonthChange = useCallback(
    async (direction: "previous" | "next") => {
      if (!teamAbbrev || !schedule) return;
  
      let newMonth: Date;
      if (direction === "previous" && schedule.previousMonth) {
        newMonth = new Date(schedule.previousMonth);
      } else if (direction === "next" && schedule.nextMonth) {
        newMonth = new Date(schedule.nextMonth);
      } else {
        return;
      }
  
      try {
        const res = await fetch(
          `${apiWeb}v1/club-schedule/${teamAbbrev}/month/${newMonth
            .toISOString()
            .slice(0, 7)}`
        );
        if (!res.ok) throw new Error("Failed to fetch new schedule");
        const newSchedule: INTeamSchedule = await res.json();
        setSchedule(newSchedule);
      } catch (error) {
        console.error(
          "Error fetching new schedule:",
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    },
    [teamAbbrev, apiWeb, schedule]
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <>{loaderComponent()}</>;
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
      searchParams.delete("section");
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
        otLoss={teamRecord?.otLosses ?? 0}
        loss={teamRecord?.losses ?? 0}
        wins={teamRecord?.wins ?? 0}
        division={teamRanking.divisionRank}
        conference={teamRanking.conferenceRank}
        league={teamRanking.leagueRank}
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
          onMonthChange={handleMonthChange} 
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
