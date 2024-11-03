import Scrolly from "../components/utils/scrolly";
import Standing from "../fetcher/fetchStanding";

function Home() {
  Scrolly();
  return (
    <>
      <section className="hero">
        <div className="wrapper">
          <h1 data-scrolly="opacity" data-norepeat>
            Suivez la NHL en direct - Équipes, Matchs, Joueurs
          </h1>
          <Standing isHome></Standing>
        </div>
      </section>
    </>
  );
}

export default Home;
