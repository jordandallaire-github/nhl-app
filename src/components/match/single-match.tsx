import { Link } from "react-router-dom";
import { INTMainGameInfos } from "../../interfaces/main-match";
import { INTMoreGameInfos } from "../../interfaces/more-detail-match";
import TVA from "../../assets/images/TVA.svg";
import RDS from "../../assets/images/RDS.svg";
import { Svg } from "../../scripts/utils/Icons";
import { renderTeamLeaders } from "./components/teamLeaders";
import { renderGoalieTeam } from "./components/goalieLeaders";
import { renderRightPanelTeamStatsInfos } from "./components/matchupStats";
import { renderRightPanelSeriesInfos } from "./components/panelSeries";
import { renderTeamInfo } from "./components/teamInfos";
import { renderGameSituation } from "./components/gameSituation";
import { renderShotOnNet } from "./components/shots";
import { renderScoreboard } from "./components/scoreboard";

interface MatchProps {
  gameInfos: INTMainGameInfos | null;
  gameMoreInfos: INTMoreGameInfos | null;
  teamColors?: {
    home: string;
    away: string;
  } | null;
}

const SingleMatch: React.FC<MatchProps> = ({
  gameInfos,
  gameMoreInfos,
  teamColors,
}) => {
  return (
    <>
      <section className="match hero">
        <div className="wrapper">
          <h1>Détails du match</h1>
          <div className="team-versus-container">
            <div className="match-infos">
              <div className="specific-infos">
                {gameInfos?.tvBroadcasts &&
                  gameInfos.tvBroadcasts.length > 0 &&
                  gameInfos.gameState !== "OFF" &&
                  gameInfos.gameState !== "FINAL" && (
                    <div className="broadcast">
                      {gameInfos.tvBroadcasts.map((broadcast, index) => (
                        <span key={`${broadcast.id}-${index}`}>
                          {broadcast.network === "RDS" ? (
                            <Link to={`https://www.rds.ca/`}>
                              <img src={RDS} alt="RDS logo" />
                            </Link>
                          ) : broadcast.network === "TVAS" ? (
                            <Link to={`https://www.tvasports.ca/`}>
                              <img
                                className="white"
                                src={TVA}
                                alt="TVA sports logo"
                              />
                            </Link>
                          ) : (
                            broadcast.network
                          )}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
              {gameInfos?.ticketsLink !== undefined ||
              gameInfos?.ticketsLinkFr !== undefined ? (
                <a
                  className="window-effect ticket"
                  href={gameInfos.ticketsLinkFr ?? gameInfos.ticketsLink}
                  target="_blank"
                >
                  <div
                    className="color"
                    style={{
                      backgroundImage: `radial-gradient(circle at -56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at 100% 12px, ${teamColors?.home},${teamColors?.home})`,
                    }}
                  ></div>
                  <Svg name="ticket" size="sm" isStroke={true} />
                  Billets
                </a>
              ) : (
                ""
              )}
            </div>
            <div className="team-matchup window-effect">
              <div className="glare-effect"></div>
              {gameInfos?.specialEventLogo && (
                <img
                  className="special"
                  src={gameInfos.specialEventLogo}
                  alt={gameInfos.specialEvent?.default}
                />
              )}
              {renderTeamInfo(
                gameInfos,
                true,
                teamColors ?? { home: "", away: "" }
              )}
              {renderGameSituation(gameInfos)}
              {renderTeamInfo(
                gameInfos,
                false,
                teamColors ?? { home: "", away: "" }
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="game-infos-section">
        <div className="wrapper">
          <div className="main-game-infos">
            {gameInfos?.matchup?.teamLeaders?.leaders &&
            gameInfos?.matchup?.teamLeaders?.leaders.length > 0 ? (
              <>
                {renderTeamLeaders(gameInfos)}
                {renderGoalieTeam(
                  gameInfos,
                  teamColors ?? { home: "", away: "" }
                )}
              </>
            ) : (
              "Buts"
            )}
          </div>
          <div className="other-game-infos">
            {gameMoreInfos && gameInfos && (
              <>
                {renderShotOnNet(
                  gameInfos,
                  gameMoreInfos,
                  teamColors ?? { home: "", away: "" }
                )}
                {renderRightPanelSeriesInfos(gameMoreInfos, gameInfos)}
                {renderRightPanelTeamStatsInfos(
                  gameMoreInfos,
                  gameInfos,
                  teamColors ?? { home: "", away: "" }
                )}
                {renderScoreboard(gameMoreInfos, gameInfos)}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleMatch;
