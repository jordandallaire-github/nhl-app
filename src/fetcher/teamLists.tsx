import React, { useEffect, useState } from "react";
import TemplateTeamDivision from "../components/team/template/template-team-division";

export interface Team {
  teamAbbrev: { default: string };
  teamName: { default: string; fr: string };
  teamLogo: string;
  divisionName: string;
  teamCommonName: { default: string };
}

export interface TeamColor {
  [key: string]: {
    name: string;
    color: string;
  };
}

const groupTeamsByDivision = (teams: Team[]) => {
  return teams.reduce((acc: { [key: string]: Team[] }, team) => {
    const division = team.divisionName;
    if (!acc[division]) {
      acc[division] = [];
    }
    acc[division].push(team);
    return acc;
  }, {});
};

const ListTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamColors, setTeamColors] = useState<TeamColor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamsAndColors = async () => {
      try {
        // Fetch team colors
        const colorRes = await fetch("/teamColor.json");
        if (!colorRes.ok) throw new Error("Failed to fetch team colors");
        const colorData = await colorRes.json();
        setTeamColors(colorData);

        // Fetch teams from the NHL API
        const res = await fetch("https://api-web.nhle.com/v1/standings/now");
        if (!res.ok) throw new Error("Failed to fetch teams");
        const teamData = await res.json();
        setTeams(teamData.standings);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchTeamsAndColors();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Grouper les équipes par division
  const teamsByDivision = groupTeamsByDivision(teams);

  return (
    <section className="hero">
      <div className="wrapper">
        <h1>Équipes NHL</h1>
        {Object.entries(teamsByDivision).map(([division, teams]) => (
          <TemplateTeamDivision
            key={division}
            division={division}
            teams={teams}
            teamColors={teamColors}
          />
        ))}
      </div>
    </section>
  );
};

export default ListTeams;
