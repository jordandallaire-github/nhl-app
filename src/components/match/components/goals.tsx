import { INTMainGameInfos } from "../../../interfaces/main-match";
import { Link } from "react-router-dom";
import React from "react";
import { TeamsLogoLinks } from "./teamLogoLink";
import GoalClip from "./goalClip";
import { INTGameVideo } from "../../../interfaces/game-video";
import { formatPublicationDate } from "../../../scripts/utils/formatDate";

interface Colors {
  home: string | null;
  away: string | null;
}

export const renderGoalInfos = (
  game: INTMainGameInfos | null,
  teamColors: Colors,
  goalVideo: INTGameVideo | null
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
      default:
        return shot;
    }
  };

  const filteredGoalVideos =
    goalVideo?.items.filter((video) =>
      video.tags.some((tag) => tag.slug.includes("goal"))
    ) || [];

  const getVideoId = (url: string) => {
    return url.split("-").pop();
  };

  const noGoal =
    game?.summary.scoring.filter((score) => score.goals.length > 0) || [];

  // Générer un ID unique pour chaque but
  const generateUniqueGoalId = (
    periodNumber: number,
    periodType: string,
    timeInPeriod: string,
    playerId: string | number,
    goalIndex: number,
    teamAbbrev: string
  ) => {
    return `goal-${periodNumber}-${periodType}-${timeInPeriod}-${playerId}-${goalIndex}-${teamAbbrev}`;
  };

  return (
    <>
      <div className="goal-infos-card">
        <h3>Résumé des buts</h3>
        {game?.summary?.scoring
          ?.filter((goal) => goal.goals.length > 0)
          .map((scoring, periodIndex) => (
            <div
              key={`period-${scoring.periodDescriptor.number}-${scoring.periodDescriptor.periodType}-${periodIndex}`}
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
              {scoring.goals
                .filter((situation) => situation.situationCode !== "1010")
                .map((goal, goalIndex) => {
                  const frVideoId = goal.highlightClipSharingUrlFr
                    ? getVideoId(goal.highlightClipSharingUrlFr)
                    : null;
                  const enVideoId = goal.highlightClipSharingUrl
                    ? getVideoId(goal.highlightClipSharingUrl)
                    : null;

                  let matchingVideo = null;
                  if (frVideoId) {
                    matchingVideo = filteredGoalVideos.find(
                      (video) => getVideoId(video.selfUrl) === frVideoId
                    );
                  } else if (enVideoId) {
                    matchingVideo = filteredGoalVideos.find(
                      (video) => getVideoId(video.selfUrl) === enVideoId
                    );
                  }

                  const uniqueGoalId = generateUniqueGoalId(
                    scoring.periodDescriptor.number,
                    scoring.periodDescriptor.periodType,
                    goal.timeInPeriod,
                    goal.playerId,
                    goalIndex,
                    goal.teamAbbrev.default
                  );

                  return (
                    <div key={uniqueGoalId} className="goal-container">
                      <div className="players-goal window-effect">
                        <div className="glare-effect" />
                        <div className="goals-container">
                          <div className="player-infos">
                            <div className="media">
                              <Link
                                to={`/equipes/${
                                  game.awayTeam.abbrev ===
                                  goal.teamAbbrev.default
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
                                  <p className="goal-situation">
                                    <strong>{`${goal.firstName.default} ${
                                      goal.lastName.default
                                    }${` (${goal.goalsToDate})`}`}</strong>
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
                                </div>
                                <div className="assists">
                                  <TeamsLogoLinks
                                    team={
                                      goal.teamAbbrev.default ===
                                      game.homeTeam.abbrev
                                        ? game.homeTeam
                                        : game.awayTeam
                                    }
                                  />
                                  <div className="assist">
                                    {goal.assists.length > 0 ? (
                                      <>
                                        {goal.assists.map(
                                          (assist, assistIndex) => (
                                            <React.Fragment
                                              key={`assist-${assist.playerId}-${assistIndex}`}
                                            >
                                              {assistIndex > 0 && (
                                                <span> et </span>
                                              )}
                                              <span>{`${assist.name.default} (${assist.assistsToDate})`}</span>
                                            </React.Fragment>
                                          )
                                        )}
                                      </>
                                    ) : (
                                      <span>Sans aide</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="goal-infos-stats">
                            <div className="stat window-effect">
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
                            <div className="stat window-effect">
                              <p>
                                <strong>{goal.timeInPeriod}</strong>
                              </p>
                              <p>Temps</p>
                            </div>
                            <div className="stat window-effect">
                              <p>
                                <strong>{formatShotType(goal.shotType)}</strong>
                              </p>
                              <p>Tir</p>
                            </div>
                            {(goal.highlightClipSharingUrl !== undefined ||
                              goal.highlightClipSharingUrlFr !== undefined) && (
                              <GoalClip
                                isSvg
                                fr={
                                  goal.highlightClipSharingUrlFr ??
                                  goal.highlightClipSharingUrl ??
                                  ""
                                }
                                title={matchingVideo?.title}
                                description={
                                  matchingVideo?.fields.longDescription
                                }
                                date={formatPublicationDate(
                                  matchingVideo?.contentDate ?? ""
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        {game?.summary.shootout.map((so, shootoutIndex) => (
          <div
            key={`shootout-${so.playerId}-${shootoutIndex}-${so.teamAbbrev}`}
            className="goal-container so window-effect"
          >
            <div className="glare-effect" />
            <div className="player-infos">
              <div className="media">
                <Link
                  to={`/equipes/${
                    game.awayTeam.abbrev === so.teamAbbrev
                      ? game.awayTeam.name.default
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      : game.homeTeam.name.default
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                  }/${so.firstName?.toLowerCase()}-${so.lastName?.toLowerCase()}-${
                    so.playerId
                  }`}
                >
                  <img
                    src={so.headshot}
                    alt={`${so.firstName} ${so.lastName}`}
                  />
                </Link>
                <div className="goals-infos">
                  <div className="goal-info">
                    <p>
                      <strong>{`${so.firstName.charAt(0)}. ${
                        so.lastName
                      }`}</strong>
                    </p>
                  </div>
                  <div className="assists so">
                    <TeamsLogoLinks
                      team={
                        so.teamAbbrev === game.homeTeam.abbrev
                          ? game.homeTeam
                          : game.awayTeam
                      }
                    />
                    <p>
                      <strong>{so.result === "goal" ? "But" : "Arrêt"}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="result">
              {so.result === "goal" ? (
                <span className="goal">&#10004;</span>
              ) : (
                <span className="stop">&#10006;</span>
              )}
            </div>
          </div>
        ))}
        {noGoal.length === 0 && <p>Aucun but inscrit.</p>}
      </div>
    </>
  );
};
