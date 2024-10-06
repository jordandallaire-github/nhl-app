import React from "react";
import {
  TeamScoreboard,
  GameData,
} from "../../../interfaces/team/teamScoreboard";
import { Link } from "react-router-dom";
import { GameLink } from "../../../scripts/utils/formatGameURL";
import Carousel from "../../utils/carousel";
import { formatGameTime } from "../../../scripts/utils/formatGameTime";
import { formatDateMonthDay } from "../../../scripts/utils/formatDate";

interface SingleTeamScoreboardProps {
  teamScoreboard: TeamScoreboard | null;
  teamColor: string | null;
}

const SingleTeamScoreboard: React.FC<SingleTeamScoreboardProps> = ({
  teamScoreboard,
  teamColor,
}) => {
  if (!teamScoreboard || teamScoreboard.gamesByDate.length === 0) {
    return <p>Aucun match à venir</p>;
  }

  return (
    <section className="scoreboard">
      <div className="wrapper">
        <h2>Match à venir</h2>
        <Carousel
          breakpoint={{
            1300: { slidesPerView: 3.2, spaceBetween: 30 },
            1020: { slidesPerView: 2.5, spaceBetween: 30 },
            720: { slidesPerView: 1.8, spaceBetween: 10 },
            350: { slidesPerView: 1.1, spaceBetween: 20 },
          }}
        >
          {teamScoreboard.gamesByDate.map((gameData: GameData) =>
            gameData.games.map((game) => (
              <div
                data-is-swiper-slide
                key={game.id}
                className="game-card window-effect scoreboard"
              >
                <div
                  style={{
                    backgroundImage: `linear-gradient(to right, #0000 15%, ${teamColor} 50%, #0000 95%)`,
                  }}
                  className="glare-effect"
                ></div>
                <h3>{formatDateMonthDay(game.gameDate, false)}</h3>
                <div className="game-media">
                  <div className="team">
                    {game?.situation?.teamAbbrev === game?.awayTeam?.abbrev &&
                      (game?.situation?.situationCode === "PP" ? (
                        <p className="situation">
                          AN {game?.situation?.timeRemaining}
                        </p>
                      ) : (
                        <p className="situation">
                          {game?.situation?.situationCode}{" "}
                          {game?.situation?.timeRemaining}
                        </p>
                      ))}
                    <Link
                      to={`/equipes/${game.awayTeam.commonName.default
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${game.awayTeam.abbrev}_dark.svg`}
                        alt={`${game.awayTeam.name.fr} logo`}
                      />
                    </Link>
                    <p>{game.awayTeam.abbrev}</p>
                    <p>
                      <strong>
                        {game.awayTeam.record == null
                          ? game.awayTeam.score
                          : game.awayTeam.record}
                      </strong>
                    </p>
                  </div>
                  <div className="livescore">
                    {game.gameState === "LIVE" ? (
                      <>
                        <p>
                          <strong className="period">{`${
                            game.period === 1
                              ? game.period + "re"
                              : game.period + "e"
                          }`}</strong>{" "}
                          {game.clock.inIntermission === true ? "ENT" : ""}{" "}
                          {game.clock.timeRemaining}
                        </p>
                        <p>@</p>
                        <p>{game.venue.default}</p>
                      </>
                    ) : (
                      <>
                        <p>
                          {`${
                            game.gameState === "FINAL" || game.gameState === "OFF"
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
                        <p>@</p>
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
                    {game?.situation?.teamAbbrev === game?.homeTeam?.abbrev &&
                      (game?.situation?.situationCode === "PP" ? (
                        <p className="situation">
                          AN {game?.situation?.timeRemaining}
                        </p>
                      ) : (
                        <p className="situation">
                          {game?.situation?.situationCode}{" "}
                          {game?.situation?.timeRemaining}
                        </p>
                      ))}
                    <Link
                      to={`/equipes/${game.homeTeam.commonName.default
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <img
                        src={`https://assets.nhle.com/logos/nhl/svg/${game.homeTeam.abbrev}_dark.svg`}
                        alt={`${game.homeTeam.name.fr} logo`}
                      />
                    </Link>
                    <p>{game.homeTeam.abbrev}</p>
                    <p>
                      <strong>
                        {game.homeTeam.record == null
                          ? game.homeTeam.score
                          : game.homeTeam.record}
                      </strong>
                    </p>
                  </div>
                </div>
                <div className="game-content">
                  <div className="game-links">
                    <GameLink game={game.gameCenterLink} />
                    {game.ticketsLink && game.gameState === "FUT" && (
                      <a href={game.ticketsLinkFr}>Acheter des billets</a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </Carousel>
      </div>
    </section>
  );
};

export default SingleTeamScoreboard;
