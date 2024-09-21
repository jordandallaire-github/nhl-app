export interface Award {
  trophy: {
    default: string;
    fr?: string;
  };
  seasons: {
    assists: number;
    blockedShots: number;
    gameTypeId: number;
    gamesPlayed: number;
    goals: number;
    hits: number;
    pim: number;
    plusMinus: number;
    points: number;
    seasonId: number;
    gaa: number; //Only goalie value
    losses: number; //Only goalie value
    otLosses: number; //Only goalie value
    savePctg: number; //Only goalie value
    wins: number; //Only goalie value
  }[];
}
