import React, { useEffect, useState, useMemo } from "react";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { Link } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import fetchTeamNames from "../../../fetcher/teamName";

const PlayerSingleLast5Games: React.FC<{
  last5Games: PlayerDetailsType["last5Games"];
  player: PlayerDetailsType;
}> = ({ last5Games, player }) => {
  const [teamNames, setTeamNames] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  } | null>(null);

  useEffect(() => {
    const loadTeamNames = async () => {
      try {
        const names = await fetchTeamNames();
        setTeamNames(names);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    loadTeamNames();
  }, []);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "descending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const convertToMinutes = (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    return minutes + seconds / 60;
  };

  const sortedGames = useMemo(() => {
    if (!last5Games) return [];

    return [...last5Games].sort((a, b) => {
      if (!sortConfig) return 0;

      const valueA =
        sortConfig.key === "goalsAgainstAvg"
          ? ((a.goalsAgainst || 0) / (convertToMinutes(a.toi) || 1)) * 60
          : a[sortConfig.key as keyof typeof a];
      const valueB =
        sortConfig.key === "goalsAgainstAvg"
          ? ((b.goalsAgainst || 0) / (convertToMinutes(b.toi) || 1)) * 60
          : b[sortConfig.key as keyof typeof b];

      if (valueA < valueB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [last5Games, sortConfig]);

  const getSortArrow = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↓" : "↑";
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!last5Games || last5Games.length === 0)
    return (
      <section className="last-games">
        <div className="wrapper">
          <h2>Aucun match récent trouvé.</h2>
        </div>
      </section>
    );

  switch (player.positionCode) {
    case "G":
      return (
        <section className="last-5-games goalie-layout">
          <div className="wrapper">
            <h2>{`Les ${sortedGames.length} derniers matchs`}</h2>
            <div className="container-table">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => requestSort("date")}>
                      Date {getSortArrow("date")}
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
                      <td>
                        {(
                          ((game.goalsAgainst || 0) /
                            (convertToMinutes(game.toi) || 1)) *
                          60
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      );

    default:
      return (
        <section className="last-5-games player-layout">
          <div className="wrapper">
            <h2>{`Les ${sortedGames.length} derniers matchs`}</h2>
            <div className="container-table">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => requestSort("date")}>
                      Date {getSortArrow("date")}
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
                    <th onClick={() => requestSort("pim")}>
                      PIM {getSortArrow("pim")}
                    </th>
                    <th onClick={() => requestSort("toi")}>
                      TG {getSortArrow("toi")}
                    </th>
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
            </div>
          </div>
        </section>
      );
  }
};

export default PlayerSingleLast5Games;
