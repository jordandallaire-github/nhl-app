import { Link } from "react-router-dom";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTMoreGameInfos } from "../../../interfaces/more-detail-match";
import { generateMatchPath } from "../../../scripts/utils/generateMatchPath";
import { formatGameTime } from "../../../scripts/utils/formatGameTime";
import { formatDateMonthDay } from "../../../scripts/utils/formatDate";

 export const renderRightPanelSeriesInfos = (
    other: INTMoreGameInfos,
    game: INTMainGameInfos
  ) => {
    return (
      <>
        <div className="season-series-card window-effect">
          <div className="glare-effect"></div>
          <div className="series-infos">
            <h4>Duels cette saison</h4>
            <p>
              {`${
                other.seasonSeriesWins.awayTeamWins >
                other.seasonSeriesWins.homeTeamWins
                  ? game.awayTeam.abbrev + " mène"
                  : other.seasonSeriesWins.awayTeamWins <
                    other.seasonSeriesWins.homeTeamWins
                  ? game.homeTeam.abbrev + " mène"
                  : "Égalité"
              }`}{" "}
              {`${
                other.seasonSeriesWins.awayTeamWins >
                other.seasonSeriesWins.homeTeamWins
                  ? other.seasonSeriesWins.awayTeamWins +
                    "-" +
                    other.seasonSeriesWins.homeTeamWins
                  : other.seasonSeriesWins.homeTeamWins +
                    "-" +
                    other.seasonSeriesWins.awayTeamWins
              }`}
            </p>
          </div>
          <div className="series-container">
            {other.seasonSeries.map((serie, index) => (
              <Link
                to={`${generateMatchPath(serie.gameCenterLink)}`}
                key={`${serie.id}-${index}`}
                className={`serie window-effect ${
                  serie.id === game.id ? "active" : ""
                }`}
              >
                <div className="team">
                  <div
                    className={`away ${
                      serie.homeTeam.score > serie.awayTeam.score ? "lost" : ""
                    }`}
                  >
                    <div className="media">
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${serie?.awayTeam.abbrev}_dark.svg`}
                        alt={`${serie?.awayTeam.abbrev} logo`}
                      />
                      <p>
                        {serie?.awayTeam.abbrev}
                      </p>
                    </div>
                    {(serie.gameState === "LIVE" ||
                      serie.gameState === "FINAL" ||
                      serie.gameState === "OFF") && (
                      <p className="score">{serie.awayTeam.score}</p>
                    )}
                  </div>
                  <div
                    className={`home ${
                      serie.awayTeam.score > serie.homeTeam.score ? "lost" : ""
                    }`}
                  >
                    <div className="media">
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${serie?.homeTeam.abbrev}_dark.svg`}
                        alt={`${serie?.homeTeam.abbrev} logo`}
                      />
                      <p>
                        {serie?.homeTeam.abbrev}
                      </p>
                    </div>
                    {(serie.gameState === "LIVE" ||
                      serie.gameState === "FINAL" ||
                      serie.gameState === "OFF") && (
                      <p className="score">{serie.homeTeam.score}</p>
                    )}
                  </div>
                </div>
                <div className="game-infos">
                  <p>
                    {formatGameTime(serie.startTimeUTC, serie.easternUTCOffset)}{" "}
                    HAE
                  </p>
                  <p>{formatDateMonthDay(serie.gameDate, false)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </>
    );
  };