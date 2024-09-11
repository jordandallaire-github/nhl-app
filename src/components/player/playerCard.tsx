// PlayerCard.tsx
import React from "react";
import { Player } from "../../fetcher/playerInfos";

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => (
  <a href="#" className="player-card window-effect">
    <div className="player-media">
      <img
        src={player.headshot}
        alt={`${player.firstName.default} ${player.lastName.default}`}
      />
    </div>
    <div className="player-content">
      <h3>
        {player.firstName.default} {player.lastName.default}
      </h3>
      <div className="other-infos">
        {" "}
        <img
          className="team-logo"
          src={player.teamLogo}
          alt={`${player.teamName} logo`}
        />
        <p>#{player.sweaterNumber}</p>
        <p>
          {player.positionCode === "R"
            ? "AD"
            : player.positionCode === "L"
            ? "AG"
            : player.positionCode}
        </p>
      </div>
    </div>
  </a>
);

export default PlayerCard;
