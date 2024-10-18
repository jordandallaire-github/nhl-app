import { INTMainGameInfos } from "../../../interfaces/main-match";
import { TeamsLogoLinks } from "./teamLogoLink";

export const renderPenalties = (game: INTMainGameInfos | null) => {
  const formatPenalty = (penalty: string) => {
    switch (penalty) {
      case "unsportsmanlike-conduct":
        return "conduite antisportive aux dépens de";
      case "fighting":
        return "s'être battu aux dépens de";
      case "roughing":
        return "rudesse aux dépens de";
      case "tripping":
        return "avoir fait trébucher aux dépens de";
      case "interference":
        return "obstruction aux dépens de";
      case "delaying-game-puck-over-glass":
        return "avoir retardé le match - rondelle par-dessus la baie vitrée";
      case "slashing":
        return "coup de bâton aux dépens de";
      case "interference-goalkeeper":
        return "obstruction du gardien aux dépens de";
      case "delaying-game-unsuccessful-challenge":
        return "Avoir retardé le match - contestation infructueuse";
      case "holding":
        return "avoir retenu aux dépens de";
      case "cross-checking":
        return "double-échec aux dépens de";
      case "hooking":
        return "avoir accroché aux dépens de";
      case "high-sticking":
        return "bâton élevé aux dépens de";
      case "too-many-men-on-the-ice":
        return "Trop de joueurs sur la glace";
      case "holding-the-stick":
        return "avoir retenu le bâton aux dépens de";
      case "roughing-removing-opponents-helmet":
        return "rudesse - retirer le casque d'un adversaire aux dépens de";
      case "instigator":
        return "instigateur aux dépens de";
      case "instigator-misconduct":
        return "instigateur - inconduite";
      case "game-misconduct":
        return "inconduite de partie";
      case "elbowing":
        return "avoir donné du coude aux dépens de";
      case "misconduct":
        return "inconduite";
      default:
        return penalty;
    }
  };
  const noPenalty =
    game?.summary.penalties.filter((pen) => pen.penalties.length > 0) || [];
  return (
    <>
      <div className="penalties">
        <h3>Pénalités</h3>
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
                      <h4>Prolongation</h4>
                    )}
                  {penaltie.penalties.length !== 0 &&
                    penaltie.periodDescriptor.periodType === "SO" && (
                      <h4>Tirs de barrage</h4>
                    )}
                  {penaltie.penalties.length !== 0 &&
                    penaltie.periodDescriptor.number <= 3 && (
                      <h4>{`${penaltie.periodDescriptor.number}${
                        penaltie.periodDescriptor.number > 1 ? "e" : "re"
                      } Période`}</h4>
                    )}
                  <div className="penalty-table window-effect">
                    <table>
                      <thead>
                        <tr>
                          <th scope="row">Équipes</th>
                          <th scope="row">Temps</th>
                          <th scope="row">Durée</th>
                          <th>Pénalité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {penaltie.penalties.map((pen) => (
                          <tr key={pen.timeInPeriod}>
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
                            <td scope="row">
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
