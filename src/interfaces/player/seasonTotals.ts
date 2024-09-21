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
  gamesStarted: number; //Only goalie value
  goalsAgainst: number; //Only goalie value
  goalsAgainstAvg: number; //Only goalie value
  losses: number; //Only goalie value
  otLosses: number; //Only goalie value
  savePctg: number; //Only goalie value
  shotsAgainst: number; //Only goalie value
  shutouts: number; //Only goalie value
  timeOnIce: number; //Only goalie value
  wins: number; //Only goalie value
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
