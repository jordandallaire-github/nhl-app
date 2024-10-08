export interface INTMoreGameInfos {
  seasonSeries: Array<{
    id: number;
    season: number;
    gameType: number;
    gameDate: string;
    startTimeUTC: string;
    easternUTCOffset: string;
    venueUTCOffset: string;
    gameState: string;
    gameScheduleState: string;
    awayTeam: {
      id: number;
      abbrev: string;
      logo: string;
      score: string;
    };
    homeTeam: {
      id: number;
      abbrev: string;
      logo: string;
      score: string;
    };
    gameCenterLink: string;
  }>;
  seasonSeriesWins: {
    awayTeamWins: number;
    homeTeamWins: number;
  };
  gameInfo: {
    referees: Array<{
      default: string;
    }>;
    linesmen: Array<{
      default: string;
    }>;
    awayTeam: {
      headCoach: {
        default: string;
      };
      scratches: Array<{
        id: number;
        firstName: {
          default: string;
          [key: string]: string;
        };
        lastName: {
          default: string;
          [key: string]: string;
        };
      }>;
    };
    homeTeam: {
      headCoach: {
        default: string;
      };
      scratches: Array<{
        id: number;
        firstName: {
          default: string;
          [key: string]: string;
        };
        lastName: {
          default: string;
          [key: string]: string;
        };
      }>;
    };
  };
  linescore: {
    byPeriod: Array<{
      periodDescriptor: {
        number: number;
        periodType: string;
        maxRegulationPeriods: number;
      };
      away: number;
      home: number;
    }>;
    totals: {
      away: number;
      home: number;
    };
  };
  shotsByPeriod: Array<{
    periodDescriptor: {
      number: number;
      periodType: string;
      maxRegulationPeriods: number;
    };
    away: number;
    home: number;
  }>;
  teamGameStats: Array<{
    category: string;
    awayValue: number | string;
    homeValue: number | string;
  }>;
  gameReports: {
    gameSummary: string;
    eventSummary: string;
    playByPlay: string;
    faceoffSummary: string;
    faceoffComparison: string;
    rosters: string;
    shotSummary: string;
    toiAway: string;
    toiHome: string;
  };
  teamSeasonStats: {
    awayTeam: {
      ppPctg: number;
      pkPctg: number;
      faceoffWinningPctg: number;
      goalsForPerGamePlayed: number;
      goalsAgainstPerGamePlayed: number;
      ppPctgRank: number;
      pkPctgRank: number;
      faceoffWinningPctgRank: number;
      goalsForPerGamePlayedRank: number;
      goalsAgainstPerGamePlayedRank: number;
    };
    homeTeam: {
      ppPctg: number;
      pkPctg: number;
      faceoffWinningPctg: number;
      goalsForPerGamePlayed: number;
      goalsAgainstPerGamePlayed: number;
      ppPctgRank: number;
      pkPctgRank: number;
      faceoffWinningPctgRank: number;
      goalsForPerGamePlayedRank: number;
      goalsAgainstPerGamePlayedRank: number;
    };
  };
}
