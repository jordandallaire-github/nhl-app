import { INTGameVideo } from "../../interfaces/game-video";
import { formatPublicationDate } from "../../scripts/utils/formatDate";
import { Svg } from "../../scripts/utils/Icons";
import GoalClip from "./components/goalClip";
import { TeamAbbreviations } from "../../fetcher/fetchMatchVideos";

export const renderMatchVideo = (
  gameVideos: INTGameVideo | null,
  team: TeamAbbreviations | null,
  gameDate: string
) => {
  if (gameVideos) {
    return (
      <>
        <div className="hero">
          <div className="wrapper">
            <div className="team-versus">
              <div className="team-logo-video">
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${team?.awayTeam}_dark.svg`}
                  alt={`${team?.awayTeam} logo`}
                  loading="lazy"
                />
              </div>
              <span>VS</span>
              <div className="team-logo-video">
                <img
                  src={`https://assets.nhle.com/logos/nhl/svg/${team?.homeTeam}_dark.svg`}
                  alt={`${team?.homeTeam} logo`}
                  loading="lazy"
                />
              </div>
            </div>
            <h1>Match du {gameDate}</h1>
          </div>
        </div>
        <section className="highlight match-video">
          <div className="wrapper">
            <h2>Vidéos du match</h2>
            {gameVideos.items.length > 0 ? (
              <>
                <div className="videos-container">
                  {gameVideos.items.map((video) => (
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
                            alt={`${video.title}`}
                            loading="lazy"
                          />
                          <Svg name="play" size="sm" />
                          <span>{video.fields.duration?.slice(4, 8)}</span>
                        </div>
                        <div className="content">
                          <p>
                            <strong>{video.title}</strong>
                          </p>
                          <p>{formatPublicationDate(video.contentDate)}</p>
                        </div>
                      </div>
                    </GoalClip>
                  ))}
                </div>
              </>
            ) : (
              <p>Aucune vidéos du match.</p>
            )}
          </div>
        </section>
      </>
    );
  }
  return null;
};
