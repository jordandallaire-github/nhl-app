export interface GameData {
  date: string;
  games: Array<{
    id: number;
    season: number;
    gameType: number;
    gameDate: string;
    gameCenterLink: string;
    venue: { default: string };
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
    awayTeam: {
      id: number;
      name: { default: string; fr?: string };
      commonName: { default: string };
      placeNameWithPreposition: { default: string; fr?: string };
      abbrev: string;
      record: string;
      logo: string;
      score: number;
      sog: number;
    };
    homeTeam: {
      id: number;
      name: { default: string; fr?: string };
      commonName: { default: string };
      placeNameWithPreposition: { default: string; fr?: string };
      abbrev: string;
      record: string;
      logo: string;
      score: number;
      sog: number;
    };
    ticketsLink: string;
    ticketsLinkFr?: string;
    period: number,
    periodDescriptor: {
      number: number,
      periodType: string,
      maxRegulationPeriods: number
    },
    clock: {
      timeRemaining: string,
      secondsRemaining: number,
      running: string,
      inIntermission: boolean
    }
    situation: {
        teamAbbrev: string,
        situationCode: string
        timeRemaining: string,
      }
  }>;
}

export interface TeamScoreboard {
  focusedDate: string;
  focusedDateCount: number;
  clubTimeZone: string;
  clubUTCOffset: string;
  clubScheduleLink: string;
  gamesByDate: GameData[];
}
