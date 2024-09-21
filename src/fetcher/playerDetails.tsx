import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerSingleHero from "../components/player/single/single-player-hero";
import PlayerSingleGeneralStats from "../components/player/single/single-player-general-stats";
import PlayerSingleMoreInfos from "../components/player/single/single-player-more-infos";
import PlayerSingleLast5Games from "../components/player/single/single-player-last-5-games";
import PlayerSingleStats from "../components/player/single/single-player-stats";
import PlayerSingleAwards from "../components/player/single/single-player-awards";
import { PlayerDetailsType } from "../interfaces/player/playerDetails";
import { SeasonTotals } from "../interfaces/player/seasonTotals";

const DEFAULT_LANGUAGE = "default";
const FRENCH_LANGUAGE = "fr";

const cmToFeetAndInches = (cm: number): string => {
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm % 30.48) / 2.54);
  return `${feet}'${inches}"`;
};

const calculateAge = (birthDate: string): string => {
  const today = new Date();
  const birthDay = new Date(birthDate);
  const age = today.getFullYear() - birthDay.getFullYear();

  const isBeforeBirthday =
    today.getMonth() < birthDay.getMonth() ||
    (today.getMonth() === birthDay.getMonth() &&
      today.getDate() < birthDay.getDate());

  return isBeforeBirthday ? (age - 1).toString() : age.toString();
};

const usePlayerDetails = (playerSlug: string) => {
  const [player, setPlayer] = useState<PlayerDetailsType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        if (!playerSlug) throw new Error("Invalid player slug");

        const playerId = playerSlug.split("-").pop();
        if (!playerId) throw new Error("Invalid player ID");

        const colorRes = await fetch("/teamColor.json");
        if (!colorRes.ok) throw new Error("Failed to fetch team colors");
        const teamColorData = await colorRes.json();

        const res = await fetch(
          `https://api-web.nhle.com/v1/player/${playerId}/landing`
        );
        if (!res.ok) throw new Error("Failed to fetch player data");
        const playerData = await res.json();

        setPlayer({
          id: playerData.id,
          heroImage: playerData.heroImage,
          firstName: playerData.firstName?.[DEFAULT_LANGUAGE],
          lastName: playerData.lastName?.[DEFAULT_LANGUAGE],
          sweaterNumber: playerData.sweaterNumber || "00",
          teamCommonName: playerData.teamCommonName?.[DEFAULT_LANGUAGE],
          positionCode: playerData.position,
          currentTeamAbbrev: playerData.currentTeamAbbrev,
          headshot: playerData.headshot,
          teamLogo: playerData.teamLogo,
          teamName: playerData.teamName?.[DEFAULT_LANGUAGE],
          fullTeamName: playerData.fullTeamName?.[FRENCH_LANGUAGE],
          shootsCatches: playerData.shootsCatches,
          teamColor: teamColorData[playerData.currentTeamAbbrev].color,
          heightInFeet: cmToFeetAndInches(playerData.heightInCentimeters),
          weightInPounds: playerData.weightInPounds,
          birthDate: playerData.birthDate,
          age: calculateAge(playerData.birthDate),
          birthCity:
            playerData.birthCity?.[FRENCH_LANGUAGE] ||
            playerData.birthCity?.[DEFAULT_LANGUAGE] ||
            "",
          birthStateProvince:
            playerData.birthStateProvince?.[FRENCH_LANGUAGE] ||
            playerData.birthStateProvince?.[DEFAULT_LANGUAGE] ||
            "",
          birthCountry: playerData.birthCountry,
          draftOverallPick: playerData.draftDetails?.overallPick || "",
          draftYear: playerData.draftDetails?.year || "",
          draftTeamAbbre: playerData.draftDetails?.teamAbbrev || "",
          draftRound: playerData.draftDetails?.round || "",
          draftPickRound: playerData.draftDetails?.pickInRound || "",
          featuredStats: playerData.featuredStats,
          careerTotals: playerData.careerTotals,
          last5Games: playerData.last5Games,
          seasonTotals:
            playerData.seasonTotals?.filter(
              (season: SeasonTotals) => season.leagueAbbrev === "NHL"
            ) || [],
          awards: playerData.awards,
        });
      } catch (error) {
        if (error instanceof Error) setError(error.message);
      }
    };

    fetchPlayer();
  }, [playerSlug]);

  return { player, error };
};

const PlayerDetails: React.FC = () => {
  const params = useParams<{ playerSlug?: string }>();
  const { player, error } = usePlayerDetails(params.playerSlug ?? "");

  if (error) return <div>Error: {error}</div>;
  if (!player) return <div>Loading...</div>;

  return (
    <>
      <PlayerSingleHero player={player}></PlayerSingleHero>
      <PlayerSingleGeneralStats player={player}></PlayerSingleGeneralStats>
      <PlayerSingleMoreInfos player={player}></PlayerSingleMoreInfos>
      <PlayerSingleLast5Games last5Games={player.last5Games} player={player}></PlayerSingleLast5Games>
      <PlayerSingleStats player={player}></PlayerSingleStats>
      <PlayerSingleAwards awards={player.awards} player={player}></PlayerSingleAwards>
    </>
  );
};

export default React.memo(PlayerDetails);
