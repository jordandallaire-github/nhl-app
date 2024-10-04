import React, { useMemo } from "react";
import { INTStanding } from "../../interfaces/standing";
import { Link } from "react-router-dom";

interface SingleStandingProps {
  standing: INTStanding | null;
}

type TeamStanding = INTStanding["standings"][0];

interface ConferenceStandings {
  [division: string]: TeamStanding[];
}

interface FilteredStandings {
  Est: ConferenceStandings;
  Ouest: ConferenceStandings;
}

const SingleStanding: React.FC<SingleStandingProps> = ({ standing }) => {
  const filteredStandings = useMemo(() => {
    if (!standing || !standing.standings) return null;

    const conferences = ["Est", "Ouest"] as const;

    const divisions = {
      Est: ["Atlantique", "Métropolitaine"],
      Ouest: ["Centrale", "Pacifique"],
    } as const;

    const divisionMapping: Record<string, string> = {
      Atlantic: "Atlantique",
      Metropolitan: "Métropolitaine",
      Central: "Centrale",
      Pacific: "Pacifique",
    };

    const result: FilteredStandings = {
      Est: { Atlantique: [], Métropolitaine: [], "Quatrième as": [] },
      Ouest: { Centrale: [], Pacifique: [], "Quatrième as": [] },
    };

    standing.standings.forEach((team) => {
      const conferenceMapping: Record<string, keyof FilteredStandings> = {
        Eastern: "Est",
        Western: "Ouest",
      };

      const conf = conferenceMapping[
        team.conferenceName
      ] as keyof FilteredStandings;
      const div = divisionMapping[
        team.divisionName
      ] as keyof ConferenceStandings;

      if (conf in result && div in result[conf]) {
        result[conf][div].push(team);
      } else {
        console.warn(
          `Équipe ignorée : ${team.teamName.default} (conférence: ${team.conferenceName}, division: ${team.divisionName})`
        );
      }
    });

    conferences.forEach((conf) => {
      divisions[conf].forEach((div) => {
        result[conf][div].sort((a, b) => b.points - a.points);
        const top3 = result[conf][div].slice(0, 3);
        const wildCards = result[conf][div].slice(3);
        result[conf][div] = top3;
        result[conf]["Quatrième as"].push(...wildCards);
      });

      result[conf]["Quatrième as"].sort((a, b) => b.points - a.points);
    });

    return result;
  }, [standing]);

  if (!filteredStandings) return <p>Aucune donnée disponible.</p>;

  return (
    <section className="hero">
      <div className="wrapper">
        <h1>Classements</h1>
        {(["Est", "Ouest"] as const).map((conference) => (
          <div key={conference} className="standing-container">
            <h2>{conference}</h2>
            {Object.entries(filteredStandings[conference]).map(
              ([division, teams]) => (
                <div key={division} className="table-standing-container">
                  <h3>{division}</h3>
                  {teams.length === 0 ? (
                    <p>Aucune équipe disponible dans cette division.</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Rang</th>
                          <th>Équipe</th>
                          <th>PJ</th>
                          <th>V</th>
                          <th>D</th>
                          <th>DPr.</th>
                          <th>PTS</th>
                          <th>%PTS</th>
                          <th>VR</th>
                          <th>VPr.</th>
                          <th>BP</th>
                          <th>BC</th>
                          <th>DIFF</th>
                          <th>DOM</th>
                          <th>ÉTR</th>
                          <th>TB</th>
                          <th>10D.M.</th>
                          <th>SÉQ.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teams.map((team, index) => (
                          <tr key={`${team.teamAbbrev.default}-${index}`}>
                            <td>{`${index + 1}`}</td>
                            <td>
                              <Link
                                to={`/equipes/${team.teamCommonName.default
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                              >
                                <img
                                  src={`https://assets.nhle.com/logos/nhl/svg/${team.teamAbbrev.default}_dark.svg`}
                                  alt={`${team.teamName.fr} logo`}
                                />
                                {`${team.teamName.fr}`}
                              </Link>
                            </td>
                            <td>{team.gamesPlayed}</td>
                            <td>{team.wins}</td>
                            <td>{team.losses}</td>
                            <td>{team.otLosses}</td>
                            <td>{team.points}</td>
                            <td>
                              .
                              {(team.pointPctg * 10)
                                .toFixed(2)
                                .replace(".", "")}
                            </td>
                            <td>{team.regulationWins}</td>
                            <td>{team.regulationPlusOtWins - team.regulationWins}</td>
                            <td>{team.goalFor}</td>
                            <td>{team.goalAgainst}</td>
                            <td className={team.goalDifferential < 0 ? "negative" : "positive"}>{team.goalDifferential}</td>
                            <td>{`${team.homeWins}-${team.homeLosses}-${team.homeOtLosses}`}</td>
                            <td>{`${team.roadWins}-${team.roadLosses}-${team.roadOtLosses}`}</td>
                            <td>{`${team.shootoutWins}-${team.shootoutLosses}`}</td>
                            <td>{`${team.l10Wins}-${team.l10Losses}-${team.l10OtLosses}`}</td>
                            <td>{team.streakCount}{team.streakCode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SingleStanding;
