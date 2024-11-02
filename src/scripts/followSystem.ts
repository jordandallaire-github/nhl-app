import { useState, useCallback, useEffect } from 'react';
import { FollowedPlayer } from '../interfaces/followedPlayer';

const STORAGE_KEY = 'followedPlayers';

interface FollowUpdateEvent extends CustomEvent {
  detail: FollowedPlayer[];
}

declare global {
  interface WindowEventMap {
    'followedPlayersUpdate': FollowUpdateEvent;
  }
}

const FOLLOW_UPDATE_EVENT = 'followedPlayersUpdate';

const broadcastUpdate = (players: FollowedPlayer[]): void => {
  const event = new CustomEvent<FollowedPlayer[]>(FOLLOW_UPDATE_EVENT, { 
    detail: players 
  });
  window.dispatchEvent(event);
};

export const useFollowSystem = () => {
  const [followedPlayers, setFollowedPlayers] = useState<FollowedPlayer[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === STORAGE_KEY) {
        const newValue = e.newValue ? JSON.parse(e.newValue) : [];
        setFollowedPlayers(newValue);
      }
    };
    const handleFollowUpdate = (e: FollowUpdateEvent): void => {
      setFollowedPlayers(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(FOLLOW_UPDATE_EVENT, handleFollowUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(FOLLOW_UPDATE_EVENT, handleFollowUpdate);
    };
  }, []);

  const isPlayerFollowed = useCallback(
    (playerId: string): boolean => {
      return followedPlayers.some(player => String(player.playerId) === String(playerId));
    },
    [followedPlayers]
  );

  const addFollowedPlayer = useCallback((player: FollowedPlayer): void => {
    const playerIdString = String(player.playerId);

    setFollowedPlayers(prevPlayers => {
      if (prevPlayers.some(p => String(p.playerId) === playerIdString)) {
        return prevPlayers;
      }

      const newFollowedPlayers = [
        ...prevPlayers,
        {
          ...player,
          playerId: playerIdString,
          sweaterNumber: String(player.sweaterNumber)
        }
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFollowedPlayers));
      broadcastUpdate(newFollowedPlayers);

      return newFollowedPlayers;
    });
  }, []);

  const removeFollowedPlayer = useCallback((playerId: string): void => {
    const playerIdString = String(playerId);

    setFollowedPlayers(prevPlayers => {
      const newFollowedPlayers = prevPlayers.filter(
        player => String(player.playerId) !== playerIdString
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFollowedPlayers));
      broadcastUpdate(newFollowedPlayers);

      return newFollowedPlayers;
    });
  }, []);

  return {
    followedPlayers,
    isPlayerFollowed,
    addFollowedPlayer,
    removeFollowedPlayer
  };
};