import React, { useCallback, useEffect, useState } from "react";
import { INTStanding } from "../interfaces/standing";
import SingleStanding from "../components/standing/single-standing";

const Standing: React.FC = () => {
  const [standing, setStanding] = useState<INTStanding | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStanding = useCallback(async () => {
    setLoading(true);
    try {
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
      <SingleStanding standing={standing}></SingleStanding>
    </>
  );
};

export default Standing;
