import Carousel from "../components/carousel";
import Video from "../components/youtube";
import Thumbnail from "../assets/images/scale.png";
import Scrolly from "../components/scrolly";

function Home() {
  Scrolly();
  return (
    <>
      <section className="hero">
        <div className="wrapper">
          <h1 data-scrolly="opacity" data-norepeat>
            Home
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
          <Carousel autoplay>
            <div data-is-swiper-slide className="card">
              <h1>oui</h1>
              <p>dhsihdhshhdis</p>
            </div>
            <div data-is-swiper-slide className="card">
              <h1>oui</h1>
              <p>dhsihdhshhdis</p>
            </div>
            <div data-is-swiper-slide className="card">
              <h1>oui</h1>
              <p>dhsihdhshhdis</p>
            </div>
            <div data-is-swiper-slide className="card">
              <h1>oui</h1>
              <p>dhsihdhshhdis</p>
            </div>
            <div className="swiper-pagination"></div>
          </Carousel>
          <Carousel autoplay>
            <div data-is-swiper-slide className="card">
              <h1>oui</h1>
              <p>dhsihdhshhdis</p>
            </div>
            <div data-is-swiper-slide className="card">
              <h1>oui</h1>
              <p>dhsihdhshhdis</p>
            </div>
            <div data-is-swiper-slide className="card">
              <h1>oui</h1>
              <p>dhsihdhshhdis</p>
            </div>
            <div data-is-swiper-slide className="card">
              <h1>oui</h1>
              <p>dhsihdhshhdis</p>
            </div>
            <div className="swiper-pagination"></div>
          </Carousel>
        </div>
      </section>
    </>
  );
}

export default Home;
