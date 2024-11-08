import React, { useCallback, useEffect, useState } from "react";
import {
  LeaderPlayerStats,
  LeaderGoalieStats,
} from "../interfaces/leader-stats";
import SingleLeaderStats from "../components/single-stats-leader";
import { loaderComponent } from "../components/utils/loader";

const StatsLeader: React.FC = () => {
  const [playerStats, setPlayerStats] = useState<LeaderPlayerStats | null>(
    null
  );
  const [goalieStats, setGoalieStats] = useState<LeaderGoalieStats | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isBuildProduction = false
  const apiWeb = isBuildProduction ? "/proxy.php/" : "https://api-web.nhle.com/"

  const fetchStanding = useCallback(async () => {
    setLoading(true);
    try {
      const responsePlayerStats = await fetch(
        `${apiWeb}v1/skater-stats-leaders/current`
      );
      if (!responsePlayerStats.ok) {
        throw new Error(
          "Erreur lors de la récupération des stats des joueurs."
        );
      }
      const dataPlayerStats: LeaderPlayerStats =
        await responsePlayerStats.json();
      setPlayerStats(dataPlayerStats);

      const responseGoalieStats = await fetch(
        `${apiWeb}v1/goalie-stats-leaders/current`
      );
      if (!responseGoalieStats.ok) {
        throw new Error("Erreur lors de la récupération du classement.");
      }
      const dataGoalieStats: LeaderGoalieStats =
        await responseGoalieStats.json();
      setGoalieStats(dataGoalieStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [apiWeb]);

  useEffect(() => {
    fetchStanding();
  }, [fetchStanding]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (loading) {
    return (
      <>
        {loaderComponent()}
      </>
    );
  }

  return (
    <>
      <SingleLeaderStats
        player={playerStats}
        goalie={goalieStats}
      ></SingleLeaderStats>
    </>
  );
};

export default StatsLeader;
