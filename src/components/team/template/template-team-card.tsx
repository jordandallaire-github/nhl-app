import { Link } from "react-router-dom";
import { TeamDetails } from "../../../interfaces/team/teamDetails";
import { TeamColor } from "../../../interfaces/team/teamColor";

interface TeamCardProps {
  team: TeamDetails;
  teamColor: TeamColor | null;
}

const TemplateTeamCard: React.FC<TeamCardProps> = ({ team, teamColor }) => {
  const teamAbbrev = team.teamAbbrev.default;
  const teamColors = teamColor?.[teamAbbrev]?.color;

  return (
    <Link
      to={`/equipes/${team.teamCommonName.default
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
      className="card window-effect"
    >
      <div className="card-media">
        <img
          className="team-logo list-team"
          src={`https://assets.nhle.com/logos/nhl/svg/${teamAbbrev}_dark.svg`}
          alt={team.teamName.fr}
        />
      </div>
      <div className="card-content">
        <h3>{team.teamName.fr}</h3>
      </div>
      <div
        className="card-background-color"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0, #7fcfff33, #0000 80%), radial-gradient(circle at 50% 0, ${teamColors}, #0000)`,
        }}
      ></div>
    </Link>
  );
};

export default TemplateTeamCard;
