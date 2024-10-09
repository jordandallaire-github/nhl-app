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

type TeamSeasonStatsKeys =
  keyof INTMoreGameInfos["teamSeasonStats"]["awayTeam"];

type TeamGameStatsKeys = keyof INTMoreGameInfos["teamGameStats"];

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
              {`${
                game.periodDescriptor.number === 1
                  ? game.periodDescriptor.number + "re"
                  : game.periodDescriptor.number + "e"
              }`}{" "}
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

  const renderRightPanelSeriesInfos = (
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
                        <strong>{serie?.awayTeam.abbrev}</strong>
                      </p>
                    </div>
                    {(game.gameState === "LIVE" ||
                      game.gameState === "FINAL" ||
                      game.gameState === "OFF") && (
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

  const renderRightPanelTeamStatsInfos = (
    other: INTMoreGameInfos,
    game: INTMainGameInfos
  ) => {
    const scaleFactor = 2;
    const statsToCompareGame = [
      {
        key: "sog" as TeamGameStatsKeys,
        label: "Tirs",
        multiplier: 1,
        decimals: 0,
        isPercentage: false,
      },
      {
        key: "faceoffWinningPctg" as TeamGameStatsKeys,
        label: "% mise en jeu",
        multiplier: 100,
        decimals: 1,
        isPercentage: true,
      },
      {
        key: "powerPlayPctg" as TeamGameStatsKeys,
        label: "% avantage numérique",
        multiplier: 100,
        decimals: 1,
        isPercentage: true,
      },
      {
        key: "pim" as TeamGameStatsKeys,
        label: "Minutes de pénalité",
        multiplier: 1,
        decimals: 0,
        isPercentage: false,
      },
      {
        key: "blockedShots" as TeamGameStatsKeys,
        label: "Tirs bloqués",
        multiplier: 1,
        decimals: 0,
        isPercentage: false,
      },
      {
        key: "giveaways" as TeamGameStatsKeys,
        label: "Revirement",
        multiplier: 1,
        decimals: 0,
        isPercentage: false,
      },
      {
        key: "takeaways" as TeamGameStatsKeys,
        label: "Revirements provoqués",
        multiplier: 1,
        decimals: 0,
        isPercentage: false,
      },
    ] as const;

    const statsToCompareTeam = [
      {
        key: "ppPctg" as TeamSeasonStatsKeys,
        label: "% avantage numérique",
        multiplier: 100,
        decimals: 1,
        isPercentage: false,
      },
      {
        key: "pkPctg" as TeamSeasonStatsKeys,
        label: "% infériorité numérique",
        multiplier: 100,
        decimals: 1,
        isPercentage: false,
      },
      {
        key: "faceoffWinningPctg" as TeamSeasonStatsKeys,
        label: "% mise en jeu",
        multiplier: 100,
        decimals: 1,
        isPercentage: true,
      },
      {
        key: "goalsForPerGamePlayed" as TeamSeasonStatsKeys,
        label: "BP/PJ",
        multiplier: 1,
        decimals: 2,
        isPercentage: false,
      },
      {
        key: "goalsAgainstPerGamePlayed" as TeamSeasonStatsKeys,
        label: "BC/PJ",
        multiplier: 1,
        decimals: 2,
        isPercentage: false,
      },
    ] as const;

    const renderTeamStatComparison = (
      stat: (typeof statsToCompareTeam)[number]
    ) => {
      const awayValue = (
        other.teamSeasonStats.awayTeam[stat.key] * stat.multiplier
      ).toFixed(stat.decimals);
      const homeValue = (
        other.teamSeasonStats.homeTeam[stat.key] * stat.multiplier
      ).toFixed(stat.decimals);

      const awayFlex = Math.pow(parseFloat(awayValue), scaleFactor);
      const homeFlex = Math.pow(parseFloat(homeValue), scaleFactor);
      const totalFlex = awayFlex + homeFlex;
      const normalizedAwayFlex = awayFlex / totalFlex;
      const normalizedHomeFlex = homeFlex / totalFlex;

      const awayRank =
        other.teamSeasonStats.awayTeam[
          `${stat.key}Rank` as TeamSeasonStatsKeys
        ];
      const homeRank =
        other.teamSeasonStats.homeTeam[
          `${stat.key}Rank` as TeamSeasonStatsKeys
        ];

      const formatValue = (value: string) =>
        stat.isPercentage ? `${value}%` : value;

      return (
        <div className="stat" key={stat.key as string}>
          <div className="pcStat">
            <p>
              <strong>{formatValue(awayValue ?? 0)}</strong>
            </p>
            <p>{stat.label}</p>
            <p>
              <strong>{formatValue(homeValue ?? 0)}</strong>
            </p>
          </div>
          <div className="indication-color">
            <div className="team" style={{ flex: `${normalizedAwayFlex}` }}>
              <div
                className={`color away`}
                style={{ borderTop: `8px solid ${teamColors?.away}` }}
              />
            </div>
            <div className="team" style={{ flex: `${normalizedHomeFlex}` }}>
              <div
                className={`color home`}
                style={{ borderBottom: `8px solid ${teamColors?.home}` }}
              />
            </div>
          </div>
          {awayRank && homeRank && (
            <div className="standing-stat">
              <p>{`${awayRank === 1 ? 1 + "re" : awayRank + "e"}`}</p>
              <p>{`${homeRank === 1 ? 1 + "re" : homeRank + "e"}`}</p>
            </div>
          )}
        </div>
      );
    };

    const renderGameStatComparison = (
      stat: (typeof statsToCompareGame)[number]
    ) => {
      const statObject = other.teamGameStats.find(
        (s) => s.category === stat.key
      );
      if (!statObject) return null;

      const awayValue = (
        parseFloat(statObject.awayValue as string) * stat.multiplier
      ).toFixed(stat.decimals);
      const homeValue = (
        parseFloat(statObject.homeValue as string) * stat.multiplier
      ).toFixed(stat.decimals);

      const awayFlex = Math.pow(parseFloat(awayValue), scaleFactor);
      const homeFlex = Math.pow(parseFloat(homeValue), scaleFactor);
      const totalFlex = awayFlex + homeFlex;
      const normalizedAwayFlex = awayFlex / totalFlex;
      const normalizedHomeFlex = homeFlex / totalFlex;

      const formatValue = (value: string) =>
        stat.isPercentage ? `${value}%` : value;

      return (
        <div className="stat" key={stat.key as string}>
          <div className="pcStat">
            <p>
              <strong>{formatValue(awayValue ?? 0)}</strong>
            </p>
            <p>{stat.label}</p>
            <p>
              <strong>{formatValue(homeValue ?? 0)}</strong>
            </p>
          </div>
          <div className="indication-color">
            <div className="team" style={{ flex: `${normalizedAwayFlex}` }}>
              <div
                className={`color away`}
                style={{ borderTop: `8px solid ${teamColors?.away}` }}
              />
            </div>
            <div className="team" style={{ flex: `${normalizedHomeFlex}` }}>
              <div
                className={`color home`}
                style={{ borderBottom: `8px solid ${teamColors?.home}` }}
              />
            </div>
          </div>
          {stat.key === ("powerPlayPctg" as TeamGameStatsKeys) && (
            <>
              {other.teamGameStats.some((s) => s.category === "powerPlay") && (
                <>
                  {statObject.awayValue !==
                    other.teamGameStats.find((s) => s.category === "powerPlay")
                      ?.awayValue &&
                    statObject.homeValue !==
                      other.teamGameStats.find(
                        (s) => s.category === "powerPlay"
                      )?.homeValue && (
                      <div className="standing-stat">
                        <p>
                          {
                            other.teamGameStats.find(
                              (s) => s.category === "powerPlay"
                            )?.awayValue
                          }
                        </p>
                        <p>
                          {
                            other.teamGameStats.find(
                              (s) => s.category === "powerPlay"
                            )?.homeValue
                          }
                        </p>
                      </div>
                    )}
                </>
              )}
            </>
          )}
          {statObject.category === "powerPlay" && (
            <div className="standing-stat">
              <p>{statObject.awayValue}</p>
              <p>{statObject.homeValue}</p>
            </div>
          )}
        </div>
      );
    };

    if (game.gameState === "FUT") {
      return (
        <>
          {gameMoreInfos?.teamSeasonStats?.awayTeam !== undefined &&
            gameMoreInfos?.teamSeasonStats?.homeTeam !== undefined && (
              <div className="team-stats window-effect">
                <div className="glare-effect"></div>
                <div className="teams-infos">
                  <div className="teams-logo">
                    <Link
                      to={`/equipes/${game.awayTeam.name.default
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${game.awayTeam.abbrev}_dark.svg`}
                        alt={`${game.awayTeam.name.default} logo`}
                      />
                    </Link>
                    <h4>Statistiques d'équipe</h4>
                    <Link
                      to={`/equipes/${game.homeTeam.name.default
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${game.homeTeam.abbrev}_dark.svg`}
                        alt={`${game.homeTeam.name.default} logo`}
                      />
                    </Link>
                  </div>
                  <div className="team-abbrev">
                    <p>{game.awayTeam.abbrev}</p>
                    <p>{game.homeTeam.abbrev}</p>
                  </div>
                  <div className="stats-container">
                    {statsToCompareTeam.map(renderTeamStatComparison)}
                  </div>
                </div>
              </div>
            )}
        </>
      );
    } else {
      return (
        <div className="team-stats window-effect">
          <div className="glare-effect"></div>
          <div className="teams-infos">
            <div className="teams-logo">
              <Link
                to={`/equipes/${game.awayTeam.name.default
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${game.awayTeam.abbrev}_dark.svg`}
                  alt={`${game.awayTeam.name.default} logo`}
                />
              </Link>
              <h4>Statistiques du match</h4>
              <Link
                to={`/equipes/${game.homeTeam.name.default
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${game.homeTeam.abbrev}_dark.svg`}
                  alt={`${game.homeTeam.name.default} logo`}
                />
              </Link>
            </div>
            <div className="team-abbrev">
              <p>{game.awayTeam.abbrev}</p>
              <p>{game.homeTeam.abbrev}</p>
            </div>
            <div className="stats-container">
              {statsToCompareGame.map(renderGameStatComparison)}
            </div>
          </div>
        </div>
      );
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
            {gameMoreInfos && gameInfos && (
              <>
                {renderRightPanelSeriesInfos(gameMoreInfos, gameInfos)}
                {renderRightPanelTeamStatsInfos(gameMoreInfos, gameInfos)}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleMatch;
