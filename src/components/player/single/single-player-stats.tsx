import React, { useState, useMemo } from "react";
import Carousel from "../../carousel";
import { PlayerDetailsType } from "../../../fetcher/playerDetails";
import { Link } from "react-router-dom";
import formatSeason from "../../utils/formatSeason";

const PlayerSingleStats: React.FC<{ player: PlayerDetailsType }> = ({
  player,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const requestSort = (key: string) => {
    let direction = "descending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const sortedSeasonTotals = useMemo(() => {
    if (!player.seasonTotals) return [];

    return [...player.seasonTotals].sort((a, b) => {
      if (!sortConfig) return 0;

      const valueA = a[sortConfig.key as keyof typeof a];
      const valueB = b[sortConfig.key as keyof typeof b];

      if (valueA < valueB) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [player.seasonTotals, sortConfig]);

  const getSortArrow = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↓" : "↑";
  };

  if (!player.seasonTotals || player.seasonTotals.length === 0)
    return (
      <section className="last-games">
        <div className="wrapper">
          <h2>Aucune Saison trouvé.</h2>
        </div>
      </section>
    );

  const playoffStats = sortedSeasonTotals.filter(
    (seasonData) => seasonData.gameTypeId === 3
  );

  const renderPlayerStats = () => {
    switch (player.positionCode) {
      case "G":
        return (
          <>
            <Carousel
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              breakpoint={{ 1020: { spaceBetween: 10, slidesPerView: 1 } }}
              noSwiping={true}
              grabCursor={false}
              autoHeight={true}
            >
              <div className="nav stats">
                <div className="swiper-button-prev">
                  <h3>Saisons</h3>
                </div>
                <div className="swiper-button-next">
                  <h3>Séries</h3>
                </div>
              </div>
              <div data-is-swiper-slide className="season swiper-no-swiping">
                <div className="season-stats">
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => requestSort("season")}>
                          Saison {getSortArrow("season")}
                        </th>
                        <th>Équipe</th>
                        <th onClick={() => requestSort("gamesStarted")}>
                          PJ {getSortArrow("gamesStarted")}
                        </th>
                        <th onClick={() => requestSort("wins")}>
                          V {getSortArrow("wins")}
                        </th>
                        <th onClick={() => requestSort("losses")}>
                          D {getSortArrow("losses")}
                        </th>
                        <th onClick={() => requestSort("otLosses")}>
                          DP {getSortArrow("otLosses")}
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
                        <th onClick={() => requestSort("shutouts")}>
                          BL {getSortArrow("shutouts")}
                        </th>
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
                          PUN {getSortArrow("pim")}
                        </th>
                        <th onClick={() => requestSort("timeOnIce")}>
                          TG {getSortArrow("timeOnIce")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSeasonTotals.map(
                        (seasonData, index) =>
                          seasonData.gameTypeId === 2 && (
                            <tr key={index}>
                              <td scope="row">
                                {formatSeason(seasonData.season)}
                              </td>
                              <td scope="row">
                                <Link
                                  to={`/equipes/${seasonData.teamCommonName.default
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                >
                                  {seasonData.teamName.fr}
                                </Link>
                              </td>
                              <td>{seasonData.gamesStarted}</td>
                              <td>{seasonData.wins}</td>
                              <td>{seasonData.losses}</td>
                              <td>{seasonData.otLosses}</td>
                              <td>{seasonData.shotsAgainst}</td>
                              <td>{seasonData.goalsAgainst}</td>
                              <td>{seasonData.savePctg.toFixed(3)}</td>
                              <td>{seasonData.goalsAgainstAvg.toFixed(2)}</td>
                              <td>{seasonData.shutouts}</td>
                              <td>{seasonData.goals}</td>
                              <td>{seasonData.assists}</td>
                              <td>{seasonData.goals + seasonData.assists}</td>
                              <td>{seasonData.pim}</td>
                              <td>{seasonData.timeOnIce}</td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div data-is-swiper-slide className="playoff swiper-no-swiping">
                <div className="playoff-stats">
                  {playoffStats.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => requestSort("season")}>
                            Saison {getSortArrow("season")}
                          </th>
                          <th>Équipe</th>
                          <th onClick={() => requestSort("gamesStarted")}>
                            PJ {getSortArrow("gamesStarted")}
                          </th>
                          <th onClick={() => requestSort("wins")}>
                            V {getSortArrow("wins")}
                          </th>
                          <th onClick={() => requestSort("losses")}>
                            D {getSortArrow("losses")}
                          </th>
                          <th onClick={() => requestSort("otLosses")}>
                            DP {getSortArrow("otLosses")}
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
                          <th onClick={() => requestSort("shutouts")}>
                            BL {getSortArrow("shutouts")}
                          </th>
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
                            PUN {getSortArrow("pim")}
                          </th>
                          <th onClick={() => requestSort("timeOnIce")}>
                            TG {getSortArrow("timeOnIce")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {playoffStats.map((seasonData, index) => (
                          <tr key={index}>
                            <td scope="row">
                              {formatSeason(seasonData.season)}
                            </td>
                            <td scope="row">
                              <Link
                                to={`/equipes/${seasonData.teamCommonName.default
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                              >
                                {seasonData.teamName.fr}
                              </Link>
                            </td>
                            <td>{seasonData.gamesStarted}</td>
                            <td>{seasonData.wins}</td>
                            <td>{seasonData.losses}</td>
                            <td>{seasonData.otLosses}</td>
                            <td>{seasonData.shotsAgainst}</td>
                            <td>{seasonData.goalsAgainst}</td>
                            <td>{seasonData.savePctg.toFixed(3)}</td>
                            <td>{seasonData.goalsAgainstAvg.toFixed(2)}</td>
                            <td>{seasonData.shutouts}</td>
                            <td>{seasonData.goals}</td>
                            <td>{seasonData.assists}</td>
                            <td>{seasonData.goals + seasonData.assists}</td>
                            <td>{seasonData.pim}</td>
                            <td>{seasonData.timeOnIce}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <h4>Aucun match de série joué.</h4>
                  )}
                </div>
              </div>
            </Carousel>
          </>
        );

      default:
        return (
          <>
            <Carousel
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              breakpoint={{ 1020: { spaceBetween: 10, slidesPerView: 1 } }}
              noSwiping={true}
              grabCursor={false}
              autoHeight={true}
            >
              <div className="nav stats">
                <div className="swiper-button-prev">
                  <h3>Saisons</h3>
                </div>
                <div className="swiper-button-next">
                  <h3>Séries</h3>
                </div>
              </div>
              <div data-is-swiper-slide className="season swiper-no-swiping">
                <div className="season-stats">
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => requestSort("season")}>
                          Saison {getSortArrow("season")}
                        </th>
                        <th>Équipe</th>
                        <th onClick={() => requestSort("gamesPlayed")}>
                          PJ {getSortArrow("gamesPlayed")}
                        </th>
                        <th onClick={() => requestSort("goals")}>
                          B {getSortArrow("goals")}
                        </th>
                        <th onClick={() => requestSort("assists")}>
                          A {getSortArrow("assists")}
                        </th>
                        <th onClick={() => requestSort("points")}>
                          P {getSortArrow("points")}
                        </th>
                        <th onClick={() => requestSort("plusMinus")}>
                          +/- {getSortArrow("plusMinus")}
                        </th>
                        <th onClick={() => requestSort("pim")}>
                          PUN {getSortArrow("pim")}
                        </th>
                        <th onClick={() => requestSort("shots")}>
                          T {getSortArrow("shots")}
                        </th>
                        <th onClick={() => requestSort("shootingPctg")}>
                          %T {getSortArrow("shootingPctg")}
                        </th>
                        <th onClick={() => requestSort("powerPlayGoals")}>
                          BAN {getSortArrow("powerPlayGoals")}
                        </th>
                        <th onClick={() => requestSort("powerPlayPoints")}>
                          PAN {getSortArrow("powerPlayPoints")}
                        </th>
                        <th onClick={() => requestSort("shorthandedGoals")}>
                          BIN {getSortArrow("shorthandedGoals")}
                        </th>
                        <th onClick={() => requestSort("shorthandedPoints")}>
                          PIN {getSortArrow("shorthandedPoints")}
                        </th>
                        <th onClick={() => requestSort("avgToi")}>
                          TG/PJ {getSortArrow("avgToi")}
                        </th>
                        <th onClick={() => requestSort("gameWinningGoals")}>
                          BG {getSortArrow("gameWinningGoals")}
                        </th>
                        <th onClick={() => requestSort("otGoals")}>
                          B Pr {getSortArrow("otGoals")}
                        </th>
                        <th onClick={() => requestSort("faceoffWinningPctg")}>
                          %MAJ {getSortArrow("faceoffWinningPctg")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSeasonTotals.map(
                        (seasonData, index) =>
                          seasonData.gameTypeId === 2 && (
                            <tr key={index}>
                              <td scope="row">
                                {formatSeason(seasonData.season)}
                              </td>
                              <td scope="row">
                                <Link
                                  to={`/equipes/${seasonData.teamCommonName.default
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                >
                                  {seasonData.teamName.fr}
                                </Link>
                              </td>
                              <td>{seasonData.gamesPlayed}</td>
                              <td>{seasonData.goals}</td>
                              <td>{seasonData.assists}</td>
                              <td>{seasonData.points}</td>
                              <td>{seasonData.plusMinus}</td>
                              <td>{seasonData.pim}</td>
                              <td>{seasonData.shots}</td>
                              <td>{seasonData.shootingPctg.toFixed(3)}</td>
                              <td>{seasonData.powerPlayGoals}</td>
                              <td>{seasonData.powerPlayPoints}</td>
                              <td>{seasonData.shorthandedGoals}</td>
                              <td>{seasonData.shorthandedPoints}</td>
                              <td>{seasonData.avgToi}</td>
                              <td>{seasonData.gameWinningGoals}</td>
                              <td>{seasonData.otGoals}</td>
                              <td>
                                {seasonData.faceoffWinningPctg.toFixed(3)}
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div data-is-swiper-slide className="playoff swiper-no-swiping">
                <div className="playoff-stats">
                  {playoffStats.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => requestSort("season")}>
                            Saison {getSortArrow("season")}
                          </th>
                          <th>Équipe</th>
                          <th onClick={() => requestSort("gamesPlayed")}>
                            PJ {getSortArrow("gamesPlayed")}
                          </th>
                          <th onClick={() => requestSort("goals")}>
                            B {getSortArrow("goals")}
                          </th>
                          <th onClick={() => requestSort("assists")}>
                            A {getSortArrow("assists")}
                          </th>
                          <th onClick={() => requestSort("points")}>
                            P {getSortArrow("points")}
                          </th>
                          <th onClick={() => requestSort("plusMinus")}>
                            +/- {getSortArrow("plusMinus")}
                          </th>
                          <th onClick={() => requestSort("pim")}>
                            PUN {getSortArrow("pim")}
                          </th>
                          <th onClick={() => requestSort("shots")}>
                            T {getSortArrow("shots")}
                          </th>
                          <th onClick={() => requestSort("shootingPctg")}>
                            %T {getSortArrow("shootingPctg")}
                          </th>
                          <th onClick={() => requestSort("powerPlayGoals")}>
                            BAN {getSortArrow("powerPlayGoals")}
                          </th>
                          <th onClick={() => requestSort("powerPlayPoints")}>
                            PAN {getSortArrow("powerPlayPoints")}
                          </th>
                          <th onClick={() => requestSort("shorthandedGoals")}>
                            BIN {getSortArrow("shorthandedGoals")}
                          </th>
                          <th onClick={() => requestSort("shorthandedPoints")}>
                            PIN {getSortArrow("shorthandedPoints")}
                          </th>
                          <th onClick={() => requestSort("avgToi")}>
                            TG/PJ {getSortArrow("avgToi")}
                          </th>
                          <th onClick={() => requestSort("gameWinningGoals")}>
                            BG {getSortArrow("gameWinningGoals")}
                          </th>
                          <th onClick={() => requestSort("otGoals")}>
                            B Pr {getSortArrow("otGoals")}
                          </th>
                          <th onClick={() => requestSort("faceoffWinningPctg")}>
                            %MAJ {getSortArrow("faceoffWinningPctg")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {playoffStats.map((seasonData, index) => (
                          <tr key={index}>
                            <td scope="row">
                              {formatSeason(seasonData.season)}
                            </td>
                            <td scope="row">
                              <Link
                                to={`/equipes/${seasonData.teamCommonName.default
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                              >
                                {seasonData.teamName.fr}
                              </Link>
                            </td>
                            <td>{seasonData.gamesPlayed}</td>
                            <td>{seasonData.goals}</td>
                            <td>{seasonData.assists}</td>
                            <td>{seasonData.points}</td>
                            <td>{seasonData.plusMinus}</td>
                            <td>{seasonData.pim}</td>
                            <td>{seasonData.shots}</td>
                            <td>{seasonData.shootingPctg.toFixed(3)}</td>
                            <td>{seasonData.powerPlayGoals}</td>
                            <td>{seasonData.powerPlayPoints}</td>
                            <td>{seasonData.shorthandedGoals}</td>
                            <td>{seasonData.shorthandedPoints}</td>
                            <td>{seasonData.avgToi}</td>
                            <td>{seasonData.gameWinningGoals}</td>
                            <td>{seasonData.otGoals}</td>
                            <td>{seasonData.faceoffWinningPctg.toFixed(3)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <h4>Aucun match de série joué.</h4>
                  )}
                </div>
              </div>
            </Carousel>
          </>
        );
    }
  };

  return (
    <section className="global-stats stats">
      <div className="wrapper">
        <h2>Statistiques</h2>
        {renderPlayerStats()}
      </div>
    </section>
  );
};

export default PlayerSingleStats;
