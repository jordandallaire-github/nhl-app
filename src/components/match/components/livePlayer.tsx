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
  function convertSecondsToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return (
    <div className="live-match">
      <IceRink game={game} teamColors={teamColors}></IceRink>
      <div className="players-live">
        <div className="forward away">
          {game.summary.iceSurface.awayTeam.forwards.map((forward) => (
            <div 
              key={`${forward.playerId}-${forward.totalSOI}-${forward.name}-${forward.positionCode}`} 
              className="player away"
            >
              <div
                style={{
                  borderColor: `${teamColors.away}`,
                  color: `${teamColors.away}`,
                  backgroundColor: `#fff`,
                  border: `1px solid ${teamColors.away}`,
                }}
                className="number"
              >
                {forward.sweaterNumber}
              </div>
              <div className="player-infos window-effect">
                <img src={forward.headshot} alt={forward.name.default} loading="lazy"/>
                <p>
                  <strong>{forward.name.default}</strong>
                </p>
                <p>
                  {game.homeTeam.abbrev} - #{forward.sweaterNumber} -{" "}
                  {forward.positionCode}
                </p>
                <p>TG : {convertSecondsToMinutes(forward.totalSOI)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="defensement away">
          {game.summary.iceSurface.awayTeam.defensemen.map((defensemen) => (
            <div 
              key={`${defensemen.playerId}-${defensemen.totalSOI}-${defensemen.name}-${defensemen.positionCode}`}
              className="player away"
            >
              <div
                style={{
                  borderColor: `${teamColors.away}`,
                  color: `${teamColors.away}`,
                  backgroundColor: `#fff`,
                  border: `1px solid ${teamColors.away}`,
                }}
                className="number"
              >
                {defensemen.sweaterNumber}
              </div>
              <div className="player-infos window-effect">
                <img
                  src={defensemen.headshot}
                  alt={defensemen.name.default}
                  loading="lazy"
                />
                <p>
                  <strong>{defensemen.name.default}</strong>
                </p>
                <p>
                  {game.homeTeam.abbrev} - #{defensemen.sweaterNumber} -{" "}
                  {defensemen.positionCode}
                </p>
                <p>TG : {convertSecondsToMinutes(defensemen.totalSOI)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="goalie away">
          {game.summary.iceSurface.awayTeam.goalies.map((goalie) => (
            <div 
              key={`${goalie.playerId}-${goalie.totalSOI}-${goalie.name}-${goalie.positionCode}`}
              className="player away"
            >
              <div
                style={{
                  borderColor: `${teamColors.away}`,
                  color: `${teamColors.away}`,
                  backgroundColor: `#fff`,
                  border: `1px solid ${teamColors.away}`,
                }}
                className="number"
              >
                {goalie.sweaterNumber}
              </div>
              <div className="player-infos window-effect">
                <img src={goalie.headshot} alt={goalie.name.default} loading="lazy"/>
                <p>
                  <strong>{goalie.name.default}</strong>
                </p>
                <p>
                  {game.homeTeam.abbrev} - #{goalie.sweaterNumber} -{" "}
                  {goalie.positionCode}
                </p>
                <p>TG : {convertSecondsToMinutes(goalie.totalSOI)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="penalty-box away">
          {game.summary.iceSurface.awayTeam.penaltyBox.map((penalty) => (
            <div 
              key={`${penalty.playerId}-${penalty.secondsRemaining}-${penalty.name}-${penalty.positionCode}`}
              className="player away"
            >
              <div
                style={{
                  borderColor: `${teamColors.away}`,
                  color: `${teamColors.away}`,
                  backgroundColor: `#fff`,
                  border: `1px solid ${teamColors.away}`,
                }}
                className="number"
              >
                {penalty.sweaterNumber}
              </div>
              <div className="player-infos window-effect">
                <img src={penalty.headshot} alt={penalty.name.default} loading="lazy" />
                <p>
                  <strong>{penalty.name.default}</strong>
                </p>
                <p>
                  {game.homeTeam.abbrev} - #{penalty.sweaterNumber} -{" "}
                  {penalty.positionCode}
                </p>
                <p>TG : {convertSecondsToMinutes(penalty.secondsRemaining)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="forward home">
          {game.summary.iceSurface.homeTeam.forwards.map((forward) => (
            <div 
              key={`${forward.playerId}-${forward.totalSOI}-${forward.name}-${forward.positionCode}`}
              className="player home"
            >
              <div
                style={{ backgroundColor: `${teamColors.home}` }}
                className="number"
              >
                {forward.sweaterNumber}
              </div>
              <div className="player-infos window-effect">
                <img src={forward.headshot} alt={forward.name.default} loading="lazy" />
                <p>
                  <strong>{forward.name.default}</strong>
                </p>
                <p>
                  {game.homeTeam.abbrev} - #{forward.sweaterNumber} -{" "}
                  {forward.positionCode}
                </p>
                <p>TG : {convertSecondsToMinutes(forward.totalSOI)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="defensement home">
          {game.summary.iceSurface.homeTeam.defensemen.map((defensemen) => (
            <div 
              key={`${defensemen.playerId}-${defensemen.totalSOI}-${defensemen.name}-${defensemen.positionCode}`}
              className="player home"
            >
              <div
                style={{ backgroundColor: `${teamColors.home}` }}
                className="number"
              >
                {defensemen.sweaterNumber}
              </div>
              <div className="player-infos window-effect">
                <img
                  src={defensemen.headshot}
                  alt={defensemen.name.default}
                  loading="lazy"
                />
                <p>
                  <strong>{defensemen.name.default}</strong>
                </p>
                <p>
                  {game.homeTeam.abbrev} - #{defensemen.sweaterNumber} -{" "}
                  {defensemen.positionCode}
                </p>
                <p>TG : {convertSecondsToMinutes(defensemen.totalSOI)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="goalie home">
          {game.summary.iceSurface.homeTeam.goalies.map((goalie) => (
            <div 
              key={`${goalie.playerId}-${goalie.totalSOI}-${goalie.name}-${goalie.positionCode}`}
              className="player home"
            >
              <div
                style={{ backgroundColor: `${teamColors.home}` }}
                className="number"
              >
                {goalie.sweaterNumber}
              </div>
              <div className="player-infos window-effect">
                <img src={goalie.headshot} alt={goalie.name.default} loading="lazy"/>
                <p>
                  <strong>{goalie.name.default}</strong>
                </p>
                <p>
                  {game.homeTeam.abbrev} - #{goalie.sweaterNumber} -{" "}
                  {goalie.positionCode}
                </p>
                <p>TG : {convertSecondsToMinutes(goalie.totalSOI)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="penalty-box home">
          {game.summary.iceSurface.homeTeam.penaltyBox.map((penalty) => (
            <div 
              key={`${penalty.playerId}-${penalty.secondsRemaining}-${penalty.name}-${penalty.positionCode}`}
              className="player home"
            >
              <div
                style={{
                  backgroundColor: `${teamColors.home}`,
                  color: `#f2f2f2`,
                }}
                className="number"
              >
                {penalty.sweaterNumber}
              </div>
              <div className="player-infos window-effect">
                <img src={penalty.headshot} alt={penalty.name.default} loading="lazy" />
                <p>
                  <strong>{penalty.name.default}</strong>
                </p>
                <p>
                  {game.homeTeam.abbrev} - #{penalty.sweaterNumber} -{" "}
                  {penalty.positionCode}
                </p>
                <p>TG : {convertSecondsToMinutes(penalty.secondsRemaining)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
