import { INTMainGameInfos } from "../../../interfaces/main-match";
import { TeamsLogoLinks } from "./teamLogoLink";

export const TeamMatchupSetup: React.FC<{ game: INTMainGameInfos, title: string }> = ({ game, title }) => (
  <div className="teams-logo matchup">
    <TeamsLogoLinks team={game.awayTeam} />
    <h4>{title}</h4>
    <TeamsLogoLinks team={game.homeTeam} />
  </div>
);
