import { INTSchedule } from "../../interfaces/schedule";
import { formatDateMonthDay } from "../utils/formatDate";
import { Link } from "react-router-dom";
import { formatDateDay } from "../utils/formatDate";
import { formatGameTime } from "../utils/formatGameTime";
import Carousel from "../carousel";
import React from "react";
import { Svg } from "../utils/Icons";

interface SingleScheduleProps {
  schedule: INTSchedule | null;
}

const SingleSchedule: React.FC<SingleScheduleProps> = ({ schedule }) => {
  if (!schedule || !schedule.currentDate) {
    return <div>Aucun calendrier disponible.</div>;
  }

  const todayGames = schedule.games.filter(
    (game) =>
      new Date(game.gameDate).toDateString() ===
      new Date(schedule.currentDate).toDateString()
  );

  return (
    <>
      <section className="main-schedule hero">
        <div className="wrapper">
          <h1>Calendrier de la journée</h1>
          <div className="schedule-container">
            <h2>
              {formatDateDay(schedule.currentDate)}{" "}
              {formatDateMonthDay(schedule.currentDate, true)}
            </h2>
            <div className="container-games">
              {todayGames.length > 0 ? (
                todayGames.map((game) => (
                  <div key={game.id} className="schedule-game window-effect">
                    <div className="glare-effect"></div>
                    <div className="situation">
                      {game.gameState === "LIVE" ? (
                        <>
                          <p>
                            <strong className="period">
                              {`${
                                game.period === 1
                                  ? game.period + "re"
                                  : game.period + "e"
                              }`}{" "}
                            </strong>
                            {game.clock.inIntermission === true ? "ENT" : ""}{" "}
                            {game.clock.timeRemaining}
                          </p>
                          {game?.situation?.homeTeam?.strength &&
                          game?.situation?.homeTeam?.strength ? (
                            <p>
                              {game?.situation?.homeTeam?.strength >
                              game?.situation?.awayTeam?.strength
                                ? game?.situation?.homeTeam?.strength +
                                  " contre " +
                                  game?.situation?.awayTeam?.strength
                                : game?.situation?.awayTeam?.strength +
                                  " contre " +
                                  game?.situation?.homeTeam?.strength}
                            </p>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        <>
                          <p>
                            {`${
                              game.gameState === "FINAL"
                                ? `Finale${
                                    game.periodDescriptor.periodType === "OT"
                                      ? "/Pr."
                                      : game.periodDescriptor.periodType ===
                                        "SO"
                                      ? "/TB"
                                      : ""
                                  }`
                                : formatGameTime(
                                    game.startTimeUTC,
                                    game.easternUTCOffset
                                  ) + " HAE"
                            }`}
                          </p>
                        </>
                      )}
                      {game.gameState !== "FINAL" ? (
                        <div className="broadcast">
                          {game.tvBroadcasts.map((broadcast) => (
                            <p key={broadcast.id}>{broadcast.network}</p>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="team">
                      <Link
                        to={`/equipes/${game.awayTeam.name.default
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        <div className="left-side">
                          {" "}
                          <img
                            src={`https://assets.nhle.com/logos/nhl/svg/${game.awayTeam.abbrev}_dark.svg`}
                            alt={`${game.awayTeam.name.default} logo`}
                          />
                          <div className="team-stats">
                            <p>{game.awayTeam.name.default}</p>
                            {game.gameState === "LIVE" ||
                            game.gameState === "FINAL" ? (
                              <p>
                                T: {game.awayTeam.sog}{" "}
                                {`${
                                  game?.situation?.awayTeam?.abbrev ===
                                    game?.awayTeam?.abbrev &&
                                  game?.situation?.awayTeam
                                    ?.situationDescriptions != null
                                    ? "| " +
                                      game?.situation?.awayTeam
                                        ?.situationDescriptions +
                                      " " +
                                      game?.situation?.timeRemaining
                                    : ""
                                }`}
                              </p>
                            ) : (
                              <p>{game.awayTeam.record}</p>
                            )}
                          </div>
                        </div>

                        <div className="score-games">
                          {game.gameState === "LIVE" ||
                          game.gameState === "FINAL" ? (
                            <p>{game.awayTeam.score}</p>
                          ) : (
                            ""
                          )}
                        </div>
                      </Link>
                      <Link
                        to={`/equipes/${game.homeTeam.name.default
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        <div className="left-side">
                          <img
                            src={`https://assets.nhle.com/logos/nhl/svg/${game.homeTeam.abbrev}_dark.svg`}
                            alt={`${game.homeTeam.name.default} logo`}
                          />
                          <div className="team-stats">
                            <p>{game.homeTeam.name.default}</p>
                            {game.gameState === "LIVE" ||
                            game.gameState === "FINAL" ? (
                              <p>
                                T: {game.homeTeam.sog}{" "}
                                {`${
                                  game?.situation?.homeTeam?.abbrev ===
                                    game?.homeTeam?.abbrev &&
                                  game?.situation?.homeTeam
                                    ?.situationDescriptions != null
                                    ? "| " +
                                      game?.situation?.homeTeam
                                        ?.situationDescriptions +
                                      " " +
                                      game?.situation?.timeRemaining
                                    : ""
                                }`}
                              </p>
                            ) : (
                              <p>{game.homeTeam.record}</p>
                            )}
                          </div>
                        </div>

                        <div className="score-games">
                          {game.gameState === "LIVE" ||
                          game.gameState === "FINAL" ? (
                            <p>{game.homeTeam.score}</p>
                          ) : (
                            ""
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="content">
                      {game?.teamLeaders?.length > 0 ? (
                        <>
                          <p>Meneurs de l'équipe</p>
                          <Carousel
                            breakpoint={{
                              375: { slidesPerView: "auto", spaceBetween: 10 },
                            }}
                          >
                            {game.teamLeaders.map((leader) => (
                              <div
                                className="slide window-effect leader"
                                key={leader.id}
                                data-is-swiper-slide
                              >
                                <div className="player-infos">
                                  <Link
                                    to={`/equipes/${
                                      game.awayTeam.abbrev === leader.teamAbbrev
                                        ? game.awayTeam.name.default
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                        : game.homeTeam.name.default
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                    }/${leader.firstName.default.toLowerCase()}-${leader.lastName.default.toLowerCase()}-${
                                      leader.id
                                    }`}
                                  >
                                    <img
                                      src={leader.headshot}
                                      alt={`${leader.firstName.default} ${leader.lastName.default}`}
                                    />
                                  </Link>
                                  <div className="other-infos">
                                    <p>{leader.firstName.default}</p>
                                    <p>
                                      <strong>{leader.lastName.default}</strong>
                                    </p>
                                    <p>{leader.teamAbbrev}</p>
                                  </div>
                                </div>
                                <div className="player-stats">
                                  <p>
                                    <strong className="stats">
                                      {leader.value}
                                    </strong>
                                  </p>
                                  <p>
                                    {leader.category === "goals"
                                      ? "Buts"
                                      : leader.category === "assists"
                                      ? "Aides"
                                      : leader.category === "wins"
                                      ? "Victoires"
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </Carousel>
                        </>
                      ) : (
                        <>
                          <p>Buts</p>
                          <Carousel
                            breakpoint={{
                              375: { slidesPerView: "auto", spaceBetween: 10 },
                            }}
                          >
                            {game.goals.map((goal) => (
                              <div
                                key={goal.playerId}
                                className="slide window-effect"
                                data-is-swiper-slide
                              >
                                <div className="media">
                                  <Link
                                    to={`/equipes/${
                                      game.awayTeam.abbrev === goal.teamAbbrev
                                        ? game.awayTeam.name.default
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                        : game.homeTeam.name.default
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                    }/${goal.firstName.default.toLowerCase()}-${goal.lastName.default.toLowerCase()}-${
                                      goal.playerId
                                    }`}
                                  >
                                    <img
                                      src={goal.mugshot}
                                      alt={`${goal.firstName.default} ${goal.lastName.default}`}
                                    />
                                  </Link>
                                </div>
                                <div className="goal-infos">
                                  <p>
                                    <strong>{`${goal.firstName.default} ${
                                      goal.lastName.default
                                    }${
                                      goal.periodDescriptor.periodType !== "SO"
                                        ? " (" + goal.goalsToDate + ")"
                                        : ""
                                    }`}</strong>
                                    {(goal.strength !== "ev" ||
                                      goal.goalModifier !== "none") && (
                                      <span className="strength">
                                        {goal.strength === "pp"
                                          ? " BAN"
                                          : goal.strength === "sh"
                                          ? " BIN"
                                          : goal.goalModifier === "empty-net"
                                          ? " FD"
                                          : ""}
                                      </span>
                                    )}
                                  </p>
                                  <span className="assists">
                                    {goal.assists.length > 0 ? (
                                      <>
                                        {goal.assists.map((assist, index) => (
                                          <React.Fragment key={assist.playerId}>
                                            {index > 0 && <span> et </span>}
                                            <span>{`${assist.name.default} (${assist.assistsToDate})`}</span>
                                          </React.Fragment>
                                        ))}
                                      </>
                                    ) : (
                                      <span>Sans aide</span>
                                    )}
                                  </span>
                                  {goal.teamAbbrev === game.homeTeam.abbrev ? (
                                    <p>
                                      {game.awayTeam.abbrev} {goal.awayScore} -{" "}
                                      <strong>
                                        {game.homeTeam.abbrev} {goal.homeScore}
                                      </strong>{" "}
                                      {goal.periodDescriptor.periodType ===
                                      "REG"
                                        ? `(${
                                            goal.period === 1
                                              ? goal.period + "re"
                                              : goal.period + "e"
                                          } - ${goal.timeInPeriod})`
                                        : `(${
                                            goal.periodDescriptor.periodType ===
                                            "OT"
                                              ? "Pr" + " - " + goal.timeInPeriod
                                              : goal.periodDescriptor
                                                  .periodType === "SO"
                                              ? "TB"
                                              : ""
                                          })`}
                                    </p>
                                  ) : (
                                    <p>
                                      <strong>
                                        {game.awayTeam.abbrev} {goal.awayScore}
                                      </strong>{" "}
                                      - {game.homeTeam.abbrev} {goal.homeScore}{" "}
                                      {goal.periodDescriptor.periodType ===
                                      "REG"
                                        ? `(${
                                            goal.period === 1
                                              ? goal.period + "re"
                                              : goal.period + "e"
                                          } - ${goal.timeInPeriod})`
                                        : `(${
                                            goal.periodDescriptor.periodType ===
                                            "OT"
                                              ? "Pr" +
                                                "(" +
                                                goal.timeInPeriod +
                                                ")"
                                              : goal.periodDescriptor
                                                  .periodType === "SO"
                                              ? "TB"
                                              : ""
                                          })`}
                                    </p>
                                  )}
                                </div>
                                {goal.highlightClipSharingUrl !== undefined && (
                                  <div className="clip">
                                    <Link
                                      to={goal.highlightClipSharingUrl}
                                      target="_blank"
                                    >
                                      <Svg
                                        name="recap-play-video"
                                        size="xs"
                                      ></Svg>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ))}
                          </Carousel>
                        </>
                      )}
                    </div>
                    <div className="game-links">
                      {(game?.threeMinRecapFr !== undefined ||
                        game?.threeMinRecap !== undefined ||
                        game?.condensedGame !== undefined ||
                        game?.condensedGameFr !== undefined) && (
                        <a
                          target="_blank"
                          href={`https://www.nhl.com${
                            game?.threeMinRecapFr
                              ? game?.threeMinRecapFr
                              : game?.threeMinRecap
                              ? game?.threeMinRecap
                              : game?.condensedGameFr
                              ? game.condensedGameFr
                              : game.condensedGame
                          }`}
                        >
                          <span className="mobile">Résumé du match</span>
                        </a>
                      )}
                      <a href={`#`}>
                        <span className="mobile">Détails match</span>
                      </a>
                      {game.gameState === "FUT" && (
                        <a
                          target="_blank"
                          href={game.ticketsLinkFr ?? game.ticketsLink}
                        >
                          <span className="mobile">Billets</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="schedule-game no-games">
                  <p>Aucune partie aujourd'hui.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleSchedule;
