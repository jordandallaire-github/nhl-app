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
              ? `radial-gradient(circle at 56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at -100% 12px, ${teamColors?.away}, rgba(0, 0, 0, 0) 90%)`
              : `radial-gradient(circle at -56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at 160% 1px, ${teamColors?.home}, rgba(0, 0, 0, 0) 90%)`
          }`,
        }}
      ></div>
      <div className="media">
        <Link
          to={`/equipes/${team?.commonName.default
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          <img
            src={`https://assets.nhle.com/logos/nhl/svg/${team?.abbrev}_dark.svg`}
            alt={`${team?.commonName?.default} logo`}
            loading="lazy"
          />
        </Link>
      </div>
      <div className="team-infos">
        <div className="team-name">
          <p className="no-mobile"><strong>{team?.commonName.fr === "Club de hockey de l'Utah" ? "Club de hockey" : team?.commonName.fr ? team?.commonName.fr : team?.commonName.default}</strong></p>
          <p className="no-mobile">{team?.placeNameWithPreposition.fr}</p>
          <p className="mobile"><strong>{team?.abbrev}</strong></p>
        </div>
        {game?.gameState === "LIVE" ||
        game?.gameState === "FINAL" ||
        game?.gameState === "OFF" || game?.gameState === "CRIT" ? (
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
          game?.gameState === "OFF" || game?.gameState === "CRIT") && (
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
