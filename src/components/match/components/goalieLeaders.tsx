import { Link } from "react-router-dom";
import formatSeason from "../../../scripts/utils/formatSeason";
import { INTMainGameInfos } from "../../../interfaces/main-match";

interface Colors {
  home: string | null;
  away: string | null;
}

 export const renderGoalieTeam = (game: INTMainGameInfos, teamColors: Colors) => {
  return (
    <>
      <div className="matchup-card window-effect">
        <div className="glare-effect"></div>
        <h2>Gardiens</h2>
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
              to={`/equipes/${game?.awayTeam.commonName.default
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <img
                src={`https://assets.nhle.com/logos/nhl/svg/${game?.awayTeam.abbrev}_dark.svg`}
                alt={`${game?.awayTeam.commonName.default} logo`}
                loading="lazy"
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
                            to={`/equipes/${game?.awayTeam.commonName.default
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}/joueur/${awayLeader.firstName.default.toLowerCase()}-${awayLeader.lastName.default.toLowerCase()}-${
                              awayLeader.playerId
                            }`}
                          >
                            <img
                              src={awayLeader.headshot}
                              alt={`${awayLeader.firstName.default} ${awayLeader.lastName.default}`}
                              loading="lazy"
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
              to={`/equipes/${game?.homeTeam.commonName.default
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <img
                src={`https://assets.nhle.com/logos/nhl/svg/${game?.homeTeam.abbrev}_dark.svg`}
                alt={`${game?.awayTeam.commonName.default} logo`}
                loading="lazy"
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
                    <div className="player home left">
                      <div className="infos">
                        <div className="media">
                          <Link
                            to={`/equipes/${game?.homeTeam.commonName.default
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )}/joueur/${homeLeader.firstName.default.toLowerCase()}-${homeLeader.lastName.default.toLowerCase()}-${
                              homeLeader.playerId
                            }`}
                          >
                            <img
                              src={homeLeader.headshot}
                              alt={`${homeLeader.firstName.default} ${homeLeader.lastName.default}`}
                              loading="lazy"
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
