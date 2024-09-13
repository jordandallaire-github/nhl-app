import React from "react";
import { Player } from "../../fetcher/playerInfos";

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => (
  <a
    href="#"
    className="player-card window-effect" /* style={{backgroundColor: player.teamColor}} */
  >
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
        <p>#{player.sweaterNumber}</p>
        <img
        className="team-logo"
        src={player.teamLogo}
        alt={`${player.teamName} logo`}
      />
        <p>
          {player.positionCode === "R"
            ? "AD"
            : player.positionCode === "L"
            ? "AG"
            : player.positionCode}
        </p>
      </div>
    </div>
    <div
      className="player-background-color"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 0, #7fcfff33, #0000 80%), radial-gradient(circle at 50% 0, ${player.teamColor}, #0000)`,
      }}
    ></div>
  </a>
);

export default PlayerCard;
