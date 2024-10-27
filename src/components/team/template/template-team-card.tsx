import { Link } from "react-router-dom";
import { TeamDetail } from "../../../interfaces/team/teamDetails";
import { TeamColor } from "../../../interfaces/team/teamColor";

interface TeamCardProps {
  team: TeamDetail;
  teamColor: TeamColor | null;
}

const TemplateTeamCard: React.FC<TeamCardProps> = ({ team, teamColor }) => {
  const teamAbbrev = team.teamAbbrev.default;
  const teamColors = teamColor?.[teamAbbrev]?.color;

  return (
    <div className="card window-effect">
      <div className="card-media">
        <Link
          to={`/equipes/${team.teamCommonName.default
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          <img
            className="list-team"
            src={`https://assets.nhle.com/logos/nhl/svg/${teamAbbrev}_dark.svg`}
            alt={team.teamName.fr}
          />
        </Link>
      </div>
      <div className="card-content">
        <h3>{team.teamName.fr}</h3>
        <div className="links-team">
          <Link
            to={`/equipes/${team.teamCommonName.default
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            Accueil
          </Link>
          <Link
            to={`/equipes/${team.teamCommonName.default
              .toLowerCase()
              .replace(/\s+/g, "-")}?section=calendrier`}
          >
            Calendrier
          </Link>
          <Link
            to={`/equipes/${team.teamCommonName.default
              .toLowerCase()
              .replace(/\s+/g, "-")}?section=statistiques`}
          >
            Statistiques
          </Link>
        </div>
      </div>
      <div
        className="card-background-color"
        style={{
          backgroundImage: `radial-gradient(circle at 56% 0px, rgba(127, 207, 255, 0.2), rgba(0, 0, 0, 0) 0%), radial-gradient(circle at 0 12px, ${teamColors}, rgba(0, 0, 0, 0) 100%)`,
        }}
      ></div>
    </div>
  );
};

export default TemplateTeamCard;
