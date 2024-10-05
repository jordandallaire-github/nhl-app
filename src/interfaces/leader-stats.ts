export interface LeaderPlayerStats {
  plusMinus: Array<PlayerStatGeneric>;
  assists: Array<PlayerStatGeneric>;
  faceoffLeaders: Array<PlayerStatGeneric>;
  penaltyMins: Array<PlayerStatGeneric>;
  goals: Array<PlayerStatGeneric>;
  points: Array<PlayerStatGeneric>;
  toi: Array<PlayerStatGeneric>;
}

export interface LeaderGoalieStats {
  wins: Array<PlayerStatGeneric>;
  shutouts: Array<PlayerStatGeneric>;
  savePctg: Array<PlayerStatGeneric>;
  goalsAgainstAverage: Array<PlayerStatGeneric>;
}

export interface PlayerStatGeneric {
  id: number;
  firstName: { default: string };
  lastName: { default: string };
  sweaterNumber: number;
  headshot: string;
  teamAbbrev: string;
  teamName: { default: string };
  teamLogo: string;
  position: string;
  value: number;
}
