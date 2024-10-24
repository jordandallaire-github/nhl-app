import { INTMoreGameInfos } from "../../../interfaces/more-detail-match";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import Carousel from "../../utils/carousel";

export const renderGameInfos = (
  infos: INTMoreGameInfos,
  team: INTMainGameInfos
) => {
  return (
    <div className="game-infos-card window-effect">
      <div className="glare-effect"></div>
      <Carousel
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        breakpoint={{ 320: { spaceBetween: 0, slidesPerView: "auto" } }}
        noSwiping={true}
        grabCursor={false}
        autoHeight={true}
      >
        {infos.gameReports !== undefined ? (
          <div className="nav game-infos">
            <div className="swiper-button-prev">
              <h5>Rapports de match</h5>
            </div>

            <div className="swiper-button-next">
              <h5>Infos du match</h5>
            </div>
          </div>
        ) : (
          <div className="nav game-infos no-report">
            <h5>Infos du match</h5>
          </div>
        )}
        {infos.gameReports !== undefined && (
          <div
            data-is-swiper-slide
            className="game-infos-container swiper-no-swiping reports"
          >
            <ul>
              <li>
                <a target="_blank" href={infos.gameReports.gameSummary}>
                  Sommaire du match
                </a>
              </li>
              <li>
                <a target="_blank" href={infos.gameReports.eventSummary}>
                  Sommaire complet
                </a>
              </li>
              <li>
                <a target="_blank" href={infos.gameReports.playByPlay}>
                  Description complète
                </a>
              </li>
              <li>
                <a target="_blank" href={infos.gameReports.faceoffComparison}>
                  Comparaison des mises en jeu
                </a>
              </li>
              <li>
                <a target="_blank" href={infos.gameReports.faceoffSummary}>
                  Sommaire des mises en jeu
                </a>
              </li>
              <li>
                <a target="_blank" href={infos.gameReports.toiAway}>
                  Temps de jeu : {team.awayTeam.abbrev}
                </a>
              </li>
              <li>
                <a target="_blank" href={infos.gameReports.toiHome}>
                  Temps de jeu : {team.homeTeam.abbrev}
                </a>
              </li>
              <li>
                <a target="_blank" href={infos.gameReports.shotSummary}>
                  Rapport des tirs
                </a>
              </li>
              {infos.gameReports.shiftChart && (
                <li>
                  <a target="_blank" href={infos.gameReports.shiftChart}>
                    Graphique des présences
                  </a>
                </li>
              )}
              <li>
                <a target="_blank" href={infos.gameReports.rosters}>
                  Formations
                </a>
              </li>
            </ul>
          </div>
        )}

        <div
          data-is-swiper-slide
          className="game-infos-container swiper-no-swiping reports"
        >
          <div className="info">
            <p>Réseaux :</p>
            <p>
              {team.tvBroadcasts.map((broadcast, index) => (
                <span key={`broadcast-${broadcast.network}-${index}`}>
                  {index > 0 && ", "}
                  {broadcast.network}
                </span>
              ))}
            </p>
          </div>
          <div className="info">
            <p>Lieu :</p>
            <p>
              {team.venue.default}, {team.venueLocation.default}
            </p>
          </div>
          {infos.gameInfo.referees.length > 0 && (
            <div className="info referee">
              <p>Officiels :</p>
              <p>
                {infos.gameInfo.referees.map((referee, index) => (
                  <span key={`referee-${referee.default}-${index}`}>
                    {`${referee.default} - Arb. `}
                  </span>
                ))}
                {infos.gameInfo.linesmen.map((linesmen, index) => (
                  <span key={`linesmen-${linesmen.default}-${index}`}>
                    {`${linesmen.default} - JL `}
                  </span>
                ))}
              </p>
            </div>
          )}
          <div className="info">
            <p>Entraineur {team.awayTeam.abbrev} :</p>
            <p>{infos.gameInfo.awayTeam.headCoach.default}</p>
          </div>
          <div className="info">
            <p>Entraineur {team.homeTeam.abbrev} :</p>
            <p>{infos.gameInfo.homeTeam.headCoach.default}</p>
          </div>
          {infos.gameInfo.awayTeam.scratches.length > 0 && (
            <div className="info scratche">
              <p>{team.awayTeam.abbrev} retranchés :</p>
              <p>
                {infos.gameInfo.awayTeam.scratches.map((scratche, index) => (
                  <span key={`away-scratche-${scratche.id}-${index}`}>
                    {scratche.firstName.default} {scratche.lastName.default}
                  </span>
                ))}
              </p>
            </div>
          )}
          {infos.gameInfo.homeTeam.scratches.length > 0 && (
            <div className="info scratche">
              <p>{team.homeTeam.abbrev} retranchés :</p>
              <p>
                {infos.gameInfo.homeTeam.scratches.map((scratche, index) => (
                  <span key={`home-scratche-${scratche.id}-${index}`}>
                    {scratche.firstName.default} {scratche.lastName.default}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </Carousel>
    </div>
  );
};