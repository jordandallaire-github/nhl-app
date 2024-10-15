import { INTGameVideo } from "../../../interfaces/game-video";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { Svg } from "../../../scripts/utils/Icons";
import { formatPublicationDate } from "../../../scripts/utils/formatDate";

export const renderGameVideo = (
  game: INTMainGameInfos | null,
  gameVideos: INTGameVideo | null
) => {
  if (gameVideos) {
    const filteredVideos = gameVideos.items.filter((video) =>
      video.tags.some((tag) => tag.slug === "goal" || tag.slug === "save")
    );

    return (
      <>
        <div className="highlight">
          <h3>Faits saillants</h3>
          <div className="videos-container">
            {filteredVideos.slice(0, 3).map((video) => (
              <a
                target="_blank"
                href={`https://www.nhl.com/${video.selfUrl.replace(
                  /https?:\/\/forge-dapi\.d3\.nhle\.com\/v2\/content\/fr-ca\/videos\/|-.*/,
                  "fr/video/"
                )}`}
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
              </a>
            ))}
          </div>
          <a
            className="more button window-effect"
            target="_blank"
            href={`https://www.nhl.com/fr/video/game/gameid-${game?.id}`}
          >
            Voir plus
          </a>
        </div>
      </>
    );
  }
};
