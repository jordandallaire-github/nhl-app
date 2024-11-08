import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { FormatPosition } from "../../../scripts/utils/formatPosition";
import FollowButton from "../../utils/follow";

const getDraftDetails = (player: PlayerDetailsType) => {
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

const PlayerSingleHero: React.FC<{ player: PlayerDetailsType }> = ({
  player,
}) => (
  <section className="hero single-player">
    <img
      className="hero-player"
      src={player.heroImage}
      alt={`${player.firstName} ${player.lastName}`}
      loading="lazy"
    />
    <div className="wrapper">
      <div className="card basic-infos-player">
        <div className="media">
          <img
            src={player.headshot}
            alt={`${player.firstName} ${player.lastName}`}
            loading="lazy"
          />
        </div>
        <div className="card-content">
          <div className="name-follow">
            <h1>{`${player.firstName} ${player.lastName}`} </h1>
            <FollowButton
              playerId={player.playerId}
              playerData={{
                name: player.name,
                teamAbbrev: player.teamAbbrev,
                sweaterNumber: player.sweaterNumber,
                positionCode: player.positionCode,
                teamColor: player.teamColor,
                teamName: player.teamName.toLowerCase(),
              }}
              isSinglePlayer
            ></FollowButton>
          </div>
          <div className="other-infos">
            <p>
              <strong>{`#${player.sweaterNumber}`}</strong>
            </p>
            <img
              className="team-logo"
              src={player.teamLogo}
              alt={`${player.fullTeamName} logo`}
              loading="lazy"
            />
            <p>
              <strong>{`${FormatPosition(player.positionCode)}`}</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="more-infos">
        <h2>Connaître le joueur: </h2>
        <p>
          <strong>Lance de la: </strong>
          {`${player.shootsCatches === "L" ? "G" : "D"}`}
        </p>
        <p>
          <strong>Taille: </strong>
          {`${player.heightInFeet}`}
        </p>
        <p>
          <strong>Poids: </strong>
          {`${player.weightInPounds} lb`}
        </p>
        <p>
          <strong>Date de naissance: </strong>
          {`${player.birthDate}`}
        </p>
        <p>
          <strong>Lieu de naissance: </strong>
          {`${player.birthCity}, ${
            player.birthStateProvince ? `${player.birthStateProvince}, ` : ""
          }${player.birthCountry}`}
        </p>
        <p>
          <strong>Repêchage: </strong>
          {`${getDraftDetails(player)}`}
        </p>
        <p>
          <strong>Âge: </strong>
          {`${player.age}`}
        </p>
      </div>
    </div>
  </section>
);

export default PlayerSingleHero;
