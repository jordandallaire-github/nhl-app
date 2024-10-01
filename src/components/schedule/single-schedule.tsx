import { INTSchedule } from "../../interfaces/schedule";
import { formatDateMonthDay } from "../utils/formatDate";
import { Link } from "react-router-dom";
import { formatDateDay } from "../utils/formatDate";
import { formatGameTime } from "../utils/formatGameTime";

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
                    <div className="situation">
                      {game.gameState === "LIVE" ? (
                        <>
                          <p>
                            {`${
                              game.period === 1
                                ? game.period + "re"
                                : game.period + "e"
                            }`}{" "}
                            {game.clock.inIntermission === true ? "ENT" : ""}{" "}
                            {game.clock.timeRemaining}
                          </p>
                          {game?.situation?.homeTeam.strength &&
                          game?.situation?.homeTeam.strength ? (
                            <p>
                              {game?.situation?.homeTeam?.strength >
                              game?.situation?.homeTeam?.strength
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
                                      : ""
                                  }`
                                : formatGameTime(
                                    game.startTimeUTC,
                                    game.easternUTCOffset
                                  ) + " HAE"
                            }`}
                          </p>
                          {game.gameState === "FUT" ? (
                            <div className="broadcast">
                              {game.tvBroadcasts.map((broadcast) => (
                                <p key={broadcast.id}>{broadcast.network}</p>
                              ))}
                            </div>
                          ) : (
                            <p>{game.venue.default}</p>
                          )}
                        </>
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
                    <div className="content"></div>
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
