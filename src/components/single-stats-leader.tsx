import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LeaderPlayerStats,
  LeaderGoalieStats,
} from "../interfaces/leader-stats";
import { generatePlayerSlug } from "../scripts/utils/generatePlayerSlug";
import { FormatPosition } from "../scripts/utils/formatPosition";

interface LeaderStatsProps {
  player: LeaderPlayerStats | null;
  goalie: LeaderGoalieStats | null;
}

const formatTimeOnIce = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  return `${hours}:${remainingMinutes.toString().padStart(2, "0")}`;
};

const formatStatValue = (value: unknown, category: string): string => {
  if (typeof value === "number") {
    switch (category) {
      case "% MAJ":
        return (value * 100).toFixed(2);
      case "% Arr.":
        return (value * 10).toFixed(2);
      case "Moy.":
        return value.toFixed(2);
      case "TG/PJ":
        return formatTimeOnIce(value);
      default:
        return value.toFixed(0);
    }
  }
  return String(value);
};

type Player =
  | LeaderPlayerStats["points"][number]
  | LeaderGoalieStats["savePctg"][number];

const PlayerDisplay: React.FC<{
  player: Player;
  statValue: number | string;
  titleStats: string;
}> = React.memo(({ player, statValue, titleStats }) => (
  <div className="display-player">
    <div className="media">
      <Link
        to={`/equipes/${player.teamName.default
          .toLowerCase()
          .replace(/\s+/g, "-")}/joueur/${generatePlayerSlug(
          player.firstName.default,
          player.lastName.default,
          player.id
        )}`}
      >
        <img
          src={player.headshot}
          alt={`${player.firstName.default} ${player.lastName.default}`}
        />
      </Link>
    </div>
    <div className="content">
      <h3>{`${player.firstName.default} ${player.lastName.default}`}</h3>
      <div className="other-infos">
        <p>{`#${player.sweaterNumber}`}</p>
        <Link
          to={`/equipes/${player.teamName.default
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          <img
            src={`https://assets.nhle.com/logos/nhl/svg/${player.teamAbbrev}_dark.svg`}
            alt={`${player.teamName.default} Logo`}
          />
        </Link>
        <p>{FormatPosition(player.position)}</p>
      </div>
      <p>
        <strong>
          {formatStatValue(statValue, titleStats)} {titleStats}
        </strong>
      </p>
    </div>
  </div>
));

const SingleLeaderStats: React.FC<LeaderStatsProps> = ({ player, goalie }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, Player | null>>({});
  const [teamColors, setTeamColors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamColors = async () => {
      try {
        const colorRes = await fetch("./teamColor.json");
        if (!colorRes.ok) throw new Error("Failed to fetch team colors");
        const colorData: Record<string, { color: string }> = await colorRes.json();
        setTeamColors(Object.fromEntries(Object.entries(colorData).map(([key, value]) => [key, value.color])));
      } catch (err) {
        console.error(err);
        setError("Error fetching team colors");
      }
    };

    fetchTeamColors();
  }, []);

  const getLeaderBoards = useMemo(() => {
    if (!player || !goalie) return [];

    return [
      { label: "Points", stats: player.points, type: "Points" },
      { label: "Buts", stats: player.goals, type: "Buts" },
      { label: "Aides", stats: player.assists, type: "Aides" },
      { label: "+/-", stats: player.plusMinus, type: "Différentiel" },
      { label: "TG/PJ", stats: player.toi, type: "Moyenne de temps de glace" },
      { label: "% MAJ", stats: player.faceoffLeaders, type: "% Mises en jeu gagnées" },
      { label: "% Arr.", stats: goalie.savePctg, type: "% Arr." },
      { label: "Moy.", stats: goalie.goalsAgainstAverage, type: "Moyenne de buts accordés" },
    ];
  }, [player, goalie]);

  const handlePlayerClick = useCallback((category: string, player: Player) => {
    setSelectedPlayers((prev) => ({ ...prev, [category]: player }));
  }, []);

  const renderLeaderBoard = useMemo(() => {
    return getLeaderBoards.map((item) => {
      const bestPlayer = item.stats[0];
      const selectedPlayer = selectedPlayers[item.type] || bestPlayer;

      return (
        <div className="player-stat" key={item.label}>
          <PlayerDisplay
            player={selectedPlayer}
            statValue={selectedPlayer.value}
            titleStats={item.label}
          />
          <div className="stats">
            <h2>{item.type}</h2>
            {item.stats.slice(0, 5).map((stat, index) => {
              const isSelected = selectedPlayers[item.type] === stat;
              const isBest = stat === bestPlayer;
              const backgroundColor = isSelected || (isBest && !selectedPlayers[item.type])
                ? teamColors[stat.teamAbbrev] || 'transparent'
                : 'transparent';

              return (
                <div
                  key={stat.id}
                  className={`content window-effect ${isSelected ? "active" : ""}`}
                  style={{ backgroundColor }}
                  onClick={() => handlePlayerClick(item.type, stat)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {stat.firstName.default} {stat.lastName.default}
                    </p>
                    <p>
                      <strong>{formatStatValue(stat.value, item.label)}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }, [getLeaderBoards, selectedPlayers, teamColors, handlePlayerClick]);

  return (
    <section className="stats-leaders hero">
      <div className="wrapper">
        <h1>Meneurs de la LNH</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="player-stats-container">{renderLeaderBoard}</div>
      </div>
    </section>
  );
};

export default SingleLeaderStats;