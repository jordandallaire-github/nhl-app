import React, { useEffect, useRef, useState } from "react";
import brightcovePlayerLoader from "@brightcove/player-loader";

const VideoPlayer: React.FC<{ videoId: string }> = ({ videoId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerId, setPlayerId] = useState<string>(`player-${Date.now()}`);
  const videoJS = document.getElementsByName("video-js");

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
    setPlayerId(`player-${Date.now()}`);
  }, [videoId]);

  return <div ref={containerRef}></div>;
};

export default VideoPlayer;
