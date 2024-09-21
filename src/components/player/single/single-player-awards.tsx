import { PlayerDetailsType } from "../../../fetcher/playerDetails";
import { Award } from "../../../fetcher/playerDetails";
import formatSeason from "../../utils/formatSeason";
import trophyDataJson from "../../../data/trophyPlayerData.json";

interface Trophy {
  description: string;
  specialTitle: string | null;
  stats: {
    player?: {
      fields: string[];
      labels: { [key: string]: string };
    };
    goalie?: {
      fields: string[];
      labels: { [key: string]: string };
    };
  };
}

interface TrophyData {
  [key: string]: Trophy;
}

const trophyData = trophyDataJson as unknown as TrophyData;

const PlayerSingleAwards: React.FC<{
  awards: PlayerDetailsType["awards"];
  player: PlayerDetailsType;
}> = ({ awards, player }) => {
  const renderAwardLayout = (award: Award) => {
    const trophyName = award.trophy.fr || award.trophy.default;
    const trophyInfo = trophyData[trophyName as keyof TrophyData];
    const playerPosition = player.positionCode === "G" ? "goalie" : "player";

    if (!trophyInfo) {
      return (
        <div className="trophy">
          <h3>{trophyName}</h3>
          <p>Description non disponible.</p>
        </div>
      );
    }

    const trophyCount = award.seasons.length;
    const displayTitle = trophyInfo.specialTitle || trophyName;
    const statsToDisplay = trophyInfo.stats[playerPosition];

    return (
      <>
        <div className="trophy-description">
          <h3>{`${trophyCount}x ${displayTitle}`}</h3>
          <p>{trophyInfo.description}</p>
        </div>
        <div className="table-trophy">
          <table>
            <thead>
              <tr>
                <th>Saison</th>
                {statsToDisplay?.fields.map((stat) => (
                  <th key={stat}>{statsToDisplay.labels[stat]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {award.seasons.map((season) => (
                <tr key={season.seasonId}>
                  <td>{formatSeason(season.seasonId)}</td>
                  {statsToDisplay?.fields.map((stat) => {
                    const value = season[stat as keyof Award["seasons"][0]];

                    if (playerPosition === "goalie" && stat === "gaa") {
                      return (
                        <td key={stat}>
                          {value !== undefined ? value.toFixed(2) : "-"}
                        </td>
                      );
                    } else if (
                      playerPosition === "goalie" &&
                      stat === "savePctg"
                    ) {
                      return (
                        <td key={stat}>
                          {value !== undefined ? value.toFixed(3) : "-"}
                        </td>
                      );
                    }
                    return <td key={stat}>{value}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <section className="player-awards">
      <div className="wrapper">
        <h2>Honneurs:</h2>
        {awards && awards.length > 0 ? (
          awards.map((award) => (
            <div className="trophy" key={award.trophy.default}>
              {renderAwardLayout(award)}
            </div>
          ))
        ) : (
          <h3>Aucune récompense.</h3>
        )}
      </div>
    </section>
  );
};

export default PlayerSingleAwards;
