import { Link } from "react-router-dom";
import { Svg } from "./Icons";

export const GameLink: React.FC<{ game: string; withSvg?: boolean }> = ({
  game,
  withSvg,
}) => {
  const generateMatchPath = (game: string) => {
    const parts = game.split("/");
    const teamAbbrs = parts[2].replace("vs", "vs");
    const [year, month, day] = parts.slice(3, 6);
    const matchId = parts[6];
    return `/match/${teamAbbrs}/${year}/${month}/${day}/${matchId}`;
  };

  return (
    <Link to={generateMatchPath(game)}>
      {withSvg && <Svg name="game-stats" size="sm" />}
      <span className="mobile">Détails match</span>
      {withSvg && <Svg className="mobile" name="right-arrow" size="sm" />}
    </Link>
  );
};
