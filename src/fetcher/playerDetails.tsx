import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Carousel from "../components/carousel";

export interface PlayerDetails {
  id: number;
  heroImage: string;
  firstName: string;
  lastName: string;
  sweaterNumber: string;
  positionCode: string;
  currentTeamAbbrev: string;
  headshot: string;
  teamLogo: string;
  teamName: string;
  fullTeamName: string;
  shootsCatches: string;
  teamColor: string;
  heightInFeet: string;
  birthDate: string;
  weightInPounds: string;
  age: string;
  birthCity: string;
  birthStateProvince: string;
  birthCountry: string;
  draftYear: string;
  draftTeamAbbre: string;
  draftRound: string;
  draftPickRound: string;
  draftOverallPick: string;
  featuredStats?: FeaturedStats;
}

interface FeaturedStats {
  season: number;
  regularSeason: {
    subSeason: {
      assists: number;
      gameWinningGoals: number;
      gamesPlayed: number;
      goals: number;
      otGoals: number;
      pim: number;
      plusMinus: number;
      points: number;
      powerPlayGoals: number;
      powerPlayPoints: number;
      shootingPctg: number;
      shorthandedGoals: number;
      shorthandedPoints: number;
      shots: number;
    };
    career: {
      assists: number;
      gameWinningGoals: number;
      gamesPlayed: number;
      goals: number;
      otGoals: number;
      pim: number;
      plusMinus: number;
      points: number;
      powerPlayGoals: number;
      powerPlayPoints: number;
      shootingPctg: number;
      shorthandedGoals: number;
      shorthandedPoints: number;
      shots: number;
    };
  };
  playoffs: {
    subSeason: {
      assists: number;
      gameWinningGoals: number;
      gamesPlayed: number;
      goals: number;
      otGoals: number;
      pim: number;
      plusMinus: number;
      points: number;
      powerPlayGoals: number;
      powerPlayPoints: number;
      shootingPctg: number;
      shorthandedGoals: number;
      shorthandedPoints: number;
      shots: number;
    };
    career: {
      assists: number;
      gameWinningGoals: number;
      gamesPlayed: number;
      goals: number;
      otGoals: number;
      pim: number;
      plusMinus: number;
      points: number;
      powerPlayGoals: number;
      powerPlayPoints: number;
      shootingPctg: number;
      shorthandedGoals: number;
      shorthandedPoints: number;
      shots: number;
    };
  };
}

const formatSeason = (season: number | undefined): string => {
  if (!season) return "";
  const seasonString = season.toString();
  const startYear = seasonString.slice(0, 4);
  const endYear = seasonString.slice(6, 8);
  return `${startYear}-${endYear}`;
};
function calculateAge(birthDate: string): string {
  const today = new Date();
  const birthDay = new Date(birthDate);
  const age = today.getFullYear() - birthDay.getFullYear();

  const isBeforeBirthday =
    today.getMonth() < birthDay.getMonth() ||
    (today.getMonth() === birthDay.getMonth() &&
      today.getDate() < birthDay.getDate());

  return isBeforeBirthday ? (age - 1).toString() : age.toString();
}

function cmToFeetAndInches(cm: number): string {
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm % 30.48) / 2.54);
  return `${feet}'${inches}"`;
}

const getPositionLabel = (positionCode: string) => {
  switch (positionCode) {
    case "R":
      return "AD";
    case "L":
      return "AG";
    default:
      return positionCode;
  }
};

const getDraftDetails = (player: PlayerDetails) => {
  if (
    player.draftYear &&
    player.draftTeamAbbre &&
    player.draftOverallPick &&
    player.draftRound &&
    player.draftPickRound
  ) {
    const overallSuffix = player.draftOverallPick === "1" ? "re" : "e";
    const roundSuffix = player.draftRound === "1" ? "re" : "e";
    const pickSuffix = player.draftPickRound === "1" ? "re" : "e";

    return `${player.draftYear}, ${player.draftTeamAbbre} (${player.draftOverallPick}${overallSuffix} au total), ${player.draftRound}${roundSuffix} ronde, ${player.draftPickRound}${pickSuffix} choix`;
  }

  return "Jamais repêché";
};

const PlayerDetails: React.FC = () => {
  const { playerSlug } = useParams<{ playerSlug: string }>();
  const [player, setPlayer] = useState<PlayerDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        if (!playerSlug) throw new Error("Invalid player slug");

        const playerId = playerSlug.split("-").pop();
        if (!playerId) throw new Error("Invalid player ID");

        const colorRes = await fetch("/teamColor.json");
        if (!colorRes.ok) throw new Error("Failed to fetch team colors");
        const teamColorData = await colorRes.json();

        const res = await fetch(
          `https://api-web.nhle.com/v1/player/${playerId}/landing`
        );
        if (!res.ok) throw new Error("Failed to fetch player data");
        const playerData = await res.json();

        setPlayer({
          id: playerData.id,
          heroImage: playerData.heroImage,
          firstName: playerData.firstName.default,
          lastName: playerData.lastName.default,
          sweaterNumber: playerData.sweaterNumber || "00",
          positionCode: playerData.position,
          currentTeamAbbrev: playerData.currentTeamAbbrev,
          headshot: playerData.headshot,
          teamLogo: playerData.teamLogo,
          teamName: playerData.teamName,
          fullTeamName: playerData.fullTeamName.fr,
          shootsCatches: playerData.shootsCatches,
          teamColor: teamColorData[playerData.currentTeamAbbrev].color,
          heightInFeet: cmToFeetAndInches(playerData.heightInCentimeters),
          weightInPounds: playerData.weightInPounds,
          birthDate: playerData.birthDate,
          age: calculateAge(playerData.birthDate),
          birthCity:
            playerData.birthCity?.fr || playerData.birthCity?.default || "",
          birthStateProvince:
            playerData.birthStateProvince?.fr ||
            playerData.birthStateProvince?.default ||
            "",
          birthCountry: playerData.birthCountry,
          draftOverallPick: playerData.draftDetails?.overallPick || "",
          draftYear: playerData.draftDetails?.year || "",
          draftTeamAbbre: playerData.draftDetails?.teamAbbrev || "",
          draftRound: playerData.draftDetails?.round || "",
          draftPickRound: playerData.draftDetails?.pickInRound || "",
          featuredStats: playerData.featuredStats,
        });
      } catch (error) {
        if (error instanceof Error) setError(error.message);
      }
    };

    fetchPlayer();
  }, [playerSlug]);

  if (error) return <div>Error: {error}</div>;
  if (!player) return <div>Loading...</div>;

  return (
    <>
      <section className="hero single-player">
        <img
          className="hero-player"
          src={player.heroImage}
          alt={`${player.firstName} ${player.lastName}`}
        />
        <div className="wrapper">
          <div className="card basic-infos-player">
            <div className="media">
              <img
                src={player.headshot}
                alt={`${player.firstName} ${player.lastName}`}
              />
            </div>
            <div className="card-content">
              <h1>{`${player.firstName} ${player.lastName}`}</h1>
              <div className="other-infos">
                <p>{`#${player.sweaterNumber}`}</p>
                <img
                  className="team-logo"
                  src={player.teamLogo}
                  alt={`${player.fullTeamName} logo`}
                />
                <p>{`${getPositionLabel(player.positionCode)}`}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="global-stats">
        <div className="wrapper">
          <Carousel
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoint={{ 1020: { spaceBetween: 10, slidesPerView: 1 } }}
            noSwiping={true}
            noSwipingClass=".noSwipe"
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
            <div data-is-swiper-slide className="normal-stats noSwipe">
              <div className="current-season-stats">
                <h3>
                  {`Saison ${
                    formatSeason(player.featuredStats?.season)
                      ? formatSeason(player.featuredStats?.season)
                      : "2023-24"
                  }`}
                </h3>
                <div className="short-stats-list">
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
                        <th>
                          {player.featuredStats?.regularSeason?.subSeason
                            ?.gamesPlayed ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.regularSeason?.subSeason
                            ?.goals ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.regularSeason?.subSeason
                            ?.assists ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.regularSeason?.subSeason
                            ?.points ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.regularSeason?.subSeason
                            ?.plusMinus ?? 0}
                        </th>
                        <th className="statsNoMobile">
                          {player.featuredStats?.regularSeason?.subSeason
                            ?.pim ?? 0}
                        </th>
                        <th className="statsNoMobile">
                          {player.featuredStats?.regularSeason?.subSeason?.shootingPctg?.toFixed(
                            3
                          ) ?? 0}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="current-total-stats">
                <h3>Carrière</h3>
                <div className="short-stats-list">
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
                        <th>
                          {player.featuredStats?.regularSeason?.career
                            ?.gamesPlayed ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.regularSeason?.career?.goals ??
                            0}
                        </th>
                        <th>
                          {player.featuredStats?.regularSeason?.career
                            ?.assists ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.regularSeason?.career
                            ?.points ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.regularSeason?.career
                            ?.plusMinus ?? 0}
                        </th>
                        <th className="statsNoMobile">
                          {player.featuredStats?.regularSeason?.career?.pim ??
                            0}
                        </th>
                        <th className="statsNoMobile">
                          {player.featuredStats?.regularSeason?.career?.shootingPctg?.toFixed(
                            3
                          ) ?? 0}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div data-is-swiper-slide className="playoff-stats noSwipe">
              <div className="current-season-stats">
                <h3>
                  {`Série ${
                    formatSeason(player.featuredStats?.season)
                      ? formatSeason(player.featuredStats?.season)
                      : "2023-24"
                  }`}
                </h3>
                <div className="short-stats-list">
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
                        <th>
                          {player.featuredStats?.playoffs?.subSeason
                            ?.gamesPlayed ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.playoffs?.subSeason?.goals ??
                            0}
                        </th>
                        <th>
                          {player.featuredStats?.playoffs?.subSeason?.assists ??
                            0}
                        </th>
                        <th>
                          {player.featuredStats?.playoffs?.subSeason?.points ??
                            0}
                        </th>
                        <th>
                          {player.featuredStats?.playoffs?.subSeason
                            ?.plusMinus ?? 0}
                        </th>
                        <th className="statsNoMobile">
                          {player.featuredStats?.playoffs?.subSeason?.pim ?? 0}
                        </th>
                        <th className="statsNoMobile">
                          {player.featuredStats?.playoffs?.subSeason?.shootingPctg?.toFixed(
                            3
                          ) ?? 0}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="current-total-stats">
                <h3>Carrière en séries</h3>
                <div className="short-stats-list">
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
                        <th>
                          {player.featuredStats?.playoffs?.career
                            ?.gamesPlayed ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.playoffs?.career?.goals ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.playoffs?.career?.assists ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.playoffs?.career?.points ?? 0}
                        </th>
                        <th>
                          {player.featuredStats?.playoffs?.career?.plusMinus ??
                            0}
                        </th>
                        <th className="statsNoMobile">
                          {player.featuredStats?.playoffs?.career?.pim ?? 0}
                        </th>
                        <th className="statsNoMobile">
                          {player.featuredStats?.playoffs?.career?.shootingPctg?.toFixed(
                            3
                          ) ?? 0}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </section>
      <section className="general-infos-player">
        <div className="wrapper">
          <p>{`Lance de la: ${player.shootsCatches === "L" ? "G" : "D"}`}</p>
          <p>{`Taille: ${player.heightInFeet}`}</p>
          <p>{`Poids: ${player.weightInPounds} lb`}</p>
          <p>{`Date de naissance: ${player.birthDate}`}</p>
          <p>{`Lieu de naissance: ${player.birthCity}, ${
            player.birthStateProvince ? `${player.birthStateProvince}, ` : ""
          }${player.birthCountry}`}</p>
          <p>{`Repêchage: ${getDraftDetails(player)}`}</p>
          <p>{`Âge: ${player.age}`}</p>
        </div>
      </section>
    </>
  );
};

export default PlayerDetails;
