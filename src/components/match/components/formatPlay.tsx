import { Svg } from "../../../scripts/utils/Icons";

const Stoppage = (stoppage: string | null) => {
  switch (stoppage) {
    case "period-start":
      return "Début de la période"
    case "stoppage":
      return ""
    default:
      return stoppage;
  }
};

export const Play = (type: string, stopReason: string | null) => {
  switch (type) {
    case "period-start":
      return (
        <>
          <div className="stop-play whistle">
            <Svg name="whistle" size="sm"></Svg>
            <p>{Stoppage(stopReason)}</p>
          </div>
        </>
      );
    case "stoppage":
      return (
        <>
          <div className="stop-play whistle">
            <Svg name="whistle" size="sm"></Svg>
            <p>{Stoppage(stopReason)}</p>
          </div>
        </>
      );
    default:
      return type;
  }
};
