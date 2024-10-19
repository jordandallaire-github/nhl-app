import { INTMoreGameInfos } from "../../../interfaces/more-detail-match";
import { TeamMatchupSetup } from "./teamLogoSetup";
import { INTMainGameInfos } from "../../../interfaces/main-match";

interface Colors {
  home: string | null;
  away: string | null;
}

export const renderShotOnNet = (
  game: INTMainGameInfos,
  other: INTMoreGameInfos | null,
  teamColors: Colors
) => {
  const calculateFlexValues = (
    awayValue: number,
    homeValue: number,
    scaleFactor: number,
    lowerIsBetter: boolean = false
  ) => {
    let awayFlex, homeFlex;

    if (lowerIsBetter) {
      if (awayValue === 0 && homeValue === 0) {
        awayFlex = homeFlex = 1;
      } else if (awayValue === 0) {
        awayFlex = 1;
        homeFlex = 0;
      } else if (homeValue === 0) {
        awayFlex = 0;
        homeFlex = 1;
      } else {
        awayFlex = Math.pow(homeValue, scaleFactor);
        homeFlex = Math.pow(awayValue, scaleFactor);
      }
    } else {
      if (awayValue === 0 && homeValue === 0) {
        awayFlex = homeFlex = 1;
      }
      awayFlex = Math.pow(awayValue, scaleFactor);
      homeFlex = Math.pow(homeValue, scaleFactor);
    }

    const totalFlex = awayFlex + homeFlex;
    return {
      normalizedAwayFlex: awayFlex / totalFlex,
      normalizedHomeFlex: homeFlex / totalFlex,
    };
  };

  return (
    <>
      {(game.gameState === "LIVE" ||
        game.gameState === "OFF" ||
        game.gameState === "FINAL") && (
        <div className="scoreboard-card window-effect">
          <div className="glare-effect"></div>
          <TeamMatchupSetup title="Tirs" game={game}></TeamMatchupSetup>

          {other?.shotsByPeriod
            .filter(
              (isNotShoutout) =>
                isNotShoutout.periodDescriptor.periodType !== "SO"
            )
            .map((shot) => {
              const { normalizedAwayFlex, normalizedHomeFlex } =
                calculateFlexValues(shot.away, shot.home, 1);

              const awayFlex = `${normalizedAwayFlex * 100}%`;
              const homeFlex = `${normalizedHomeFlex * 100}%`;
              const awayDisplay = normalizedAwayFlex === 0 ? "none" : "block";
              const homeDisplay = normalizedHomeFlex === 0 ? "none" : "block";

              return (
                <div
                  className="stat matchup"
                  key={shot.periodDescriptor.number}
                >
                  <div className="pcStat">
                    <p>
                      <strong>{shot.away}</strong>
                    </p>
                    <p>{`${
                      shot.periodDescriptor.number === 1
                        ? shot.periodDescriptor.number + "re Période"
                        : shot.periodDescriptor.number === 2 ||
                          shot.periodDescriptor.number === 3
                        ? shot.periodDescriptor.number + "e Période"
                        : shot.periodDescriptor.periodType === "OT"
                        ? "Prolongation"
                        : ""
                    }`}</p>
                    <p>
                      <strong>{shot.home}</strong>
                    </p>
                  </div>
                  <div className="indication-color">
                    <div
                      className="team"
                      style={{ flex: awayFlex, display: awayDisplay }}
                    >
                      <div
                        className="color away"
                        style={{ borderTop: `8px solid ${teamColors.away}` }}
                      />
                    </div>
                    <div
                      className="team"
                      style={{ flex: homeFlex, display: homeDisplay }}
                    >
                      <div
                        className="color home"
                        style={{ borderBottom: `8px solid ${teamColors.home}` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

          {other?.teamGameStats
            .filter((shotsTotal) => shotsTotal.category === "sog")
            .map((shot) => {
              const { normalizedAwayFlex, normalizedHomeFlex } =
                calculateFlexValues(
                  shot.awayValue as number,
                  shot.homeValue as number,
                  2
                );

              const awayFlex = `${normalizedAwayFlex * 100}%`;
              const homeFlex = `${normalizedHomeFlex * 100}%`;
              const awayDisplay = normalizedAwayFlex === 0 ? "none" : "block";
              const homeDisplay = normalizedHomeFlex === 0 ? "none" : "block";

              return (
                <div className="stat matchup" key={shot.category}>
                  <div className="pcStat">
                    <p>
                      <strong>{shot.awayValue}</strong>
                    </p>
                    <p>Nombres de tirs</p>
                    <p>
                      <strong>{shot.homeValue}</strong>
                    </p>
                  </div>
                  <div className="indication-color">
                    <div
                      className="team"
                      style={{ flex: awayFlex, display: awayDisplay }}
                    >
                      <div
                        className="color away"
                        style={{ borderTop: `8px solid ${teamColors.away}` }}
                      />
                    </div>
                    <div
                      className="team"
                      style={{ flex: homeFlex, display: homeDisplay }}
                    >
                      <div
                        className="color home"
                        style={{ borderBottom: `8px solid ${teamColors.home}` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};
