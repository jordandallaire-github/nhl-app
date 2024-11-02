import { Link } from "react-router-dom";
import FollowButton from "../components/utils/follow";
import { INTSearch } from "../interfaces/search";
import { FollowedPlayer } from "../interfaces/followedPlayer";

 export const renderPlayerCard = (player: INTSearch | FollowedPlayer, teamName?: { [key: string]: string }, teamColor?: Record<string, { color: string }>) => (
    <div key={player.playerId} className="card window-effect">
      <Link
        to={`/equipes/${
          teamName?.[player.teamAbbrev] ?? player.teamName
        }/joueur/${player.name.toLowerCase().replace(/\s+/g, "-")}-${
          player.playerId
        }`}
      >
        <div className="card-media player">
          <img
            src={`https://assets.nhle.com/mugs/nhl/20242025/${player.teamAbbrev}/${player.playerId}.png`}
            alt={`${player.name}`}
          />
        </div>
        <div className="card-content">
          <h4>{player.name}</h4>
          <div className="other-infos">
            <p>
              <strong>#{player.sweaterNumber}</strong>
            </p>
            <img
              className="team-logo"
              src={`https://assets.nhle.com/logos/nhl/svg/${player.teamAbbrev}_dark.svg`}
              alt={`${teamName?.[player.teamAbbrev]} logo`}
            />
            <p>
              <strong>
                {player.positionCode === "R"
                  ? "AD"
                  : player.positionCode === "L"
                  ? "AG"
                  : player.positionCode}
              </strong>
            </p>
          </div>
        </div>
        <div
          className="card-background-color"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0, #7fcfff33, #0000 80%), radial-gradient(circle at 50% 0, ${
              teamColor?.[player.teamAbbrev]?.color ?? player.teamColor
            }, #0000)`,
          }}
        ></div>
      </Link>
      <FollowButton 
        playerId={player.playerId}
        playerData={{
          name: player.name,
          teamAbbrev: player.teamAbbrev,
          sweaterNumber: player.sweaterNumber ?? "0",
          positionCode: player.positionCode,
          teamColor: teamColor?.[player.teamAbbrev]?.color ?? player.teamColor,
          teamName: teamName?.[player.teamAbbrev] ?? player.teamName
        }}
      />
    </div>
  );