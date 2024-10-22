import React from "react";
import { INTBoxscore } from "../../../interfaces/boxscores";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { FormatPosition } from "../../../scripts/utils/formatPosition";
import SortableTable from "../components/sortableHeader";

export const playerStats = (
  game: INTMainGameInfos,
  isForward: boolean,
  boxscore: INTBoxscore | null,
  home: boolean
) => {
  const isHome = home ? "homeTeam" : ("awayTeam" as const);

  const headers = [
    { key: "sweaterNumber", label: "#" },
    { key: "name", label: isForward ? "Attaquants" : "Défenseurs" },
    { key: "position", label: "POS" },
    ...(boxscore
      ? [
          { key: "goals", label: "B" },
          { key: "assists", label: "A" },
          { key: "points", label: "PTS" },
          { key: "plusMinus", label: "+/-" },
          { key: "pim", label: "PUN" },
          { key: "powerPlayGoals", label: "BAN" },
          { key: "shifts", label: "PRÉS" },
          { key: "toi", label: "TG" },
          { key: "sog", label: "T" },
          { key: "blockedShots", label: "TB" },
          { key: "hits", label: "MÉ" },
          { key: "giveaways", label: "REV" },
          { key: "takeaways", label: "REV P." },
          ...(isForward ? [{ key: "faceoffWinningPctg", label: "%MAJ" }] : []),
        ]
      : [
          { key: "gamesPlayed", label: "PJ" },
          { key: "goals", label: "B" },
          { key: "assists", label: "A" },
          { key: "points", label: "PTS" },
          { key: "plusMinus", label: "+/-" },
          { key: "pim", label: "PUN" },
          { key: "powerPlayGoals", label: "BAN" },
          { key: "gameWinningGoals", label: "BG" },
          { key: "shots", label: "T" },
          { key: "blockedShots", label: "TB" },
          { key: "hits", label: "MÉ" },
          { key: "avgTimeOnIce", label: "TG/PJ" },
          ...(isForward ? [{ key: "faceoffWinningPctg", label: "%MAJ" }] : []),
        ]),
  ];

  const data = boxscore
    ? isForward
      ? boxscore.playerByGameStats[isHome]?.forwards
      : boxscore.playerByGameStats[isHome]?.defense
    : game.matchup?.skaterSeasonStats.filter(
        (player) =>
          player.teamId === (home ? game.homeTeam.id : game.awayTeam.id) &&
          (isForward
            ? ["C", "L", "R"].includes(player.position)
            : player.position === "D")
      );

  const formattedData = data?.map((player) => ({
    ...player,
    name: player.name.default || '--',
    position: FormatPosition(player.position) || '--',
    goals: player.goals ?? '--',
    assists: player.assists ?? '--',
    points: player.points ?? '--',
    plusMinus: player.plusMinus ?? '--',
    pim: player.pim ?? '--',
    powerPlayGoals: player.powerPlayGoals ?? '--',
    shifts: 'shifts' in player ? player.shifts ?? '--' : '--',
    gamesPlayed: 'gamesPlayed' in player ? player.gamesPlayed ?? '--' : '--',
    gameWinningGoals: 'gameWinningGoals' in player ? player.gameWinningGoals ?? '--' : '--',
    shots: 'shots' in player ? player.shots ?? '--' : '--',
    avgTimeOnIce: 'avgTimeOnIce' in player ? player.avgTimeOnIce ?? '--' : '--',
    toi: 'toi' in player? player.toi || '--' : '--',
    sog: 'sog' in player ? player.sog ?? '--' : '--',
    blockedShots: 'blockedShots' in player ? player.blockedShots ?? '--' : '--',
    hits: player.hits ?? '--',
    giveaways: 'giveaways' in player ? player.giveaways ?? '--' : '--',
    takeaways: 'takeaways' in player ? player.takeaways ?? '--' : '--',
    faceoffWinningPctg: typeof player.faceoffWinningPctg === 'number'
      ? (player.faceoffWinningPctg * 100).toFixed(2)
      : '--',
  }));

  return (
    <div className="roster-table-container window-effect">
      <SortableTable
        headers={headers}
        data={formattedData}
        initialSortColumn="name"
      />
    </div>
  );
};

export const goalieStats = (
  game: INTMainGameInfos,
  boxscore: INTBoxscore | null,
  home: boolean
) => {
  const isHome = home ? "homeTeam" : ("awayTeam" as const);

  const headers = boxscore
    ? [
        { key: "sweaterNumber", label: "#" },
        { key: "name", label: "Gardiens" },
        { key: "shotsAgainst", label: "TC" },
        { key: "saves", label: "Arr." },
        { key: "savePctg", label: "%Arr." },
        { key: "goalsAgainst", label: "BC" },
        { key: "evenStrengthGoalsAgainst", label: "BA EN" },
        { key: "powerPlayGoalsAgainst", label: "BA AN" },
        { key: "shorthandedGoalsAgainst", label: "BA IN" },
        { key: "toi", label: "TG" },
      ]
    : [
        { key: "sweaterNumber", label: "#" },
        { key: "name", label: "Gardiens" },
        { key: "gamesPlayed", label: "PJ" },
        { key: "wins", label: "V" },
        { key: "losses", label: "D" },
        { key: "otLosses", label: "DP" },
        { key: "shotsAgainst", label: "TC" },
        { key: "saves", label: "Arr." },
        { key: "savePctg", label: "%Arr." },
        { key: "goalsAgainst", label: "BC" },
        { key: "goalsAgainstAvg", label: "Moy.", isReversed: true },
        { key: "toi", label: "TG" },
      ];

  const data = boxscore
    ? boxscore.playerByGameStats[isHome].goalies
    : game.matchup?.goalieSeasonStats.filter(
        (goalie) =>
          goalie.teamId === (home ? game.homeTeam.id : game.awayTeam.id)
      );

  const formattedData = data?.map((goalie) => ({
    ...goalie,
    name: goalie.name.default || '--',
    shotsAgainst: 'shotsAgainst' in goalie ? goalie.shotsAgainst ?? '--' : '--',
    saves: 'saves' in goalie ? goalie.saves ?? '--' : '--',
    wins: 'wins' in goalie ? goalie.wins ?? '--' : '--',
    losses: 'losses' in goalie ? goalie.losses ?? '--' : '--',
    gamesPlayed: 'gamesPlayed' in goalie ? goalie.gamesPlayed ?? '--' : '--',
    otLosses: 'otLosses' in goalie ? goalie.otLosses ?? '--' : '--',
    savePctg: typeof goalie.savePctg === 'number'
      ? (goalie.savePctg * 10).toFixed(2)
      : '--',
    goalsAgainst: 'goalsAgainst' in goalie ? goalie.goalsAgainst ?? '--' : '--',
    evenStrengthGoalsAgainst: 'evenStrengthGoalsAgainst' in goalie
      ? goalie.evenStrengthGoalsAgainst ?? '--'
      : '--',
    powerPlayGoalsAgainst: 'powerPlayGoalsAgainst' in goalie
      ? goalie.powerPlayGoalsAgainst ?? '--'
      : '--',
    shorthandedGoalsAgainst: 'shorthandedGoalsAgainst' in goalie
      ? goalie.shorthandedGoalsAgainst ?? '--'
      : '--',
    toi: goalie.toi || '--',
    goalsAgainstAvg: 'goalsAgainstAvg' in goalie
      ? goalie.goalsAgainstAvg?.toFixed(2) ?? '--'
      : '--',
  }));

  return (
    <div className="roster-table-container window-effect">
      <SortableTable
        headers={headers}
        data={formattedData}
        initialSortColumn="name"
      />
    </div>
  );
};
