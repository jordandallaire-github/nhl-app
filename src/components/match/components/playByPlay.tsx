import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTPlayByPlay } from "../../../interfaces/playByPlay";
import { Svg } from "../../../scripts/utils/Icons";
import Accordion from "../../utils/accordion";
import { Play } from "./formatPlay";
import IceRink from "./iceRink";

interface Colors {
  home: string | null;
  away: string | null;
}

export const renderPlayByPlay = (
  game: INTMainGameInfos,
  teamColors: Colors,
  plays: INTPlayByPlay
) => {
  return (
    <>
      <div className="playByPlay">
        <h3>Jeux</h3>
{/*         <div className="plays-container">
          {plays.plays.map((play) => (
            <div key={play.timeInPeriod} className="play">
              {play.typeDescKey === "period-start" ||
              play.typeDescKey === "stoppage" ? (
                Play(play.typeDescKey, play.details?.reason ?? null)
              ) : (
                <Accordion notClosing={false}>
                  <div className="accordion__container">
                    <h5
                      className="accordion__header js-header window-effect"
                    >
                      <Svg name="right-arrow" size="sm"></Svg>
                    </h5>
                    <div
                      className={`accordion__content`}
                    >
                      <IceRink game={game} teamColors={teamColors} plays={play}>
                      </IceRink>
                    </div>
                  </div>
                </Accordion>
              )}
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};
