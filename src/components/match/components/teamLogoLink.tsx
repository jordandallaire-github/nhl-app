import { Link } from "react-router-dom";
import { INTMainGameInfos } from "../../../interfaces/main-match";

export const TeamsLogoLinks: React.FC<{
  team: INTMainGameInfos["awayTeam"] | INTMainGameInfos["homeTeam"];
  isNoMobile?: boolean;
}> = ({ team, isNoMobile }) => (
  <Link className={`${isNoMobile ? "no-mobile" : "mobile"}`} to={`/equipes/${team.name.default.toLowerCase().replace(/\s+/g, "-")}`}>
    <img
      src={`https://assets.nhle.com/logos/nhl/svg/${team.abbrev}_dark.svg`}
      alt={`${team.name.default} logo`}
      loading="lazy"
    />
  </Link>
);
