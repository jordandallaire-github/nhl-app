import React from "react";
import { Link } from "react-router-dom";
import TVA from "../assets/images/TVA.svg";
import RDS from "../assets/images/RDS.svg";
import { formatSituation } from "../scripts/utils/formatSituation";
import {
  INTSchedule,
  Game,
  TeamLeader,
  Goal,
  Assist,
} from "../interfaces/schedule";
import {
  formatDateMonthDay,
  formatDateDay,
  getFrenchDayAbbr,
  formatJustDay,
} from "../scripts/utils/formatDate";
import { GameLink } from "../scripts/utils/formatGameURL";
import { formatGameTime } from "../scripts/utils/formatGameTime";
import Carousel from "./utils/carousel";
import { Svg } from "../scripts/utils/Icons";
import GoalClip from "./match/components/goalClip";

interface SingleScheduleProps {
  schedule: INTSchedule | null;
  onChangeWeek: (direction: "prev" | "next") => void;
  onChangeDay: (dayIndex: string) => void;
}

const SingleSchedule: React.FC<SingleScheduleProps> = ({
  schedule,
  onChangeWeek,
  onChangeDay,
}) => {
  if (!schedule || !schedule.currentDate) {
    return <div>Aucun calendrier disponible.</div>;
  }

  const { currentDate, games = [] } = schedule;

  const renderGameSituation = (game: Game) => {
    if (game.gameState === "LIVE" || game.gameState === "CRIT") {
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
        {game.gameState === "FINAL" || game.gameState === "OFF"
          ? `Final${
              game.periodDescriptor.periodType === "OT"
                ? "/Pr."
                : game.periodDescriptor.periodType === "SO"
                ? "/TB"
                : ""
            }`
          : `${formatGameTime(game.startTimeUTC, game.easternUTCOffset)} HAE`}
      </p>
    );
  };

  const renderTeamInfo = (game: Game, isAway: boolean) => {
    const team = isAway ? game.awayTeam : game.homeTeam;
    return (
      <Link
        to={`/equipes/${team.name.default.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <div className="left-side">
          <img
            src={`https://assets.nhle.com/logos/nhl/svg/${team.abbrev}_dark.svg`}
            alt={`${team.name.default} logo`}
          />
          <div className="team-stats">
            <p>{team.name.default}</p>
            {game.gameState === "LIVE" ||
            game.gameState === "FINAL" ||
            game.gameState === "OFF" ||
            game.gameState === "CRIT" ? (
              <p>
                T: {team.sog}{" "}
                {game.situation?.[isAway ? "awayTeam" : "homeTeam"]?.abbrev ===
                  team.abbrev &&
                  game.situation?.[isAway ? "awayTeam" : "homeTeam"]
                    ?.situationDescriptions &&
                  `| ${formatSituation(
                    game.situation[isAway ? "awayTeam" : "homeTeam"]
                      .situationDescriptions
                  )} ${game.situation.timeRemaining}`}
              </p>
            ) : (
              <p>{team.record}</p>
            )}
          </div>
        </div>
        <div className="score-games">
          {(game.gameState === "LIVE" ||
            game.gameState === "FINAL" ||
            game.gameState === "OFF" ||
            game.gameState === "CRIT") && <p className="score">{team.score}</p>}
        </div>
      </Link>
    );
  };

  const renderTeamLeaders = (game: Game) => (
    <>
      <p>Meneurs de l'équipe</p>
      <Carousel
        breakpoint={{
          375: { slidesPerView: "auto", spaceBetween: 10 },
        }}
        pagination={{
          clickable: true,
          type: "bullets",
          el: ".swiper-pagination",
          bulletActiveClass: "swiper-pagination-bullet-active",
          bulletClass: "swiper-pagination-bullet window-effect",
          bulletElement: "span",
        }}
        navigation={{
          nextEl: ".next",
          prevEl: ".prev",
        }}
      >
        <div className="swiper-pagination">
          <span></span>
        </div>
        <div
          className={`swiper-navigation ${
            game.teamLeaders.length >= 5 ? "more" : ""
          }`}
        >
          <div className="prev">
            <Svg name="left-arrow" size="xs" />
          </div>
          <div className="next">
            <Svg name="right-arrow" size="xs" />
          </div>
        </div>
        {game.teamLeaders.map((leader: TeamLeader, index: number) => (
          <div
            className="slide window-effect leader"
            key={`${leader.id}-${index}`}
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
                <strong className="stats">{leader.value}</strong>
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
  );

  const renderGoals = (game: Game) => (
    <>
      <p>Buts</p>
      <Carousel
        breakpoint={{
          375: { slidesPerView: "auto", spaceBetween: 10 },
        }}
        pagination={{
          clickable: true,
          type: "bullets",
          el: ".swiper-pagination",
          bulletActiveClass: "swiper-pagination-bullet-active",
          bulletClass: "swiper-pagination-bullet window-effect",
          bulletElement: "span",
        }}
        navigation={{
          nextEl: ".next",
          prevEl: ".prev",
        }}
      >
        <div className="swiper-pagination">
          <span></span>
        </div>
        <div
          className={`swiper-navigation ${
            game.goals.length >= 5 ? "more" : ""
          }`}
        >
          <div className="prev">
            <Svg name="left-arrow" size="xs" />
          </div>
          <div className="next">
            <Svg name="right-arrow" size="xs" />
          </div>
        </div>
        {game.goals.map((goal: Goal, index: number) => (
          <div
            key={`${goal.playerId}-${index}`}
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
                }/${goal.firstName?.default.toLowerCase()}-${goal.lastName?.default.toLowerCase()}-${
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
              <p className="goal-situation">
                <strong>{`${goal.firstName.default} ${goal.lastName.default}${
                  goal.periodDescriptor.periodType !== "SO"
                    ? ` (${goal.goalsToDate})`
                    : ""
                }`}</strong>
                {goal.strength !== "ev" || goal.goalModifier !== "none" ? (
                  <span className="strength">
                    {goal.strength === "pp"
                      ? " BAN"
                      : goal.strength === "sh"
                      ? " BIN"
                      : goal.goalModifier === "empty-net"
                      ? " FD"
                      : ""}
                  </span>
                ) : (
                  <span className="strength no"></span>
                )}
              </p>
              <span className="assists">
                {goal.assists.length > 0 ? (
                  <>
                    {goal.assists.map((assist: Assist, index: number) => (
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
              <p>
                {goal.teamAbbrev === game.homeTeam.abbrev ? (
                  <>
                    {game.awayTeam.abbrev} {goal.awayScore} -{" "}
                    <strong>
                      {game.homeTeam.abbrev} {goal.homeScore}
                    </strong>{" "}
                  </>
                ) : (
                  <>
                    <strong>
                      {game.awayTeam.abbrev} {goal.awayScore}
                    </strong>{" "}
                    - {game.homeTeam.abbrev} {goal.homeScore}{" "}
                  </>
                )}
                {goal.periodDescriptor.periodType === "REG"
                  ? `(${
                      goal.period === 1 ? goal.period + "re" : goal.period + "e"
                    } - ${goal.timeInPeriod})`
                  : `(${
                      goal.periodDescriptor.periodType === "OT"
                        ? `Pr - ${goal.timeInPeriod}`
                        : goal.periodDescriptor.periodType === "SO"
                        ? "TB"
                        : ""
                    })`}
              </p>
            </div>
            {(goal.highlightClipSharingUrlFr ||
              goal.highlightClipSharingUrl) && (
              <GoalClip
                fr={
                  goal.highlightClipSharingUrlFr ?? goal.highlightClipSharingUrl
                }
              >
                <Svg name="recap-play-video" size="xs" />
              </GoalClip>
            )}
          </div>
        ))}
      </Carousel>
    </>
  );

  return (
    <section className="main-schedule hero">
      <div className="wrapper">
        <h1>Calendrier de la journée</h1>
        <div className="nav-week">
          <div className="change-week window-effect">
            <button onClick={() => onChangeWeek("prev")}>
              <Svg name="left-arrow" size="sm" />
            </button>
            <p>
              {formatDateMonthDay(schedule.gameWeek[0].date, false)} -{" "}
              {formatDateMonthDay(schedule.gameWeek[6].date, false)}
            </p>
            <button onClick={() => onChangeWeek("next")}>
              <Svg name="right-arrow" size="sm" />
            </button>
          </div>
        </div>
        <div className="day-of-week">
          {schedule.gameWeek.map((game, index) => (
            <button
              className={`window-effect ${
                game.date === currentDate ? "active" : ""
              }`}
              key={`${game.date}-${index}`}
              onClick={() => onChangeDay(game.date)}
            >
              <p>{getFrenchDayAbbr(game.date)}</p>
              <p>{formatJustDay(game.date)}</p>
              <p>{game.numberOfGames}</p>
            </button>
          ))}
        </div>
        <div className="schedule-container">
          <h2>
            {formatDateDay(currentDate)} {formatDateMonthDay(currentDate, true)}
          </h2>
          <div className="container-games">
            {games.length > 0 ? (
              games.map((game, index) => (
                <div
                  key={`${game.id}-${index}`}
                  className="schedule-game window-effect"
                >
                  <div className="glare-effect"></div>
                  <div className="situation">
                    {renderGameSituation(game)}
                    {game.gameState !== "FINAL" &&
                      game.tvBroadcasts.length > 0 &&
                      game.gameState !== "OFF" && (
                        <div className="broadcast">
                          {game.tvBroadcasts.map((broadcast, index) => (
                            <p key={`${broadcast.id}-${index}`}>
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
                            </p>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="team">
                    {renderTeamInfo(game, true)}
                    {renderTeamInfo(game, false)}
                  </div>
                  <div className="content">
                    {game?.teamLeaders?.length > 0
                      ? renderTeamLeaders(game)
                      : renderGoals(game)}
                  </div>
                  <div className="game-links">
                    {(game?.threeMinRecapFr ||
                      game?.threeMinRecap ||
                      game?.condensedGame ||
                      game?.condensedGameFr) && (
                      <GoalClip
                        fr={`https://www.nhl.com${
                          game?.threeMinRecapFr ??
                          game?.condensedGameFr ??
                          game?.threeMinRecap ??
                          game.condensedGame
                        }`}
                      >
                        <span className="mobile">Résumé du match</span>
                      </GoalClip>
                    )}
                    <GameLink game={game.gameCenterLink} />
                    {(game.gameState === "FUT" || game.gameState === "PRE") && (
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
  );
};

export default SingleSchedule;
