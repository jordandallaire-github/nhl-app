import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";

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

const PlayerSingleMoreInfos: React.FC<{ player: PlayerDetailsType }> = ({
  player,
}) => (
  <section className="more-infos mobile">
    <div className="wrapper">
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
  </section>
);

export default PlayerSingleMoreInfos;
