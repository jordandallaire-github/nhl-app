import { PlayerDetailsType } from "../../../fetcher/playerDetails";

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

const PlayerSingleHero: React.FC<{ player: PlayerDetailsType }> = ({ player }) => (
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
