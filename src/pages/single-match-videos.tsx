import Scrolly from "../components/utils/scrolly";
import MatchVideos from "../fetcher/fetchMatchVideos";

function MainMatchVideos() {
  Scrolly();
  return (
    <>
      <MatchVideos></MatchVideos>
    </>
  );
}

export default MainMatchVideos;