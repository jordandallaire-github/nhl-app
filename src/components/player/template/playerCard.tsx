import React from "react";
import { Link } from "react-router-dom";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { generatePlayerSlug } from "../../../scripts/utils/generatePlayerSlug";

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
    <Link
      to={`/equipes/${teamCommonName}/joueur/${generatePlayerSlug(
        player.firstName.default,
        player.lastName.default,
        player.id
      )}`}
      key={player.id}
      className="card window-effect"
    >
      <div className="card-media player">
        <img
          src={player.headshot}
          alt={`${player.firstName.default} ${player.lastName.default}`}
        />
      </div>
      <div className="card-content">
        <h4>
          {player.firstName.default} {player.lastName.default}
        </h4>
        <div className="other-infos">
          <p>
            <strong>#{player.sweaterNumber}</strong>
          </p>
          <img className="team-logo" src={teamLogo} alt={`logo`} />
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
  );
};

export default PlayerCard;
