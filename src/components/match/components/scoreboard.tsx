import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTMoreGameInfos } from "../../../interfaces/more-detail-match";
import { TeamsLogoLinks } from "./teamLogoLink";

export const renderScoreboard = (
  other: INTMoreGameInfos,
  game: INTMainGameInfos
) => {
  let filteredPeriods = other.linescore?.byPeriod;

  if (
    game.gameState === "LIVE" ||
    game.gameState === "OFF" ||
    game.gameState === "FINAL" ||
    game.gameState === "CRIT"
  ) {
    filteredPeriods = other.linescore.byPeriod.filter((period) => {
      const shootoutExists = other.linescore.byPeriod.some(
        (p) => p.periodDescriptor.periodType === "SO"
      );
      return !(period.periodDescriptor.periodType === "OT" && shootoutExists);
    });
  }

  return (
    <>
      {(game.gameState === "LIVE" ||
        game.gameState === "OFF" ||
        game.gameState === "FINAL" ||
        game.gameState === "CRIT") && (
        <div className="scoreboard-card scores window-effect">
          <div className="glare-effect"></div>
          <h4>Pointage</h4>
          <div className="scoreboard-table-container">
            <table>
              <thead>
                <tr>
                  <th key="team-header">Équipe</th>
                  {filteredPeriods.map((period, index) => (
                    <th
                      key={`header-${period.periodDescriptor.number}-${period.periodDescriptor.periodType}-${index}`}
                    >
                      {period.periodDescriptor.periodType === "SO"
                        ? "TB"
                        : period.periodDescriptor.number === 1
                        ? "1re"
                        : period.periodDescriptor.number === 2 ||
                          period.periodDescriptor.number === 3
                        ? `${period.periodDescriptor.number}e`
                        : period.periodDescriptor.periodType === "OT"
                        ? "Pr."
                        : ""}
                    </th>
                  ))}
                  <th key="total-header">T</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td key="away-team-name" scope="row">
                    <TeamsLogoLinks team={game.awayTeam} />
                    {game.awayTeam.abbrev}
                  </td>
                  {filteredPeriods.map((period, index) => (
                    <td
                      key={`away-${period.periodDescriptor.number}-${period.periodDescriptor.periodType}-${index}`}
                    >
                      {period.periodDescriptor.periodType === "SO"
                        ? `${period.away} (${other.linescore.shootout.awayConversions}/${other.linescore.shootout.awayAttempts})`
                        : period.away}
                    </td>
                  ))}
                  <td key="away-total">{other.linescore.totals.away}</td>
                </tr>
                <tr>
                  <td key="home-team-name" scope="row">
                    <TeamsLogoLinks team={game.homeTeam} />
                    {game.homeTeam.abbrev}
                  </td>
                  {filteredPeriods.map((period, index) => (
                    <td
                      key={`home-${period.periodDescriptor.number}-${period.periodDescriptor.periodType}-${index}`}
                    >
                      {period.periodDescriptor.periodType === "SO"
                        ? `${period.home} (${other.linescore.shootout.homeConversions}/${other.linescore.shootout.homeAttempts})`
                        : period.home}
                    </td>
                  ))}
                  <td key="home-total">{other.linescore.totals.home}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
