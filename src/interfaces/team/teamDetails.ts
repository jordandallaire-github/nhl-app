export interface TeamDetail {
  color: string;
  teamAbbrev: { default: string };
  teamCommonName: { default: string; fr: string };
  divisionName: string;
  teamLogo: string;
  teamName: { default: string; fr: string };
  losses: number;
  wins: number;
  otLosses: number;
  points: number;
  goalDifferential: number;
  conferenceName: string;
}
