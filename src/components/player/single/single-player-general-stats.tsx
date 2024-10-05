import React from 'react';
import Carousel from "../../utils/carousel";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import formatSeason from "../../../scripts/utils/formatSeason";

interface StatsTableProps {
  stats: any;
  isGoalie: boolean;
}

const StatsTable: React.FC<StatsTableProps> = ({ stats, isGoalie }) => {
  if (isGoalie) {
    return (
      <table>
        <thead>
          <tr>
            <th>PJ</th>
            <th>V</th>
            <th>D</th>
            <th>%ARR</th>
            <th>MOY</th>
            <th className="statsNoMobile">BL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{stats?.gamesPlayed ?? 0}</td>
            <td>{stats?.wins ?? 0}</td>
            <td>{stats?.losses ?? 0}</td>
            <td>{stats?.savePctg?.toFixed(3) ?? 0}</td>
            <td>{stats?.goalsAgainstAvg?.toFixed(2) ?? 0}</td>
            <td className="statsNoMobile">{stats?.shutouts ?? 0}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>PJ</th>
          <th>B</th>
          <th>A</th>
          <th>P</th>
          <th>+/-</th>
          <th className="statsNoMobile">PUN</th>
          <th className="statsNoMobile">%T</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{stats?.gamesPlayed ?? 0}</td>
          <td>{stats?.goals ?? 0}</td>
          <td>{stats?.assists ?? 0}</td>
          <td>{stats?.points ?? 0}</td>
          <td>{stats?.plusMinus ?? 0}</td>
          <td className="statsNoMobile">{stats?.pim ?? 0}</td>
          <td className="statsNoMobile">{stats?.shootingPctg?.toFixed(3) ?? 0}</td>
        </tr>
      </tbody>
    </table>
  );
};

const StatSection: React.FC<{ title: string; stats: any; isGoalie: boolean }> = ({ title, stats, isGoalie }) => (
  <div className="stats-section">
    <h3>{title}</h3>
    <div className="short-stats-list">
      <StatsTable stats={stats} isGoalie={isGoalie} />
    </div>
  </div>
);

const PlayerSingleGeneralStats: React.FC<{ player: PlayerDetailsType }> = ({ player }) => {
  const isGoalie = player.positionCode === "G";
  const season = formatSeason(player.featuredStats?.season) || "2023-24";

  const carouselSlide = (isPlayoffs: boolean) => (
    <div data-is-swiper-slide className={`${isPlayoffs ? 'playoff' : 'normal'}-stats-general swiper-no-swiping`}>
      <StatSection
        title={`${isPlayoffs ? 'Série' : 'Saison'} ${season}`}
        stats={player.featuredStats?.[isPlayoffs ? 'playoffs' : 'regularSeason']?.subSeason}
        isGoalie={isGoalie}
      />
      <StatSection
        title={`Carrière${isPlayoffs ? ' en séries' : ''}`}
        stats={player.careerTotals?.[isPlayoffs ? 'playoffs' : 'regularSeason']}
        isGoalie={isGoalie}
      />
    </div>
  );

  return (
    <section className="global-stats">
      <div className="wrapper">
        <Carousel
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          breakpoint={{ 1020: { spaceBetween: 10, slidesPerView: 1 } }}
          noSwiping={true}
          grabCursor={false}
        >
          <div className="nav">
            <div className="swiper-button-prev">
              <h2>Saisons</h2>
            </div>
            <div className="swiper-button-next">
              <h2>Séries</h2>
            </div>
          </div>
          {carouselSlide(false)}
          {carouselSlide(true)}
        </Carousel>
      </div>
    </section>
  );
};

export default PlayerSingleGeneralStats;