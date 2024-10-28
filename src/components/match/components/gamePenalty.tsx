import { INTMainGameInfos } from "../../../interfaces/main-match";
import { formatPenalty } from "./formatPlay";
import { TeamsLogoLinks } from "./teamLogoLink";

export const renderPenalties = (game: INTMainGameInfos | null) => {
  const noPenalty =
    game?.summary.penalties.filter((pen) => pen.penalties.length > 0) || [];
  return (
    <>
      <div className="penalties">
        <h2>Pénalités</h2>
        {noPenalty.length > 0 ? (
          <>
            {game?.summary?.penalties
              ?.filter((penalties) => penalties.penalties.length > 0)
              .map((penaltie) => (
                <div
                  key={penaltie.periodDescriptor.number}
                  className="penalties-container"
                >
                  {penaltie.penalties.length !== 0 &&
                    penaltie.periodDescriptor.periodType === "OT" && (
                      <h3>Prolongation</h3>
                    )}
                  {penaltie.penalties.length !== 0 &&
                    penaltie.periodDescriptor.periodType === "SO" && (
                      <h3>Tirs de barrage</h3>
                    )}
                  {penaltie.penalties.length !== 0 &&
                    penaltie.periodDescriptor.number <= 3 && (
                      <h3>{`${penaltie.periodDescriptor.number}${
                        penaltie.periodDescriptor.number > 1 ? "e" : "re"
                      } Période`}</h3>
                    )}
                  <div className="penalty-table window-effect">
                    <table>
                      <thead>
                        <tr>
                          <th scope="row">Équipes</th>
                          <th scope="row">Temps</th>
                          <th scope="row" className="no-mobile">Durée</th>
                          <th>Pénalité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {penaltie.penalties.map((pen) => (
                          <tr key={`${pen.timeInPeriod}-${pen.committedByPlayer}-${pen.descKey}`}>
                            <td scope="row">
                              <TeamsLogoLinks
                                team={
                                  pen.teamAbbrev.default ===
                                  game.homeTeam.abbrev
                                    ? game.homeTeam
                                    : game.awayTeam
                                }
                              ></TeamsLogoLinks>
                            </td>
                            <td scope="row">{pen.timeInPeriod}</td>
                            <td scope="row" className="no-mobile">
                              {pen.descKey === "game-misconduct"
                                ? 60
                                : pen.duration}{" "}
                              min
                            </td>
                            <td>
                              {pen.committedByPlayer}{" "}
                              {formatPenalty(pen.descKey)} {pen.drawnBy ?? ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </>
        ) : (
          <p>Aucune pénalité.</p>
        )}
      </div>
    </>
  );
};
