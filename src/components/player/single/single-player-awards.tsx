// PlayerSingleAwards.tsx
import { PlayerDetailsType } from "../../../fetcher/playerDetails";
import { Award } from "../../../fetcher/playerDetails";
import formatSeason from "../../utils/formatSeason";
import trophyDataJson from "../../../data/trophyPlayerData.json";

interface Trophy {
  description: string;
  specialTitle: string | null;
}

interface TrophyData {
  [key: string]: Trophy;
}

const trophyData = trophyDataJson as TrophyData;

const PlayerSingleAwards: React.FC<{ awards: PlayerDetailsType["awards"] }> = ({
  awards,
}) => {
  const renderAwardLayout = (award: Award) => {
    const trophyName = award.trophy.fr || award.trophy.default;
    const trophyInfo = trophyData[trophyName as keyof TrophyData];

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

    return (
      <div className="trophy">
        <h3>{`${trophyCount}x ${displayTitle}`}</h3>
        <p>{trophyInfo.description}</p>
        {award.seasons.map((season) => (
          <p key={season.seasonId}>Saison: {formatSeason(season.seasonId)}</p>
        ))}
      </div>
    );
  };

  return (
    <section className="player-awards">
      <div className="wrapper">
        <h2>Récompenses:</h2>
        {awards && awards.length > 0 ? (
          awards.map((award) => (
            <div key={award.trophy.default}>{renderAwardLayout(award)}</div>
          ))
        ) : (
          <h3>Aucune récompense.</h3>
        )}
      </div>
    </section>
  );
};

export default PlayerSingleAwards;
