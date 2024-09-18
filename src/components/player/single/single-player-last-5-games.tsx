import React, { useEffect, useState } from "react";
import { PlayerDetailsType } from "../../../fetcher/playerDetails";
import { Link } from "react-router-dom";

const fetchTeamNames = async (): Promise<{ [key: string]: string }> => {
  const response = await fetch("/teamName.json");
  if (!response.ok) {
    throw new Error("Failed to fetch team names");
  }
  return response.json();
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", options);
};

const PlayerSingleLast5Games: React.FC<{
  last5Games: PlayerDetailsType["last5Games"];
}> = ({ last5Games }) => {
  const [teamNames, setTeamNames] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

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

  const sortedGames = React.useMemo(() => {
    if (!last5Games) return [];
    
    return [...last5Games].sort((a, b) => {
      if (sortConfig?.key === "date") {
        const dateA = new Date(a.gameDate).getTime();
        const dateB = new Date(b.gameDate).getTime();
        return sortConfig.direction === "ascending" ? dateA - dateB : dateB - dateA;
      } else {
        const valueA = a[sortConfig?.key as keyof typeof a];
        const valueB = b[sortConfig?.key as keyof typeof b];
        if (valueA < valueB) {
          return sortConfig?.direction === "ascending" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig?.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
    });
  }, [last5Games, sortConfig]);

  const requestSort = (key: string) => {
    let direction = "descending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
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

  return (
    <section className="last-5-games">
      <div className="wrapper">
        <h2>{`Les ${sortedGames.length} derniers matchs`}</h2>
        <div className="container-table">
          <table>
            <thead>
              <tr>
                <th onClick={() => requestSort("date")}>Date</th>
                <th>Adv.</th>
                <th onClick={() => requestSort("goals")}>B</th>
                <th onClick={() => requestSort("assists")}>A</th>
                <th onClick={() => requestSort("points")}>P</th>
                <th onClick={() => requestSort("pim")}>PIM</th>
                <th onClick={() => requestSort("toi")}>TG</th>
                <th onClick={() => requestSort("shots")}>T</th>
                <th onClick={() => requestSort("plusMinus")}>+/-</th>
              </tr>
            </thead>
            <tbody>
              {sortedGames.map((game, index) => (
                <tr key={index}>
                  <td>{formatDate(game.gameDate)}</td>
                  <td>
                    <Link to={`/equipes/${teamNames[game.opponentAbbrev]}`}>
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${game.opponentAbbrev}_light.svg`}
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
};

export default PlayerSingleLast5Games;
