import React, { useState } from "react";
import { Svg } from "../../../scripts/utils/Icons";
import VideoPlayer from "../../utils/brightcove";

interface GoalProps {
  fr: string;
  en: string;
}

const GoalClip: React.FC<GoalProps> = ({
  fr,
  en,
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoId = fr?.toString().split('-').pop() || (en?.toString().split('-').pop());

  const handleClick = () => {
    setShowVideo(true);
  };

  return (
    <div className="video-player">
      {(fr || en) && !showVideo ? (
        <div className="clip" onClick={handleClick}>
          <Svg name="recap-play-video" size="sm" />
        </div>
      ) : (
        ""
      )}
      {showVideo && videoId && <VideoPlayer videoId={videoId} />}
    </div>
  );
};

export default GoalClip;
