import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { INTGameVideo } from "../interfaces/game-video";
import { renderMatchVideo } from "../components/match/single-match-videos";
import { formatDate } from "../scripts/utils/formatDate";

 export interface TeamAbbreviations {
  awayTeam: string;
  homeTeam: string;
}

const extractTeamAbbreviations = (pathname: string): TeamAbbreviations | null => {
  const match = pathname.match(/\/match\/([a-zA-Z]+)-vs-([a-zA-Z]+)/);
  
  if (!match) {
    return null;
  }

  return {
    awayTeam: match[1].toUpperCase(),
    homeTeam: match[2].toUpperCase()
  };
};

const extractMatchDate = (pathname: string): string | null => {
  const date = pathname.match(/\/(\d{4})\/(\d{2})\/(\d{2})/);
  if (!date) {
    return null;
  }
  return `${date[1]}-${date[2]}-${date[3]}`;
};


const MatchVideos: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [gameVideo, setGameVideo] = useState<INTGameVideo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [teams, setTeams] = useState<TeamAbbreviations | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const teamAbbreviations = extractTeamAbbreviations(location.pathname);
    setTeams(teamAbbreviations);

    const matchDate = extractMatchDate(location.pathname);
    setDate(matchDate)
  }, [location.pathname]);

  const fetchMatchVideoData = useCallback(async () => {
    if (!matchId) {
      setError("ID du match non trouvé");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [
        gameVideoResponse,
      ] = await Promise.all([
        fetch(`https://forge-dapi.d3.nhle.com/v2/content/fr-ca/videos?context.slug=nhl&tags.slug=highlight&tags.slug=gameid-${matchId}`),
      ]);

      if (!gameVideoResponse) {
        throw new Error("Erreur lors de la récupération des données du match");
      }

      const dataGameVideo: INTGameVideo = await gameVideoResponse.json();

      setGameVideo(dataGameVideo);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    fetchMatchVideoData();
  }, [fetchMatchVideoData]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
  }


  return (
    <>
        {renderMatchVideo(gameVideo, teams, formatDate(date ?? ""))}
    </>
  );
};

export default MatchVideos;