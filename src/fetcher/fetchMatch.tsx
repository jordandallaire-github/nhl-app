import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { INTMainGameInfos, /* INTGoal */ } from "../interfaces/main-match";
import { INTMoreGameInfos } from "../interfaces/more-detail-match";
import SingleMatch from "../components/match/single-match";
/* import { IReplayFrame } from "../interfaces/goal-simulation"; */
import { INTGameVideo } from "../interfaces/game-video";

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
  const [gameVideo, setGameVideo] = useState<INTGameVideo | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [teamColors, setTeamColors] = useState<{
    home: string;
    away: string;
  } | null>(null);

/*   const [replayData, setReplayData] = useState<{
    [goalId: string]: IReplayFrame[];
  }>({}); */

  const fetchTeamColors = useCallback(async () => {
    try {
      const response = await fetch("/teamColor.json");
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
  }, []);

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

  const fetchStanding = useCallback(async () => {
    if (!matchId) {
      setError("ID du match non trouvé");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [mainGameInfosResponse, moreGameInfosResponse, gameVideoResponse ,teamColorsData] =
        await Promise.all([
          fetch(`https://api-web.nhle.com/v1/gamecenter/${matchId}/landing`),
          fetch(`https://api-web.nhle.com/v1/gamecenter/${matchId}/right-rail`),
          fetch(`https://forge-dapi.d3.nhle.com/v2/content/fr-ca/videos?context.slug=nhl&tags.slug=highlight&tags.slug=gameid-${matchId}`),
          fetchTeamColors(),
        ]);

      if (!mainGameInfosResponse.ok || !moreGameInfosResponse.ok || !gameVideoResponse) {
        throw new Error("Erreur lors de la récupération des données du match");
      }

      const dataMainGameInfos: INTMainGameInfos =
        await mainGameInfosResponse.json();
      const dataMoreGameInfos: INTMoreGameInfos =
        await moreGameInfosResponse.json();
        const dataGameVideo: INTGameVideo =
        await gameVideoResponse.json();

      setMainGameInfos(dataMainGameInfos);
      setMoreGameInfos(dataMoreGameInfos);
      setGameVideo(dataGameVideo);

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
  }, [matchId, fetchTeamColors, /* fetchReplayData */]);

  useEffect(() => {
    fetchStanding();
  }, [fetchStanding]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <SingleMatch
        gameInfos={mainGameInfos}
        gameMoreInfos={moreGameInfos}
        teamColors={teamColors}
        /* goalSimulation={replayData} */
        gameVideo={gameVideo}
      />
    </>
  );
};

export default Match;
