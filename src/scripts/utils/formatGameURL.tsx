import { Link } from "react-router-dom";
import { Svg } from "./Icons";
import { generateMatchPath } from "./generateMatchPath";

export const GameLink: React.FC<{ game: string; withSvg?: boolean }> = ({
  game,
  withSvg,
}) => {

  return (
    <Link to={generateMatchPath(game)}>
      {withSvg && <Svg name="game-stats" size="sm" />}
      <span className="mobile">Détails match</span>
      {withSvg && <Svg className="mobile" name="right-arrow" size="sm" />}
    </Link>
  );
};
