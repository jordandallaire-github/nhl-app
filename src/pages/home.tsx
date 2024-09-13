import Video from "../components/youtube";
import Thumbnail from "../assets/images/scale.png";
import Scrolly from "../components/scrolly";
import TeamRoster from "../fetcher/playerSimpleInfos";

function Home() {
  Scrolly();
  return (
    <>
      <section className="hero">
        <div className="wrapper">
          <h1 data-scrolly="opacity" data-norepeat>
            Accueil
          </h1>
          <div className="window-effect glare-item">
            <Video
              platform="youtube"
              iconName="php"
              iconSize="xl"
              customThumbnail={true}
              poster={Thumbnail}
              videoId="SqcY0GlETPk&t=494s"
            ></Video>
          </div>
          <div className="fade"></div>
        </div>
      </section>
      <section>
        <div className="wrapper">
          <TeamRoster></TeamRoster>
        </div>
      </section>
    </>
  );
}

export default Home;
