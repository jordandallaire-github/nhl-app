import { Link } from "react-router-dom";
import { formatSituation } from "../../../scripts/utils/formatSituation";
import { INTMainGameInfos } from "../../../interfaces/main-match";

interface Colors {
  home: string | null;
  away: string | null;
}

export const renderTeamInfo = (
  game: INTMainGameInfos | null,
  isAway: boolean,
  teamColors: Colors
) => {
  const team = isAway ? game?.awayTeam : game?.homeTeam;
  return (
    <div className={`team ${isAway ? "away" : "home"}`}>
      <div
        className="team-color"
        style={{
          backgroundImage: `${
            isAway
              ? `radial-gradient(circle at 56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at -100% 12px, ${teamColors?.away}, rgba(0, 0, 0, 0) 100%)`
              : `radial-gradient(circle at -56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at 160% 1px, ${teamColors?.home}, rgba(0, 0, 0, 0) 100%)`
          }`,
        }}
      ></div>
      <div className="media">
        <Link
          to={`/equipes/${team?.name.default
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          <img
            src={`https://assets.nhle.com/logos/nhl/svg/${team?.abbrev}_dark.svg`}
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
