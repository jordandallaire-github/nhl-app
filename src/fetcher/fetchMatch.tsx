import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { INTMainGameInfos /* INTGoal */ } from "../interfaces/main-match";
import { INTMoreGameInfos } from "../interfaces/more-detail-match";
import SingleMatch from "../components/match/single-match";
/* import { IReplayFrame } from "../interfaces/goal-simulation"; */
import { INTGameVideo } from "../interfaces/game-video";
import { INTBoxscore } from "../interfaces/boxscores";
import { INTPlayByPlay } from "../interfaces/playByPlay";
import { PlayerDetailsType } from "../interfaces/player/playerDetails";
import { loaderComponent } from "../components/utils/loader";

type TeamColors = {
  [key: string]: {
    color: string;
  };
};

const Match: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [mainGameInfos, setMainGameInfos] = useState<INTMainGameInfos | null>(
    null
  );
  const [moreGameInfos, setMoreGameInfos] = useState<INTMoreGameInfos | null>(
    null
  );
  const [gameVideo, setGameVideo] = useState<INTGameVideo | null>(null);
  const [boxscore, setBoxscore] = useState<INTBoxscore | null>(null);
  const [plays, setPlayByPlay] = useState<INTPlayByPlay | null>(null);
  const [homeTeamRoster, setHomeTeamRoster] = useState<PlayerDetailsType[]>([]);
  const [awayTeamRoster, setAwayTeamRoster] = useState<PlayerDetailsType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [teamColors, setTeamColors] = useState<{
    home: string;
    away: string;
  } | null>(null);

  const isBuildProduction = false
  const path = isBuildProduction ? "/projets/jdh/" : "/";
  const apiWeb = isBuildProduction
    ? "/proxy.php/"
    : "https://api-web.nhle.com/";
  const apiForge = isBuildProduction
    ? "/proxy.php/"
    : "https://forge-dapi.d3.nhle.com/";

  /*   const [replayData, setReplayData] = useState<{
    [goalId: string]: IReplayFrame[];
  }>({}); */

  const fetchTeamColors = useCallback(async () => {
    try {
      const response = await fetch(`${path}teamColor.json`);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des couleurs des équipes"
        );
      }
      const colors: TeamColors = await response.json();
      return colors;
    } catch (err) {
      console.error("Erreur lors du chargement des couleurs des équipes:", err);
      return null;
    }
  }, [path]);

  /*   const fetchReplayData = useCallback(async (goal: INTGoal) => {
    if (!goal.pptReplayUrl) return;

    try {
      const response = await fetch(goal.pptReplayUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch replay data for goal`);
      }

      const data: IReplayFrame[] = await response.json();
      setReplayData((prevData) => ({
        ...prevData,
        [goal.pptReplayUrl]: data,
      }));
    } catch (err) {
      console.error(`Error fetching replay data for goal:`, err);
    }
  }, []); */

  const fetchRosters = useCallback(
    async (homeTeamAbbrev: string, awayTeamAbbrev: string) => {
      try {
        const [rosterAwayResponse, rosterHomeResponse] = await Promise.all([
          fetch(`${apiWeb}v1/roster/${awayTeamAbbrev}/current`),
          fetch(`${apiWeb}v1/roster/${homeTeamAbbrev}/current`),
        ]);

        if (!rosterAwayResponse.ok || !rosterHomeResponse.ok) {
          throw new Error("Erreur lors de la récupération des rosters");
        }

        const awayRosterData = await rosterAwayResponse.json();
        const homeRosterData = await rosterHomeResponse.json();

        const awayRosterArray: PlayerDetailsType[] = [
          ...(awayRosterData.forwards || []),
          ...(awayRosterData.defensemen || []),
          ...(awayRosterData.goalies || []),
        ];

        const homeRosterArray: PlayerDetailsType[] = [
          ...(homeRosterData.forwards || []),
          ...(homeRosterData.defensemen || []),
          ...(homeRosterData.goalies || []),
        ];

        setAwayTeamRoster(awayRosterArray);
        setHomeTeamRoster(homeRosterArray);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    },
    [apiWeb]
  );

  const fetchMatchData = useCallback(async () => {
    if (!matchId) {
      setError("ID du match non trouvé");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Premier groupe de fetches pour obtenir les informations de base
      const [
        mainGameInfosResponse,
        moreGameInfosResponse,
        boxscoreResponse,
        playsResponse,
        gameVideoResponse,
        teamColorsData,
      ] = await Promise.all([
        fetch(`${apiWeb}v1/gamecenter/${matchId}/landing`),
        fetch(`${apiWeb}v1/gamecenter/${matchId}/right-rail`),
        fetch(`${apiWeb}v1/gamecenter/${matchId}/boxscore`),
        fetch(`${apiWeb}v1/gamecenter/${matchId}/play-by-play`),
        fetch(
          `${apiForge}v2/content/fr-ca/videos?context.slug=nhl&tags.slug=highlight&tags.slug=gameid-${matchId}`
        ),
        fetchTeamColors(),
      ]);

      if (
        !mainGameInfosResponse.ok ||
        !moreGameInfosResponse.ok ||
        !boxscoreResponse.ok ||
        !playsResponse.ok
      ) {
        throw new Error("Erreur lors de la récupération des données du match");
      }

      const dataMainGameInfos: INTMainGameInfos =
        await mainGameInfosResponse.json();
      const dataMoreGameInfos: INTMoreGameInfos =
        await moreGameInfosResponse.json();
      const dataBoxscore: INTBoxscore = await boxscoreResponse.json();
      const dataPlays: INTPlayByPlay = await playsResponse.json();
      const dataGameVideo: INTGameVideo = await gameVideoResponse.json();

      await fetchRosters(
        dataMainGameInfos.homeTeam.abbrev,
        dataMainGameInfos.awayTeam.abbrev
      );

      setMainGameInfos(dataMainGameInfos);
      setMoreGameInfos(dataMoreGameInfos);
      setGameVideo(dataGameVideo);
      setBoxscore(dataBoxscore);
      setPlayByPlay(dataPlays);

      /*       if (dataMainGameInfos.summary && dataMainGameInfos.summary.scoring) {
        const replayPromises = dataMainGameInfos.summary.scoring.flatMap(
          (period) => period.goals.map((goal) => fetchReplayData(goal))
        );
        await Promise.all(replayPromises);
      } */

      if (teamColorsData) {
        const homeTeamAbbrev = dataMainGameInfos.homeTeam.abbrev;
        const awayTeamAbbrev = dataMainGameInfos.awayTeam.abbrev;
        setTeamColors({
          home: teamColorsData[homeTeamAbbrev]?.color || "#000000",
          away: teamColorsData[awayTeamAbbrev]?.color || "#000000",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [
    matchId,
    apiWeb,
    apiForge,
    fetchTeamColors,
    fetchRosters,
  ]); /* fetchReplayData */

  useEffect(() => {
    fetchMatchData();
  }, [fetchMatchData]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (loading) {
    return <>{loaderComponent()}</>;
  }

  const forwardsAway = awayTeamRoster.filter((player) =>
    ["C", "L", "R"].includes(player.positionCode)
  );
  const defensemenAway = awayTeamRoster.filter(
    (player) => player.positionCode === "D"
  );
  const goaliesAway = awayTeamRoster.filter(
    (player) => player.positionCode === "G"
  );

  const forwardsHome = homeTeamRoster.filter((player) =>
    ["C", "L", "R"].includes(player.positionCode)
  );
  const defensemenHome = homeTeamRoster.filter(
    (player) => player.positionCode === "D"
  );
  const goaliesHome = homeTeamRoster.filter(
    (player) => player.positionCode === "G"
  );

  return (
    <>
      <SingleMatch
        gameInfos={mainGameInfos}
        gameMoreInfos={moreGameInfos}
        teamColors={teamColors}
        /* goalSimulation={replayData} */
        gameVideo={gameVideo}
        boxscore={boxscore}
        plays={plays}
        homeRoster={[...forwardsHome, ...defensemenHome, ...goaliesHome]}
        awayRoster={[...forwardsAway, ...defensemenAway, ...goaliesAway]}
      />
    </>
  );
};

export default Match;
