import { INTMainGameInfos } from "../../../interfaces/main-match";
import Carousel from "../../utils/carousel";
import { goalieStats, playerStats } from "./utilRosterPlayer";

export const renderRosterMatch = (game: INTMainGameInfos) => {
  return (
    <>
      <div className="roster-match">
        <h3>Formation</h3>
        <Carousel
          navigation={{
            nextEl: ".roster-home",
            prevEl: ".roster-away",
          }}
          breakpoint={{ 320: { spaceBetween: 10, slidesPerView: 1 } }}
          noSwiping={true}
          grabCursor={false}
        >
          <div className="nav-wrapper">
            <div className="indicator"></div>
            <div className="nav-pill-roster">
              <div className="roster-away">
                <p>{game.awayTeam.name.fr ?? game.awayTeam.name.default}</p>
              </div>
              <div className="roster-home">
                <p>{game.homeTeam.name.fr ?? game.homeTeam.name.default}</p>
              </div>
              <div className="indicator-pill"></div>
            </div>
          </div>

          <div data-is-swiper-slide className="roster-slide swiper-no-swiping">
            {playerStats(game, true, null, false)}
            {playerStats(game, false, null, false)}
            {goalieStats(game, null, false)}
          </div>
          <div data-is-swiper-slide className="roster-slide swiper-no-swiping">
            {playerStats(game, true, null, true)}
            {playerStats(game, false, null, true)}
            {goalieStats(game, null, true)}
          </div>
        </Carousel>
      </div>
    </>
  );
};
