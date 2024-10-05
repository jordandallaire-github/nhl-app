import React, { useMemo } from "react";
import { INTStanding, INTStandingOtherInfos } from "../interfaces/standing";
import { Link } from "react-router-dom";
import Carousel from "./utils/carousel";

interface SingleStandingProps {
  standing: INTStanding | null;
  standingOther: INTStandingOtherInfos | null;
}

type TeamStanding = INTStanding["standings"][0];

interface ConferenceStandings {
  [division: string]: {
    team: TeamStanding;
    otherInfo: INTStandingOtherInfos["data"][0] | null;
  }[];
}

interface FilteredStandings {
  Est: ConferenceStandings;
  Ouest: ConferenceStandings;
  Ligue: {
    team: TeamStanding;
    otherInfo: INTStandingOtherInfos["data"][0] | null;
  }[];
}

const SingleStanding: React.FC<SingleStandingProps> = ({
  standing,
  standingOther,
}) => {
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
      Ligue: [],
    };

    standing.standings.forEach((team) => {
      const conferenceMapping: Record<string, keyof FilteredStandings> = {
        Eastern: "Est",
        Western: "Ouest",
      };

      const conf = conferenceMapping[team.conferenceName] as "Est" | "Ouest";
      const div = divisionMapping[
        team.divisionName
      ] as keyof ConferenceStandings;

      const otherInfo =
        standingOther?.data.find(
          (info) => info.teamFullName === team.teamName.default
        ) || null;

      if (conf in result && div in result[conf]) {
        result[conf][div].push({ team, otherInfo });
      }

      result.Ligue.push({ team, otherInfo });
    });

    conferences.forEach((conf) => {
      divisions[conf].forEach((div) => {
        result[conf][div].sort((a, b) => b.team.points - a.team.points);
        const top3 = result[conf][div].slice(0, 3);
        const wildCards = result[conf][div].slice(3);
        result[conf][div] = top3;
        result[conf]["Quatrième as"].push(...wildCards);
      });

      result[conf]["Quatrième as"].sort(
        (a, b) => b.team.points - a.team.points
      );
    });

    result.Ligue.sort((a, b) => b.team.points - a.team.points);

    return result;
  }, [standing, standingOther]);

  if (!filteredStandings) return <p>Aucune donnée disponible.</p>;

  const renderTeamRow = (
    {
      team,
      otherInfo,
    }: {
      team: TeamStanding;
      otherInfo: INTStandingOtherInfos["data"][0] | null;
    },
    index: number
  ) => (
    <tr key={`${team.teamAbbrev.default}-${index}`}>
      <td>{`${index + 1}`}</td>
      <td scope="row">
        <Link
          to={`/equipes/${team.teamCommonName.default
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {team.clinchIndicator ? (
            <span className="clinch window-effect">{team.clinchIndicator}</span>
          ) : (
            <span className="clinch no"></span>
          )}
          <img
            src={`https://assets.nhle.com/logos/nhl/svg/${team.teamAbbrev.default}_dark.svg`}
            alt={`${team.teamName.fr || team.teamName.default} logo`}
          />
          {`${team.teamName.fr || team.teamName.default}`}
        </Link>
      </td>
      <td>{team.gamesPlayed}</td>
      <td>{team.wins}</td>
      <td>{team.losses}</td>
      <td>{team.otLosses}</td>
      <td>{team.points}</td>
      <td>
        .
        {team.pointPctg * 10
          ? (team.pointPctg * 10).toFixed(2).replace(".", "")
          : ""}
      </td>
      <td>{team.regulationWins}</td>
      <td>{team.regulationPlusOtWins - team.regulationWins}</td>
      <td>{team.goalFor}</td>
      <td>{team.goalAgainst}</td>
      <td className={team.goalDifferential < 0 ? "negative" : "positive"}>
        {team.goalDifferential}
      </td>
      <td>
        {otherInfo?.powerPlayPct !== undefined
          ? `${(otherInfo.powerPlayPct * 100).toFixed(1)}`
          : "-"}
      </td>
      <td>
        {otherInfo?.penaltyKillPct !== undefined
          ? `${(otherInfo.penaltyKillPct * 100).toFixed(1)}`
          : "-"}
      </td>
      <td className="record">{`${team.homeWins}-${team.homeLosses}-${team.homeOtLosses}`}</td>
      <td className="record">{`${team.roadWins}-${team.roadLosses}-${team.roadOtLosses}`}</td>
      <td>{`${team.shootoutWins}-${team.shootoutLosses}`}</td>
      <td className="record last">{`${team.l10Wins}-${team.l10Losses}-${team.l10OtLosses}`}</td>
      <td>
        {team.streakCount}
        {team.streakCode}
      </td>
    </tr>
  );

  const renderStandingsTable = (
    teams: {
      team: TeamStanding;
      otherInfo: INTStandingOtherInfos["data"][0] | null;
    }[]
  ) => (
    <table>
      <thead>
        <tr>
          <th>Rang</th>
          <th scope="row">Équipe</th>
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
          <th>%AN</th>
          <th>%IN</th>
          <th className="record">DOM</th>
          <th className="record">ÉTR</th>
          <th>TB</th>
          <th className="record last">10D.M.</th>
          <th>SÉQ.</th>
        </tr>
      </thead>
      <tbody>{teams.map((team, index) => renderTeamRow(team, index))}</tbody>
    </table>
  );

  return (
    <section className="standing hero">
      <div className="wrapper">
        <h1>Classements</h1>
        <Carousel
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoint={{ 1020: { spaceBetween: 0, slidesPerView: 1 } }}
          noSwiping={true}
          grabCursor={false}
          autoHeight={true}
        >
          <div className="nav standing">
            <div className="swiper-button-prev">
              <h3>Quatrième as</h3>
            </div>
            <div className="swiper-button-next">
              <h3>Ligue</h3>
            </div>
          </div>
          <div
            data-is-swiper-slide
            className="standing-container swiper-no-swiping"
          >
            {(["Est", "Ouest"] as const).map((conference) => (
              <div key={conference}>
                <h2>{conference}</h2>
                {Object.entries(filteredStandings[conference]).map(
                  ([division, teams]) => (
                    <div key={division} className="table-standing-container">
                      <h3>{division}</h3>
                      {teams.length === 0 ? (
                        <p>Aucune équipe disponible dans cette division.</p>
                      ) : (
                        renderStandingsTable(teams)
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
          <div
            data-is-swiper-slide
            className="standing-container swiper-no-swiping"
          >
            <h2>Classement de la ligue</h2>
            <div className="table-standing-container">
              {renderStandingsTable(filteredStandings.Ligue)}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default SingleStanding;
