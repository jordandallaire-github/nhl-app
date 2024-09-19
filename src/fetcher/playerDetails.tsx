import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerSingleHero from "../components/player/single/single-player-hero";
import PlayerSingleGeneralStats from "../components/player/single/single-player-general-stats";
import PlayerSingleMoreInfos from "../components/player/single/single-player-more-infos";
import PlayerSingleLast5Games from "../components/player/single/single-player-last-5-games";
import PlayerSingleStats from "../components/player/single/single-player-stats";

export interface PlayerDetailsType {
  id: number;
  heroImage: string;
  firstName: string;
  lastName: string;
  sweaterNumber: string;
  positionCode: string;
  currentTeamAbbrev: string;
  headshot: string;
  teamLogo: string;
  teamName: string;
  fullTeamName: string;
  shootsCatches: string;
  teamColor: string;
  heightInFeet: string;
  birthDate: string;
  weightInPounds: string;
  age: string;
  birthCity: string;
  birthStateProvince: string;
  birthCountry: string;
  draftYear: string;
  draftTeamAbbre: string;
  draftRound: string;
  draftPickRound: string;
  draftOverallPick: string;
  featuredStats?: FeaturedStats;
  careerTotals?: CareerTotals;
  last5Games?: {
    assists: number;
    gameDate: string;
    gameId: number;
    gameTypeId: number;
    goals: number;
    homeRoadFlag: string;
    opponentAbbrev: string;
    pim: number;
    plusMinus: number;
    points: number;
    powerPlayGoals: number;
    shifts: number;
    shorthandedGoals: number;
    shots: number;
    teamAbbrev: string;
    toi: string;
  }[];
  seasonTotals?: SeasonTotals[];
}

interface FeaturedStats {
  season: number;
  regularSeason: {
    subSeason: {
      assists: number;
      gameWinningGoals: number;
      gamesPlayed: number;
      goals: number;
      otGoals: number;
      pim: number;
      plusMinus: number;
      points: number;
      powerPlayGoals: number;
      powerPlayPoints: number;
      shootingPctg: number;
      shorthandedGoals: number;
      shorthandedPoints: number;
      shots: number;
    };
  };
  playoffs: {
    subSeason: {
      assists: number;
      gameWinningGoals: number;
      gamesPlayed: number;
      goals: number;
      otGoals: number;
      pim: number;
      plusMinus: number;
      points: number;
      powerPlayGoals: number;
      powerPlayPoints: number;
      shootingPctg: number;
      shorthandedGoals: number;
      shorthandedPoints: number;
      shots: number;
    };
  };
}

interface CareerTotals {
  regularSeason: {
    assists: number;
    avgToi: number;
    faceoffWinningPctg: number;
    gameWinningGoals: number;
    gamesPlayed: number;
    goals: number;
    otGoals: number;
    pim: number;
    plusMinus: number;
    points: number;
    powerPlayGoals: number;
    powerPlayPoints: number;
    shootingPctg: number;
    shorthandedGoals: number;
    shorthandedPoints: number;
    shots: number;
  };
  playoffs: {
    assists: number;
    avgToi: number;
    faceoffWinningPctg: number;
    gameWinningGoals: number;
    gamesPlayed: number;
    goals: number;
    otGoals: number;
    pim: number;
    plusMinus: number;
    points: number;
    powerPlayGoals: number;
    powerPlayPoints: number;
    shootingPctg: number;
    shorthandedGoals: number;
    shorthandedPoints: number;
    shots: number;
  };
}

export interface SeasonTotals {
  assists: number;
  avgToi: number;
  faceoffWinningPctg: number;
  gameTypeId: number;
  gameWinningGoals: number;
  gamesPlayed: number;
  goals: number;
  leagueAbbrev: string;
  otGoals: number;
  pim: number;
  plusMinus: number;
  points: number;
  powerPlayGoals: number;
  powerPlayPoints: number;
  season: number;
  sequence: number;
  shootingPctg: number;
  shorthandedGoals: number;
  shorthandedPoints: number;
  shots: number;
  teamCommonName: {
    default: string;
  };
  teamName: {
    default: string;
    fr: string;
  };
  teamPlaceNameWithPreposition: {
    default: string;
    fr: string;
  };
}

function calculateAge(birthDate: string): string {
  const today = new Date();
  const birthDay = new Date(birthDate);
  const age = today.getFullYear() - birthDay.getFullYear();

  const isBeforeBirthday =
    today.getMonth() < birthDay.getMonth() ||
    (today.getMonth() === birthDay.getMonth() &&
      today.getDate() < birthDay.getDate());

  return isBeforeBirthday ? (age - 1).toString() : age.toString();
}

function cmToFeetAndInches(cm: number): string {
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm % 30.48) / 2.54);
  return `${feet}'${inches}"`;
}


const PlayerDetails: React.FC = () => {
  const { playerSlug } = useParams<{ playerSlug: string }>();
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
          firstName: playerData.firstName.default,
          lastName: playerData.lastName.default,
          sweaterNumber: playerData.sweaterNumber || "00",
          positionCode: playerData.position,
          currentTeamAbbrev: playerData.currentTeamAbbrev,
          headshot: playerData.headshot,
          teamLogo: playerData.teamLogo,
          teamName: playerData.teamName,
          fullTeamName: playerData.fullTeamName.fr,
          shootsCatches: playerData.shootsCatches,
          teamColor: teamColorData[playerData.currentTeamAbbrev].color,
          heightInFeet: cmToFeetAndInches(playerData.heightInCentimeters),
          weightInPounds: playerData.weightInPounds,
          birthDate: playerData.birthDate,
          age: calculateAge(playerData.birthDate),
          birthCity:
            playerData.birthCity?.fr || playerData.birthCity?.default || "",
          birthStateProvince:
            playerData.birthStateProvince?.fr ||
            playerData.birthStateProvince?.default ||
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
          seasonTotals: playerData.seasonTotals?.filter((season: SeasonTotals) => 
            season.leagueAbbrev === "NHL"
          ) || []
        });
      } catch (error) {
        if (error instanceof Error) setError(error.message);
      }
    };

    fetchPlayer();
  }, [playerSlug]);

  if (error) return <div>Error: {error}</div>;
  if (!player) return <div>Loading...</div>;

  return (
    <>
      <PlayerSingleHero player={player}></PlayerSingleHero>
      <PlayerSingleGeneralStats player={player}></PlayerSingleGeneralStats>
      <PlayerSingleMoreInfos player={player}></PlayerSingleMoreInfos>
      <PlayerSingleLast5Games last5Games={player.last5Games}></PlayerSingleLast5Games>
      <PlayerSingleStats player={player}></PlayerSingleStats>
    </>
  );
};

export default PlayerDetails;
