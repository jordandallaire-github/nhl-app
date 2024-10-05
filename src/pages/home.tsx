import Video from "../components/utils/youtube";
import Thumbnail from "../assets/images/scale.png";
import Scrolly from "../components/utils/scrolly";

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
    </>
  );
}

export default Home;
