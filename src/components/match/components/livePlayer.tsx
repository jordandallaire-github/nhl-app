import { INTMainGameInfos } from "../../../interfaces/main-match";
import IceRink from "./iceRink";

interface Colors {
  home: string | null;
  away: string | null;
}

export const renderLivePlayer = (
  game: INTMainGameInfos,
  teamColors: Colors
) => {
  return (
    <>
      <div className="live-match">
        <IceRink game={game} teamColors={teamColors}></IceRink>
        <div className="players-live">
          <div className="forward away">
            {game.summary.iceSurface.awayTeam.forwards.map((forward) => (
              <div key={forward.playerId} className="player away">
                <div style={{borderColor: `${teamColors.away}`}} className="number">{forward.sweaterNumber}</div>
              </div>
            ))}
          </div>
          <div className="defensement away">
            {game.summary.iceSurface.awayTeam.defensemen.map((defensemen) => (
              <div key={defensemen.playerId} className="player away">
                <div style={{borderColor: `${teamColors.away}`}} className="number">{defensemen.sweaterNumber}</div>
              </div>
            ))}
          </div>
          <div className="goalie away">
            {game.summary.iceSurface.awayTeam.goalies.map((goalie) => (
              <div key={goalie.playerId} className="player away">
                <div style={{borderColor: `${teamColors.away}`}} className="number"></div>
              </div>
            ))}
          </div>
          <div className="penalty-box away">
            {game.summary.iceSurface.awayTeam.penaltyBox.map((penalty) => (
              <div key={penalty.playerId} className="player away">
                <div style={{borderColor: `${teamColors.away}`}} className="number"></div>
              </div>
            ))}
          </div>
          <div className="forward home">
            {game.summary.iceSurface.homeTeam.forwards.map((forward) => (
              <div key={forward.playerId} className="player away">
                <div style={{backgroundColor: `${teamColors.home}`}} className="number"></div>
              </div>
            ))}
          </div>
          <div className="defensement home">
            {game.summary.iceSurface.homeTeam.defensemen.map((defensemen) => (
              <div key={defensemen.playerId} className="player away">
                <div style={{backgroundColor: `${teamColors.home}`}} className="number"></div>
              </div>
            ))}
          </div>
          <div className="goalie home">
            {game.summary.iceSurface.homeTeam.forwards.map((goalie) => (
              <div key={goalie.playerId} className="player away">
                <div style={{backgroundColor: `${teamColors.home}`}} className="number"></div>
              </div>
            ))}
          </div>
          <div className="penalty-box home">
            {game.summary.iceSurface.homeTeam.forwards.map((penalty) => (
              <div key={penalty.playerId} className="player away">
                <div style={{backgroundColor: `${teamColors.home}`, color: `#f2f2f2`}} className="number"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
