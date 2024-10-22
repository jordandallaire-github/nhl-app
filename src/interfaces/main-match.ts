export interface INTMainGameInfos {
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
    fr: string;
  };
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  venueTimezone: string;
  periodDescriptor: {
    number: number;
    periodType: string;
    maxRegulationPeriods: number;
  };
  tvBroadcasts: Array<{
    id: number;
    market: string;
    countryCode: string;
    network: string;
    sequenceNumber: number;
  }>;
  gameState: string;
  gameScheduleState: string;
  specialEvent?: {
    default: string;
  };
  specialEventLogo?: string;
  specialEventLogoGc?: string;
  awayTeam: INTTeam;
  homeTeam: INTTeam;
  shootoutInUse: boolean;
  maxPeriods: number;
  regPeriods: number;
  otInUse: boolean;
  tiesInUse: boolean;
  summary: {
    scoring: Array<{
      periodDescriptor: {
        number: number;
        periodType: string;
        maxRegulationPeriods: number;
      };
      goals: Array<INTGoal>;
    }>;
    shootout: INTShootoutAttempt[];
    threeStars: Array<INTStar>;
    penalties: Array<{
      periodDescriptor: {
        number: number;
        periodType: string;
        maxRegulationPeriods: number;
      };
      penalties: Array<INTPenalty>;
    }>;
    iceSurface: {
      awayTeam: {
        forwards: Array<{
          playerId: number;
          name: {
            default: string;
            cs?: string;
            fi?: string;
            sk?: string;
          };
          sweaterNumber: number;
          positionCode: string;
          headshot: string;
        }>;
        defensemen: Array<{
          playerId: number;
          name: {
            default: string;
            cs?: string;
            fi?: string;
            sk?: string;
          };
          sweaterNumber: number;
          positionCode: string;
          headshot: string;
        }>;
        goalies: Array<{
          playerId: number;
          name: {
            default: string;
            cs?: string;
            fi?: string;
            sk?: string;
          };
          sweaterNumber: number;
          positionCode: string;
          headshot: string;
          totalSOI: number;
        }>;
        penaltyBox: any[]; // Type à définir selon les données reçues
      };
      homeTeam: {
        forwards: Array<{
          playerId: number;
          name: {
            default: string;
            cs?: string;
            fi?: string;
            sk?: string;
          };
          sweaterNumber: number;
          positionCode: string;
          headshot: string;
        }>;
        defensemen: Array<{
          playerId: number;
          name: {
            default: string;
            cs?: string;
            fi?: string;
            sk?: string;
          };
          sweaterNumber: number;
          positionCode: string;
          headshot: string;
        }>;
        goalies: Array<{
          playerId: number;
          name: {
            default: string;
            cs?: string;
            fi?: string;
            sk?: string;
          };
          sweaterNumber: number;
          positionCode: string;
          headshot: string;
          totalSOI: number;
        }>;
        penaltyBox: any[]; // Type à définir selon les données reçues
      };
    };
  };
  clock: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  // When the game haven't started
  ticketsLink?: string;
  ticketsLinkFr?: string;
  matchup?: {
    season: number;
    gameType: number;
    teamLeaders: {
      context: string;
      contextSeason: number;
      leaders: Array<{
        category: string;
        awayLeader: {
          playerId: number;
          name: { default: string };
          firstName: { default: string };
          lastName: { default: string };
          sweaterNumber: number;
          positionCode: string;
          headshot: string;
          value: number;
        };
        homeLeader: {
          playerId: number;
          name: { default: string };
          firstName: { default: string };
          lastName: { default: string };
          sweaterNumber: number;
          positionCode: string;
          headshot: string;
          value: number;
        };
      }>;
    };
    goalieComparison: {
      homeTeam: {
        teamTotals: {
          record: string;
          gaa: number;
          savePctg: number;
          shutouts: number;
        };
        leaders: Array<{
          playerId: number;
          name: { default: string };
          firstName: { default: string };
          lastName: { default: string };
          sweaterNumber: number;
          headshot: string;
          positionCode: string;
          gamesPlayed: number;
          seasonPoints: number;
          record: string;
          gaa: number;
          savePctg: number;
          shutouts: number;
        }>;
      };
      awayTeam: {
        teamTotals: {
          record: string;
          gaa: number;
          savePctg: number;
          shutouts: number;
        };
        leaders: Array<{
          playerId: number;
          name: { default: string };
          firstName: { default: string };
          lastName: { default: string };
          sweaterNumber: number;
          headshot: string;
          positionCode: string;
          gamesPlayed: number;
          seasonPoints: number;
          record: string;
          gaa: number;
          savePctg: number;
          shutouts: number;
        }>;
      };
    };
    skaterSeasonStats: Array<{
      playerId: number;
      teamId: number;
      sweaterNumber: number;
      name: { default: string };
      position: string;
      gamesPlayed: number;
      goals: number;
      assists: number;
      points: number;
      plusMinus: number;
      pim: number;
      avgPoints: number;
      avgTimeOnIce: string;
      gameWinningGoals: number;
      shots: number;
      shootingPctg: number;
      faceoffWinningPctg: number;
      powerPlayGoals: number;
      blockedShots: number;
      hits: number;
    }>;
    goalieSeasonStats: Array<{
      playerId: number;
      teamId: number;
      sweaterNumber: number;
      name: { default: string };
      gamesPlayed: number;
      wins: number;
      losses: number;
      otLosses: number;
      shotsAgainst: string;
      goalsAgainst: number;
      goalsAgainstAvg: number;
      savePctg: number;
      shutouts: number;
      saves: number;
      toi: number;
    }>;
  };
  situation: {
    homeTeam: {
      abbrev: string;
      situationDescriptions: [string];
      strength: number;
    };
    awayTeam: {
      abbrev: string;
      situationDescriptions: [string];
      strength: number;
    };
    situationCode: number;
    timeRemaining: string;
    secondsRemaining: number;
  };
  period: number;
}

interface INTTeam {
  id: number;
  name: {
    default: string;
    fr: string;
  };
  abbrev: string;
  placeName: {
    default: string;
  };
  placeNameWithPreposition: {
    default: string;
    fr: string;
  };
  score: number;
  sog: number;
  logo: string;
  record: string;
}

export interface INTGoal {
  situationCode: string;
  strength: string;
  playerId: number;
  firstName: {
    default: string;
  };
  lastName: {
    default: string;
  };
  name: {
    default: string;
  };
  teamAbbrev: {
    default: string;
  };
  headshot: string;
  highlightClipSharingUrl?: string;
  highlightClipSharingUrlFr?: string;
  highlightClip?: number;
  discreteClip?: number;
  goalsToDate: number;
  awayScore: number;
  homeScore: number;
  leadingTeamAbbrev?: {
    default: string;
  };
  timeInPeriod: string;
  shotType: string;
  goalModifier: string;
  assists: Array<{
    playerId: number;
    firstName: {
      default: string;
    };
    lastName: {
      default: string;
    };
    name: {
      default: string;
    };
    assistsToDate: number;
  }>;
  homeTeamDefendingSide: string;
  pptReplayUrl: string;
}

interface INTStar {
  star: number;
  playerId: number;
  teamAbbrev: string;
  headshot: string;
  name: {
    default: string;
  };
  sweaterNo: number;
  position: string;
  goals?: number;
  assists?: number;
  points?: number;
  goalsAgainstAverage?: number;
  savePctg?: number;
}

interface INTPenalty {
  timeInPeriod: string;
  type: string;
  duration: number;
  committedByPlayer: string;
  teamAbbrev: {
    default: string;
  };
  drawnBy: string;
  descKey: string;
  servedBy?: string;
}

interface INTShootoutAttempt {
  sequence: number;
  playerId: number;
  teamAbbrev: string;
  firstName: string;
  lastName: string;
  shotType?: string;
  result: string;
  headshot: string;
  gameWinner: boolean;
}
