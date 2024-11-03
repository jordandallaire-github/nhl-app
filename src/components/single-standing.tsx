import React, { useEffect, useMemo, useState } from "react";
import { INTStanding, INTStandingOtherInfos } from "../interfaces/standing";
import { Link, useSearchParams } from "react-router-dom";
import Carousel from "./utils/carousel";
import Swiper from "swiper";

interface SingleStandingProps {
  standing: INTStanding | null;
  standingOther: INTStandingOtherInfos | null;
  home: boolean;
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

type TableId =
  | "Ligue"
  | "Atlantique"
  | "Métropolitaine"
  | "Centrale"
  | "Pacifique"
  | "Quatrième as";

interface SortConfig {
  tableId: TableId;
  key: SortKey;
  direction: "ascending" | "descending";
}

const SingleStanding: React.FC<SingleStandingProps> = ({
  standing,
  standingOther,
  home,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [swiperInstance, setSwiperInstance] = useState<Swiper | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

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
    if (!filteredStandings || !sortConfig) return filteredStandings;

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

    if (sortConfig.tableId === "Ligue") {
      sortedData.Ligue = sortTeams(sortedData.Ligue);
    } else {
      for (const conference of ["Est", "Ouest"] as const) {
        if (sortConfig.tableId in sortedData[conference]) {
          sortedData[conference][sortConfig.tableId] = sortTeams(
            sortedData[conference][sortConfig.tableId]
          );
        }
      }
    }

    return sortedData;
  }, [filteredStandings, sortConfig]);

  const requestSort = (key: SortKey, tableId: TableId) => {
    let direction: "ascending" | "descending" = "descending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.tableId === tableId
    ) {
      direction =
        sortConfig.direction === "descending" ? "ascending" : "descending";
    }
    setSortConfig({ tableId, key, direction });
  };

  const getSortDirection = (key: SortKey, tableId: TableId) => {
    if (
      !sortConfig ||
      sortConfig.key !== key ||
      sortConfig.tableId !== tableId
    ) {
      return null;
    }
    return sortConfig.direction;
  };

  const renderSortArrow = (key: SortKey, tableId: TableId) => {
    const direction = getSortDirection(key, tableId);
    if (!direction) return null;
    return direction === "ascending" ? " ↓" : " ↑";
  };

  const renderTableHeader = (tableId: TableId) => (
    <tr>
      <th onClick={() => requestSort("conferenceSequence", tableId)}>
        Rang{renderSortArrow("conferenceSequence", tableId)}
      </th>
      <th scope="row">Équipe</th>
      <th onClick={() => requestSort("gamesPlayed", tableId)}>
        PJ{renderSortArrow("gamesPlayed", tableId)}
      </th>
      <th onClick={() => requestSort("wins", tableId)}>
        V{renderSortArrow("wins", tableId)}
      </th>
      <th onClick={() => requestSort("losses", tableId)}>
        D{renderSortArrow("losses", tableId)}
      </th>
      <th onClick={() => requestSort("otLosses", tableId)}>
        DPr.{renderSortArrow("otLosses", tableId)}
      </th>
      <th onClick={() => requestSort("points", tableId)}>
        PTS{renderSortArrow("points", tableId)}
      </th>
      <th onClick={() => requestSort("pointPctg", tableId)}>
        %PTS{renderSortArrow("pointPctg", tableId)}
      </th>
      <th onClick={() => requestSort("regulationWins", tableId)}>
        VR{renderSortArrow("regulationWins", tableId)}
      </th>
      <th onClick={() => requestSort("regulationPlusOtWins", tableId)}>
        VPr.{renderSortArrow("regulationPlusOtWins", tableId)}
      </th>
      <th onClick={() => requestSort("goalFor", tableId)}>
        BP{renderSortArrow("goalFor", tableId)}
      </th>
      <th onClick={() => requestSort("goalAgainst", tableId)}>
        BC{renderSortArrow("goalAgainst", tableId)}
      </th>
      <th onClick={() => requestSort("goalDifferential", tableId)}>
        DIFF{renderSortArrow("goalDifferential", tableId)}
      </th>
      <th onClick={() => requestSort("powerPlayPct", tableId)}>
        %AN{renderSortArrow("powerPlayPct", tableId)}
      </th>
      <th onClick={() => requestSort("penaltyKillPct", tableId)}>
        %IN{renderSortArrow("penaltyKillPct", tableId)}
      </th>
      <th className="record">DOM</th>
      <th className="record">ÉTR</th>
      <th onClick={() => requestSort("shootoutWins", tableId)}>
        TB{renderSortArrow("shootoutWins", tableId)}
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
          <span className="no-mobile">{`${
            team.teamName.fr || team.teamName.default
          }`}</span>
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
    }[],
    tableId: TableId
  ) => (
    <table>
      <thead>{renderTableHeader(tableId)}</thead>
      <tbody>{teams.map((team, index) => renderTeamRow(team, index))}</tbody>
    </table>
  );

  if (!sortedStandings) return <p>Aucune donnée disponible.</p>;

  return (
    <section className={`standing ${home ? "" : "hero"}`}>
      <div className={`${home ? "" : "wrapper"}`}>
        {home ? <h2>Classements</h2> : <h1>Classements</h1>}
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
            handleSlideChange(swiper.activeIndex === 0 ? "divisions" : "ligue");
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
                        renderStandingsTable(teams, division as TableId)
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
              {renderStandingsTable(sortedStandings.Ligue, "Ligue")}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default SingleStanding;
