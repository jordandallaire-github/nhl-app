import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTMoreGameInfos } from "../../../interfaces/more-detail-match";
import { TeamsLogoLinks } from "./teamLogoLink";

export const renderScoreboard = (
  other: INTMoreGameInfos,
  game: INTMainGameInfos
) => {
  return (
    <>
      {(game.gameState === "LIVE" ||
        game.gameState === "OFF" ||
        game.gameState === "FINAL") && (
        <div className="scoreboard-card window-effect">
          <h4>Pointage</h4>
          <div className="scoreboard-table-container">
            <table>
              <thead>
                <tr>
                  <th>Équipe</th>
                  <th>1re</th>
                  <th>2e</th>
                  <th>3e</th>
                  {game.periodDescriptor.periodType === "OT" ? (
                    <th>Pr.</th>
                  ) : game.periodDescriptor.periodType === "SO" ? (
                    <th>TB</th>
                  ) : (
                    ""
                  )}
                  <th>T</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">
                    <TeamsLogoLinks team={game.awayTeam}></TeamsLogoLinks>
                    {game.awayTeam.abbrev}
                  </td>
                  {other.linescore.byPeriod.map((period) => {
                    const shootoutExists = other.linescore.byPeriod.some(
                      (p) => p.periodDescriptor.periodType === "SO"
                    );
                    return (
                      <>
                        {period.periodDescriptor.periodType === "OT" &&
                        shootoutExists ? null : period.periodDescriptor
                            .periodType === "SO" ? (
                          <td key={period.periodDescriptor.number}>
                            {period.away}
                            {` (${
                              other.linescore.shootout.awayConversions +
                              "/" +
                              other.linescore.shootout.awayAttempts
                            })`}
                          </td>
                        ) : (
                          <td key={period.periodDescriptor.number}>
                            {period.away}
                          </td>
                        )}
                      </>
                    );
                  })}
                  <td>{other.linescore.totals.away}</td>
                </tr>
                <tr>
                  <td scope="row">
                    <TeamsLogoLinks team={game.homeTeam}></TeamsLogoLinks>
                    {game.homeTeam.abbrev}
                  </td>
                  {other.linescore.byPeriod.map((period) => {
                    const shootoutExists = other.linescore.byPeriod.some(
                      (p) => p.periodDescriptor.periodType === "SO"
                    );
                    return (
                      <>
                        {period.periodDescriptor.periodType === "OT" &&
                        shootoutExists ? null : period.periodDescriptor
                            .periodType === "SO" ? (
                          <td key={period.periodDescriptor.number}>
                            {period.home}
                            {` (${
                              other.linescore.shootout.homeConversions +
                              "/" +
                              other.linescore.shootout.homeAttempts
                            })`}
                          </td>
                        ) : (
                          <td key={period.periodDescriptor.number}>
                            {period.home}
                          </td>
                        )}
                      </>
                    );
                  })}
                  <td>{other.linescore.totals.home}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
