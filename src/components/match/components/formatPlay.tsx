import { PlayerEvent } from "../../../interfaces/playByPlay";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { Svg } from "../../../scripts/utils/Icons";

const formatShotType = (shot: string) => {
  switch (shot) {
    case "poke":
      return "harponné";
    case "tip-in":
      return "redirigé";
    case "wrist":
      return "du poignet";
    case "slap":
      return "frappé";
    case "snap":
      return "semi-frappé";
    case "deflected":
      return "dévié";
    case "backhand":
      return "du revers";
  }
};

const formatMissedShot = (shot: string) => {
  switch (shot) {
    case "wide-right":
      return "à droite du filet";
    case "wide-left":
      return "à gauche du filet";
    case "high-and-wide-left":
      return "à gauche et au-dessus du filet";
    case "high-and-wide-right":
      return "à droite et au-dessus du filet";
    case "above-crossbar":
      return "au-dessus de la barre transversale";
    case "hit-left-post":
      return "sur le poteau gauche";
    case "hit-right-post":
      return "sur le poteau droite";
    default:
      return shot;
  }
};

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
    case "goalie-puck-frozen-played-from-beyond-center":
      return "Rondelle immobilisée par le gardien - participe au jeu au-delà de la ligne centrale";
    case "net-dislodged-defensive-skater":
      return "Filet déplacé par un joueur défensif";
    case "net-dislodged-forward-skater":
      return "Filet déplacé par un joueur offensif";
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

export const SvgName = (svg: string | null) => {
  switch (svg) {
    case "faceoff":
      return svg;
    case "takeaway":
      return "turnover";
    case "hit":
      return svg;
    case "shot-on-goal":
      return "shot";
    case "missed-shot":
      return "block";
    case "giveaway":
      return "turnover";
    case "blocked-shot":
    case "delayed-penalty":
    case "penalty":
      return "block";
    case "goal":
      return "siren";
    default:
      return svg;
  }
};

export const formatPenalty = (penalty: string) => {
  switch (penalty) {
    case "unsportsmanlike-conduct":
      return "conduite antisportive aux dépens de";
    case "fighting":
      return "s'être battu aux dépens de";
    case "roughing":
      return "rudesse aux dépens de";
    case "tripping":
      return "avoir fait trébucher aux dépens de";
    case "interference":
      return "obstruction aux dépens de";
    case "delaying-game-puck-over-glass":
      return "avoir retardé le match - rondelle par-dessus la baie vitrée";
    case "slashing":
      return "coup de bâton aux dépens de";
    case "interference-goalkeeper":
      return "obstruction du gardien aux dépens de";
    case "delaying-game-unsuccessful-challenge":
      return "Avoir retardé le match - contestation infructueuse";
    case "holding":
      return "avoir retenu aux dépens de";
    case "cross-checking":
      return "double-échec aux dépens de";
    case "hooking":
      return "avoir accroché aux dépens de";
    case "high-sticking":
      return "bâton élevé aux dépens de";
    case "too-many-men-on-the-ice":
      return "Trop de joueurs sur la glace";
    case "holding-the-stick":
      return "avoir retenu le bâton aux dépens de";
    case "roughing-removing-opponents-helmet":
      return "rudesse - retirer le casque d'un adversaire aux dépens de";
    case "instigator":
      return "instigateur aux dépens de";
    case "instigator-misconduct":
      return "instigateur - inconduite";
    case "game-misconduct":
      return "inconduite de partie";
    case "elbowing":
      return "avoir donné du coude aux dépens de";
    case "misconduct":
      return "inconduite";
    default:
      return penalty;
  }
};

const findPlayerByEventType = (
  play: PlayerEvent,
  homeRoster: PlayerDetailsType[] | null,
  awayRoster: PlayerDetailsType[] | null
): {
  mainPlayer?: PlayerDetailsType;
  secondaryPlayer?: PlayerDetailsType;
} => {
  if (!play.details) return {};

  const findPlayer = (
    playerId: string | number | undefined
  ): PlayerDetailsType | undefined => {
    return (
      homeRoster?.find((player) => player.id === playerId) ||
      awayRoster?.find((player) => player.id === playerId)
    );
  };

  switch (play.typeDescKey) {
    case "hit":
      return {
        mainPlayer: findPlayer(play.details.hittingPlayerId),
        secondaryPlayer: findPlayer(play.details.hitteePlayerId),
      };

    case "faceoff":
      return {
        mainPlayer: findPlayer(play.details.winningPlayerId),
        secondaryPlayer: findPlayer(play.details.losingPlayerId),
      };

    case "shot":
    case "shot-on-goal":
      return {
        mainPlayer: findPlayer(play.details.shootingPlayerId),
        secondaryPlayer: findPlayer(play.details.goalieInNetId),
      };

    case "missed-shot":
      return {
        mainPlayer: findPlayer(play.details.shootingPlayerId),
      };

    case "penalty":
      return {
        mainPlayer: findPlayer(play.details.committedByPlayerId),
        secondaryPlayer: findPlayer(play.details.drawnByPlayerId),
      };

    case "blocked-shot":
      return {
        mainPlayer: findPlayer(play.details.blockingPlayerId),
        secondaryPlayer: findPlayer(play.details.shootingPlayerId),
      };

    case "goalie-change":
      return {
        mainPlayer: findPlayer(play.details.pulledPlayerId),
      };

    case "takeaway":
      return {
        mainPlayer: findPlayer(play.details.playerId),
      };

    case "giveaway":
      return {
        mainPlayer: findPlayer(play.details.playerId),
      };

    default:
      return {};
  }
};

export const formatPlayDescription = (
  play: PlayerEvent,
  homeRoster: PlayerDetailsType[] | null,
  awayRoster: PlayerDetailsType[] | null
): string => {
  const { mainPlayer, secondaryPlayer } = findPlayerByEventType(
    play,
    homeRoster,
    awayRoster
  );

  if (!mainPlayer) return "";

  const formatPlayer = (player: PlayerDetailsType, total?: string) => {
    return `${player.firstName.default} ${player.lastName.default} #${
      player.sweaterNumber
    }${total ? ` (${total})` : ""}`;
  };

  switch (play.typeDescKey) {
    case "hit":
      return secondaryPlayer
        ? `${formatPlayer(mainPlayer)} mise en échec sur ${formatPlayer(
            secondaryPlayer
          )}`
        : formatPlayer(mainPlayer);

    case "faceoff":
      return secondaryPlayer
        ? `${formatPlayer(
            mainPlayer
          )} a remporté la mise en jeu contre ${formatPlayer(secondaryPlayer)}`
        : `${formatPlayer(mainPlayer)} gagne la mise en jeu`;

    case "shot":
    case "shot-on-goal":
      return secondaryPlayer
        ? `${formatPlayer(mainPlayer)} tir ${formatShotType(
            play.details?.shotType ?? ""
          )} arrêté par ${formatPlayer(secondaryPlayer)}`
        : `${formatPlayer(mainPlayer)} gagne la mise en jeu`;

    case "penalty":
      return secondaryPlayer
        ? `${formatPlayer(mainPlayer)} ${
            play.details?.duration
          } minutes pour ${formatPenalty(
            play.details?.descKey ?? ""
          )} ${formatPlayer(secondaryPlayer)}`
        : `Pénalité à ${formatPlayer(mainPlayer)}`;

    case "blocked-shot":
      return secondaryPlayer
        ? `Tir de ${formatPlayer(secondaryPlayer)} bloqué par ${formatPlayer(
            mainPlayer
          )}`
        : `Tir bloqué par ${formatPlayer(mainPlayer)}`;

    case "takeaway":
      return `Revirement provoqué par ${formatPlayer(mainPlayer)}`;

    case "missed-shot":
      return `${formatPlayer(mainPlayer)} tir ${formatShotType(
        play.details?.shotType ?? ""
      )} ${formatMissedShot(play.details?.reason ?? "")}`;

    case "giveaway":
      return `Revirement par ${formatPlayer(mainPlayer)}`;

    case "goalie-change":
      return `${formatPlayer(mainPlayer)} retiré`;

    default:
      return formatPlayer(mainPlayer);
  }
};

export const Play = (type: string, stopReason: string | null) => {
  switch (type) {
    default:
      return (
        <div className="stop-play whistle window-effect">
          <Svg name="whistle" size="sm"></Svg>
          <p>{Stoppage(stopReason ?? type)}</p>
        </div>
      );
  }
};
