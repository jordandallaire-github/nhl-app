import Scrolly from "../components/utils/scrolly";
import TeamLists from "../fetcher/teamLists";

function Teams() {
  Scrolly();
  return (
    <>
      <TeamLists></TeamLists>
    </>
  );
}

export default Teams;
