import React, { useEffect, useMemo, useState } from "react";
import { INTStanding, INTStandingOtherInfos } from "../interfaces/standing";
import { Link, useSearchParams } from "react-router-dom";
import Carousel from "./utils/carousel";
import Swiper from "swiper";

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

type SortKey = keyof TeamStanding | "powerPlayPct" | "penaltyKillPct";

const SingleStanding: React.FC<SingleStandingProps> = ({
  standing,
  standingOther,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [swiperInstance, setSwiperInstance] = useState<Swiper | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    const standing = searchParams.get("classement") || "divisions";
    if (swiperInstance) {
      swiperInstance.slideTo(standing === "divisions" ? 0 : 1, 0);
    }
  }, [swiperInstance, searchParams]);

  const handleSlideChange = (classement: "divisions" | "ligue") => {
    setSearchParams({ classement });
  };

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

  const sortedStandings = useMemo(() => {
    if (!filteredStandings) return filteredStandings;

    const sortedData: FilteredStandings = JSON.parse(
      JSON.stringify(filteredStandings)
    );

    const sortTeams = (
      teams: {
        team: TeamStanding;
        otherInfo: INTStandingOtherInfos["data"][0] | null;
      }[]
    ) => {
      return teams.sort((a, b) => {
        if (!sortConfig) return 0;

        const { key, direction } = sortConfig;

        if (key === "powerPlayPct" || key === "penaltyKillPct") {
          const aValue = a.otherInfo?.[key] ?? 0;
          const bValue = b.otherInfo?.[key] ?? 0;
          return direction === "ascending" ? aValue - bValue : bValue - aValue;
        } else {
          const aValue = a.team[key];
          const bValue = b.team[key];
          if (aValue < bValue) {
            return direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
      });
    };

    for (const conference of ["Est", "Ouest"] as const) {
      for (const division in sortedData[conference]) {
        sortedData[conference][division] = sortTeams(
          sortedData[conference][division]
        );
      }
    }
    sortedData.Ligue = sortTeams(sortedData.Ligue);

    return sortedData;
  }, [filteredStandings, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "descending";
    if (sortConfig && sortConfig.key === key) {
      direction =
        sortConfig.direction === "descending" ? "ascending" : "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction;
  };

  const renderSortArrow = (key: SortKey) => {
    const direction = getSortDirection(key);
    if (!direction) return null;
    return direction === "ascending" ? " ↓" : " ↑";
  };

  const renderTableHeader = () => (
    <tr>
      <th onClick={() => requestSort("conferenceSequence")}>
        Rang{renderSortArrow("conferenceSequence")}
      </th>
      <th scope="row">Équipe</th>
      <th onClick={() => requestSort("gamesPlayed")}>
        PJ{renderSortArrow("gamesPlayed")}
      </th>
      <th onClick={() => requestSort("wins")}>V{renderSortArrow("wins")}</th>
      <th onClick={() => requestSort("losses")}>
        D{renderSortArrow("losses")}
      </th>
      <th onClick={() => requestSort("otLosses")}>
        DPr.{renderSortArrow("otLosses")}
      </th>
      <th onClick={() => requestSort("points")}>
        PTS{renderSortArrow("points")}
      </th>
      <th onClick={() => requestSort("pointPctg")}>
        %PTS{renderSortArrow("pointPctg")}
      </th>
      <th onClick={() => requestSort("regulationWins")}>
        VR{renderSortArrow("regulationWins")}
      </th>
      <th onClick={() => requestSort("regulationPlusOtWins")}>
        VPr.{renderSortArrow("regulationPlusOtWins")}
      </th>
      <th onClick={() => requestSort("goalFor")}>
        BP{renderSortArrow("goalFor")}
      </th>
      <th onClick={() => requestSort("goalAgainst")}>
        BC{renderSortArrow("goalAgainst")}
      </th>
      <th onClick={() => requestSort("goalDifferential")}>
        DIFF{renderSortArrow("goalDifferential")}
      </th>
      <th onClick={() => requestSort("powerPlayPct")}>
        %AN{renderSortArrow("powerPlayPct")}
      </th>
      <th onClick={() => requestSort("penaltyKillPct")}>
        %IN{renderSortArrow("penaltyKillPct")}
      </th>
      <th className="record">DOM</th>
      <th className="record">ÉTR</th>
      <th onClick={() => requestSort("shootoutWins")}>
        TB{renderSortArrow("shootoutWins")}
      </th>
      <th className="record last">10D.M.</th>
      <th>SÉQ.</th>
    </tr>
  );

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
          <span className="no-mobile">{`${team.teamName.fr || team.teamName.default}`}</span>
          <span className="mobile">{`${team.teamAbbrev.default}`}</span>
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
      <thead>{renderTableHeader()}</thead>
      <tbody>{teams.map((team, index) => renderTeamRow(team, index))}</tbody>
    </table>
  );

  if (!sortedStandings) return <p>Aucune donnée disponible.</p>;

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
          onSwiper={(swiper) => setSwiperInstance(swiper)}
          onSlideChange={(swiper) => {
            handleSlideChange(
              swiper.activeIndex === 0 ? "divisions" : "ligue"
            );
          }}
        >
          <div className="nav standing">
            <div
              className="swiper-button-prev"
              onClick={() => handleSlideChange("divisions")}
            >
              <h3>Quatrième as</h3>
            </div>
            <div
              className="swiper-button-next"
              onClick={() => handleSlideChange("ligue")}
            >
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
                {Object.entries(sortedStandings[conference]).map(
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
              {renderStandingsTable(sortedStandings.Ligue)}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default SingleStanding;
