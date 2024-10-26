import React, { useCallback, useEffect, useState } from "react";
import { INTStanding, INTStandingOtherInfos } from "../interfaces/standing";
import SingleStanding from "../components/single-standing";

const Standing: React.FC = () => {
  const [standing, setStanding] = useState<INTStanding | null>(null);
  const [standingOther, setStandingOther] =
    useState<INTStandingOtherInfos | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async (url: string, params?: URLSearchParams) => {
    const fullUrl = params ? `${url}?${params}` : url;
    const response = await fetch(fullUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur (${response.status}): ${errorText}`);
    }

    return response.json();
  };

  const fetchStanding = useCallback(async () => {
    setLoading(true);
    try {
      // Premier appel API
      const standingsData = await fetchData("/proxy.php/v1/standings/now");
      setStanding(standingsData);

      // Deuxième appel API
      const statsParams = new URLSearchParams({
        isAggregate: 'false',
        isGame: 'false',
        sort: '[{"property":"points","direction":"DESC"},{"property":"wins","direction":"DESC"},{"property":"teamId","direction":"ASC"}]',
        start: '0',
        limit: '50',
        cayenneExp: 'gameTypeId=2 and seasonId<=20242025 and seasonId>=20242025'
      });
      
      const statsData = await fetchData('/proxy.php/stats/rest/en/team/summary', statsParams);
      setStandingOther(statsData);

    } catch (err) {
      console.error("Erreur détaillée:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStanding();
  }, [fetchStanding]);

  if (error) {
    return (
      <div>
        <h3>Erreur de chargement</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <p>Chargement des classements...</p>
      </div>
    );
  }

  return (
    <>
      <SingleStanding standingOther={standingOther} standing={standing} />
    </>
  );
};

export default Standing;
