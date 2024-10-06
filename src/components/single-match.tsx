import { Link } from "react-router-dom";
import { INTMainGameInfos } from "../interfaces/main-match";
import { INTMoreGameInfos } from "../interfaces/more-detail-match";
import { formatDate } from "../scripts/utils/formatDate";
import { formatSituation } from "../scripts/utils/formatSituation";
import { formatGameTime } from "../scripts/utils/formatGameTime";

interface LeaderStatsProps {
  gameInfos: INTMainGameInfos | null;
  gameMoreInfos: INTMoreGameInfos | null;
}

const SingleMatch: React.FC<LeaderStatsProps> = ({
  gameInfos,
  gameMoreInfos,
}) => {
  const renderTeamInfo = (game: INTMainGameInfos | null, isAway: boolean) => {
    const team = isAway ? game?.awayTeam : game?.homeTeam;
    return (
      <div className={`team ${isAway ? "away" : "home"}`}>
        <div className="media">
          <Link
            to={`/equipes/${team?.name.default
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            <img
              src={`https://assets.nhle.com/logos/nhl/svg/${team.abbrev}_dark.svg`}
              alt={`${team?.name.default} logo`}
            />
          </Link>
        </div>
        <div className="team-infos">
          <div className="team-name">
            <h2>{team?.name.default}</h2>
            <p>{team?.placeNameWithPreposition.fr}</p>
          </div>
          {game?.gameState === "LIVE" ||
          game?.gameState === "FINAL" ||
          game?.gameState === "OFF" ? (
            <p>
              T: {team?.sog}{" "}
              {game.situation?.[isAway ? "awayTeam" : "homeTeam"]?.abbrev ===
                team?.abbrev &&
                game.situation?.[isAway ? "awayTeam" : "homeTeam"]
                  ?.situationDescriptions &&
                `| ${formatSituation(
                  game.situation[isAway ? "awayTeam" : "homeTeam"]
                    .situationDescriptions
                )} ${game.situation.timeRemaining}`}
            </p>
          ) : (
            <p>{team?.record}</p>
          )}
        </div>
        <div className="score-games">
          {(game?.gameState === "LIVE" ||
            game?.gameState === "FINAL" ||
            game?.gameState === "OFF") && (
            <p
              className={`score ${
                game.awayTeam.score > game.homeTeam.score
                  ? "away-win"
                  : "home-win"
              }`}
            >
              {team?.score}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderGameSituation = (game: INTMainGameInfos | null) => {
    if (game?.gameState === "LIVE") {
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
        {game?.gameState === "FINAL" || game?.gameState === "OFF"
          ? `Final${
              game.periodDescriptor.periodType === "OT"
                ? "/Pr."
                : game.periodDescriptor.periodType === "SO"
                ? "/TB"
                : ""
            }`
          : `${formatGameTime(
              game?.startTimeUTC ?? "",
              game?.easternUTCOffset ?? ""
            )} HAE`}
      </p>
    );
  };

  return (
    <section className="match hero">
      <div className="wrapper">
        <h1>Détails du match</h1>
        <div className="team-versus-container">
          <div className="match-infos">
            <p>{formatDate(gameInfos?.gameDate ?? "")}</p>
            {gameInfos?.ticketsLink !== undefined ||
            gameInfos?.ticketsLinkFr !== undefined ? (
              <a href={gameInfos.ticketsLinkFr ?? gameInfos.ticketsLink}>
                Billets
              </a>
            ) : (
              ""
            )}
          </div>
          <div className="team-matchup window-effect">
            {gameInfos?.specialEventLogo && (
              <img
                className="special"
                src={gameInfos.specialEventLogo}
                alt={gameInfos.specialEvent?.default}
              />
            )}
            {renderTeamInfo(gameInfos, true)}
            {renderGameSituation(gameInfos)}
            {renderTeamInfo(gameInfos, false)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleMatch;
