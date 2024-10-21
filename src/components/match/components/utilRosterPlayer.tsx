import { INTBoxscore } from "../../../interfaces/boxscores";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { FormatPosition } from "../../../scripts/utils/formatPosition";

export const playerStats = (
  game: INTMainGameInfos,
  isForward: boolean,
  boxscore: INTBoxscore | null,
  home: boolean
) => {
  const isHome = home ? "homeTeam" : ("awayTeam" as const);
  return (
    <>
      <div className="roster-table-container window-effect">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th scope="row">{isForward ? "Attaquants" : "Défenseurs"}</th>
              <th>POS</th>
              {!boxscore && <th>PJ</th>}
              <th>B</th>
              <th>A</th>
              <th>PTS</th>
              <th>+/-</th>
              <th>PUN</th>
              <th>BAN</th>
              {boxscore && <th>PRÉS</th>}
              {!boxscore && <th>BG</th>}
              {boxscore && <th>TG</th>}
              <th>T</th>
              <th>TB</th>
              <th>MÉ</th>
              {!boxscore && <th>TG/PJ</th>}
              {boxscore && <th>REV</th>}
              {boxscore && <th>REV P.</th>}
              {isForward && <th>%MAJ</th>}
            </tr>
          </thead>
          <tbody>
            {boxscore ? (
              <>
                {isForward ? (
                  <>
                    {boxscore.playerByGameStats[isHome]?.forwards.map(
                      (forward) => (
                        <tr key={forward.playerId}>
                          <td>{forward.sweaterNumber}</td>
                          <td scope="row">{forward.name.default}</td>
                          <td>{FormatPosition(forward.position)}</td>
                          <td>{forward.goals ?? "--"}</td>
                          <td>{forward.assists ?? "--"}</td>
                          <td>{forward.points ?? "--"}</td>
                          <td>{forward.plusMinus ?? "--"}</td>
                          <td>{forward.pim ?? "--"}</td>
                          <td>{forward.powerPlayGoals ?? "--"}</td>
                          <td>{forward.shifts ?? "--"}</td>
                          <td>{forward.toi ?? "--"}</td>
                          <td>{forward.sog}</td>
                          <td>{forward.blockedShots ?? "--"}</td>
                          <td>{forward.hits ?? "--"}</td>
                          <td>{forward.giveaways ?? "--"}</td>
                          <td>{forward.takeaways ?? "--"}</td>
                          <td>
                            {typeof forward.faceoffWinningPctg === "number"
                              ? (forward.faceoffWinningPctg * 100).toFixed(2)
                              : "--"}
                          </td>
                        </tr>
                      )
                    )}
                  </>
                ) : (
                  <>
                    {boxscore.playerByGameStats[isHome]?.defense.map(
                      (defensemen) => (
                        <tr key={defensemen.playerId}>
                          <td>{defensemen.sweaterNumber}</td>
                          <td scope="row">{defensemen.name.default}</td>
                          <td>{FormatPosition(defensemen.position)}</td>
                          <td>{defensemen.goals ?? "--"}</td>
                          <td>{defensemen.assists ?? "--"}</td>
                          <td>{defensemen.points ?? "--"}</td>
                          <td>{defensemen.plusMinus ?? "--"}</td>
                          <td>{defensemen.pim ?? "--"}</td>
                          <td>{defensemen.powerPlayGoals ?? "--"}</td>
                          <td>{defensemen.shifts ?? "--"}</td>
                          <td>{defensemen.toi ?? "--"}</td>
                          <td>{defensemen.sog}</td>
                          <td>{defensemen.blockedShots ?? "--"}</td>
                          <td>{defensemen.hits ?? "--"}</td>
                          <td>{defensemen.giveaways ?? "--"}</td>
                          <td>{defensemen.takeaways ?? "--"}</td>
                        </tr>
                      )
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {isForward ? (
                  <>
                    {game.matchup?.skaterSeasonStats
                      .filter(
                        (away) =>
                          away.teamId ===
                            (home ? game.homeTeam.id : game.awayTeam.id) &&
                          (away.position === "C" ||
                            away.position === "L" ||
                            away.position === "R")
                      )
                      .map((forward) => (
                        <tr key={forward.playerId}>
                          <td>{forward.sweaterNumber}</td>
                          <td scope="row">{forward.name.default}</td>
                          <td>{FormatPosition(forward.position)}</td>
                          <td>{forward.gamesPlayed ?? "--"}</td>
                          <td>{forward.goals ?? "--"}</td>
                          <td>{forward.assists ?? "--"}</td>
                          <td>{forward.points ?? "--"}</td>
                          <td>{forward.plusMinus ?? "--"}</td>
                          <td>{forward.pim ?? "--"}</td>
                          <td>{forward.powerPlayGoals ?? "--"}</td>
                          <td>{forward.gameWinningGoals ?? "--"}</td>
                          <td>{forward.shots ?? "--"}</td>
                          <td>{forward.blockedShots ?? "--"}</td>
                          <td>{forward.hits ?? "--"}</td>
                          <td>{forward.avgTimeOnIce ?? "--"}</td>
                          <td>
                            {typeof forward.faceoffWinningPctg === "number"
                              ? (forward.faceoffWinningPctg * 100).toFixed(2)
                              : "--"}
                          </td>
                        </tr>
                      ))}
                  </>
                ) : (
                  <>
                    {game.matchup?.skaterSeasonStats
                      .filter(
                        (away) =>
                          away.teamId ===
                            (home ? game.homeTeam.id : game.awayTeam.id) &&
                          away.position === "D"
                      )
                      .map((defensemen) => (
                        <tr key={defensemen.playerId}>
                          <td>{defensemen.sweaterNumber}</td>
                          <td scope="row">{defensemen.name.default}</td>
                          <td>{defensemen.gamesPlayed ?? "--"}</td>
                          <td>{defensemen.goals ?? "--"}</td>
                          <td>{defensemen.assists ?? "--"}</td>
                          <td>{defensemen.points ?? "--"}</td>
                          <td>{defensemen.plusMinus ?? "--"}</td>
                          <td>{defensemen.pim ?? "--"}</td>
                          <td>{defensemen.powerPlayGoals ?? "--"}</td>
                          <td>{defensemen.gameWinningGoals ?? "--"}</td>
                          <td>{defensemen.shots ?? "--"}</td>
                          <td>{defensemen.blockedShots ?? "--"}</td>
                          <td>{defensemen.hits ?? "--"}</td>
                          <td>{defensemen.avgTimeOnIce ?? "--"}</td>
                        </tr>
                      ))}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
export const goalieStats = (
  game: INTMainGameInfos,
  boxscore: INTBoxscore | null,
  home: boolean
) => {
  const isHome = home ? "homeTeam" : ("awayTeam" as const);

  return (
    <div className="roster-table-container window-effect">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th scope="row">Gardiens</th>
            {!boxscore && <th>PJ</th>}
            {!boxscore && <th>V</th>}
            {!boxscore && <th>D</th>}
            {!boxscore && <th>DP</th>}
            <th>TC</th>
            <th>Arr.</th>
            <th>%Arr.</th>
            <th>BC</th>
            {boxscore && <th>BA EN</th>}
            {boxscore && <th>BA AN</th>}
            {boxscore && <th>BA IN</th>}
            {!boxscore && <th>Moy.</th>}
            <th>TG</th>
          </tr>
        </thead>
        <tbody>
          {boxscore ? (
            <>
              {boxscore.playerByGameStats[isHome].goalies.map((goalie) => (
                <tr key={goalie.playerId}>
                  <td>{goalie.sweaterNumber}</td>
                  <td scope="row">{goalie.name.default}</td>
                  <td>{goalie.shotsAgainst ?? "--"}</td>
                  <td>{goalie.saves ?? "--"}</td>
                  <td>
                    {typeof goalie.savePctg === "number"
                      ? (goalie.savePctg * 10).toFixed(2)
                      : "--"}
                  </td>
                  <td>{goalie.goalsAgainst ?? "--"}</td>
                  <td>{goalie.evenStrengthGoalsAgainst}</td>
                  <td>{goalie.powerPlayGoalsAgainst}</td>
                  <td>{goalie.shorthandedGoalsAgainst}</td>
                  <td>{goalie.toi}</td>
                </tr>
              ))}
            </>
          ) : (
            <>
              {game.matchup?.goalieSeasonStats
                .filter(
                  (away) =>
                    away.teamId === (home ? game.homeTeam.id : game.awayTeam.id)
                )
                .map((goalie) => (
                  <tr key={goalie.playerId}>
                    <td>{goalie.sweaterNumber}</td>
                    <td scope="row">{goalie.name.default}</td>
                    <td>{goalie.gamesPlayed ?? "--"}</td>
                    <td>{goalie.wins ?? "--"}</td>
                    <td>{goalie.losses ?? "--"}</td>
                    <td>{goalie.otLosses ?? "--"}</td>
                    <td>{goalie.shotsAgainst ?? "--"}</td>
                    <td>{goalie.saves ?? "--"}</td>
                    <td>
                      {typeof goalie.savePctg === "number"
                        ? (goalie.savePctg * 10).toFixed(2)
                        : "--"}
                    </td>
                    <td>{goalie.goalsAgainst ?? "--"}</td>
                    <td>{goalie.goalsAgainstAvg?.toFixed(2) ?? "--"}</td>
                    <td>{goalie.toi ?? "--"}</td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};
