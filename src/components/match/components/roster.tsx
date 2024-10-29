import { INTMainGameInfos } from "../../../interfaces/main-match";
import Carousel from "../../utils/carousel";
import { goalieStats, playerStats } from "./utilRosterPlayer";

interface Colors {
  home: string | null;
  away: string | null;
}

export const renderRosterMatch = (
  game: INTMainGameInfos,
  teamColors: Colors
) => {
  return (
    <>
      <div className="roster-match">
        <h2>Formation</h2>
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
            <div
              className={`indicator`}
              style={{
                backgroundColor: teamColors.away || "#000",
                boxShadow: `0 2px 25px 2px ${teamColors.away}`,
              }}
            ></div>
            <div className="nav-pill-roster">
              <div
                onClick={() =>
                  changeIndicatorColor("away", teamColors)
                }
                className={`roster-away`}
              >
                <p>{game.awayTeam.name.fr === "Club de hockey de l'Utah" ? "Club de l'Utah" : game.awayTeam.name.fr ? game.awayTeam.name.fr : game.awayTeam.name.default}</p>
              </div>
              <div
                onClick={() =>
                  changeIndicatorColor("home", teamColors)
                }
                className={`roster-home`}
              >
                <p>{game.homeTeam.name.fr === "Club de hockey de l'Utah" ? "Club de l'Utah" : game.homeTeam.name.fr ? game.homeTeam.name.fr : game.homeTeam.name.default}</p>
              </div>
              <div
                className={`indicator-pill-roster`}
                style={{ backgroundColor: teamColors.away || "#000" }}
              ></div>
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

const changeIndicatorColor = (
  teamType: "away" | "home",
  colors: Colors,
) => {
  const indicator = document.querySelector(".indicator") as HTMLElement;
  const indicatorPill = document.querySelector(
    ".indicator-pill-roster"
  ) as HTMLElement;

  if (teamType === "away") {
    indicator.classList.remove("home");
    indicator.classList.add("away");
    indicator.style.backgroundColor = colors.away || "#000";
    indicator.style.boxShadow = `0 2px 25px 2px ${colors.away}`;
    indicatorPill.style.backgroundColor = colors.away || "#000";
  } else {
    indicator.classList.remove("away");
    indicator.classList.add("home");
    indicator.style.backgroundColor = colors.home || "#000";
    indicator.style.boxShadow = `0 2px 25px 2px ${colors.home}`;
    indicatorPill.style.backgroundColor = colors.home || "#000";
  }
};
