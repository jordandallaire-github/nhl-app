import { useEffect, useState } from "react";
import { FollowedPlayer } from "../interfaces/followedPlayer";
import { useFollowSystem } from "../scripts/followSystem";
import { renderPlayerCard } from "../scripts/renderFollowPlayers";

const FollowPlayer = (): JSX.Element => {
  const { followedPlayers } = useFollowSystem();
  const [localFollowedPlayers, setLocalFollowedPlayers] = useState<FollowedPlayer[]>([]);

  useEffect(() => {
    setLocalFollowedPlayers(followedPlayers);
  }, [followedPlayers]);

  return (
    <section className="hero follow-players">
      <div className="wrapper">
        <h1>Joueurs suivis:</h1>
        {localFollowedPlayers.length > 0 ? (
          <div className="search-results cards">
            {localFollowedPlayers.map(player => 
              renderPlayerCard(player)
            )}
          </div>
        ) : (
          <p><strong>Aucun joueur suivis.</strong></p>
        )}
      </div>
    </section>
  );
};

export default FollowPlayer;
