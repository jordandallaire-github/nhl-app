export interface INTeamSchedule {
  previousMonth: string;
  currentMonth: string;
  nextMonth: string;
  calendarUrl: string;
  clubTimezone: string;
  clubUTCOffset: string;
  games: Array<{
    id: number;
    season: number;
    gameType: number;
    gameDate: string;
    venue: { default: string };
    neutralSite: boolean;
    startTimeUTC: string;
    easternUTCOffset: string;
    venueUTCOffset: string;
    venueTimezone: string;
    gameState: string;
    gameScheduleState: string;
    tvBroadcasts: Array<{
      id: number;
      market: string;
      countryCode: string;
      network: string;
      sequenceNumber: number;
    }>;
    awayTeam: {
      id: number;
      placeName: { default: string; fr?: string };
      placeNameWithPreposition: { default: string; fr?: string };
      abbrev: string;
      logo: string;
      darkLogo: string;
      awaySplitSquad: boolean;
      score: number;
      radioLink?: string;
    };
    homeTeam: {
      id: number;
      placeName: { default: string };
      placeNameWithPreposition: { default: string; fr?: string };
      abbrev: string;
      logo: string;
      darkLogo: string;
      homeSplitSquad: boolean;
      score: number;
      radioLink?: string;
    };
    periodDescriptor: {
      number: number;
      periodType: string;
      maxRegulationPeriods: number;
    };
    gameOutcome: {
      lastPeriodType: string;
    };
    winningGoalie?: {
      playerId: number;
      firstInitial: { default: string };
      lastName: { default: string };
    };
    winningGoalScorer?: {
      playerId: number;
      firstInitial: { default: string };
      lastName: { default: string };
    };
    ticketsLink: string,
    ticketsLinkFr: string,
    threeMinRecapFr?: string;
    threeMinRecap?: string;
    gameCenterLink: string;
  }>;
}
