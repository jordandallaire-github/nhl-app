import Carousel from "../../carousel";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import formatSeason from "../../utils/formatSeason";

const PlayerSingleGeneralStats: React.FC<{ player: PlayerDetailsType }> = ({
  player,
}) => {
  const renderStats = () => {
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
              <div className="nav">
                <div className="swiper-button-prev">
                  <h2>Saisons</h2>
                </div>
                <div className="swiper-button-next">
                  <h2>Séries</h2>
                </div>
              </div>
              <div
                data-is-swiper-slide
                className="normal-stats-general swiper-no-swiping"
              >
                <div className="current-season-stats">
                  <h3>
                    {`Saison ${
                      formatSeason(player.featuredStats?.season)
                        ? formatSeason(player.featuredStats?.season)
                        : "2023-24"
                    }`}
                  </h3>
                  <div className="short-stats-list">
                    <table>
                      <thead>
                        <tr>
                          <th>PJ</th>
                          <th>V</th>
                          <th>D</th>
                          <th>%ARR</th>
                          <th>MOY</th>
                          <th className="statsNoMobile">BL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.gamesPlayed ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.wins ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.losses ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason?.savePctg?.toFixed(
                              3
                            ) ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason?.goalsAgainstAvg?.toFixed(
                              2
                            ) ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.shutouts ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="current-total-stats">
                  <h3>Carrière</h3>
                  <div className="short-stats-list">
                    <table>
                      <thead>
                        <tr>
                          <th>PJ</th>
                          <th>V</th>
                          <th>D</th>
                          <th>%ARR</th>
                          <th>MOY</th>
                          <th className="statsNoMobile">BL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {player.careerTotals?.regularSeason?.gamesPlayed ??
                              0}
                          </td>
                          <td>
                            {player.careerTotals?.regularSeason?.wins ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.regularSeason?.losses ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.regularSeason?.savePctg.toFixed(
                              3
                            ) ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.regularSeason?.goalsAgainstAvg.toFixed(
                              2
                            ) ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.careerTotals?.regularSeason?.shutouts ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                data-is-swiper-slide
                className="playoff-stats-general swiper-no-swiping"
              >
                <div className="current-season-stats">
                  <h3>
                    {`Série ${
                      formatSeason(player.featuredStats?.season)
                        ? formatSeason(player.featuredStats?.season)
                        : "2023-24"
                    }`}
                  </h3>
                  <div className="short-stats-list">
                    <table>
                      <thead>
                        <tr>
                          <th>PJ</th>
                          <th>V</th>
                          <th>D</th>
                          <th>%ARR</th>
                          <th>MOY</th>
                          <th className="statsNoMobile">BL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason
                              ?.gamesPlayed ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason?.wins ??
                              0}
                          </td>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason
                              ?.losses ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason?.savePctg?.toFixed(
                              3
                            ) ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason?.goalsAgainstAvg?.toFixed(
                              2
                            ) ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.featuredStats?.playoffs?.subSeason
                              ?.shutouts ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="current-total-stats">
                  <h3>Carrière en séries</h3>
                  <div className="short-stats-list">
                    <table>
                      <thead>
                        <tr>
                          <th>PJ</th>
                          <th>V</th>
                          <th>D</th>
                          <th>%ARR</th>
                          <th>MOY</th>
                          <th className="statsNoMobile">BL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {player.careerTotals?.playoffs
                              ?.gamesPlayed ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.playoffs?.wins ??
                              0}
                          </td>
                          <td>
                            {player.careerTotals?.playoffs
                              ?.losses ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.playoffs?.savePctg?.toFixed(
                              3
                            ) ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.playoffs?.goalsAgainstAvg?.toFixed(
                              2
                            ) ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.careerTotals?.playoffs
                              ?.shutouts ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
              <div className="nav">
                <div className="swiper-button-prev">
                  <h2>Saisons</h2>
                </div>
                <div className="swiper-button-next">
                  <h2>Séries</h2>
                </div>
              </div>
              <div
                data-is-swiper-slide
                className="normal-stats-general swiper-no-swiping"
              >
                <div className="current-season-stats">
                  <h3>
                    {`Saison ${
                      formatSeason(player.featuredStats?.season)
                        ? formatSeason(player.featuredStats?.season)
                        : "2023-24"
                    }`}
                  </h3>
                  <div className="short-stats-list">
                    <table>
                      <thead>
                        <tr>
                          <th>PJ</th>
                          <th>B</th>
                          <th>A</th>
                          <th>P</th>
                          <th>+/-</th>
                          <th className="statsNoMobile">PUN</th>
                          <th className="statsNoMobile">%T</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.gamesPlayed ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.goals ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.assists ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.points ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.plusMinus ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.featuredStats?.regularSeason?.subSeason
                              ?.pim ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.featuredStats?.regularSeason?.subSeason?.shootingPctg?.toFixed(
                              3
                            ) ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="current-total-stats">
                  <h3>Carrière</h3>
                  <div className="short-stats-list">
                    <table>
                      <thead>
                        <tr>
                          <th>PJ</th>
                          <th>B</th>
                          <th>A</th>
                          <th>P</th>
                          <th>+/-</th>
                          <th className="statsNoMobile">PUN</th>
                          <th className="statsNoMobile">%T</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {player.careerTotals?.regularSeason?.gamesPlayed ??
                              0}
                          </td>
                          <td>
                            {player.careerTotals?.regularSeason?.goals ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.regularSeason?.assists ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.regularSeason?.points ?? 0}
                          </td>
                          <td>
                            {player.careerTotals?.regularSeason?.plusMinus ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.careerTotals?.regularSeason?.pim ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.careerTotals?.regularSeason?.shootingPctg?.toFixed(
                              3
                            ) ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                data-is-swiper-slide
                className="playoff-stats-general swiper-no-swiping"
              >
                <div className="current-season-stats">
                  <h3>
                    {`Série ${
                      formatSeason(player.featuredStats?.season)
                        ? formatSeason(player.featuredStats?.season)
                        : "2023-24"
                    }`}
                  </h3>
                  <div className="short-stats-list">
                    <table>
                      <thead>
                        <tr>
                          <th>PJ</th>
                          <th>B</th>
                          <th>A</th>
                          <th>P</th>
                          <th>+/-</th>
                          <th className="statsNoMobile">PUN</th>
                          <th className="statsNoMobile">%T</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason
                              ?.gamesPlayed ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason?.goals ??
                              0}
                          </td>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason
                              ?.assists ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason
                              ?.points ?? 0}
                          </td>
                          <td>
                            {player.featuredStats?.playoffs?.subSeason
                              ?.plusMinus ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.featuredStats?.playoffs?.subSeason?.pim ??
                              0}
                          </td>
                          <td className="statsNoMobile">
                            {player.featuredStats?.playoffs?.subSeason?.shootingPctg?.toFixed(
                              3
                            ) ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="current-total-stats">
                  <h3>Carrière en séries</h3>
                  <div className="short-stats-list">
                    <table>
                      <thead>
                        <tr>
                          <th>PJ</th>
                          <th>B</th>
                          <th>A</th>
                          <th>P</th>
                          <th>+/-</th>
                          <th className="statsNoMobile">PUN</th>
                          <th className="statsNoMobile">%T</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {player.careerTotals?.playoffs?.gamesPlayed ?? 0}
                          </td>
                          <td>{player.careerTotals?.playoffs?.goals ?? 0}</td>
                          <td>{player.careerTotals?.playoffs?.assists ?? 0}</td>
                          <td>{player.careerTotals?.playoffs?.points ?? 0}</td>
                          <td>
                            {player.careerTotals?.playoffs?.plusMinus ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.careerTotals?.playoffs?.pim ?? 0}
                          </td>
                          <td className="statsNoMobile">
                            {player.careerTotals?.playoffs?.shootingPctg?.toFixed(
                              3
                            ) ?? 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Carousel>
          </>
        );
    }
  };

  return (
    <section className="global-stats">
      <div className="wrapper">{renderStats()}</div>
    </section>
  );
};

export default PlayerSingleGeneralStats;
