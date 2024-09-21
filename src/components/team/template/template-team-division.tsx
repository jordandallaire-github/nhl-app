import React from "react";
import TemplateTeamCard from "./template-team-card";
import { TeamColor } from "../../../interfaces/team/teamColor";
import { TeamDetails } from "../../../interfaces/team/teamDetails";

interface TeamsByDivisionProps {
  division: string;
  teams: TeamDetails[];
  teamColors: TeamColor | null;
}

const TemplateTeamDivision: React.FC<TeamsByDivisionProps> = ({ division, teams, teamColors }) => {
  return (
    <div className="division-section">
      <h2>{division}</h2>
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