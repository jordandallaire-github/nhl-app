import { Svg } from "../../scripts/utils/Icons";

export const loaderComponent = () => {
  return (
    <div className={`loading`}>
      <span className="puck">
        <div className="logo">
          <Svg name="jdh" size="md"></Svg>
        </div>
      </span>
    </div>
  );
};
