import React, { useCallback, useEffect, useState } from "react";
import { INTStanding, INTStandingOtherInfos } from "../interfaces/standing";
import SingleStanding from "../components/single-standing";
import { loaderComponent } from "../components/utils/loader";

const Standing: React.FC<{ isHome?: boolean }> = ({ isHome = false }) => {
  const [standing, setStanding] = useState<INTStanding | null>(null);
  const [standingOther, setStandingOther] =
    useState<INTStandingOtherInfos | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isBuildProduction = false
  const api = isBuildProduction ? "/proxy.php/" : "https://api.nhle.com/"
  const apiWeb = isBuildProduction ? "/proxy.php/" : "https://api-web.nhle.com/"

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
      const standingsData = await fetchData(`${apiWeb}v1/standings/now`);
      setStanding(standingsData);

      const statsParams = new URLSearchParams({
        isAggregate: 'false',
        isGame: 'false',
        sort: '[{"property":"points","direction":"DESC"},{"property":"wins","direction":"DESC"},{"property":"teamId","direction":"ASC"}]',
        start: '0',
        limit: '50',
        cayenneExp: 'gameTypeId=2 and seasonId<=20242025 and seasonId>=20242025'
      });
      
      const statsData = await fetchData(`${api}stats/rest/en/team/summary`, statsParams);
      setStandingOther(statsData);

    } catch (err) {
      console.error("Erreur détaillée:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, [api, apiWeb]);

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
      <>
        {loaderComponent()}
      </>
    );
  }

  return (
    <>
      <SingleStanding standingOther={standingOther} home={isHome} standing={standing} />
    </>
  );
};

export default Standing;
