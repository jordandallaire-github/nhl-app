import { Link } from "react-router-dom";
import { INTGameVideo } from "../../../interfaces/game-video";
import { Svg } from "../../../scripts/utils/Icons";
import { formatPublicationDate } from "../../../scripts/utils/formatDate";
import GoalClip from "./goalClip";

export const renderGameVideo = (
  gameVideos: INTGameVideo | null
) => {
  if (gameVideos) {
    const filteredVideos =
      gameVideos?.items.filter((video) =>
        video.tags.some(
          (tag) => tag.slug.includes("goal") || tag.slug === "save"
        )
      ) || [];

    return (
      <div className="highlight">
        <h3>Faits saillants</h3>
        {filteredVideos.length > 0 ? (
          <>
            <div className="videos-container">
              {filteredVideos.slice(0, 3).map((video) => (
                <GoalClip
                  key={video.contentDate}
                  fr={video?.selfUrl}
                  title={video.title}
                  description={video.fields.longDescription}
                  date={formatPublicationDate(video.contentDate)}
                >
                  <div className="video">
                    <div className="media">
                      <img
                        src={`${video.thumbnail.thumbnailUrl.replace(
                          /t_ratio1_1-size20/,
                          "t_ratio16_9-size20/f_auto/"
                        )}`}
                        alt=""
                      />
                      <Svg name="play" size="sm" />
                      <span>{video.fields.duration?.slice(4, 8)}</span>
                    </div>
                    <div className="content">
                      <h4>{video.title}</h4>
                      <p>{formatPublicationDate(video.contentDate)}</p>
                    </div>
                  </div>
                </GoalClip>
              ))}
            </div>
            <Link
              className="more button window-effect"
              to={`video`}
            >
              Voir plus
            </Link>
          </>
        ) : (
          <p>Aucun faits saillants.</p>
        )}
      </div>
    );
  }
  return null;
};