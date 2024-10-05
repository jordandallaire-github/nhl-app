import React, { useCallback, useEffect, useState } from "react";
import { INTStanding, INTStandingOtherInfos } from "../interfaces/standing";
import SingleStanding from "../components/single-standing";

const StatsLeader: React.FC = () => {
  const [standing, setStanding] = useState<INTStanding | null>(null);
  const [standingOther, setStandingOther] =
    useState<INTStandingOtherInfos | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStanding = useCallback(async () => {
    setLoading(true);
    try {
      const responseOtherTeamInfos = await fetch(
        `https://api.nhle.com/stats/rest/en/team/summary?isAggregate=false&isGame=false&sort=%5B%7B%22property%22:%22points%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22wins%22,%22direction%22:%22DESC%22%7D,%7B%22property%22:%22teamId%22,%22direction%22:%22ASC%22%7D%5D&start=0&limit=50&cayenneExp=gameTypeId=2%20and%20seasonId%3C=20242025%20and%20seasonId%3E=20242025`
      );
      if (!responseOtherTeamInfos.ok) {
        throw new Error("Erreur lors de la récupération des autres stats.");
      }
      const dataOtherInfos: INTStandingOtherInfos =
        await responseOtherTeamInfos.json();
      setStandingOther(dataOtherInfos);

      const response = await fetch(`https://api-web.nhle.com/v1/standings/now`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du classement.");
      }
      const data: INTStanding = await response.json();
      setStanding(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, []);

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
      <SingleStanding
        standingOther={standingOther}
        standing={standing}
      ></SingleStanding>
    </>
  );
};

export default StatsLeader;
