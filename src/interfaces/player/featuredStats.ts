export interface FeaturedStats {
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
      goalsAgainstAvg: number; //Only goalie value
      losses: number; //Only goalie value
      otLosses: number; //Only goalie value
      savePctg: number; //Only goalie value
      shutouts: number; //Only goalie value
      wins: number; //Only goalie value
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
      goalsAgainstAvg: number; //Only goalie value
      losses: number; //Only goalie value
      otLosses: number; //Only goalie value
      savePctg: number; //Only goalie value
      shutouts: number; //Only goalie value
      wins: number; //Only goalie value
    };
  };
}
