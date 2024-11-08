import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TeamPlayerStats,
  Skater,
  Goalie,
} from "../../../interfaces/team/teamPlayerStats";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { FormatPosition } from "../../../scripts/utils/formatPosition";
import { generatePlayerSlug } from "../../../scripts/utils/generatePlayerSlug";

interface PlayerStatsProps {
  playerStats: TeamPlayerStats | null;
  playerOtherInfos: PlayerDetailsType[] | null;
  teamColor: string | null;
  abr: string | null;
  teamName?: string;
}

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

type SkaterCategory = keyof ExtendedSkater;
type GoalieCategory = keyof ExtendedGoalie;
type PlayerCategory = SkaterCategory | GoalieCategory;

const isSkater = (player: Player): player is ExtendedSkater =>
  "plusMinus" in player;

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

const formatStatName = (value: string): string => {
  const statNameMap: Record<string, string> = {
    "% Mises en jeu gagnées": "% MAJ",
    "% D'arrêts": "% Arr",
    "Moyenne de buts accordés": "Moy.",
    Différentiel: "+/-",
    "Moyenne de temps de glace": "TG/PJ",
  };
  return statNameMap[value] || value;
};

const getTopPlayers = <T extends Player>(
  players: T[],
  statToCompare: keyof T,
  ascending = false,
  minGamesPlayed = 1
): T[] => {
  return players
    .filter(
      (player): player is T =>
        statToCompare in player && (player.gamesPlayed || 0) >= minGamesPlayed
    )
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
          to={`/equipes/${teamName}/joueur/${generatePlayerSlug(
            player.firstName.default,
            player.lastName.default,
            player.playerId
          )}`}
        >
          <img
            src={player?.headshot}
            alt={`${player.firstName.default} ${player.lastName.default}`}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="content">
        <p className="name"><strong>{`${player.firstName.default} ${player.lastName.default}`}</strong></p>
        <div className="other-infos">
          <p>{`#${playerDetails?.sweaterNumber ?? 0}`}</p>
          <img
            src={`https://assets.nhle.com/logos/nhl/svg/${abr}_dark.svg`}
            alt={`${abr} Logo`}
            loading="lazy"
          />
          {isSkater(player) ? (
            <p>{FormatPosition(player.positionCode)}</p>
          ) : (
            <p>G</p>
          )}
        </div>
        <p>
          <strong>
            {statValue} {formatStatName(titleStats)}
          </strong>
        </p>
      </div>
    </div>
  )
);

const SingleTeamPlayerStats: React.FC<PlayerStatsProps> = React.memo(
  ({ playerStats, playerOtherInfos, abr, teamName, teamColor }) => {
    const [selectedPlayers, setSelectedPlayers] = useState<
      Record<string, Player | null>
    >({});

    const PlayerStatList: React.FC<{
      players: Player[];
      statKey: keyof Player;
      onPlayerClick: (player: Player) => void;
    }> = React.memo(({ players, statKey, onPlayerClick }) => {
      return (
        <>
          {players.map((player, index) => (
            <div
              className={`content window-effect ${
                selectedPlayers[statKey] === player ? "active" : ""
              }`}
              style={{
                backgroundColor: `${
                  selectedPlayers[statKey] === player ? teamColor : ""
                }`,
              }}
              key={player.playerId}
              onClick={() => onPlayerClick(player)}
            >
              <p>{index + 1}.</p>
              <div className="main-stats">
                <p>
                  {player.firstName.default} {player.lastName.default}
                </p>
                <p>
                  <strong>{formatStatValue(player[statKey], statKey)}</strong>
                </p>
              </div>
            </div>
          ))}
        </>
      );
    });

    const topPlayers = useMemo(() => {
      if (!playerStats?.skaters) return {};
      const { skaters, goalies } = playerStats;

      const categories = {
        points: skaters,
        goals: skaters,
        assists: skaters,
        plusMinus: skaters,
        faceoffWinPctg: skaters,
        avgTimeOnIcePerGame: skaters,
        savePercentage: goalies,
        goalsAgainstAverage: goalies,
      };

      return Object.entries(categories).reduce((acc, [key, players]) => {
        acc[key] = getTopPlayers(
          players as Player[],
          key as keyof Player,
          key === "goalsAgainstAverage",
          1
        );
        return acc;
      }, {} as Record<string, Player[]>);
    }, [playerStats]);

    const defaultSelectedPlayers = useMemo(() => {
      const initialSelectedPlayers: Record<string, Player | null> = {};
      if (playerStats?.skaters || playerStats?.goalies) {
        Object.entries(topPlayers).forEach(([category, players]) => {
          if (players.length > 0) {
            initialSelectedPlayers[category] = players[0];
          }
        });
      }
      return initialSelectedPlayers;
    }, [playerStats?.goalies, playerStats?.skaters, topPlayers]);

    useEffect(() => {
      setSelectedPlayers(defaultSelectedPlayers);
    }, [defaultSelectedPlayers]);

    const getPlayerDetails = useCallback(
      (playerId: string): PlayerDetailsType | null => {
        return (
          playerOtherInfos?.find((player) => player.id === playerId) || null
        );
      },
      [playerOtherInfos]
    );

    const handlePlayerClick = useCallback(
      (category: string, player: Player) => {
        setSelectedPlayers((prev) => ({ ...prev, [category]: player }));
      },
      []
    );

    const renderPlayerStat = useCallback(
      (
        category: PlayerCategory,
        title: string,
        formatFunc: (value: any) => any = (value) => value
      ) => {
        const players = topPlayers[category] || [];
        const bestPlayer = players[0];

        if (!bestPlayer) return null;

        const selectedPlayer = selectedPlayers[category] || bestPlayer;
        const selectedPlayerDetails = getPlayerDetails(selectedPlayer.playerId);

        return (
          <div className="player-stat" key={category}>
            <PlayerDisplay
              player={selectedPlayer}
              statValue={formatFunc(selectedPlayer[category as keyof Player])}
              playerDetails={selectedPlayerDetails}
              abr={abr}
              teamName={teamName}
              titleStats={title}
            />
            <div className="stats">
              <h2>{title}</h2>
              <PlayerStatList
                players={players}
                statKey={category as keyof Player}
                onPlayerClick={(player) => handlePlayerClick(category, player)}
              />
            </div>
          </div>
        );
      },
      [
        topPlayers,
        selectedPlayers,
        getPlayerDetails,
        abr,
        teamName,
        PlayerStatList,
        handlePlayerClick,
      ]
    );

    if (!playerStats?.skaters) return null;

    const statCategories = [
      { category: "points", title: "Points" },
      { category: "goals", title: "Buts" },
      { category: "assists", title: "Aides" },
      { category: "plusMinus", title: "Différentiel" },
      {
        category: "avgTimeOnIcePerGame",
        title: "Moyenne de temps de glace",
        format: formatTimeOnIce,
      },
      {
        category: "faceoffWinPctg",
        title: "% Mises en jeu gagnées",
        format: (value: number) => (value * 100).toFixed(2),
      },
      {
        category: "goalsAgainstAverage",
        title: "Moyenne de buts accordés",
        format: (value: number) => value.toFixed(2),
      },
      {
        category: "savePercentage",
        title: "% Arr.",
        format: (value: number) => (value * 10).toFixed(2),
      },
    ];

    return (
      <section className="stats-team-player">
        <div className="wrapper">
          <h1>Meneur de l'équipe :</h1>
          <div className="player-stats-container">
            {statCategories.map(({ category, title, format }) =>
              renderPlayerStat(category as PlayerCategory, title, format)
            )}
          </div>
        </div>
      </section>
    );
  }
);

export default SingleTeamPlayerStats;
