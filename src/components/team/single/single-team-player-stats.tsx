import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TeamPlayerStats,
  Player,
} from "../../../interfaces/team/teamPlayerStats";
import { PlayerDetailsType } from "../../../interfaces/player/playerDetails";
import { FormatPosition } from "../../utils/formatPosition";
import { Link } from "react-router-dom";
import { generatePlayerSlug } from "../../utils/generatePlayerSlug";

interface PlayerStatsProps {
  playerStats: TeamPlayerStats | null;
  playerOtherInfos: PlayerDetailsType[] | null;
  abr: string | null;
  teamName?: string;
}

const getTopPlayers = (
  players: Player[],
  statToCompare: keyof Player,
  ascending = false
): Player[] => {
  return players
    .filter((player) => typeof player[statToCompare] === "number")
    .sort((a, b) =>
      ascending
        ? (a[statToCompare] as number) - (b[statToCompare] as number)
        : (b[statToCompare] as number) - (a[statToCompare] as number)
    )
    .slice(0, 5);
};

const formatTimeOnIce = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  return `${hours}:${remainingMinutes.toString().padStart(2, "0")}`;
};

const SingleTeamPlayerStats: React.FC<PlayerStatsProps> = ({
  playerStats,
  playerOtherInfos,
  abr,
  teamName,
}) => {
  type PlayerCategory =
    | "points"
    | "goals"
    | "assists"
    | "plusMinus"
    | "faceoffWinPctg"
    | "avgTimeOnIcePerGame"
    | "savePercentage"
    | "goalsAgainstAverage";

  const [playerDetails, setPlayerDetails] = useState<PlayerDetailsType | null>(
    null
  );
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const [playerCategory, setPlayerCategory] =
    useState<PlayerCategory>("points");

  const topSkaters = useMemo(
    () => ({
      points: getTopPlayers(playerStats?.skaters || [], "points"),
      goals: getTopPlayers(playerStats?.skaters || [], "goals"),
      assists: getTopPlayers(playerStats?.skaters || [], "assists"),
      plusMinus: getTopPlayers(playerStats?.skaters || [], "plusMinus"),
      faceoffWinPctg: getTopPlayers(
        playerStats?.skaters || [],
        "faceoffWinPctg"
      ),
      avgTimeOnIcePerGame: getTopPlayers(
        playerStats?.skaters || [],
        "avgTimeOnIcePerGame"
      ),
      savePercentage: getTopPlayers(
        playerStats?.skaters || [],
        "savePercentage"
      ),
      goalsAgainstAverage: getTopPlayers(
        playerStats?.skaters || [],
        "goalsAgainstAverage",
        true
      ),
    }),
    [playerStats]
  );

  const getTopPlayersByCategory = useCallback(() => {
    return topSkaters[playerCategory] || topSkaters.points;
  }, [playerCategory, topSkaters]);

  useEffect(() => {
    if (selectedPlayer && playerOtherInfos) {
      const selectedPlayerInfo = playerOtherInfos.find(
        (player) => player.id === selectedPlayer.playerId
      );
      setPlayerDetails(selectedPlayerInfo || null);
    }
  }, [selectedPlayer?.playerId, playerOtherInfos, selectedPlayer]);

  useEffect(() => {
    const topPlayers = getTopPlayersByCategory();
    if (!selectedPlayer && topPlayers.length) {
      setSelectedPlayer(topPlayers[0]);
    }
  }, [selectedPlayer, playerCategory, getTopPlayersByCategory]);

  if (!playerStats || !playerStats.skaters) return null;

  const handlePlayerClick = (player: Player) => setSelectedPlayer(player);

  const renderPlayer = (player: Player | null, statValue: number) =>
    player && (
      <div className="display-player">
        <div className="media">
          <Link
            to={`/equipes/${teamName}/${generatePlayerSlug(
              player.firstName.default,
              player.lastName.default,
              player.playerId
            )}`}
          >
            <img
              src={playerDetails?.headshot}
              alt={`${player.firstName.default} ${player.lastName.default}`}
            />
          </Link>
        </div>
        <div className="content">
          <h3>{`${player.firstName.default} ${player.lastName.default}`}</h3>
          <div className="other-infos">
            <p>{`#${playerDetails?.sweaterNumber}`}</p>
            <img
              src={`https://assets.nhle.com/logos/nhl/svg/${abr}_dark.svg`}
              alt=""
            />
            <p>{`${FormatPosition(player.positionCode)}`}</p>
          </div>
          <p>{statValue}</p>
        </div>
      </div>
    );

  return (
    <section className="stats-team-player">
      <div className="wrapper">
        <h2>Meilleur de l'équipe :</h2>
        <div className="player-stats-container">
          <div className="player-stat">
            {selectedPlayer &&
              renderPlayer(selectedPlayer, selectedPlayer?.points)}
            <div className="stats">
              <h3>Points</h3>
              {topSkaters.points.map((player, index) => (
                <div
                  className="content"
                  key={player.playerId}
                  onClick={() => handlePlayerClick(player)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {player.firstName.default} {player.lastName.default}
                    </p>
                    <p>{player.points}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="player-stat">
          {selectedPlayer &&
              renderPlayer(selectedPlayer, selectedPlayer?.goals)}
            <div className="stats">
              <h3>Buts</h3>
              {topSkaters.goals.map((player, index) => (
                <div
                  className="content"
                  key={player.playerId}
                  onClick={() => handlePlayerClick(player)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {player.firstName.default} {player.lastName.default}
                    </p>
                    <p>{player.goals}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="player-stat">
          {selectedPlayer &&
              renderPlayer(selectedPlayer, selectedPlayer?.assists)}
            <div className="stats">
              <h3>Passes</h3>
              {topSkaters.assists.map((player, index) => (
                <div
                  className="content"
                  key={player.playerId}
                  onClick={() => handlePlayerClick(player)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {player.firstName.default} {player.lastName.default}
                    </p>
                    <p>{player.assists}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="player-stat">
          {selectedPlayer &&
              renderPlayer(selectedPlayer, selectedPlayer?.plusMinus)}
            <div className="stats">
              <h3>Différentiel</h3>
              {topSkaters.plusMinus.map((player, index) => (
                <div
                  className="content"
                  key={player.playerId}
                  onClick={() => handlePlayerClick(player)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {player.firstName.default} {player.lastName.default}
                    </p>
                    <p>{player.plusMinus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="player-stat">
          {selectedPlayer &&
              renderPlayer(selectedPlayer, selectedPlayer?.avgTimeOnIcePerGame)}
            <div className="stats">
              <h3>Moyenne de temps de glace</h3>
              {topSkaters.avgTimeOnIcePerGame.map((player, index) => (
                <div
                  className="content"
                  key={player.playerId}
                  onClick={() => handlePlayerClick(player)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {player.firstName.default} {player.lastName.default}
                    </p>
                    <p>{formatTimeOnIce(player.avgTimeOnIcePerGame)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="player-stat">
          {selectedPlayer &&
              renderPlayer(selectedPlayer, selectedPlayer?.faceoffWinPctg)}
            <div className="stats">
              <h3>% Mises en jeu gagnées</h3>
              {topSkaters.faceoffWinPctg.map((player, index) => (
                <div
                  className="content"
                  key={player.playerId}
                  onClick={() => handlePlayerClick(player)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {player.firstName.default} {player.lastName.default}
                    </p>
                    <p>{player.faceoffWinPctg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="player-stat">
          {selectedPlayer &&
              renderPlayer(selectedPlayer, selectedPlayer?.goalsAgainstAverage)}
            <div className="stats">
              <h3>Moyenne de buts accordés</h3>
              {topSkaters.goalsAgainstAverage.map((goalie, index) => (
                <div
                  className="content"
                  key={goalie.playerId}
                  onClick={() => handlePlayerClick(goalie)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {goalie.firstName.default} {goalie.lastName.default}
                    </p>
                    <p>{goalie.goalsAgainstAverage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="player-stat">
          {selectedPlayer &&
              renderPlayer(selectedPlayer, selectedPlayer?.savePercentage)}
            <div className="stats">
              <h3>% D'arrêts</h3>
              {topSkaters.savePercentage.map((goalie, index) => (
                <div
                  className="content"
                  key={goalie.playerId}
                  onClick={() => handlePlayerClick(goalie)}
                >
                  <p>{index + 1}.</p>
                  <div className="main-stats">
                    <p>
                      {goalie.firstName.default} {goalie.lastName.default}
                    </p>
                    <p>{goalie.savePercentage * 10}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleTeamPlayerStats;
