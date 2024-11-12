import { FeaturedStats } from "./featuredStats";
import { CareerTotals } from "./careerTotals";
import { SeasonTotals } from "./seasonTotals";
import { Award } from "./awards";

export interface PlayerDetailsType {
  id: string;
  heroImage: string;
  firstName: { default: string; fr: string };
  lastName: { default: string; fr: string };
  sweaterNumber: string;
  positionCode: string;
  currentTeamAbbrev: string;
  headshot: string;
  teamLogo: string;
  teamName: string;
  color?: string;
  teamCommonName:{ default: string; fr: string };
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
    decision: string; //Only goalie value
    gamesStarted: number; //Only goalie value
    goalsAgainst: number; //Only goalie value
    penaltyMins: number; //Only goalie value
    savePctg: number; //Only goalie value
    shotsAgainst: number; //Only goalie value
  }[];
  seasonTotals?: SeasonTotals[];
  awards?: Award[];
  // For followed player
  playerId: string;
  name: string;
  teamAbbrev: string;
  imageUrl: string;
}
