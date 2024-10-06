import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { INTMainGameInfos } from "../interfaces/main-match";
import { INTMoreGameInfos } from "../interfaces/more-detail-match";
import SingleMatch from "../components/single-match";

const Match: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [mainGameInfos, setMainGameInfos] = useState<INTMainGameInfos | null>(null);
  const [moreGameInfos, setMoreGameInfos] = useState<INTMoreGameInfos | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStanding = useCallback(async () => {
    if (!matchId) {
      setError("ID du match non trouvé");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const responseMainGameInfos = await fetch(
        `https://api-web.nhle.com/v1/gamecenter/${matchId}/landing`
      );
      if (!responseMainGameInfos.ok) {
        throw new Error("Erreur lors de la récupération des détails du match");
      }
      const dataMainGameInfos: INTMainGameInfos = await responseMainGameInfos.json();
      setMainGameInfos(dataMainGameInfos);

      const responseMoreGameInfos = await fetch(
        `https://api-web.nhle.com/v1/gamecenter/${matchId}/right-rail`
      );
      if (!responseMoreGameInfos.ok) {
        throw new Error("Erreur lors de la récupération des stats avancées du match.");
      }
      const dataMoreGameInfos: INTMoreGameInfos = await responseMoreGameInfos.json();
      setMoreGameInfos(dataMoreGameInfos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

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
      />
    </>
  );
};

export default Match;