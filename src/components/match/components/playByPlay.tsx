import { Link } from "react-router-dom";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTPlayByPlay } from "../../../interfaces/playByPlay";
import { Svg } from "../../../scripts/utils/Icons";
import Accordion from "../../utils/accordion";
import { Play, TypeDesc } from "./formatPlay";
import IceRink from "./iceRink";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";

interface Colors {
  home: string | null;
  away: string | null;
}

const formatPlayerName = (
  player: PlayerDetailsType,
  total: string | undefined
) => {
  return `${player.firstName.default} ${player.lastName.default} #${player.sweaterNumber} (${total})`;
};

const findPlayer = (
  playerId: string | undefined,
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
      ? formatPlayerName(players.scorer, play.details?.scoringPlayerTotal)
      : undefined,
    assists: [
      players.assist1
        ? formatPlayerName(players.assist1, play.details?.assist1PlayerTotal)
        : undefined,
      players.assist2
        ? formatPlayerName(players.assist2, play.details?.assist2PlayerTotal)
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
  awayRoster: PlayerDetailsType[] | null
) => {
  return (
    <div className="playByPlay">
      <h3>Jeux</h3>
      <div className="plays-container">
        {plays.plays.map((play, index) => {
          const isGoal = play.typeDescKey === "goal";
          const isEventOwnerHome =
            play.details?.eventOwnerTeamId === game.homeTeam.id;
          const team = isEventOwnerHome ? game.homeTeam : game.awayTeam;

          const goalInfo = isGoal
            ? getGoalPlayersInfo(play, homeRoster, awayRoster)
            : null;

          const isSpecialPlay = [
            "period-start",
            "period-end",
            "game-end",
            "stoppage",
          ].includes(play.typeDescKey);

          return (
            <div key={`${play.timeInPeriod}-${index}`} className="play">
              {isSpecialPlay ? (
                Play(play.typeDescKey, play.details?.reason ?? null)
              ) : (
                <Accordion notClosing={false}>
                  <div className="accordion__container">
                    <div className="accordion__header js-header window-effect">
                      <div className="time">
                        {plays.periodDescriptor.number !== 5 && (
                          <p>{play.timeRemaining}</p>
                        )}
                        {play.periodDescriptor.periodType === "OT" && (
                          <p>Pr.</p>
                        )}
                        {play.periodDescriptor.periodType === "SO" && <p>TB</p>}
                        {plays.periodDescriptor.number <= 3 && (
                          <p>
                            {`${plays.periodDescriptor.number}${
                              plays.periodDescriptor.number > 1 ? "e" : "re"
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
                            <p>
                              {play.details?.reason}
                              {play.details?.shotType}
                            </p>
                          </>
                        )}
                      </div>
                      <Svg name="right-arrow" size="sm" />
                    </div>
                    <div className="accordion__content">
                      <IceRink game={game} teamColors={teamColors} plays={play}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="150"
                          height="150"
                          viewBox="0 0 24 24"
                          style={{
                            fill: `${
                              isEventOwnerHome ? teamColors?.home : "#fff"
                            }`,
                            stroke: `${
                              isEventOwnerHome ? "#fff" : teamColors?.away
                            }`,
                            strokeWidth: 1,
                            color: `${
                              isEventOwnerHome ? "white" : `${teamColors.away}`
                            }`,
                          }}
                          x={play.details?.xCoord}
                          y={play.details?.yCoord}
                        >
                          <circle cx="12" cy="12" r="11"></circle>
                          <Svg
                            style={{}}
                            name={`${play.typeDescKey}`}
                            size="xs"
                          ></Svg>
                        </svg>
                      </IceRink>
                    </div>
                  </div>
                </Accordion>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
