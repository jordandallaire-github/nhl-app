import React from "react";
import { Link } from "react-router-dom";
import { PlayerInfos } from "../../fetcher/teamRoster";
import { generatePlayerSlug } from "../utils/generatePlayerSlug";

interface PlayerCardProps {
  player: PlayerInfos;
  teamAbbrev?: string;
  teamColor?: string | null;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, teamAbbrev, teamColor }) => {
  const fetchedTeamAbbrev = teamAbbrev;
  const teamLogo = `https://assets.nhle.com/logos/nhl/svg/${teamAbbrev}_light.svg`;

  return (
    <Link
      to={`/equipe/${fetchedTeamAbbrev}/${generatePlayerSlug(
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
        <h3>
          {player.firstName.default} {player.lastName.default}
        </h3>
        <div className="other-infos">
          <p>#{player.sweaterNumber}</p>
          <img className="team-logo" src={teamLogo} alt={`logo`} />
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
        className="card-background-color"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0, #7fcfff33, #0000 80%), radial-gradient(circle at 50% 0, ${teamColor}, #0000)`,
        }}
      ></div>
    </Link>
  );
};

export default PlayerCard;
