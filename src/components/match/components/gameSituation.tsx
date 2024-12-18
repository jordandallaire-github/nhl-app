import { INTMainGameInfos } from "../../../interfaces/main-match";
import { formatDateShortMonth } from "../../../scripts/utils/formatDate";
import { formatGameTime } from "../../../scripts/utils/formatGameTime";

export const renderGameSituation = (game: INTMainGameInfos | null) => {
  if (game?.gameState === "LIVE" || game?.gameState === "CRIT") {
    return (
      <>
        <p className="period-status">
          {game.situation?.homeTeam?.strength &&
            game.situation?.awayTeam?.strength && (
              <>
                {game.situation.homeTeam.strength >
                game.situation.awayTeam.strength
                  ? `${game.situation.homeTeam.strength} contre ${game.situation.awayTeam.strength}`
                  : `${game.situation.awayTeam.strength} contre ${game.situation.homeTeam.strength}`}
              </>
            )}
          <strong className="period">
            {`${
              game.periodDescriptor.number === 1
                ? game.periodDescriptor.number + "re"
                : game.periodDescriptor.number + "e"
            }`}{" "}
          </strong>
          {game.clock.inIntermission ? "ENT" : ""} {game.clock.timeRemaining}
        </p>
      </>
    );
  }
  return (
    <>
      <div className="result">
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
        <p>{formatDateShortMonth(game?.gameDate ?? "")}</p>
      </div>
    </>
  );
};
