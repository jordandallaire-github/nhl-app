export interface IPlayerOnIce {
  id: number;
  playerId: number;
  x: number;
  y: number;
  sweaterNumber: number;
  teamId: number;
  teamAbbrev: string;
}

export interface IOnIce {
  [key: string]: IPlayerOnIce;
}

export interface IReplayFrame {
  timeStamp: number;
  onIce: IOnIce;
}

export type IReplayData = IReplayFrame[];