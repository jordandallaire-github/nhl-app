import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTMoreGameInfos } from "../../../interfaces/more-detail-match";
import { TeamMatchupSetup } from "./teamLogoSetup";

type TeamSeasonStatsKeys =
  keyof INTMoreGameInfos["teamSeasonStats"]["awayTeam"];

interface TeamGameStat {
  category: string;
  awayValue: number | string;
  homeValue: number | string;
}

interface Colors {
  home: string | null;
  away: string | null;
}

interface StatConfig<T extends string> {
  key: T;
  label: string;
  multiplier: number;
  decimals: number;
  isPercentage: boolean;
  lowerIsBetter?: boolean;
}

const statsToCompareGame: StatConfig<string>[] = [
  {
    key: "sog",
    label: "Tirs",
    multiplier: 1,
    decimals: 0,
    isPercentage: false,
  },
  {
    key: "faceoffWinningPctg",
    label: "% mise en jeu",
    multiplier: 100,
    decimals: 1,
    isPercentage: true,
  },
  {
    key: "powerPlayPctg",
    label: "% avantage numérique",
    multiplier: 100,
    decimals: 1,
    isPercentage: true,
  },
  {
    key: "pim",
    label: "Minutes de pénalité",
    multiplier: 1,
    decimals: 0,
    isPercentage: false,
  },
  {
    key: "blockedShots",
    label: "Tirs bloqués",
    multiplier: 1,
    decimals: 0,
    isPercentage: false,
  },
  {
    key: "giveaways",
    label: "Revirement",
    multiplier: 1,
    decimals: 0,
    isPercentage: false,
  },
  {
    key: "takeaways",
    label: "Revirements provoqués",
    multiplier: 1,
    decimals: 0,
    isPercentage: false,
  },
];

const statsToCompareTeam: StatConfig<TeamSeasonStatsKeys>[] = [
  {
    key: "ppPctg",
    label: "% avantage numérique",
    multiplier: 100,
    decimals: 1,
    isPercentage: false,
  },
  {
    key: "pkPctg",
    label: "% infériorité numérique",
    multiplier: 100,
    decimals: 1,
    isPercentage: false,
  },
  {
    key: "faceoffWinningPctg",
    label: "% mise en jeu",
    multiplier: 100,
    decimals: 1,
    isPercentage: true,
  },
  {
    key: "goalsForPerGamePlayed",
    label: "BP/PJ",
    multiplier: 1,
    decimals: 2,
    isPercentage: false,
  },
  {
    key: "goalsAgainstPerGamePlayed",
    label: "BC/PJ",
    multiplier: 1,
    decimals: 2,
    isPercentage: false,
    lowerIsBetter: true,
  },
];

const calculateFlexValues = (
  awayValue: number,
  homeValue: number,
  scaleFactor: number,
  lowerIsBetter: boolean = false
) => {
  let awayFlex, homeFlex;

  if (lowerIsBetter) {
    if (awayValue === 0 && homeValue === 0) {
      awayFlex = homeFlex = 1;
    } else if (awayValue === 0) {
      awayFlex = 1;
      homeFlex = 0;
    } else if (homeValue === 0) {
      awayFlex = 0;
      homeFlex = 1;
    } else {
      awayFlex = Math.pow(homeValue, scaleFactor);
      homeFlex = Math.pow(awayValue, scaleFactor);
    }
  } else {
    awayFlex = Math.pow(awayValue, scaleFactor);
    homeFlex = Math.pow(homeValue, scaleFactor);
  }

  const totalFlex = awayFlex + homeFlex;
  return {
    normalizedAwayFlex: awayFlex / totalFlex,
    normalizedHomeFlex: homeFlex / totalFlex,
  };
};

const formatValue = (
  value: number,
  isPercentage: boolean,
  decimals: number
): string => {
  const formattedValue = value.toFixed(decimals);
  return isPercentage ? `${formattedValue}%` : formattedValue;
};

const renderTeamStatComparison = (
  stat: StatConfig<TeamSeasonStatsKeys>,
  awayTeamStats: INTMoreGameInfos["teamSeasonStats"]["awayTeam"],
  homeTeamStats: INTMoreGameInfos["teamSeasonStats"]["homeTeam"],
  teamColors: Colors
) => {
  const awayValue = awayTeamStats[stat.key] * stat.multiplier;
  const homeValue = homeTeamStats[stat.key] * stat.multiplier;

  let awayFlex = "0";
  let homeFlex = "0";
  let awayDisplay = "block";
  let homeDisplay = "block";

  if (stat.lowerIsBetter) {
    const { normalizedAwayFlex, normalizedHomeFlex } = calculateFlexValues(
      awayValue,
      homeValue,
      1,
      true
    );
    awayFlex = `${normalizedAwayFlex * 100}%`;
    homeFlex = `${normalizedHomeFlex * 100}%`;
    awayDisplay = `${normalizedAwayFlex === 0 ? "none" : normalizedAwayFlex}`;
    homeDisplay = `${normalizedHomeFlex === 0 ? "none" : normalizedHomeFlex}`;
  } else {
    if (awayValue === 0 && homeValue === 0) {
      awayFlex = "50%";
      homeFlex = "50%";
    } else if (awayValue === 0) {
      awayDisplay = "none";
      homeFlex = "100%";
    } else if (homeValue === 0) {
      homeDisplay = "none";
      awayFlex = "100%";
    } else {
      const { normalizedAwayFlex, normalizedHomeFlex } = calculateFlexValues(
        awayValue,
        homeValue,
        1,
        false
      );
      awayFlex = `${normalizedAwayFlex * 100}%`;
      homeFlex = `${normalizedHomeFlex * 100}%`;
    }
  }

  const awayRank = awayTeamStats[`${stat.key}Rank` as TeamSeasonStatsKeys];
  const homeRank = homeTeamStats[`${stat.key}Rank` as TeamSeasonStatsKeys];

  return (
    <div className="stat matchup" key={stat.key}>
      <div className="pcStat">
        <p>
          <strong>
            {formatValue(awayValue, stat.isPercentage, stat.decimals)}
          </strong>
        </p>
        <p>{stat.label}</p>
        <p>
          <strong>
            {formatValue(homeValue, stat.isPercentage, stat.decimals)}
          </strong>
        </p>
      </div>
      <div className="indication-color">
        <div className="team" style={{ flex: awayFlex, display: awayDisplay }}>
          <div
            className="color away"
            style={{ borderTop: `8px solid ${teamColors.away}` }}
          />
        </div>
        <div className="team" style={{ flex: homeFlex, display: homeDisplay }}>
          <div
            className="color home"
            style={{ borderBottom: `8px solid ${teamColors.home}` }}
          />
        </div>
      </div>
      {awayRank && homeRank && (
        <div className="standing-stat">
          <p>{`${awayRank === 1 ? "1re" : `${awayRank}e`}`}</p>
          <p>{`${homeRank === 1 ? "1re" : `${homeRank}e`}`}</p>
        </div>
      )}
    </div>
  );
};

const renderGameStatComparison = (
  stat: StatConfig<string>,
  teamGameStats: TeamGameStat[],
  teamColors: Colors
) => {
  const statObject = teamGameStats.find((s) => s.category === stat.key);
  if (!statObject) return null;

  const awayValue =
    parseFloat(statObject.awayValue as string) * stat.multiplier;
  const homeValue =
    parseFloat(statObject.homeValue as string) * stat.multiplier;

  let awayFlex = "0";
  let homeFlex = "0";
  let awayDisplay = "block";
  let homeDisplay = "block";

  if (stat.lowerIsBetter) {
    const { normalizedAwayFlex, normalizedHomeFlex } = calculateFlexValues(
      awayValue,
      homeValue,
      1,
      true
    );
    awayFlex = `${normalizedAwayFlex * 100}%`;
    homeFlex = `${normalizedHomeFlex * 100}%`;
    awayDisplay = `${normalizedAwayFlex === 0 ? "none" : normalizedAwayFlex}`;
    homeDisplay = `${normalizedHomeFlex === 0 ? "none" : normalizedHomeFlex}`;
  } else {
    if (awayValue === 0 && homeValue === 0) {
      awayFlex = "50%";
      homeFlex = "50%";
    } else if (awayValue === 0) {
      awayDisplay = "none";
      homeFlex = "100%";
    } else if (homeValue === 0) {
      homeDisplay = "none";
      awayFlex = "100%";
    } else {
      const { normalizedAwayFlex, normalizedHomeFlex } = calculateFlexValues(
        awayValue,
        homeValue,
        1,
        false
      );
      awayFlex = `${normalizedAwayFlex * 100}%`;
      homeFlex = `${normalizedHomeFlex * 100}%`;
    }
  }

  return (
    <div className="stat matchup" key={stat.key}>
      <div className="pcStat">
        <p>
          <strong>
            {formatValue(awayValue, stat.isPercentage, stat.decimals)}
          </strong>
        </p>
        <p>{stat.label}</p>
        <p>
          <strong>
            {formatValue(homeValue, stat.isPercentage, stat.decimals)}
          </strong>
        </p>
      </div>
      <div className="indication-color">
        <div className="team" style={{ flex: awayFlex, display: awayDisplay }}>
          <div
            className="color away"
            style={{ borderTop: `8px solid ${teamColors.away}` }}
          />
        </div>
        <div className="team" style={{ flex: homeFlex, display: homeDisplay }}>
          <div
            className="color home"
            style={{ borderBottom: `8px solid ${teamColors.home}` }}
          />
        </div>
      </div>
      {stat.key === "powerPlayPctg" && renderPowerPlayStats(teamGameStats)}
    </div>
  );
};

const renderPowerPlayStats = (teamGameStats: TeamGameStat[]) => {
  const powerPlayStat = teamGameStats.find((s) => s.category === "powerPlay");
  if (!powerPlayStat) return null;

  return (
    <div className="standing-stat">
      <p>{powerPlayStat.awayValue}</p>
      <p>{powerPlayStat.homeValue}</p>
    </div>
  );
};

export const renderRightPanelTeamStatsInfos = (
  other: INTMoreGameInfos,
  game: INTMainGameInfos,
  teamColors: Colors
) => {
  if (game.gameState === "FUT" || game.gameState === "PRE") {
    return renderFutureGameStats(other, game, teamColors);
  } else {
    return renderCompletedGameStats(other, game, teamColors);
  }
};

const renderFutureGameStats = (
  other: INTMoreGameInfos,
  game: INTMainGameInfos,
  teamColors: Colors
) => {
  if (!other.teamSeasonStats.awayTeam || !other.teamSeasonStats.homeTeam)
    return null;

  return (
    <div className="team-stats window-effect">
      <div className="glare-effect"></div>
      <div className="teams-infos">
        <TeamMatchupSetup title="Statistiques d'équipe" game={game} />
        <div className="team-abbrev">
          <p>{game.awayTeam.abbrev}</p>
          <p>{game.homeTeam.abbrev}</p>
        </div>
        <div className="stats-container">
          {statsToCompareTeam.map((stat) =>
            renderTeamStatComparison(
              stat,
              other.teamSeasonStats.awayTeam,
              other.teamSeasonStats.homeTeam,
              teamColors
            )
          )}
        </div>
      </div>
    </div>
  );
};

const renderCompletedGameStats = (
  other: INTMoreGameInfos,
  game: INTMainGameInfos,
  teamColors: Colors
) => {
  return (
    <div className="team-stats window-effect">
      <div className="glare-effect"></div>
      <div className="teams-infos">
        <TeamMatchupSetup title="Statistiques du match" game={game} />
        <div className="team-abbrev">
          <p>{game.awayTeam.abbrev}</p>
          <p>{game.homeTeam.abbrev}</p>
        </div>
        <div className="stats-container">
          {statsToCompareGame.map((stat) =>
            renderGameStatComparison(stat, other.teamGameStats, teamColors)
          )}
        </div>
      </div>
    </div>
  );
};
