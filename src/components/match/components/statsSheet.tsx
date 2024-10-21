import { INTBoxscore } from "../../../interfaces/boxscores";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import Carousel from "../../utils/carousel";
import { goalieStats, playerStats } from "./utilRosterPlayer";

export const renderBoxscore = (
  game: INTMainGameInfos,
  boxscore: INTBoxscore
) => {
  return (
    <>
      <div className="roster-match">
        <h3>Feuille de pointage</h3>
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
            {playerStats(game, true, boxscore || null, false)}
            {playerStats(game, false, boxscore || null, false)}
            {goalieStats(game, boxscore || null, false)}
          </div>
          <div data-is-swiper-slide className="roster-slide swiper-no-swiping">
            {playerStats(game, true, boxscore || null, true)}
            {playerStats(game, false, boxscore || null, true)}
            {goalieStats(game, boxscore || null, true)}
          </div>
        </Carousel>
      </div>
    </>
  );
};
