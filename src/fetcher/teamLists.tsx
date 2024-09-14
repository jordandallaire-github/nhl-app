import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Team {
  teamAbbrev: { default: string };
  teamName: { default: string; fr: string };
  teamLogo: string;
  divisionName: string;
  teamCommonName: { default: string };
}

interface TeamColor {
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
          <div key={division} className="division-section">
            <h2>{division}</h2>
            <div className="cards">
              {teams.length > 0 ? (
                teams.map((team, index) => {
                  const teamAbbrev = team.teamAbbrev.default;
                  const teamColor = teamColors?.[teamAbbrev]?.color;
                  return (
                    <Link
                      to={`/equipe/${team.teamAbbrev.default}`}
                      className="card window-effect"
                      key={index}
                    >
                      <div className="card-media">
                        <img src={team.teamLogo} alt={team.teamName.fr} />
                      </div>
                      <div className="card-content">
                        <h3>{team.teamName.fr}</h3>
                      </div>
                      <div
                        className="card-background-color"
                        style={{
                          backgroundImage: `radial-gradient(circle at 50% 0, #7fcfff33, #0000 80%), radial-gradient(circle at 50% 0, ${teamColor}, #0000)`,
                        }}
                      ></div>
                    </Link>
                  );
                })
              ) : (
                <p>Aucune équipe trouvée</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListTeams;
