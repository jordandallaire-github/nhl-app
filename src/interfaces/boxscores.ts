export interface INTBoxscore {
  id: number;
  season: number;
  gameType: number;
  limitedScoring: boolean;
  gameDate: string;
  venue: {
    default: string;
  };
  venueLocation: {
    default: string;
  };
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  tvBroadcasts: Array<{
    id: number;
    market: string;
    countryCode: string;
    network: string;
    sequenceNumber: number;
  }>;
  gameState: string;
  gameScheduleState: string;
  periodDescriptor: {
    number: number;
    periodType: string;
    maxRegulationPeriods: number;
  };
  regPeriods: number;
  awayTeam: {
    id: number;
    name: {
      default: string;
      fr: string;
    };
    abbrev: string;
    score: number;
    sog: number;
    logo: string;
    darkLogo: string;
    placeName: {
      default: string;
    };
    placeNameWithPreposition: {
      default: string;
      fr?: string;
    };
  };
  homeTeam: {
    id: number;
    name: {
      default: string;
      fr: string;
    };
    abbrev: string;
    score: number;
    sog: number;
    logo: string;
    darkLogo: string;
    placeName: {
      default: string;
    };
    placeNameWithPreposition: {
      default: string;
      fr?: string;
    };
  };
  clock: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  playerByGameStats: {
    awayTeam: {
      forwards: Array<{
        playerId: number;
        sweaterNumber: number;
        name: {
          default: string;
        };
        position: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        pim: number;
        hits: number;
        powerPlayGoals: number;
        sog: number;
        faceoffWinningPctg: number | null;
        toi: string;
        blockedShots: number;
        shifts: number;
        giveaways: number;
        takeaways: number;
      }>;
      defense: Array<{
        playerId: number;
        sweaterNumber: number;
        name: {
          default: string;
        };
        position: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        pim: number;
        hits: number;
        powerPlayGoals: number;
        sog: number;
        faceoffWinningPctg: number | null;
        toi: string;
        blockedShots: number;
        shifts: number;
        giveaways: number;
        takeaways: number;
      }>;
      goalies: Array<{
        playerId: number;
        sweaterNumber: number;
        name: {
          default: string;
        };
        position: string;
        evenStrengthShotsAgainst: string;
        powerPlayShotsAgainst: string;
        shorthandedShotsAgainst: string;
        saveShotsAgainst: string;
        savePctg: number;
        evenStrengthGoalsAgainst: number;
        powerPlayGoalsAgainst: number;
        shorthandedGoalsAgainst: number;
        goalsAgainst: number;
        toi: number;
        shotsAgainst: number;
        saves: number;
      }>;
    };
    homeTeam: {
      forwards: Array<{
        playerId: number;
        sweaterNumber: number;
        name: {
          default: string;
          cs?: string;
        };
        position: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        pim: number;
        hits: number;
        powerPlayGoals: number;
        sog: number;
        faceoffWinningPctg: number | null;
        toi: string;
        blockedShots: number;
        shifts: number;
        giveaways: number;
        takeaways: number;
      }>;
      defense: Array<{
        playerId: number;
        sweaterNumber: number;
        name: {
          default: string;
        };
        position: string;
        goals: number;
        assists: number;
        points: number;
        plusMinus: number;
        pim: number;
        hits: number;
        powerPlayGoals: number;
        sog: number;
        faceoffWinningPctg: number | null;
        toi: string;
        blockedShots: number;
        shifts: number;
        giveaways: number;
        takeaways: number;
      }>;
      goalies: Array<{
        playerId: number;
        sweaterNumber: number;
        name: {
          default: string;
        };
        position: string;
        evenStrengthShotsAgainst: string;
        powerPlayShotsAgainst: string;
        shorthandedShotsAgainst: string;
        saveShotsAgainst: string;
        savePctg: number;
        evenStrengthGoalsAgainst: number;
        powerPlayGoalsAgainst: number;
        shorthandedGoalsAgainst: number;
        goalsAgainst: number;
        decision: string;
        shotsAgainst: number;
        saves: number;
        toi: number;
      }>;
    };
  };
}
