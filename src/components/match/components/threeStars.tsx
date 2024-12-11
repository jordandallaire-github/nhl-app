import { INTMainGameInfos } from "../../../interfaces/main-match";
import { TeamsLogoLinks } from "./teamLogoLink";
import { FormatPosition } from "../../../scripts/utils/formatPosition";
import { Link } from "react-router-dom";
import Carousel from "../../utils/carousel";

interface Colors {
  home: string | null;
  away: string | null;
}

export const ThreeStars: React.FC<{
  game: INTMainGameInfos;
  teamColors: Colors;
}> = ({ game, teamColors }) => (
  <div className="three-stars">
    <h2>Trois étoiles du match</h2>
    <div className="cards-container three-star">
      <Carousel
        breakpoint={{
          700: { slidesPerView: 3, spaceBetween: 10 },
          525: { slidesPerView: 2.2, spaceBetween: 10 },
          320: { slidesPerView: 1.5, spaceBetween: 10 },
        }}
        freeMode={true}
      >
        {game.summary.threeStars.map((star) => (
          <div
            data-is-swiper-slide
            style={{
              backgroundImage: `radial-gradient(circle at 50% 0, #7fcfff33, #0000 80%), radial-gradient(circle at 50% 0, ${
                star.teamAbbrev === game.awayTeam.abbrev
                  ? teamColors.away
                  : teamColors.home
              }, #0000)`,
            }}
            key={star.name.default}
            className="card-star window-effect"
          >
            <div className="media">
              <Link
                to={`/equipes/${
                  game?.awayTeam.abbrev === star.teamAbbrev
                    ? game?.awayTeam.commonName.default
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                    : game?.homeTeam.commonName.default
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                }/joueur/${star.name.default.toLowerCase()}-${star.playerId}`}
              >
                <img src={star.headshot} alt={`${star.name}`} loading="lazy" />
              </Link>
              <div className="content">
                <p><strong>{star.name.default}</strong></p>
                <div className="infos-player">
                  <span><strong>#{star.sweaterNo}</strong></span>
                  <TeamsLogoLinks
                    team={
                      star.teamAbbrev === game.homeTeam.abbrev
                        ? game.homeTeam
                        : game.awayTeam
                    }
                  ></TeamsLogoLinks>
                  <span><strong>{FormatPosition(star.position)}</strong></span>
                </div>
                <div className="stats window-effect">
                  {star.position === "C" ||
                  star.position === "L" ||
                  star.position === "R" ||
                  star.position === "D" ? (
                    <>
                      <div className="stat">
                        <span>B</span>
                        <p>
                          <strong>{star.goals}</strong>
                        </p>
                      </div>
                      <div className="stat">
                        <span>A</span>
                        <p>
                          <strong>{star.assists}</strong>
                        </p>
                      </div>
                      <div className="stat">
                        <span>PTS</span>
                        <p>
                          <strong>{star.points}</strong>
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="stat">
                        <span>Moy</span>
                        <p>
                          <strong>{star.goalsAgainstAverage}</strong>
                        </p>
                      </div>
                      <div className="stat">
                        <span>%Arr.</span>
                        <p>
                          <strong>{star.savePctg}</strong>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="star-number window-effect">
              <p>
                <strong>{star.star}</strong>
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  </div>
);
