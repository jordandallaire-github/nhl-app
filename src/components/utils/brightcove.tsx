import React, { useEffect, useRef, useState } from "react";
import brightcovePlayerLoader from "@brightcove/player-loader";

const VideoPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null); // Ref pour le player vidéo
  const [playerId, setPlayerId] = useState<string>(`player-${Date.now()}`);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadPlayer = async () => {
      const oldPlayer = document.getElementById(playerId);
      if (oldPlayer) {
        oldPlayer.remove();
      }

      const playerElement = document.createElement("div");
      playerElement.id = playerId;
      playerElement.classList.add("highlight-goal");
      playerRef.current = playerElement; // Assigner le player à playerRef
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.appendChild(playerElement);
      }

      try {
        const success = await brightcovePlayerLoader({
          accountId: "6415718365001",
          playerId: "EXtG1xJ7H",
          videoId: videoId,
          refNode: playerElement,
          embedType: "in-page",
        });

        const myPlayer = success.ref;
        if (myPlayer && typeof myPlayer.on === "function") {
          myPlayer.on("loadedmetadata", function () {
            myPlayer.muted(true);
          });
        }
      } catch (error) {
        console.error("Failed to load Brightcove player:", error);
      }
    };

    loadPlayer();

    return () => {
      const playerToRemove = document.getElementById(playerId);
      if (playerToRemove) {
        playerToRemove.remove();
      }
    };
  }, [videoId, playerId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
        // Si on clique à l'extérieur du player, enlever la vidéo
        const playerToRemove = document.getElementById(playerId);
        if (playerToRemove) {
          playerToRemove.remove();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [playerId]);

  useEffect(() => {
    setPlayerId(`player-${Date.now()}`);
  }, [videoId]);

  return <div ref={containerRef}></div>;
};

export default VideoPlayer;
