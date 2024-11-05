import { Link } from "react-router-dom";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTPlayByPlay } from "../../../interfaces/playByPlay";
import { Svg } from "../../../scripts/utils/Icons";
import Accordion from "../../utils/accordion";
import { Play, TypeDesc, SvgName, formatPlayDescription } from "./formatPlay";
import IceRink from "./iceRink";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { INTGameVideo } from "../../../interfaces/game-video";
import GoalClip from "./goalClip";
import { formatPublicationDate } from "../../../scripts/utils/formatDate";

const RINK_DIMENSIONS = {
  minX: -100,
  maxX: 100,
  minY: -42,
  maxY: 42,

  rinkMinX: 0,
  rinkMaxX: 2250,
  rinkMinY: 0,
  rinkMaxY: 870,

  xOffset: 24,
  yOffset: 16,
};

const transformCoordinates = (x: number, y: number) => {
  const normalizedX =
    (x - RINK_DIMENSIONS.minX) / (RINK_DIMENSIONS.maxX - RINK_DIMENSIONS.minX);
  let transformedX =
    RINK_DIMENSIONS.rinkMinX +
    normalizedX * (RINK_DIMENSIONS.rinkMaxX - RINK_DIMENSIONS.rinkMinX);

  transformedX += x >= 0 ? RINK_DIMENSIONS.xOffset : -RINK_DIMENSIONS.xOffset;

  const normalizedY =
    1 -
    (y - RINK_DIMENSIONS.minY) / (RINK_DIMENSIONS.maxY - RINK_DIMENSIONS.minY);
  let transformedY =
    RINK_DIMENSIONS.rinkMinY +
    normalizedY * (RINK_DIMENSIONS.rinkMaxY - RINK_DIMENSIONS.rinkMinY);

  transformedY += RINK_DIMENSIONS.yOffset;

  if (x === 0 && y === 0 || x === undefined && y === undefined ) {
    return { x: 1125, y: 435 };
  }

  if (x === -20 && y === 22) {
    return { x: 885, y: 171 };
  }

  if (x === 20 && y === 22) {
    return { x: 1365, y: 171 };
  }

  if (x === -20 && y === -22) {
    return { x: 885, y: 699 };
  }

  if (x === 20 && y === -22) {
    return { x: 1365, y: 699 };
  }

  if (x === 69 && y === 22) {
    return { x: 1953, y: 171 };
  }

  if (x === -69 && y === 22) {
    return { x: 297, y: 171 };
  }

  if (x === 69 && y === -22) {
    return { x: 1953, y: 699 };
  }

  if (x === -69 && y === -22) {
    return { x: 297, y: 699 };
  }

  return {
    x: Math.round(transformedX),
    y: Math.round(transformedY),
  };
};

interface Colors {
  home: string | null;
  away: string | null;
}

const formatPlayerName = (
  player: PlayerDetailsType,
  total?: string | undefined,
  istotal?: boolean
) => {
  return `${player.firstName.default} ${player.lastName.default} #${
    player.sweaterNumber
  } ${istotal && `(${total})`}`;
};

const findPlayer = (
  playerId: string | number | undefined,
  homeRoster: PlayerDetailsType[] | null,
  awayRoster: PlayerDetailsType[] | null
): PlayerDetailsType | undefined => {
  return (
    homeRoster?.find((player) => player.id === playerId) ||
    awayRoster?.find((player) => player.id === playerId)
  );
};

const getGoalPlayersInfo = (
  play: INTPlayByPlay["plays"][0],
  homeRoster: PlayerDetailsType[] | null,
  awayRoster: PlayerDetailsType[] | null
) => {
  const players = {
    scorer: findPlayer(play.details?.scoringPlayerId, homeRoster, awayRoster),
    assist1: findPlayer(play.details?.assist1PlayerId, homeRoster, awayRoster),
    assist2: findPlayer(play.details?.assist2PlayerId, homeRoster, awayRoster),
  };

  return {
    scorerName: players.scorer
      ? formatPlayerName(players.scorer, play.details?.scoringPlayerTotal, true)
      : undefined,
    assists: [
      players.assist1
        ? formatPlayerName(
            players.assist1,
            play.details?.assist1PlayerTotal,
            true
          )
        : undefined,
      players.assist2
        ? formatPlayerName(
            players.assist2,
            play.details?.assist2PlayerTotal,
            true
          )
        : undefined,
    ].filter(Boolean),
  };
};

const getTeamUrl = (teamName: string): string => {
  return teamName.toLowerCase().replace(/\s+/g, "-");
};

const getTeamLogo = (abbrev: string): string => {
  return `https://assets.nhle.com/logos/nhl/svg/${abbrev}_dark.svg`;
};

export const renderPlayByPlay = (
  game: INTMainGameInfos,
  teamColors: Colors,
  plays: INTPlayByPlay,
  homeRoster: PlayerDetailsType[] | null,
  awayRoster: PlayerDetailsType[] | null,
  goalVideo: INTGameVideo | null
) => {
  const filteredGoalVideos =
    goalVideo?.items.filter((video) =>
      video.tags.some((tag) => tag.slug.includes("goal"))
    ) || [];

  const getVideoById = (play: (typeof plays.plays)[0]) => {
    if (!play.details) return null;

    const frenchVideoId = play.details.highlightClipSharingUrlFr
      ?.split("-")
      .pop();
    const englishVideoId = play.details.highlightClipSharingUrl
      ?.split("-")
      .pop();

    if (frenchVideoId) {
      const frenchVideo = filteredGoalVideos.find(
        (video) => video.fields.brightcoveId === frenchVideoId
      );
      if (frenchVideo) return frenchVideo;
    }

    if (englishVideoId) {
      const englishVideo = filteredGoalVideos.find(
        (video) => video.fields.brightcoveId === englishVideoId
      );
      if (englishVideo) return englishVideo;
    }

    return null;
  };
  return (
    <div className="playByPlay">
      <h3>Jeux</h3>
      <div className="plays-container">
        {plays.plays.map((play, index) => {
          const isGoal = play.typeDescKey === "goal";
          const isEventOwnerHome =
            play.details?.eventOwnerTeamId === game.homeTeam.id;
          const team = isEventOwnerHome ? game.homeTeam : game.awayTeam;

          const playInfo = formatPlayDescription(play, homeRoster, awayRoster);

          const goalInfo = isGoal
            ? getGoalPlayersInfo(play, homeRoster, awayRoster)
            : null;

          const isSpecialPlay = [
            "period-start",
            "period-end",
            "game-end",
            "stoppage",
          ].includes(play.typeDescKey);

          const video = isGoal ? getVideoById(play) : null;

          return (
            <div key={`${play.timeInPeriod}-${index}`} className="play">
              {isSpecialPlay ? (
                Play(play.typeDescKey, play.details?.reason ?? null)
              ) : (
                <>
                  {play.typeDescKey === "goal" && (
                    <div
                      style={{
                        backgroundColor: `${
                          isEventOwnerHome ? teamColors.home : teamColors.away
                        }`,
                      }}
                      className="goal-infos"
                    >
                      <div
                        className={`logo-score away ${
                          isEventOwnerHome ? "" : "isScoreLogo"
                        }`}
                      >
                        <img
                          src={getTeamLogo(game.awayTeam.abbrev)}
                          alt={`${game.awayTeam.name.default} logo`}
                        />
                      </div>
                      <Link
                        className={isEventOwnerHome ? "isScore" : ""}
                        to={`/equipes/${getTeamUrl(
                          game.awayTeam.name.default
                        )}`}
                      >
                        <img
                          src={getTeamLogo(game.awayTeam.abbrev)}
                          alt={`${game.awayTeam.name.default} logo`}
                        />
                      </Link>
                      <p className={isEventOwnerHome ? "isScore" : ""}>
                        <strong>{play.details?.awayScore}</strong>
                      </p>
                      <div className="goal-svg">
                        <div className="svg-style">
                          <Svg name="siren" size="sm" isStroke></Svg>
                        </div>
                        <p>
                          <strong>
                            BUT{" "}
                            {isEventOwnerHome
                              ? game.homeTeam.abbrev
                              : game.awayTeam.abbrev}
                          </strong>
                        </p>
                      </div>
                      <p className={isEventOwnerHome ? "" : "isScore"}>
                        <strong>{play.details?.homeScore}</strong>
                      </p>
                      <Link
                        className={isEventOwnerHome ? "" : "isScore"}
                        to={`/equipes/${getTeamUrl(
                          game.homeTeam.name.default
                        )}`}
                      >
                        <img
                          src={getTeamLogo(game.homeTeam.abbrev)}
                          alt={`${game.homeTeam.name.default} logo`}
                        />
                      </Link>
                      <div
                        className={`logo-score home ${
                          isEventOwnerHome ? "isScoreLogo" : ""
                        }`}
                      >
                        <img
                          src={getTeamLogo(game.homeTeam.abbrev)}
                          alt={`${game.homeTeam.name.default} logo`}
                        />
                      </div>
                    </div>
                  )}
                  <Accordion notClosing={false}>
                    <div
                      className="accordion__container play"
                      style={{
                        backgroundColor: `${
                          play.typeDescKey === "goal"
                            ? play.details?.eventOwnerTeamId ===
                              game.homeTeam.id
                              ? teamColors.home
                              : teamColors.away
                            : ""
                        }`,
                      }}
                    >
                      <div className="accordion__header js-header">
                        <div className="time">
                          {plays.periodDescriptor.number !== 5 && (
                            <p>{play.timeRemaining}</p>
                          )}
                          {play.periodDescriptor.periodType === "OT" && (
                            <p>Pr.</p>
                          )}
                          {play.periodDescriptor.periodType === "SO" && (
                            <p>TB</p>
                          )}
                          {play.periodDescriptor.number <= 3 && (
                            <p>
                              {`${play.periodDescriptor.number}${
                                play.periodDescriptor.number > 1 ? "e" : "re"
                              }`}
                            </p>
                          )}
                        </div>
                        <Link to={`/equipes/${getTeamUrl(team.name.default)}`}>
                          <img
                            src={getTeamLogo(team.abbrev)}
                            alt={`${team.name.default} logo`}
                          />
                        </Link>
                        <div className="situation">
                          {isGoal ? (
                            <>
                              <h5>{goalInfo?.scorerName}</h5>
                              {goalInfo?.assists &&
                              goalInfo.assists.length > 0 ? (
                                <p>
                                  {goalInfo?.assists.map((assist, i) => (
                                    <span key={i}>
                                      {i === 0 ? assist : `, ${assist}`}
                                    </span>
                                  ))}
                                </p>
                              ) : (
                                <p>Sans aide</p>
                              )}
                            </>
                          ) : (
                            <>
                              <h5>{TypeDesc(play.typeDescKey)}</h5>
                              {playInfo && <p>{playInfo}</p>}
                            </>
                          )}
                        </div>
                        <Svg name="right-arrow" size="sm" />
                      </div>
                      <div className="accordion__content">
                        {isGoal && video ? (
                          <div className="video-container">
                            <GoalClip
                              fr={video?.selfUrl}
                              title={video.title}
                              description={video.fields.longDescription}
                              date={formatPublicationDate(video.contentDate)}
                            >
                              <div className="video">
                                <div className="media">
                                  <img
                                    src={`${video.thumbnail.thumbnailUrl.replace(
                                      /t_ratio1_1-size20/,
                                      "t_ratio16_9-size40/f_auto/"
                                    )}`}
                                    alt={`${goalInfo?.scorerName}`}
                                  />
                                  <div className="container">
                                    <Svg name="play" size="sm"></Svg>
                                  </div>
                                </div>
                              </div>
                            </GoalClip>
                          </div>
                        ) : (
                          <IceRink
                            game={game}
                            teamColors={teamColors}
                            plays={play}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="150"
                              height="150"
                              className="svg-container"
                              viewBox="0 0 24 24"
                              style={{
                                fill: `${
                                  isEventOwnerHome ? teamColors?.home : "#fff"
                                }`,
                                stroke: `${
                                  play.typeDescKey === "goal"
                                    ? isEventOwnerHome
                                      ? teamColors.home
                                      : teamColors.away
                                    : isEventOwnerHome
                                    ? "#fff"
                                    : teamColors?.away
                                }`,
                                strokeWidth: 1,
                                color: `${
                                  isEventOwnerHome
                                    ? "#fff"
                                    : `${teamColors.away}`
                                }`,
                              }}
                              x={
                                play.details &&
                                transformCoordinates(
                                  play.details.xCoord,
                                  play.details.yCoord
                                ).x
                              }
                              y={
                                play.details &&
                                transformCoordinates(
                                  play.details.xCoord,
                                  play.details.yCoord
                                ).y
                              }
                            >
                              <circle cx="12" cy="12" r="11"></circle>
                              <Svg
                                isStroke={
                                  play.typeDescKey === "goal" ? true : false
                                }
                                name={`${SvgName(play.typeDescKey)}`}
                                size="xxs"
                              ></Svg>
                            </svg>
                          </IceRink>
                        )}
                      </div>
                    </div>
                  </Accordion>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
