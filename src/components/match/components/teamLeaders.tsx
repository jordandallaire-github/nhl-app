import { Link } from "react-router-dom";
import formatSeason from "../../../scripts/utils/formatSeason";
import { FormatPosition } from "../../../scripts/utils/formatPosition";
import { INTMainGameInfos } from "../../../interfaces/main-match";

 export const renderTeamLeaders = (game: INTMainGameInfos) => {
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
                              )}/joueur/${leader.awayLeader.firstName.default.toLowerCase()}-${leader.awayLeader.lastName.default.toLowerCase()}-${
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
                              )}/joueur/${leader.homeLeader.firstName.default.toLowerCase()}-${leader.homeLeader.lastName.default.toLowerCase()}-${
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