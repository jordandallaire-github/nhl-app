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
                        <th onClick={() => requestSort("season")}>Saison</th>
                        <th>Équipe</th>
                        <th onClick={() => requestSort("gamesStarted")}>PJ</th>
                        <th onClick={() => requestSort("wins")}>V</th>
                        <th onClick={() => requestSort("losses")}>D</th>
                        <th onClick={() => requestSort("otLosses")}>DP</th>
                        <th onClick={() => requestSort("shotsAgainst")}>TC</th>
                        <th onClick={() => requestSort("goalsAgainst")}>BC</th>
                        <th onClick={() => requestSort("savePctg")}>%Arr.</th>
                        <th onClick={() => requestSort("goalsAgainstAvg")}>
                          Moy.
                        </th>
                        <th onClick={() => requestSort("shutouts")}>BL</th>
                        <th onClick={() => requestSort("goals")}>B</th>
                        <th onClick={() => requestSort("assists")}>A</th>
                        <th onClick={() => requestSort("points")}>P</th>
                        <th onClick={() => requestSort("pim")}>PUN</th>
                        <th onClick={() => requestSort("timeOnIce")}>TG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSeasonTotals.map(
                        (seasonData, index) =>
                          seasonData.gameTypeId === 2 && (
                            <tr key={index}>
                              <th scope="row">
                                {formatSeason(seasonData.season)}
                              </th>
                              <th scope="row">
                                <Link
                                  to={`/equipes/${seasonData.teamCommonName.default
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                >
                                  {seasonData.teamName.fr}
                                </Link>
                              </th>
                              <th>{seasonData.gamesStarted}</th>
                              <th>{seasonData.wins}</th>
                              <th>{seasonData.losses}</th>
                              <th>{seasonData.otLosses}</th>
                              <th>{seasonData.shotsAgainst}</th>
                              <th>{seasonData.goalsAgainst}</th>
                              <th>{seasonData.savePctg.toFixed(3)}</th>
                              <th>{seasonData.goalsAgainstAvg.toFixed(2)}</th>
                              <th>{seasonData.shutouts}</th>
                              <th>{seasonData.goals}</th>
                              <th>{seasonData.assists}</th>
                              <th>{seasonData.goals + seasonData.assists}</th>
                              <th>{seasonData.pim}</th>
                              <th>{seasonData.timeOnIce}</th>
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
                          <th onClick={() => requestSort("season")}>Saison</th>
                          <th>Équipe</th>
                          <th onClick={() => requestSort("gamesStarted")}>
                            PJ
                          </th>
                          <th onClick={() => requestSort("wins")}>V</th>
                          <th onClick={() => requestSort("losses")}>D</th>
                          <th onClick={() => requestSort("otLosses")}>DP</th>
                          <th onClick={() => requestSort("shotsAgainst")}>
                            TC
                          </th>
                          <th onClick={() => requestSort("goalsAgainst")}>
                            BC
                          </th>
                          <th onClick={() => requestSort("savePctg")}>%Arr.</th>
                          <th onClick={() => requestSort("goalsAgainstAvg")}>
                            Moy.
                          </th>
                          <th onClick={() => requestSort("shutouts")}>BL</th>
                          <th onClick={() => requestSort("goals")}>B</th>
                          <th onClick={() => requestSort("assists")}>A</th>
                          <th onClick={() => requestSort("points")}>P</th>
                          <th onClick={() => requestSort("pim")}>PUN</th>
                          <th onClick={() => requestSort("timeOnIce")}>TG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playoffStats.map((seasonData, index) => (
                          <tr key={index}>
                            <th scope="row">
                              {formatSeason(seasonData.season)}
                            </th>
                            <th scope="row">
                              <Link
                                to={`/equipes/${seasonData.teamCommonName.default
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                              >
                                {seasonData.teamName.fr}
                              </Link>
                            </th>
                            <th>{seasonData.gamesStarted}</th>
                            <th>{seasonData.wins}</th>
                            <th>{seasonData.losses}</th>
                            <th>{seasonData.otLosses}</th>
                            <th>{seasonData.shotsAgainst}</th>
                            <th>{seasonData.goalsAgainst}</th>
                            <th>{seasonData.savePctg.toFixed(3)}</th>
                            <th>{seasonData.goalsAgainstAvg.toFixed(2)}</th>
                            <th>{seasonData.shutouts}</th>
                            <th>{seasonData.goals}</th>
                            <th>{seasonData.assists}</th>
                            <th>{seasonData.goals + seasonData.assists}</th>
                            <th>{seasonData.pim}</th>
                            <th>{seasonData.timeOnIce}</th>
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
                        <th onClick={() => requestSort("season")}>Saison</th>
                        <th>Équipe</th>
                        <th onClick={() => requestSort("gamesPlayed")}>PJ</th>
                        <th onClick={() => requestSort("goals")}>B</th>
                        <th onClick={() => requestSort("assists")}>A</th>
                        <th onClick={() => requestSort("points")}>P</th>
                        <th onClick={() => requestSort("plusMinus")}>+/-</th>
                        <th onClick={() => requestSort("pim")}>PUN</th>
                        <th onClick={() => requestSort("shots")}>T</th>
                        <th onClick={() => requestSort("shootingPctg")}>%T</th>
                        <th onClick={() => requestSort("powerPlayGoals")}>
                          BAN
                        </th>
                        <th onClick={() => requestSort("powerPlayPoints")}>
                          PAN
                        </th>
                        <th onClick={() => requestSort("shorthandedGoals")}>
                          BIN
                        </th>
                        <th onClick={() => requestSort("shorthandedPoints")}>
                          PIN
                        </th>
                        <th onClick={() => requestSort("avgToi")}>TG/PJ</th>
                        <th onClick={() => requestSort("gameWinningGoals")}>
                          BG
                        </th>
                        <th onClick={() => requestSort("otGoals")}>B Pr</th>
                        <th onClick={() => requestSort("faceoffWinningPctg")}>
                          %MAJ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSeasonTotals.map(
                        (seasonData, index) =>
                          seasonData.gameTypeId === 2 && (
                            <tr key={index}>
                              <th scope="row">
                                {formatSeason(seasonData.season)}
                              </th>
                              <th scope="row">
                                <Link
                                  to={`/equipes/${seasonData.teamCommonName.default
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                >
                                  {seasonData.teamName.fr}
                                </Link>
                              </th>
                              <th>{seasonData.gamesPlayed}</th>
                              <th>{seasonData.goals}</th>
                              <th>{seasonData.assists}</th>
                              <th>{seasonData.points}</th>
                              <th>{seasonData.plusMinus}</th>
                              <th>{seasonData.pim}</th>
                              <th>{seasonData.shots}</th>
                              <th>{seasonData.shootingPctg.toFixed(3)}</th>
                              <th>{seasonData.powerPlayGoals}</th>
                              <th>{seasonData.powerPlayPoints}</th>
                              <th>{seasonData.shorthandedGoals}</th>
                              <th>{seasonData.shorthandedPoints}</th>
                              <th>{seasonData.avgToi}</th>
                              <th>{seasonData.gameWinningGoals}</th>
                              <th>{seasonData.otGoals}</th>
                              <th>
                                {seasonData.faceoffWinningPctg.toFixed(3)}
                              </th>
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
                          <th onClick={() => requestSort("season")}>Saison</th>
                          <th>Équipe</th>
                          <th onClick={() => requestSort("gamesPlayed")}>PJ</th>
                          <th onClick={() => requestSort("goals")}>B</th>
                          <th onClick={() => requestSort("assists")}>A</th>
                          <th onClick={() => requestSort("points")}>P</th>
                          <th onClick={() => requestSort("plusMinus")}>+/-</th>
                          <th onClick={() => requestSort("pim")}>PUN</th>
                          <th onClick={() => requestSort("shots")}>T</th>
                          <th onClick={() => requestSort("shootingPctg")}>
                            %T
                          </th>
                          <th onClick={() => requestSort("powerPlayGoals")}>
                            BAN
                          </th>
                          <th onClick={() => requestSort("powerPlayPoints")}>
                            PAN
                          </th>
                          <th onClick={() => requestSort("shorthandedGoals")}>
                            BIN
                          </th>
                          <th onClick={() => requestSort("shorthandedPoints")}>
                            PIN
                          </th>
                          <th onClick={() => requestSort("avgToi")}>TG/PJ</th>
                          <th onClick={() => requestSort("gameWinningGoals")}>
                            BG
                          </th>
                          <th onClick={() => requestSort("otGoals")}>B Pr</th>
                          <th onClick={() => requestSort("faceoffWinningPctg")}>
                            %MAJ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {playoffStats.map((seasonData, index) => (
                          <tr key={index}>
                            <th scope="row">
                              {formatSeason(seasonData.season)}
                            </th>
                            <th scope="row">
                              <Link
                                to={`/equipes/${seasonData.teamCommonName.default
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                              >
                                {seasonData.teamName.fr}
                              </Link>
                            </th>
                            <th>{seasonData.gamesPlayed}</th>
                            <th>{seasonData.goals}</th>
                            <th>{seasonData.assists}</th>
                            <th>{seasonData.points}</th>
                            <th>{seasonData.plusMinus}</th>
                            <th>{seasonData.pim}</th>
                            <th>{seasonData.shots}</th>
                            <th>{seasonData.shootingPctg.toFixed(3)}</th>
                            <th>{seasonData.powerPlayGoals}</th>
                            <th>{seasonData.powerPlayPoints}</th>
                            <th>{seasonData.shorthandedGoals}</th>
                            <th>{seasonData.shorthandedPoints}</th>
                            <th>{seasonData.avgToi}</th>
                            <th>{seasonData.gameWinningGoals}</th>
                            <th>{seasonData.otGoals}</th>
                            <th>{seasonData.faceoffWinningPctg.toFixed(3)}</th>
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
