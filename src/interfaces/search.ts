export interface INTSearch {
  playerId: string;
  name: string;
  positionCode: string;
  teamId: string;
  teamAbbrev: string;
  lastTeamId: string;
  lastTeamAbbrev: string;
  lastSeasonId?: string | null;
  sweaterNumber?: number | null;
  active: boolean;
  height: string;
  heightInInches: number;
  heightInCentimeters: number;
  weightInPounds: number;
  weightInKilograms: number;
  birthCity: string;
  birthStateProvince?: string | null;
  birthCountry: string;
}
