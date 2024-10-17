import { INTGameVideo } from "../../../interfaces/game-video";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { Svg } from "../../../scripts/utils/Icons";
import { formatPublicationDate } from "../../../scripts/utils/formatDate";
import GoalClip from "./goalClip";

export const renderGameVideo = (
  game: INTMainGameInfos | null,
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
      <>
        <div className="highlight">
          <h3>Faits saillants</h3>
          {filteredVideos.length > 0 ? (
            <>
              <div className="videos-container">
                {filteredVideos.slice(0, 3).map((video) => {
                  return (
                    <>
                      <GoalClip
                        fr={video?.selfUrl}
                        title={video.title}
                        description={video.fields.longDescription}
                        date={formatPublicationDate(video.contentDate)}
                      >
                        <div key={video._entityId} className="video">
                          <div className="media">
                            <img
                              src={`${video.thumbnail.thumbnailUrl.replace(
                                /t_ratio1_1-size20/,
                                "t_ratio16_9-size20/f_auto/"
                              )}`}
                              alt=""
                            />
                            <Svg name="play" size="sm"></Svg>
                            <span>{video.fields.duration?.slice(4, 8)}</span>
                          </div>
                          <div className="content">
                            <h4>{video.title}</h4>
                            <p>{formatPublicationDate(video.contentDate)}</p>
                          </div>
                        </div>
                      </GoalClip>
                    </>
                  );
                })}
              </div>
              <a
                className="more button window-effect"
                target="_blank"
                href={`https://www.nhl.com/fr/video/game/gameid-${game?.id}`}
              >
                Voir plus
              </a>
            </>
          ) : (
            <p>Aucun faits saillants</p>
          )}
        </div>
      </>
    );
  }
};
