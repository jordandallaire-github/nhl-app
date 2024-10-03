import Scrolly from "../components/scrolly";
import Standing from "../fetcher/fetchStanding";

function MainStanding() {
  Scrolly();
  return (
    <>
      <Standing></Standing>
    </>
  );
}

export default MainStanding;