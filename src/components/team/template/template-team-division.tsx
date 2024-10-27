import React from "react";
import TemplateTeamCard from "./template-team-card";
import { TeamColor } from "../../../interfaces/team/teamColor";
import { TeamDetail } from "../../../interfaces/team/teamDetails";

interface TeamsByDivisionProps {
  division: string;
  teams: TeamDetail[];
  teamColors: TeamColor | null;
}

const formatDivisionName = (division: string) => {
  switch (division) {
    case "Central":
      return "Centrale";
    case "Pacific":
      return "Pacifique";
    case "Atlantic":
      return "Atlantique";
    case "Metropolitan":
      return "Métropolitaine";

    default:
      return division;
  }
};

const TemplateTeamDivision: React.FC<TeamsByDivisionProps> = ({
  division,
  teams,
  teamColors,
}) => {
  return (
    <div className="division-section">
      <h2>{formatDivisionName(division)}</h2>
      <div className="cards teams">
        {teams.length > 0 ? (
          teams.map((team, index) => (
            <TemplateTeamCard key={index} team={team} teamColor={teamColors} />
          ))
        ) : (
          <p>Aucune équipe trouvée</p>
        )}
      </div>
    </div>
  );
};

export default TemplateTeamDivision;
