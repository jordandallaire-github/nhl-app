import React, { useEffect, useState } from "react";
import TemplateTeamDivision from "../components/team/template/template-team-division";
import { TeamColor } from "../interfaces/team/teamColor";
import { TeamDetail } from "../interfaces/team/teamDetails";
import { loaderComponent } from "../components/utils/loader";

const groupTeamsByDivision = (teams: TeamDetail[]) => {
  return teams.reduce((acc: { [key: string]: TeamDetail[] }, team) => {
    const division = team.divisionName;
    if (!acc[division]) {
      acc[division] = [];
    }
    acc[division].push(team);
    return acc;
  }, {});
};

const ListTeams: React.FC = () => {
  const [teams, setTeams] = useState<TeamDetail[]>([]);
  const [teamColors, setTeamColors] = useState<TeamColor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isBuildProduction = true;
  const apiWeb = isBuildProduction
    ? "/proxy.php/"
    : "https://api-web.nhle.com/";

  useEffect(() => {
    const fetchTeamsAndColors = async () => {
      setLoading(true);
      try {
        const colorRes = await fetch("./teamColor.json");
        if (!colorRes.ok) throw new Error("Failed to fetch team colors");
        const colorData = await colorRes.json();
        setTeamColors(colorData);

        const res = await fetch(`${apiWeb}v1/standings/now`);
        if (!res.ok) throw new Error("Failed to fetch teams");
        const teamData = await res.json();
        setTeams(teamData.standings);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndColors();
  }, [apiWeb]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <>{loaderComponent()}</>;
  }

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
