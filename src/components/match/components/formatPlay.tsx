import { Svg } from "../../../scripts/utils/Icons";

const Stoppage = (stoppage: string | null) => {
  switch (stoppage) {
    case "period-start":
      return "Début de la période";
    case "offside":
      return "Hors-jeu";
    case "puck-frozen":
      return "Disque immobilisé";
    case "goalie-stopped-after-sog":
      return "Tir immobilisé";
    case "puck-in-benches":
      return "Rondelle sur le banc";
    case "tv-timeout":
      return "Pause publicitaire";
    case "puck-in-netting":
      return "Rond. fil.";
    case "icing":
      return "Dégagement refusé";
    case "puck-in-crowd":
      return "Rondelle dans les gradins";
    case "high-stick":
      return "Bâton élevé";
    case "period-end":
      return "Fin de la période";
    case "game-end":
      return "Fin du match";
    case "hand-pass":
      return "Passe avec la main";
    case "referee-or-linesman":
      return "Arbitre ou juge de lignes";
    case "visitor-timeout":
      return "Temps d'arrêt visiteur";
    case "home-timeout":
      return "Temps d'arrêt domicile";
    default:
      return stoppage;
  }
};

 export const TypeDesc = (desc: string | null) => {
  switch (desc) {
    case "faceoff":
      return "Mise en jeu";
    case "takeaway":
      return "Revirement P.";
    case "hit":
      return "Mise en échec";
    case "shot-on-goal":
      return "Tir au but";
    case "missed-shot":
      return "Tir raté";
    case "giveaway":
      return "Revirement";
    case "blocked-shot":
      return "Tir bloqué";
    case "delayed-penalty":
      return "Pénalité à retardement";
    case "penalty":
      return "Pénalité";
    case "high-stick":
      return "Bâton élevé";
    case "period-end":
      return "Fin de la période";
    case "game-end":
      return "Fin du match";
    case "hand-pass":
      return "Passe avec la main";
    case "referee-or-linesman":
      return "Arbitre ou juge de lignes";
    case "visitor-timeout":
      return "Temps d'arrêt visiteur";
    case "home-timeout":
      return "Temps d'arrêt domicile";
    default:
      return desc;
  }
};

export const Play = (type: string, stopReason: string | null) => {
  switch (type) {
    default:
      return (
        <div className="stop-play whistle">
          <Svg name="whistle" size="sm"></Svg>
          <p>{Stoppage(stopReason ?? type)}</p>
        </div>
      );
  }
};
