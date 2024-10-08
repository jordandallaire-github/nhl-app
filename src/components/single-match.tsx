import { Link } from "react-router-dom";
import { INTMainGameInfos } from "../interfaces/main-match";
import { INTMoreGameInfos } from "../interfaces/more-detail-match";
import { formatDate, formatDateMonthDay } from "../scripts/utils/formatDate";
import { formatSituation } from "../scripts/utils/formatSituation";
import { formatGameTime } from "../scripts/utils/formatGameTime";
import { FormatPosition } from "../scripts/utils/formatPosition";
import { generateMatchPath } from "../scripts/utils/generateMatchPath";
import formatSeason from "../scripts/utils/formatSeason";
import TVA from "../assets/images/TVA.svg";
import RDS from "../assets/images/RDS.svg";
import { Svg } from "../scripts/utils/Icons";

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
  const renderTeamInfo = (game: INTMainGameInfos | null, isAway: boolean) => {
    const team = isAway ? game?.awayTeam : game?.homeTeam;
    return (
      <div className={`team ${isAway ? "away" : "home"}`}>
        <div
          className="team-color"
          style={{
            backgroundImage: `${
              isAway
                ? `radial-gradient(circle at 56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at -100% 12px, ${teamColors?.away}, rgba(0, 0, 0, 0) 100%)`
                : `radial-gradient(circle at -56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at 160% 1px, ${teamColors?.home}, rgba(0, 0, 0, 0) 100%)`
            }`,
          }}
        ></div>
        <div className="media">
          <Link
            to={`/equipes/${team?.name.default
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <img
              src={`https://assets.nhle.com/logos/nhl/svg/${team?.abbrev}_dark.svg`}
              alt={`${team?.name.default} logo`}
            />
          </Link>
        </div>
        <div className="team-infos">
          <div className="team-name">
            <h2>{team?.name.default}</h2>
            <p>{team?.placeNameWithPreposition.fr}</p>
          </div>
          {game?.gameState === "LIVE" ||
          game?.gameState === "FINAL" ||
          game?.gameState === "OFF" ? (
            <p>
              T: {team?.sog}{" "}
              {game.situation?.[isAway ? "awayTeam" : "homeTeam"]?.abbrev ===
                team?.abbrev &&
                game.situation?.[isAway ? "awayTeam" : "homeTeam"]
                  ?.situationDescriptions &&
                `| ${formatSituation(
                  game.situation[isAway ? "awayTeam" : "homeTeam"]
                    .situationDescriptions
                )} ${game.situation.timeRemaining}`}
            </p>
          ) : (
            <p>{team?.record}</p>
          )}
        </div>
        <div className="score-games">
          {(game?.gameState === "LIVE" ||
            game?.gameState === "FINAL" ||
            game?.gameState === "OFF") && (
            <p
              className={`score ${
                game.awayTeam.score > game.homeTeam.score
                  ? "away-win"
                  : "home-win"
              }`}
            >
              {team?.score}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderGameSituation = (game: INTMainGameInfos | null) => {
    if (game?.gameState === "LIVE") {
      return (
        <>
          <p>
            <strong className="period">
              {`${game.period === 1 ? game.period + "re" : game.period + "e"}`}{" "}
            </strong>
            {game.clock.inIntermission ? "ENT" : ""} {game.clock.timeRemaining}
          </p>
          {game.situation?.homeTeam?.strength &&
            game.situation?.awayTeam?.strength && (
              <p>
                {game.situation.homeTeam.strength >
                game.situation.awayTeam.strength
                  ? `${game.situation.homeTeam.strength} contre ${game.situation.awayTeam.strength}`
                  : `${game.situation.awayTeam.strength} contre ${game.situation.homeTeam.strength}`}
              </p>
            )}
        </>
      );
    }
    return (
      <p className="result-game">
        {game?.gameState === "FINAL" || game?.gameState === "OFF"
          ? `Final${
              game.periodDescriptor.periodType === "OT"
                ? "/Pr."
                : game.periodDescriptor.periodType === "SO"
                ? "/TB"
                : ""
            }`
          : `${formatGameTime(
              game?.startTimeUTC ?? "",
              game?.easternUTCOffset ?? ""
            )} HAE`}
      </p>
    );
  };

  const renderTeamLeaders = (game: INTMainGameInfos) => {
    return (
      <>
        <div className="matchup-card window-effect">
          <div className="glare-effect"></div>
          <h3>Joueurs à surveiller</h3>
          <p className="border">
            {game.matchup?.teamLeaders.context === "regular_season"
              ? "Saison régulière"
              : ""}{" "}
            {formatSeason(game.matchup?.teamLeaders.contextSeason)}
          </p>
          <div className="matchup-players">
            <div className="team-versus">
              <Link
                to={`/equipes/${game?.awayTeam.name.default
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${game?.awayTeam.abbrev}_dark.svg`}
                  alt={`${game?.awayTeam.name.default} logo`}
                />
              </Link>
              <Link
                to={`/equipes/${game?.homeTeam.name.default
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${game?.homeTeam.abbrev}_dark.svg`}
                  alt={`${game?.homeTeam.name.default} logo`}
                />
              </Link>
            </div>
            <div className="player-container">
              {game.matchup?.teamLeaders.leaders.map((leader, index) => (
                <div
                  key={`${leader.category}-${index}`}
                  className="player-matchup"
                >
                  <h4>
                    {leader.category === "goals"
                      ? "Buts"
                      : leader.category === "assists"
                      ? "Aides"
                      : "Points"}
                  </h4>
                  <div className="players">
                    <div className="player away">
                      <div className="stat">
                        <p>
                          <strong>{leader.awayLeader.value}</strong>
                        </p>
                        <p>
                          {leader.category === "goals"
                            ? "B"
                            : leader.category === "assists"
                            ? "A"
                            : "PTS"}
                        </p>
                      </div>
                      <div className="infos">
                        <div className="content">
                          <p>{leader.awayLeader.firstName.default}</p>
                          <p>
                            <strong>
                              {leader.awayLeader.lastName.default}
                            </strong>
                          </p>
                          <p>{`#${
                            leader.awayLeader.sweaterNumber
                          } - ${FormatPosition(
                            leader.awayLeader.positionCode
                          )}`}</p>
                        </div>
                        <div className="media">
                          <Link
                            to={`/equipes/${game?.awayTeam.name.default
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}/${leader.awayLeader.firstName.default.toLowerCase()}-${leader.awayLeader.lastName.default.toLowerCase()}-${
                              leader.awayLeader.playerId
                            }`}
                          >
                            <img
                              src={leader.awayLeader.headshot}
                              alt={`${leader.awayLeader.firstName.default} ${leader.awayLeader.lastName.default}`}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="player home">
                      <div className="stat">
                        <p>
                          <strong>{leader.homeLeader.value}</strong>
                        </p>
                        <p>
                          {leader.category === "goals"
                            ? "B"
                            : leader.category === "assists"
                            ? "A"
                            : "PTS"}
                        </p>
                      </div>
                      <div className="infos">
                        <div className="content">
                          <p>{leader.homeLeader.firstName.default}</p>
                          <p>
                            <strong>
                              {leader.homeLeader.lastName.default}
                            </strong>
                          </p>
                          <p>{`#${
                            leader.homeLeader.sweaterNumber
                          } - ${FormatPosition(
                            leader.homeLeader.positionCode
                          )}`}</p>
                        </div>
                        <div className="media">
                          <Link
                            to={`/equipes/${game?.homeTeam.name.default
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}/${leader.homeLeader.firstName.default.toLowerCase()}-${leader.homeLeader.lastName.default.toLowerCase()}-${
                              leader.homeLeader.playerId
                            }`}
                          >
                            <img
                              src={leader.homeLeader.headshot}
                              alt={`${leader.homeLeader.firstName.default} ${leader.homeLeader.lastName.default}`}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderGoalieTeam = (game: INTMainGameInfos) => {
    return (
      <>
        <div className="matchup-card window-effect">
          <div className="glare-effect"></div>
          <h3>Gardiens</h3>
          <p className="border">
            {game.matchup?.teamLeaders.context === "regular_season"
              ? "Saison régulière"
              : ""}{" "}
            {formatSeason(game.matchup?.teamLeaders.contextSeason)}
          </p>
          <div className="matchup-players">
            <div
              className="team-versus window-effect"
              style={{
                backgroundImage: `radial-gradient(circle at 56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at -100% 12px, ${teamColors?.away}, rgba(0, 0, 0, 0) 100%)`,
              }}
            >
              <Link
                to={`/equipes/${game?.awayTeam.name.default
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${game?.awayTeam.abbrev}_dark.svg`}
                  alt={`${game?.awayTeam.name.default} logo`}
                />
              </Link>
            </div>
            <div className="player-container">
              {game.matchup?.goalieComparison.awayTeam.leaders
                .slice(0, 2)
                .map((awayLeader, index) => (
                  <div
                    key={`${awayLeader.playerId}-${index}`}
                    className="player-matchup"
                  >
                    <div className="players goalie">
                      <div className="player away left">
                        <div className="infos">
                          <div className="media">
                            <Link
                              to={`/equipes/${game?.awayTeam.name.default
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}/${awayLeader.firstName.default.toLowerCase()}-${awayLeader.lastName.default.toLowerCase()}-${
                                awayLeader.playerId
                              }`}
                            >
                              <img
                                src={awayLeader.headshot}
                                alt={`${awayLeader.firstName.default} ${awayLeader.lastName.default}`}
                              />
                            </Link>
                          </div>
                          <div className="content">
                            <p>{awayLeader.firstName.default}</p>
                            <p>
                              <strong>{awayLeader.lastName.default}</strong>
                            </p>
                            <p>{`#${awayLeader.sweaterNumber}`}</p>
                          </div>
                        </div>
                        <div className="stats">
                          <div className="stat">
                            <p>
                              <strong>{awayLeader.record ?? "--"}</strong>
                            </p>
                            <p>V-D-DPr</p>
                          </div>
                          <div className="stat">
                            <p>
                              <strong>
                                {awayLeader.gaa
                                  ? awayLeader.gaa.toFixed(2)
                                  : "--"}
                              </strong>
                            </p>
                            <p>Moy.</p>
                          </div>
                          <div className="stat">
                            <p>
                              <strong>
                                {awayLeader.savePctg
                                  ? (awayLeader.savePctg * 10).toFixed(2)
                                  : "--"}
                              </strong>
                            </p>
                            <p>%Arr.</p>
                          </div>
                          <div className="stat">
                            <p>
                              <strong>{awayLeader.shutouts ?? "--"}</strong>
                            </p>
                            <p>BL</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div
              className="team-versus team-home window-effect"
              style={{
                backgroundImage: `radial-gradient(circle at 56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at -100% 12px, ${teamColors?.home}, rgba(0, 0, 0, 0) 100%)`,
              }}
            >
              <Link
                to={`/equipes/${game?.homeTeam.name.default
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${game?.homeTeam.abbrev}_dark.svg`}
                  alt={`${game?.awayTeam.name.default} logo`}
                />
              </Link>
            </div>
            <div className="player-container">
              {game.matchup?.goalieComparison.homeTeam.leaders
                .slice(0, 2)
                .map((homeLeader, index) => (
                  <div
                    key={`${homeLeader.playerId}-${index}`}
                    className="player-matchup"
                  >
                    <div className="players goalie">
                      <div className="player away left">
                        <div className="infos">
                          <div className="media">
                            <Link
                              to={`/equipes/${game?.homeTeam.name.default
                                .toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                )}/${homeLeader.firstName.default.toLowerCase()}-${homeLeader.lastName.default.toLowerCase()}-${
                                homeLeader.playerId
                              }`}
                            >
                              <img
                                src={homeLeader.headshot}
                                alt={`${homeLeader.firstName.default} ${homeLeader.lastName.default}`}
                              />
                            </Link>
                          </div>
                          <div className="content">
                            <p>{homeLeader.firstName.default}</p>
                            <p>
                              <strong>{homeLeader.lastName.default}</strong>
                            </p>
                            <p>{`#${homeLeader.sweaterNumber}`}</p>
                          </div>
                        </div>
                        <div className="stats">
                          <div className="stat">
                            <p>
                              <strong>{homeLeader.record ?? "--"}</strong>
                            </p>
                            <p>V-D-DPr</p>
                          </div>
                          <div className="stat">
                            <p>
                              <strong>
                                {homeLeader.gaa
                                  ? homeLeader.gaa.toFixed(2)
                                  : "--"}
                              </strong>
                            </p>
                            <p>Moy.</p>
                          </div>
                          <div className="stat">
                            <p>
                              <strong>
                                {homeLeader.savePctg
                                  ? (homeLeader.savePctg * 10).toFixed(2)
                                  : "--"}
                              </strong>
                            </p>
                            <p>%Arr.</p>
                          </div>
                          <div className="stat">
                            <p>
                              <strong>{homeLeader.shutouts ?? "--"}</strong>
                            </p>
                            <p>BL</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderRightPanelInfos = (
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
                className={`serie window-effect ${serie.id === game.id ? "active" : ""}`}
              >
                <div className="team">
                  <div className={`away ${serie.homeTeam.score > serie.awayTeam.score ? "lost" : ""}`}>
                    <div className="media">
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${serie?.awayTeam.abbrev}_dark.svg`}
                        alt={`${serie?.awayTeam.abbrev} logo`}
                      />
                      <p>
                        <strong>{serie?.awayTeam.abbrev}</strong>
                      </p>
                    </div>
                    {(game.gameState === "LIVE" ||
                      game.gameState === "FINAL" ||
                      game.gameState === "OFF") && (
                      <p className="score">{serie.awayTeam.score}</p>
                    )}
                  </div>
                  <div className={`home ${serie.awayTeam.score > serie.homeTeam.score ? "lost" : ""}`}>
                    <div className="media">
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${serie?.homeTeam.abbrev}_dark.svg`}
                        alt={`${serie?.homeTeam.abbrev} logo`}
                      />
                      <p>
                        <strong>{serie?.homeTeam.abbrev}</strong>
                      </p>
                    </div>
                    {(game.gameState === "LIVE" ||
                      game.gameState === "FINAL" ||
                      game.gameState === "OFF") && (
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

  return (
    <>
      <section className="match hero">
        <div className="wrapper">
          <h1>Détails du match</h1>
          <div className="team-versus-container">
            <div className="match-infos">
              <div className="specific-infos">
                <p>
                  <strong>{formatDate(gameInfos?.gameDate ?? "")}</strong>
                </p>
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
              {renderTeamInfo(gameInfos, true)}
              {renderGameSituation(gameInfos)}
              {renderTeamInfo(gameInfos, false)}
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
                {renderGoalieTeam(gameInfos)}
              </>
            ) : (
              "Buts"
            )}
          </div>
          <div className="other-game-infos">
            {gameMoreInfos &&
              gameInfos &&
              renderRightPanelInfos(gameMoreInfos, gameInfos)}
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleMatch;
