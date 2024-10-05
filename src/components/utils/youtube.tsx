import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { Svg } from "../../scripts/utils/Icons";

interface YoutubeProps {
  videoId: string;
  controls?: boolean;
  customThumbnail?: boolean;
  platform: "youtube" | "youtube-short";
  poster?: string;
  iconName?: string;
  iconSize?: string;
  isStroke?: boolean;
}

const YouTube: React.FC<YoutubeProps> = ({
  videoId,
  controls = true,
  platform,
  customThumbnail,
  poster,
  iconName,
  iconSize,
  isStroke,
}) => {
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          !entries[0].isIntersecting &&
          !playerRef.current?.state.showPreview
        ) {
          playerRef.current?.getInternalPlayer()?.pauseVideo();
        }
      },
      { threshold: 0.1 } // Adjust the threshold if needed
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const getURL = () => {
    switch (platform) {
      case "youtube":
        return `https://www.youtube.com/watch?v=${videoId}`;
      case "youtube-short":
        return `https://www.youtube.com/shorts/${videoId}`;
    }
  };

  return (
    <div className="player-wrapper" ref={containerRef}>
      <ReactPlayer
        className="react-player"
        ref={playerRef}
        url={getURL()}
        controls={controls}
        light={customThumbnail ? poster : undefined}
        playIcon={
          <Svg name={`${iconName}`} size={`${iconSize}`} isStroke={isStroke} />
        }
        playing={customThumbnail ? true : false}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default YouTube;
