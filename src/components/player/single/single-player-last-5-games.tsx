import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { formatDate } from "../../../scripts/utils/formatDate";
import fetchTeamNames from "../../../fetcher/teamName";

type Game = NonNullable<PlayerDetailsType["last5Games"]>[number];

type GameWithCalculatedStats = Game & {
  goalsAgainstAvg: number;
};

type SortableKeys = keyof Game | "goalsAgainstAvg";

type SortConfig = {
  key: SortableKeys;
  direction: "ascending" | "descending";
} | null;

type TeamNames = { [key: string]: string };

const PlayerSingleLast5Games: React.FC<{
  last5Games: PlayerDetailsType["last5Games"];
  player: PlayerDetailsType;
}> = ({ last5Games, player }) => {
  const [teamNames, setTeamNames] = useState<TeamNames>({});
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  useEffect(() => {
    const loadTeamNames = async () => {
      try {
        const names = await fetchTeamNames();
        setTeamNames(names);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    loadTeamNames();
  }, []);

  const requestSort = useCallback((key: SortableKeys) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === "descending"
          ? "ascending"
          : "descending",
    }));
  }, []);

  const convertToMinutes = useCallback((timeStr: string) => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes + seconds / 60;
  }, []);

  const calculateGoalsAgainstAvg = useCallback(
    (game: Game): number => {
      return (
        ((game.goalsAgainst || 0) / (convertToMinutes(game.toi) || 1)) * 60
      );
    },
    [convertToMinutes]
  );

  const sortedGames = useMemo(() => {
    if (!last5Games) return [];

    const gamesWithCalculatedStats: GameWithCalculatedStats[] = last5Games.map(
      (game) => ({
        ...game,
        goalsAgainstAvg: calculateGoalsAgainstAvg(game),
      })
    );

    return gamesWithCalculatedStats.sort((a, b) => {
      if (!sortConfig) return 0;

      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) return sortConfig.direction === "ascending" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [last5Games, sortConfig, calculateGoalsAgainstAvg]);

  const getSortArrow = useCallback(
    (key: SortableKeys) => {
      if (!sortConfig || sortConfig.key !== key) return null;
      return sortConfig.direction === "ascending" ? "↓" : "↑";
    },
    [sortConfig]
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!last5Games || last5Games.length === 0) {
    return (
      <section className="last-games">
        <div className="wrapper">
          <h2>Aucun match récent trouvé.</h2>
        </div>
      </section>
    );
  }

  const renderGoalieTable = () => (
    <table>
      <thead>
        <tr>
          <th onClick={() => requestSort("gameDate")}>
            Date {getSortArrow("gameDate")}
          </th>
          <th>Adv.</th>
          <th onClick={() => requestSort("gamesStarted")}>
            MA {getSortArrow("gamesStarted")}
          </th>
          <th onClick={() => requestSort("decision")}>
            DÉC {getSortArrow("decision")}
          </th>
          <th onClick={() => requestSort("shotsAgainst")}>
            TC {getSortArrow("shotsAgainst")}
          </th>
          <th onClick={() => requestSort("goalsAgainst")}>
            BC {getSortArrow("goalsAgainst")}
          </th>
          <th onClick={() => requestSort("savePctg")}>
            %Arr. {getSortArrow("savePctg")}
          </th>
          <th onClick={() => requestSort("goalsAgainstAvg")}>
            Moy. {getSortArrow("goalsAgainstAvg")}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedGames.map((game, index) => (
          <tr key={index}>
            <td>{formatDate(game.gameDate)}</td>
            <td>
              <Link to={`/equipes/${teamNames[game.opponentAbbrev]}`}>
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${game.opponentAbbrev}_dark.svg`}
                  alt={`${teamNames[game.opponentAbbrev]} logo`}
                />
              </Link>
            </td>
            <td>{game.gamesStarted}</td>
            <td>
              {game.decision === "W"
                ? "V"
                : game.decision === "L"
                ? "D"
                : game.decision === "O"
                ? "DP"
                : game.decision}
            </td>
            <td>{game.shotsAgainst}</td>
            <td>{game.goalsAgainst}</td>
            <td>{game.savePctg.toFixed(3)}</td>
            <td>{game.goalsAgainstAvg.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPlayerTable = () => (
    <table>
      <thead>
        <tr>
          <th onClick={() => requestSort("gameDate")}>
            Date {getSortArrow("gameDate")}
          </th>
          <th>Adv.</th>
          <th onClick={() => requestSort("goals")}>
            B {getSortArrow("goals")}
          </th>
          <th onClick={() => requestSort("assists")}>
            A {getSortArrow("assists")}
          </th>
          <th onClick={() => requestSort("points")}>
            P {getSortArrow("points")}
          </th>
          <th onClick={() => requestSort("pim")}>PIM {getSortArrow("pim")}</th>
          <th onClick={() => requestSort("toi")}>TG {getSortArrow("toi")}</th>
          <th onClick={() => requestSort("shots")}>
            T {getSortArrow("shots")}
          </th>
          <th onClick={() => requestSort("plusMinus")}>
            +/- {getSortArrow("plusMinus")}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedGames.map((game, index) => (
          <tr key={index}>
            <td>{formatDate(game.gameDate)}</td>
            <td>
              <Link to={`/equipes/${teamNames[game.opponentAbbrev]}`}>
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${game.opponentAbbrev}_dark.svg`}
                  alt={`${teamNames[game.opponentAbbrev]} logo`}
                />
              </Link>
            </td>
            <td>{game.goals}</td>
            <td>{game.assists}</td>
            <td>{game.points}</td>
            <td>{game.pim}</td>
            <td>{game.toi}</td>
            <td>{game.shots}</td>
            <td>{game.plusMinus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <section
      className={`last-5-games ${
        player.positionCode === "G" ? "goalie-layout" : "player-layout"
      }`}
    >
      <div className="wrapper">
        <h2>{`Les ${sortedGames.length} derniers matchs`}</h2>
        <div className="container-table">
          {player.positionCode === "G"
            ? renderGoalieTable()
            : renderPlayerTable()}
        </div>
      </div>
    </section>
  );
};

export default PlayerSingleLast5Games;
