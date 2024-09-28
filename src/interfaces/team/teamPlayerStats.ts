export interface TeamPlayerStats {
  season: string;
  gameType: number;
  skaters: Player[];
}

export interface Player {
  playerId: string;
  headshot: string;
  firstName: { default: string };
  lastName: { default: string };
  gamesPlayed: number;
  shutouts: number;
  goals: number;
  assists: number;
  plusMinus: number;
  points: number;
  positionCode: "G";
  faceoffWinPctg: number;
  timeOnIce: number;
  penaltyMinutes: number;
  powerPlayGoals: number;
  shorthandedGoals: number;
  gameWinningGoals: number;
  overtimeGoals: number;
  shots: number;
  shootingPctg: number;
  avgTimeOnIcePerGame: number;
  avgShiftsPerGame: number;
  goalsAgainstAverage: number;
  savePercentage: number;
}

