export interface INTPlayByPlay {
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
  awayTeam: {
    id: number;
    name: {
      default: string;
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
  shootoutInUse: boolean;
  otInUse: boolean;
  clock: {
    timeRemaining: string;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  displayPeriod: number;
  maxPeriods: number;
  gameOutcome: {
    lastPeriodType: string;
  };
  plays: Array<{
    eventId: number;
    periodDescriptor: {
      number: number;
      periodType: string;
      maxRegulationPeriods: number;
    };
    timeInPeriod: string;
    timeRemaining: string;
    situationCode: string;
    homeTeamDefendingSide: string;
    typeCode: number;
    typeDescKey: string;
    sortOrder: number;
    details?: {
      eventOwnerTeamId: number;
      losingPlayerId: number;
      winningPlayerId: number;
      xCoord: number;
      yCoord: number;
      zoneCode: string;
      reason?: string;
      shotType?: string;
      shootingPlayerId: number;
      goalieInNetId: number;
      awaySOG: number;
      homeSOG: number;
    };
  }>;
}
