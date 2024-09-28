import React, { useMemo, useState } from "react";
import {
  TeamPlayerStats,
  Skater,
  Goalie,
} from "../../../interfaces/team/teamPlayerStats";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { FormatPosition } from "../../utils/formatPosition";
import { Link } from "react-router-dom";
import { generatePlayerSlug } from "../../utils/generatePlayerSlug";
import { title } from "process";

interface PlayerStatsProps {
  playerStats: TeamPlayerStats | null;
  playerOtherInfos: PlayerDetailsType[] | null;
  abr: string | null;
  teamName?: string;
}

const formatStatValue = (value: unknown, category: PlayerCategory): string => {
  if (typeof value === "number") {
    switch (category) {
      case "faceoffWinPctg":
        return (value * 100).toFixed(2);
      case "savePercentage":
        return (value * 10).toFixed(2);
      case "goalsAgainstAverage":
        return value.toFixed(2);
      case "avgTimeOnIcePerGame":
        return formatTimeOnIce(value);
      default:
        return value.toFixed(0);
    }
  }

  if (typeof value === "object" && value !== null && "default" in value) {
    return (value as { default: string }).default;
  }

  return String(value);
};

const formatStatName = (value: string) => {
  switch (value) {
    case "% Mises en jeu gagnées":
      return "% MAJ";
    case "% D'arrêts":
      return "% Arr";
    case "Moyenne de buts accordés":
      return "Moy.";
    case "Différentiel":
      return "+/-";
    case "Moyenne de temps de glace":
      return "TG/PJ";
    default:
      return value;
  }
};

type ExtendedSkater = Skater & {
  avgTimeOnIcePerGame: number;
  faceoffWinPctg: number;
  plusMinus: number;
};

type ExtendedGoalie = Goalie & {
  savePercentage: number;
  goalsAgainstAverage: number;
};

type Player = ExtendedSkater | ExtendedGoalie;

const isSkater = (player: Player): player is ExtendedSkater =>
  "gamesPlayed" in player;
const isGoalie = (player: Player): player is ExtendedGoalie =>
  "gamesStarted" in player;

type SkaterCategory = keyof ExtendedSkater;
type GoalieCategory = keyof ExtendedGoalie;
type PlayerCategory = SkaterCategory | GoalieCategory;

const getTopPlayers = <T extends Player>(
  players: T[],
  statToCompare: keyof T,
  ascending = false
): T[] => {
  return players
    .filter((player): player is T => statToCompare in player)
    .sort((a, b) => {
      const aValue = a[statToCompare];
      const bValue = b[statToCompare];
      const diff = ascending
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
      return isNaN(diff) ? 0 : diff;
    })
    .slice(0, 5);
};

const formatTimeOnIce = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  return `${hours}:${remainingMinutes.toString().padStart(2, "0")}`;
};

const PlayerDisplay: React.FC<{
  player: Player;
  statValue: number | string;
  playerDetails: PlayerDetailsType | null;
  abr: string | null;
  titleStats: string;
  teamName?: string;
}> = React.memo(
  ({ player, statValue, playerDetails, abr, teamName, titleStats }) => (
    <div className="display-player">
      <div className="media">
        <Link
          to={`/equipes/${teamName}/${generatePlayerSlug(
            player.firstName.default,
            player.lastName.default,
            player.playerId
          )}`}
        >
          <img
            src={playerDetails?.headshot}
            alt={`${player.firstName.default} ${player.lastName.default}`}
          />
        </Link>
      </div>
      <div className="content">
        <h3>{`${player.firstName.default} ${player.lastName.default}`}</h3>
        <div className="other-infos">
          <p>{`#${playerDetails?.sweaterNumber}`}</p>
          <img
            src={`https://assets.nhle.com/logos/nhl/svg/${abr}_dark.svg`}
            alt=""
          />
          {isSkater(player) && !isGoalie(player) ? (
            <p>{FormatPosition(player.positionCode)}</p>
          ) : (
            <p>G</p>
          )}
        </div>
        <p>
          {statValue} {formatStatName(titleStats)}
        </p>
      </div>
    </div>
  )
);

const PlayerStatList: React.FC<{
  players: Player[];
  statKey: keyof Player;
  onPlayerClick: (player: Player) => void;
}> = React.memo(({ players, statKey, onPlayerClick }) => (
  <>
    {players.map((player, index) => (
      <div
        className="content"
        key={player.playerId}
        onClick={() => onPlayerClick(player)}
      >
        <p>{index + 1}.</p>
        <div className="main-stats">
          <p>
            {player.firstName.default} {player.lastName.default}
          </p>
          <p>{formatStatValue(player[statKey], statKey)}</p>
        </div>
      </div>
    ))}
  </>
));

const SingleTeamPlayerStats: React.FC<PlayerStatsProps> = ({
  playerStats,
  playerOtherInfos,
  abr,
  teamName,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const topPlayers = useMemo(() => {
    if (!playerStats) return {};
    const { skaters, goalies } = playerStats;
    return {
      points: getTopPlayers(skaters as ExtendedSkater[], "points"),
      goals: getTopPlayers(skaters as ExtendedSkater[], "goals"),
      assists: getTopPlayers(skaters as ExtendedSkater[], "assists"),
      plusMinus: getTopPlayers(skaters as ExtendedSkater[], "plusMinus"),
      faceoffWinPctg: getTopPlayers(
        skaters as ExtendedSkater[],
        "faceoffWinPctg"
      ),
      avgTimeOnIcePerGame: getTopPlayers(
        skaters as ExtendedSkater[],
        "avgTimeOnIcePerGame"
      ),
      savePercentage: getTopPlayers(
        goalies as ExtendedGoalie[],
        "savePercentage"
      ),
      goalsAgainstAverage: getTopPlayers(
        goalies as ExtendedGoalie[],
        "goalsAgainstAverage",
        true
      ),
    };
  }, [playerStats]);

  const playerDetails = useMemo(() => {
    if (!selectedPlayer) return null;
    return (
      playerOtherInfos?.find(
        (player) => player.id === selectedPlayer.playerId
      ) || null
    );
  }, [selectedPlayer, playerOtherInfos]);

  if (!playerStats || !playerStats.skaters) return null;

  const renderPlayerStat = (
    category: PlayerCategory,
    title: string,
    formatFunc = (value: any) => value
  ) => {
    const players = topPlayers[category as keyof typeof topPlayers] || [];
    const bestPlayer = players[0];

    if (!bestPlayer) return null;
    const playerDetails =
      playerOtherInfos?.find((player) => player.id === bestPlayer.playerId) ||
      null;

    return (
      <div className="player-stat">
        <PlayerDisplay
          player={bestPlayer}
          statValue={
            isGoalie(bestPlayer)
              ? formatFunc(
                  (bestPlayer as ExtendedGoalie)[category as GoalieCategory]
                )
              : formatFunc(
                  (bestPlayer as ExtendedSkater)[category as SkaterCategory]
                )
          }
          playerDetails={playerDetails}
          abr={abr}
          teamName={teamName}
          titleStats={title}
        />
        <div className="stats">
          <h3>{title}</h3>
          <PlayerStatList
            players={players}
            statKey={category as keyof Player}
            onPlayerClick={setSelectedPlayer}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="stats-team-player">
      <div className="wrapper">
        <h2>Meilleur de l'équipe :</h2>
        <div className="player-stats-container">
          {renderPlayerStat("points", "Points")}
          {renderPlayerStat("goals", "Buts")}
          {renderPlayerStat("assists", "Aides")}
          {renderPlayerStat("plusMinus", "Différentiel")}
          {renderPlayerStat("avgTimeOnIcePerGame", "Moyenne de temps de glace", formatTimeOnIce)}
          {renderPlayerStat("faceoffWinPctg", "% Mises en jeu gagnées", (value: number) => (value * 100).toFixed(2))}
          {renderPlayerStat("goalsAgainstAverage", "Moyenne de buts accordés", (value: number) => value.toFixed(2))}
          {renderPlayerStat("savePercentage", "% D'arrêts", (value: number) => (value * 10).toFixed(2))}
        </div>
      </div>
    </section>
  );
};

export default SingleTeamPlayerStats;
