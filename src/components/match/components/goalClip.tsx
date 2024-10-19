import React, { useState, useCallback } from "react";
import { Svg } from "../../../scripts/utils/Icons";
import VideoPlayer from "../../utils/brightcove";

interface GoalProps {
  fr: string;
  title?: string;
  description?: string;
  date?: string;
  isSvg?: boolean;
  children?: React.ReactNode;
  isWindowEffect?: boolean;
}

const GoalClip: React.FC<GoalProps> = ({
  fr,
  title,
  description,
  date,
  isSvg,
  children,
  isWindowEffect
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoId =
    fr?.toString().split("-").pop();

  const handleClick = useCallback(() => {
    setShowVideo(true);
    document.documentElement.style.overflow = "hidden";
  }, []);

  const handleVideoClose = useCallback(() => {
    setShowVideo(false);
    document.documentElement.style.overflow = "auto";
  }, []);

  return (
    <>
      {isSvg && (
        <div className="clip" onClick={handleClick}>
          <Svg name="recap-play-video" size="sm" />
        </div>
      )}

      {showVideo && videoId && (
        <VideoPlayer
          videoId={videoId}
          title={title}
          description={description}
          date={date}
          onClose={handleVideoClose}
        />
      )}

      {children && <div className={`video ${isWindowEffect ? "window-effect" : ""}`} onClick={handleClick}>{children}</div>}
    </>
  );
};

export default GoalClip;
