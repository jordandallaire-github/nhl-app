import { useEffect, useState } from 'react';
import { FollowedPlayer } from "../../interfaces/followedPlayer";
import { useFollowSystem } from "../../scripts/followSystem";
import { Svg } from "../../scripts/utils/Icons";

interface FollowButtonProps {
  playerId: string;
  playerData: {
    name: string;
    teamAbbrev: string;
    sweaterNumber: string | number;
    positionCode: string;
    teamColor: string;
    teamName: string;
  };
  isSinglePlayer?: boolean;
}

const FollowButton: React.FC<FollowButtonProps> = ({ playerId, playerData, isSinglePlayer }) => {
  const { isPlayerFollowed, addFollowedPlayer, removeFollowedPlayer, followedPlayers } = useFollowSystem();
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    setIsFollowed(isPlayerFollowed(String(playerId)));
  }, [playerId, isPlayerFollowed, followedPlayers]);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const playerIdString = String(playerId);
    
    if (isFollowed) {
      removeFollowedPlayer(playerIdString);
    } else {
      const playerInfo: FollowedPlayer = {
        playerId: playerIdString,
        name: playerData.name,
        teamAbbrev: playerData.teamAbbrev,
        sweaterNumber: String(playerData.sweaterNumber),
        positionCode: playerData.positionCode,
        imageUrl: `https://assets.nhle.com/mugs/nhl/20242025/${playerData.teamAbbrev}/${playerIdString}.png`,
        teamColor: playerData.teamColor,
        teamName: playerData.teamName
      };
      addFollowedPlayer(playerInfo);
    }
  };

  return (
    <button 
      className={`follow-player window-effect ${isFollowed ? 'active' : ''} ${isSinglePlayer ? "singlePlayer" : ""}`}
      onClick={handleFollowClick}
      aria-label={isFollowed ? 'Ne plus suivre' : 'Suivre'}
    >
      <Svg name="star" size="sm" />
    </button>
  );
};

export default FollowButton;