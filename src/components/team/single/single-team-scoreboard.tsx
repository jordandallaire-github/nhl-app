import React from "react";
import {
  TeamScoreboard,
  GameData,
} from "../../../interfaces/team/teamScoreboard";
import { Link } from "react-router-dom";
import Carousel from "../../carousel";
import { formatGameTime } from "../../utils/formatGameTime";
import { formatDateMonthDay } from "../../utils/formatDate";

interface SingleTeamScoreboardProps {
  teamScoreboard: TeamScoreboard | null;
}

const SingleTeamScoreboard: React.FC<SingleTeamScoreboardProps> = ({
  teamScoreboard,
}) => {
  if (!teamScoreboard || teamScoreboard.gamesByDate.length === 0) {
    return <p>Aucun match à venir</p>;
  }

  return (
    <section className="scoreboard">
      <div className="wrapper">
        <h2>Match à venir</h2>
        <Carousel>
          {teamScoreboard.gamesByDate.map((gameData: GameData) =>
            gameData.games.map((game) => (
              <div
                data-is-swiper-slide
                key={game.id}
                className="game-card window-effect glare-item"
              >
                <h3>{formatDateMonthDay(game.gameDate)}</h3>
                <div className="game-media">
                  <div className="team">
                    <Link
                      to={`/equipes/${game.awayTeam.commonName.default
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <img
                        src={`${game.awayTeam.logo}`}
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
                          {`${
                            game.period === 1
                              ? game.period + "er"
                              : game.period + "e"
                          }`}{" "}
                          {game.clock.inIntermission === true ? "INT" : ""}{" "}
                          {game.clock.timeRemaining}
                        </p>
                        <p>@</p>
                        <p>{game.venue.default}</p>
                        <div className="broadcast">
                          {game.tvBroadcasts.map((broadcast) => (
                            <p key={broadcast.id}>{broadcast.network}</p>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          {game.gameState === "FINAL"
                            ? "Finale"
                            : formatGameTime(
                                game.startTimeUTC,
                                game.easternUTCOffset
                              )}
                        </p>
                        <p>@</p>
                        <p>{game.venue.default}</p>
                        <div className="broadcast">
                          {game.tvBroadcasts.map((broadcast) => (
                            <p key={broadcast.id}>{broadcast.network}</p>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="team">
                    <Link
                      to={`/equipes/${game.homeTeam.commonName.default
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <img
                        src={`${game.homeTeam.logo}`}
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
                    <a href={`#`}>Détails de la partie</a>
                    {game.ticketsLink && (
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
