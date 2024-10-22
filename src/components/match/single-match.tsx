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
import { renderGameInfos } from "./components/gameInfos";
import { renderGoalInfos } from "./components/goals";
/* import { IReplayFrame } from "../../interfaces/goal-simulation"; */
import { INTGameVideo } from "../../interfaces/game-video";
import { renderGameVideo } from "./components/gameVideos";
import { renderPenalties } from "./components/gamePenalty";
import { ThreeStars } from "./components/threeStars";
import GoalClip from "./components/goalClip";
import { formatPublicationDate } from "../../scripts/utils/formatDate";
import { useState } from "react";
import { renderRosterMatch } from "./components/roster";
import { INTBoxscore } from "../../interfaces/boxscores";
import { renderBoxscore } from "./components/statsSheet";
import { INTPlayByPlay } from "../../interfaces/playByPlay";
import { renderPlayByPlay } from "./components/playByPlay";
import { renderLivePlayer } from "./components/livePlayer";
import { PlayerDetailsType } from "../../interfaces/player/playerDetails";

interface MatchProps {
  gameInfos: INTMainGameInfos | null;
  gameMoreInfos: INTMoreGameInfos | null;
  boxscore: INTBoxscore | null;
  teamColors?: {
    home: string;
    away: string;
  } | null;
  /* goalSimulation: Record<string, IReplayFrame[]>; */
  gameVideo: INTGameVideo | null;
  plays: INTPlayByPlay | null;
  homeRoster: PlayerDetailsType[] | null;
  awayRoster: PlayerDetailsType[] | null;
}

const SingleMatch: React.FC<MatchProps> = ({
  gameInfos,
  gameMoreInfos,
  teamColors,
  /* goalSimulation, */
  gameVideo,
  boxscore,
  plays,
  homeRoster,
  awayRoster
}) => {
  const [showSummary, setSummary] = useState<boolean>(false);
  const [showDescription, setDescription] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("detail-match");

  const recapVideo = gameVideo?.items.find((video) =>
    video.tags.some((tag) => tag.slug === "game-recap")
  );

  const handleNavClick = (type: string) => {
    if (type === "summary") {
      setSummary(true);
    } else {
      setSummary(false);
    }
    if (type === "description") {
      setDescription(true);
    } else {
      setDescription(false);
    }

    const navContainer = document.querySelector(".main-nav");
    if (navContainer) {
      navContainer.className = `main-nav ${type}`;
      setActiveTab(type);
    }
  };

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
                  className="window-effect button ticket"
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
          {(gameInfos?.gameState === "FINAL" ||
            gameInfos?.gameState === "OFF" ||
            gameInfos?.gameState === "LIVE" ||
            gameInfos?.gameState === "CRIT") && (
            <div className="nav-match">
              <div className="main-nav">
                <p
                  className={activeTab === "detail-match" ? "active" : ""}
                  onClick={() => handleNavClick("detail-match")}
                >
                  Résumé
                </p>
                <p
                  className={activeTab === "summary" ? "active" : ""}
                  onClick={() => handleNavClick("summary")}
                >
                  Sommaire
                </p>
                <p
                  className={activeTab === "description" ? "active" : ""}
                  onClick={() => handleNavClick("description")}
                >
                  Description
                </p>
              </div>
              {gameMoreInfos?.gameVideo &&
                (gameMoreInfos.gameVideo.threeMinRecapFr ||
                  gameMoreInfos?.gameVideo.condensedGameFr ||
                  gameMoreInfos?.gameVideo.threeMinRecap ||
                  gameMoreInfos?.gameVideo.condensedGame) && (
                  <div className="game-recap">
                    <GoalClip
                      isWindowEffect
                      fr={`${
                        gameMoreInfos.gameVideo.threeMinRecapFr ??
                        gameMoreInfos.gameVideo.threeMinRecap
                      }`}
                      title={recapVideo?.title}
                      description={recapVideo?.fields.longDescription}
                      date={formatPublicationDate(
                        recapVideo?.contentDate ?? ""
                      )}
                    >
                      <Svg name="recap-play-video" size="xs"></Svg>
                      <p>Résumé</p>
                    </GoalClip>
                    <GoalClip
                      isWindowEffect
                      fr={`${
                        gameMoreInfos.gameVideo.condensedGameFr ??
                        gameMoreInfos.gameVideo.condensedGame
                      }`}
                      title={recapVideo?.title.replace("Résumé", "Condensé")}
                      description={
                        recapVideo?.fields.longDescription?.replace(".", "") +
                        " en 10 minutes."
                      }
                      date={formatPublicationDate(
                        recapVideo?.contentDate ?? ""
                      )}
                    >
                      <Svg name="recap-play-video" size="xs"></Svg>
                      <p>Condensé</p>
                    </GoalClip>
                  </div>
                )}
            </div>
          )}

          <div className="games-infos-container">
            <div className="main-game-infos">
              {!showDescription && !showSummary && (
                <>
                  {gameInfos?.matchup?.teamLeaders?.leaders ? (
                    <>
                      {renderTeamLeaders(gameInfos)}
                      {renderGoalieTeam(
                        gameInfos,
                        teamColors ?? { home: "", away: "" }
                      )}
                      {renderRosterMatch(
                        gameInfos,
                        teamColors ?? { home: "", away: "" }
                      )}
                    </>
                  ) : (
                    <>
                      {gameInfos &&
                        gameInfos.gameState === "LIVE" &&
                        renderLivePlayer(
                          gameInfos,
                          teamColors ?? { home: "", away: "" }
                        )}

                      {renderGoalInfos(
                        gameInfos,
                        teamColors ?? { home: "", away: "" },
                        /* goalSimulation, */
                        gameVideo
                      )}
                      {renderGameVideo(gameInfos, gameVideo)}
                      {renderPenalties(gameInfos)}
                      {gameInfos?.summary &&
                        gameInfos?.summary.threeStars.length > 0 && (
                          <ThreeStars
                            teamColors={teamColors ?? { home: "", away: "" }}
                            game={gameInfos}
                          />
                        )}
                    </>
                  )}
                </>
              )}
              {showDescription && !showSummary && (
                <>
                  {gameInfos &&
                    plays &&
                    renderPlayByPlay(
                      gameInfos,
                      teamColors ?? { home: "", away: "" },
                      plays,
                      homeRoster,
                      awayRoster
                    )}
                </>
              )}
              {!showDescription && showSummary && (
                <>
                  {gameInfos &&
                    boxscore &&
                    renderBoxscore(
                      gameInfos,
                      boxscore,
                      teamColors ?? { home: "", away: "" }
                    )}
                </>
              )}
            </div>
            <div className="other-game-infos">
              {gameMoreInfos && gameInfos && (
                <>
                  {renderScoreboard(gameMoreInfos, gameInfos)}
                  {renderShotOnNet(
                    gameInfos,
                    gameMoreInfos,
                    teamColors ?? { home: "", away: "" }
                  )}
                  {renderRightPanelTeamStatsInfos(
                    gameMoreInfos,
                    gameInfos,
                    teamColors ?? { home: "", away: "" }
                  )}
                  {renderRightPanelSeriesInfos(gameMoreInfos, gameInfos)}
                  {renderGameInfos(gameMoreInfos, gameInfos)}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleMatch;
