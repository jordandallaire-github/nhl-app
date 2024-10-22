import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IPlayerOnIce,
  IReplayFrame,
} from "../../../interfaces/goal-simulation";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTGoal } from "../../../interfaces/main-match";
import Accordion from "../../utils/accordion";
import { Svg } from "../../../scripts/utils/Icons";
import IceRink from "./iceRink";

interface Colors {
  home: string | null;
  away: string | null;
}

export const SimulationGoal: React.FC<{
  game: INTMainGameInfos;
  goal: INTGoal;
  teamColors: Colors;
  goalSimulation: Record<string, IReplayFrame[]>;
}> = ({ game, goal, teamColors, goalSimulation }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const replayData = goalSimulation[goal.pptReplayUrl];

  const slowFactor = 0.5;
  const targetFrameDuration = 35;
  const animationRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const memoizedReplayData = useMemo(() => replayData, [replayData]);

  const animate = useCallback(
    (time: number) => {
      if (!memoizedReplayData || memoizedReplayData.length === 0) return;

      const deltaTime = time - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = time;

      accumulatedTimeRef.current += deltaTime * slowFactor;

      while (accumulatedTimeRef.current >= targetFrameDuration) {
        const nextFrame = (currentFrame + 1) % memoizedReplayData.length;
        setCurrentFrame(nextFrame);
        accumulatedTimeRef.current -= targetFrameDuration;

        if (nextFrame === memoizedReplayData.length - 1) {
          setIsPlaying(false);
          setIsFinished(true);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [currentFrame, memoizedReplayData]
  );

  useEffect(() => {
    if (!memoizedReplayData || memoizedReplayData.length === 0) {
      console.warn("Pas de données de replay disponibles ou frames manquantes");
      return;
    }

    if (isPlaying) {
      lastUpdateTimeRef.current = performance.now();
      accumulatedTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, memoizedReplayData, animate]);

  const startReplay = useCallback(() => {
    setCurrentFrame(0);
    setIsPlaying(true);
    setIsFinished(false);
  }, []);

  const restartReplay = useCallback(() => {
    setCurrentFrame(0);
    setIsFinished(false);
    setIsPlaying(true);
  }, []);

  const pauseReplay = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeReplay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const toggleReplay = useCallback(() => {
    if (isPlaying) {
      pauseReplay();
    } else {
      resumeReplay();
    }
  }, [isPlaying, pauseReplay, resumeReplay]);

  const renderPlayer = (player: IPlayerOnIce) => {
    const isHome = player.teamId === game.homeTeam.id;

    return (
      <>
        {player.id === 1 ? (
          <g
            className="puck"
            key={player.id}
            transform={`translate(${player.x}, ${player.y})`}
          >
            <circle stroke={`black`} strokeWidth="3px" r="15" fill={`black`} />
          </g>
        ) : (
          <g
            className="player"
            key={player.id}
            transform={`translate(${player.x ?? 0}, ${player.y ?? 0})`}
          >
            <circle
              stroke={`${isHome ? teamColors.home : teamColors.away}`}
              strokeWidth="3px"
              r="48"
              fill={isHome ? (teamColors.home as string) : "#fff"}
            />
            {goal.playerId === player.playerId && (
              <circle
                stroke={`${isHome ? teamColors.home : teamColors.away}`}
                strokeWidth="6px"
                r="60"
                fill="none"
              />
            )}
            <text
              fill={`${isHome ? "#fff" : teamColors.away}`}
              dominant-baseline={`central`}
              fontSize="14"
            >
              {player.sweaterNumber}
            </text>
          </g>
        )}
      </>
    );
  };
  return (
    <>
      <Accordion notClosing={false}>
        <div className="accordion__container">
          <h5
            onClick={startReplay}
            className="accordion__header js-header window-effect"
          >
            Simulation du but <Svg name="right-arrow" size="sm"></Svg>
          </h5>
          <div className={`accordion__content ${isFinished ? "finish" : ""}`}>
            <div className={`button-container ${isFinished ? "finish" : ""}`}>
              <button className="window-effect" onClick={restartReplay}>
                <Svg name="restart" size="xs"></Svg>
              </button>
              {!isFinished && (
                <button className="window-effect" onClick={toggleReplay}>
                  {isPlaying ? (
                    <Svg name="pause" size="xs"></Svg>
                  ) : (
                    <Svg name="play" size="xs"></Svg>
                  )}
                </button>
              )}
            </div>
            <IceRink game={game} teamColors={teamColors}>
              {replayData && replayData[currentFrame] && (
                <>
                  {Object.values(replayData[currentFrame].onIce).map(
                    renderPlayer
                  )}
                </>
              )}
            </IceRink>
          </div>
        </div>
      </Accordion>
    </>
  );
};
