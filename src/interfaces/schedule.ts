export interface INTSchedule {
  prevDate: string;
  currentDate: string;
  games: Array<Game>;
  nextDate: string;
  gameWeek: Array<{
    date: string;
    dayAbbrev: string;
    numberOfGames: number;
  }>;
  oddsPartners: Array<{
    partnerId: number;
    country: string;
    name: string;
    imageUrl: string;
    siteUrl?: string;
    bgColor: string;
    textColor: string;
    accentColor: string;
  }>;
}

export interface Game {
  id: number;
  season: number;
  gameType: number;
  gameDate: string;
  period: number;
  venue: { default: string };
  startTimeUTC: string;
  easternUTCOffset: string;
  venueUTCOffset: string;
  teamLeaders: Array<TeamLeader>;
  tvBroadcasts: Array<{
    id: number;
    market: string;
    countryCode: string;
    network: string;
    sequenceNumber: number;
  }>;
  clock: {
    timeRemaining: number;
    secondsRemaining: number;
    running: boolean;
    inIntermission: boolean;
  };
  gameState: string;
  gameScheduleState: string;
  awayTeam: {
    id: number;
    name: { default: string };
    abbrev: string;
    record: string;
    logo: string;
    odds: Array<{
      providerId: number;
      value: string;
    }>;
    sog: number;
    score: number;
  };
  homeTeam: {
    id: number;
    name: { default: string };
    abbrev: string;
    record: string;
    logo: string;
    odds: Array<{
      providerId: number;
      value: string;
    }>;
    sog: number;
    score: number;
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
  gameCenterLink: string;
  neutralSite: boolean;
  venueTimezone: string;
  threeMinRecap: string;
  condensedGame: string;
  threeMinRecapFr: string;
  condensedGameFr: string;
  ticketsLink: string;
  ticketsLinkFr: string;
  periodDescriptor: {
    number: number;
    periodType: string;
    maxRegulationPeriods: number;
  };
  goals: Array<Goal>;
}

export interface TeamLeader {
  id: number;
  firstName: { default: string };
  lastName: { default: string };
  headshot: string;
  teamAbbrev: string;
  category: string;
  value: number;
}

export interface Goal {
  period: number;
  periodDescriptor: {
    number: number;
    periodType: string;
    maxRegulationPeriods: number;
  };
  timeInPeriod: string;
  playerId: number;
  name: {
    default: string;
  };
  firstName: {
    default: string;
  };
  lastName: {
    default: string;
  };
  goalModifier: string;
  assists: Array<Assist>;
  mugshot: string;
  teamAbbrev: string;
  goalsToDate: number;
  awayScore: number;
  homeScore: number;
  strength: string;
  highlightClipSharingUrl: string;
  highlightClipSharingUrlFr: string;
  highlightClip: number;
  discreteClip: number;
}

export interface Assist {
  playerId: number;
  name: {
    default: string;
  };
  assistsToDate: number;  
}
