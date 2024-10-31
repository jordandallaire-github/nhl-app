import React from "react";
import PlayerCard from "../../player/template/playerCard";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";

interface PlayerGroupProps {
  title: string;
  players: PlayerDetailsType[];
  teamColor: string | null;
  teamAbbrev: string;
  teamCommonName?: string;
}

const SingleTeamPlayerGroup: React.FC<PlayerGroupProps> = ({
  title,
  players,
  teamColor,
  teamAbbrev,
  teamCommonName,
}) => {
  return (
    <div className="player-position">
      <h2>{title} :</h2>
      <div className="cards team-players">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            teamColor={teamColor}
            teamAbbrev={teamAbbrev}
            teamCommonName={teamCommonName}
          />
        ))}
      </div>
    </div>
  );
};

export default SingleTeamPlayerGroup;
