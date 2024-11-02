export interface INTSearch {
  playerId: string;
  name: string;
  positionCode: string;
  teamId: string;
  teamAbbrev: string;
  lastTeamId: string;
  lastTeamAbbrev: string;
  lastSeasonId?: string | null;
  sweaterNumber?: string | null;
  active: boolean;
  height: string;
  heightInInches: number;
  heightInCentimeters: number;
  weightInPounds: number;
  weightInKilograms: number;
  birthCity: string;
  birthStateProvince?: string | null;
  birthCountry: string;
  // For followed player feature
  imageUrl: string;
  teamColor: string;
  teamName: string;
}
