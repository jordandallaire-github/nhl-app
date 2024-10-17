import React, { useEffect, useRef, useState, useCallback } from "react";
import brightcovePlayerLoader from "@brightcove/player-loader";

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  description?: string;
  date?: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  title,
  description,
  date,
  onClose,
}) => {
  const [playerId, setPlayerId] = useState<string>(`player-${videoId}`);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current
          .querySelector(".window-effect")
          ?.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    const loadPlayer = async () => {
      const mainElement = document.querySelector("main");
      if (!mainElement) return;

      const oldContainers = mainElement.querySelectorAll(
        ".highlight-goal:empty"
      );
      oldContainers.forEach((container) => container.remove());

      let containerVideo = mainElement
        .querySelector(`.highlight-goal #${playerId}`)
        ?.closest(".highlight-goal") as HTMLDivElement;
      const card = document.createElement("div");
      card.classList.add("video", "window-effect");

      if (!containerVideo) {
        containerVideo = document.createElement("div");
        containerVideo.classList.add("highlight-goal");
        mainElement.appendChild(containerVideo);
        containerVideo.appendChild(card);
      } else {
        containerVideo.innerHTML = "";
      }

      containerRef.current = containerVideo;

      const playerElement = document.createElement("div");
      playerElement.id = playerId;

      if (title || description || date) {
        const infoElement = document.createElement("div");
        infoElement.className = "goal-info";
        infoElement.innerHTML = `
          <h4>${title || ""}</h4>
          <p>${description || ""}</p>
          <span class="date">${date || ""}</span>
        `;

        card.appendChild(infoElement);
      }

      card.appendChild(playerElement);

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
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      const mainElement = document.querySelector("main");
      const containerToRemove = mainElement
        ?.querySelector(`.highlight-goal #${playerId}`)
        ?.closest(".highlight-goal") as HTMLElement;
      if (containerToRemove) {
        containerToRemove.remove();
      }
    };
  }, [videoId, playerId, title, description, date, handleClickOutside]);

  useEffect(() => {
    setPlayerId(`player-${videoId}`);
  }, [videoId]);

  return null;
};

export default VideoPlayer;
