import React from "react";
import { Link } from "react-router-dom";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { generatePlayerSlug } from "../../../scripts/utils/generatePlayerSlug";
import FollowButton from "../../utils/follow";

interface PlayerCardProps {
  player: PlayerDetailsType;
  teamAbbrev?: string;
  teamColor?: string | null;
  teamCommonName?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  teamAbbrev,
  teamColor,
  teamCommonName,
}) => {
  const teamLogo = `https://assets.nhle.com/logos/nhl/svg/${teamAbbrev}_light.svg`;

  return (
    <div className="card window-effect">
      <Link
        to={`/equipes/${teamCommonName}/joueur/${generatePlayerSlug(
          player.firstName.default,
          player.lastName.default,
          player.id.toString()
        )}`}
      >
        <div className="card-media player">
          <img
            src={player.headshot}
            alt={`${player.firstName.default} ${player.lastName.default}`}
            loading="lazy"
          />
        </div>
        <div className="card-content">
          <p className="name">
            <strong>
              {player.firstName.default} {player.lastName.default}
            </strong>
          </p>
          <div className="other-infos">
            <p>
              <strong>#{player.sweaterNumber}</strong>
            </p>
            <img className="team-logo" src={teamLogo} alt={`logo`} loading="lazy" />
            <p>
              <strong>
                {player.positionCode === "R"
                  ? "AD"
                  : player.positionCode === "L"
                  ? "AG"
                  : player.positionCode}
              </strong>
            </p>
          </div>
        </div>
        <div
          className="card-background-color"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0, #7fcfff33, #0000 80%), radial-gradient(circle at 50% 0, ${teamColor}, #0000)`,
          }}
        ></div>
      </Link>
      <FollowButton
        playerId={player.playerId}
        playerData={{
          name: player.firstName.default + " " + player.lastName.default,
          teamAbbrev: teamAbbrev ?? "",
          sweaterNumber: player.sweaterNumber,
          positionCode: player.positionCode,
          teamName: teamCommonName ?? "",
          teamColor: teamColor ?? "",
        }}
      ></FollowButton>
    </div>
  );
};

export default PlayerCard;
