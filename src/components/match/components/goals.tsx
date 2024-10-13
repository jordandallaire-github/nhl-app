import { INTMainGameInfos } from "../../../interfaces/main-match";
import { Link } from "react-router-dom";
import { Svg } from "../../../scripts/utils/Icons";
import { SimulationGoal } from "./simulationGoal";
import React from "react";
import { IReplayFrame } from "../../../interfaces/goal-simulation";

interface Colors {
  home: string | null;
  away: string | null;
}

export const renderGoalInfos = (
  game: INTMainGameInfos | null,
  teamColors: Colors,
  goalSimulation: Record<string, IReplayFrame[]>
) => {
  const formatShotType = (shot: string) => {
    switch (shot) {
      case "poke":
        return "Harponné";
      case "tip-in":
        return "Redirigé";
      case "wrist":
        return "Du Poignet";
      case "slap":
        return "Frappé";
      case "snap":
        return "Semi-Frappé";
      case "deflected":
        return "Dévié";
      case "backhand":
        return "Du Revers";
    }
  };
  return (
    <>
      <div className="goal-infos-card">
        <h3>Résumé des buts</h3>
        {game?.summary?.scoring?.map((scoring) => (
          <div
            key={scoring.periodDescriptor.number}
            className="period-container"
          >
            {scoring.goals.length !== 0 &&
              scoring.periodDescriptor.periodType === "OT" && (
                <h4>Prolongation</h4>
              )}
            {scoring.goals.length !== 0 &&
              scoring.periodDescriptor.periodType === "SO" && (
                <h4>Tirs de barrage</h4>
              )}
            {scoring.goals.length !== 0 &&
              scoring.periodDescriptor.number <= 3 && (
                <h4>{`${scoring.periodDescriptor.number}${
                  scoring.periodDescriptor.number > 1 ? "e" : "re"
                } Période`}</h4>
              )}
            {scoring.goals.map((goal, index) => (
              <>
                <div
                  key={`${goal.firstName}-${index}`}
                  className="goal-container"
                >
                  <div className="players-goal window-effect">
                    <div className="glare-effect"></div>
                    <div className="goals-container">
                      <div className="player-infos">
                        <div className="media">
                          <Link
                            to={`/equipes/${
                              game.awayTeam.abbrev === goal.teamAbbrev.default
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
                              src={goal.headshot}
                              alt={`${goal.firstName.default} ${goal.lastName.default}`}
                            />
                          </Link>
                          <div className="goals-infos">
                            <div className="goal-info">
                              <p>
                                <strong>{`${goal.firstName.default} ${
                                  goal.lastName.default
                                }${` (${goal.goalsToDate})`}`}</strong>
                                {goal.strength !== "ev" ||
                                goal.goalModifier !== "none" ? (
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
                            </div>
                            <div className="assists">
                              {goal.assists.length > 0 ? (
                                <>
                                  {goal.assists.map((assist, index) => (
                                    <React.Fragment key={`${assist.playerId}`}>
                                      {index > 0 && <span> et </span>}
                                      <span>{`${assist.name.default} (${assist.assistsToDate})`}</span>
                                    </React.Fragment>
                                  ))}
                                </>
                              ) : (
                                <span>Sans aide</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="goal-infos-stats">
                        <div className="stat">
                          <p>
                            {goal.teamAbbrev.default ===
                            game.homeTeam.abbrev ? (
                              <>
                                <strong>
                                  {goal.awayScore} - {goal.homeScore}{" "}
                                  {`${
                                    goal.homeScore === goal.awayScore
                                      ? "Égalité"
                                      : game.homeTeam.abbrev
                                  }`}
                                </strong>
                              </>
                            ) : (
                              <>
                                <strong>
                                  {goal.awayScore} - {goal.homeScore}{" "}
                                  {`${
                                    goal.homeScore === goal.awayScore
                                      ? "Égalité"
                                      : game.awayTeam.abbrev
                                  }`}
                                </strong>
                              </>
                            )}
                          </p>
                          <p>Pointage</p>
                        </div>
                        <div className="stat">
                          <p>
                            <strong>{goal.timeInPeriod}</strong>
                          </p>
                          <p>Temps</p>
                        </div>
                        <div className="stat">
                          <p>
                            <strong>{formatShotType(goal.shotType)}</strong>
                          </p>
                          <p>Tir</p>
                        </div>
                        {goal.highlightClipSharingUrl && (
                          <div className="clip">
                            <Link
                              to={goal.highlightClipSharingUrl}
                              target="_blank"
                            >
                              <Svg name="recap-play-video" size="sm" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="simulation">
                      {goal.pptReplayUrl !== undefined && (
                        <SimulationGoal
                          game={game}
                          goal={goal}
                          teamColors={teamColors}
                          goalSimulation={goalSimulation}
                        ></SimulationGoal>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
