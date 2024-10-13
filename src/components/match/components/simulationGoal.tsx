import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IPlayerOnIce,
  IReplayFrame,
} from "../../../interfaces/goal-simulation";
import { INTMainGameInfos } from "../../../interfaces/main-match";
import { INTGoal } from "../../../interfaces/main-match";
import Accordion from "../../utils/accordion";
import { Svg } from "../../../scripts/utils/Icons";

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
        setCurrentFrame(
          (prev) => (prev + 1) % memoizedReplayData.length
        );
        accumulatedTimeRef.current -= targetFrameDuration;
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [memoizedReplayData]
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
  }, []);

  const restartReplay = useCallback(() => {
    setCurrentFrame(0);
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
          <h5 onClick={startReplay} className="accordion__header js-header window-effect">Simulation du but <Svg name="right-arrow" size="sm"></Svg></h5>
          <div className="accordion__content">
            <button onClick={restartReplay}>
              Recommencer
            </button>
            <button onClick={toggleReplay}></button>
            <svg
              className="goal-simulation"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-75 -75 2550 1170"
            >
              <g>
                <path
                  fill="#FFFFFF"
                  d="M2064,1020H336C151.2,1020,0,868.8,0,684V336C0,151.2,151.2,0,336,0h1728c184.8,0,336,151.2,336,336v348 C2400,868.8,2248.8,1020,2064,1020z"
                ></path>
                <path
                  d="M2064,1020H336C151.2,1020,0,868.8,0,684V336C0,151.2,151.2,0,336,0h1728c184.8,0,336,151.2,336,336v348 C2400,868.8,2248.8,1020,2064,1020z"
                  fill="url(#ice)"
                ></path>
                <clipPath id="rinkBorderClip">
                  <path d="M2064,1020H336C151.2,1020,0,868.8,0,684V336C0,151.2,151.2,0,336,0h1728c184.8,0,336,151.2,336,336v348 C2400,868.8,2248.8,1020,2064,1020z"></path>
                </clipPath>
              </g>
              <defs>
                <pattern
                  id="ice"
                  patternContentUnits="userSpaceOnUse"
                  width="1"
                  height="1"
                >
                  <image
                    href="https://wsr.nhle.com/static/js/../images/f7597e93d3f2a4b23d41.png"
                    x="-100"
                    y="-100"
                    height="1220"
                    width="2600"
                  ></image>
                </pattern>
              </defs>
              <image
                href={game.homeTeam.logo}
                height="400"
                width="400"
                x="1000"
                y="310"
              ></image>
              <text
                style={{
                  fill: `${
                    goal.homeTeamDefendingSide === "left"
                      ? teamColors?.home
                      : teamColors?.away
                  }`,
                }}
                x="510"
                y="-25"
                text-anchor="middle"
                transform="rotate(90)"
              >
                {goal.homeTeamDefendingSide === "left"
                  ? game.homeTeam.abbrev
                  : game.awayTeam.abbrev}
              </text>
              <text
                style={{
                  fill: `${
                    goal.homeTeamDefendingSide === "right"
                      ? teamColors?.home
                      : teamColors?.away
                  }`,
                }}
                x="-510"
                y="2375"
                text-anchor="middle"
                transform="rotate(270)"
              >
                {goal.homeTeamDefendingSide === "right"
                  ? game.homeTeam.abbrev
                  : game.awayTeam.abbrev}
              </text>
              <rect x="1194" width="12" height="1020" fill="#CC3333"></rect>
              <g>
                <path
                  fill="#3366CC"
                  d="M1200,332c24.03,0,47.34,4.71,69.29,13.99c21.2,8.97,40.23,21.8,56.58,38.15 c16.35,16.35,29.18,35.38,38.15,56.58c9.28,21.94,13.99,45.25,13.99,69.29s-4.71,47.34-13.99,69.28 c-8.97,21.2-21.8,40.23-38.15,56.58s-35.38,29.18-56.58,38.15c-21.94,9.28-45.25,13.99-69.29,13.99s-47.34-4.71-69.29-13.99 c-21.2-8.97-40.23-21.8-56.58-38.15s-29.18-35.38-38.15-56.58c-9.28-21.94-13.99-45.25-13.99-69.28s4.71-47.34,13.99-69.29 c8.97-21.2,21.8-40.23,38.15-56.58c16.35-16.35,35.38-29.18,56.58-38.15C1152.66,336.71,1175.97,332,1200,332 M1200,330 c-99.41,0-180,80.59-180,180s80.59,180,180,180s180-80.59,180-180S1299.41,330,1200,330L1200,330z"
                ></path>
              </g>
              <g>
                <rect x="888" fill="#3366CC" width="12" height="1020"></rect>
              </g>
              <g>
                <rect x="1500" fill="#3366CC" width="12" height="1020"></rect>
              </g>
              <g>
                <path
                  fill="none"
                  d="M1200,962c-31.98,0-58,26.02-58,58h116C1258,988.02,1231.98,962,1200,962z"
                ></path>
                <path
                  fill="#CC3333"
                  d="M1200,962c31.98,0,58,26.02,58,58h2c0-33.14-26.86-60-60-60s-60,26.86-60,60h2 C1142,988.02,1168.02,962,1200,962z"
                ></path>
              </g>
              <g>
                <rect x="1196" fill="#FFFFFF" width="8" height="8"></rect>
                <path
                  fill="#FFFFFF"
                  d="M1204,983.78h-8v-16.13h8V983.78z M1204,939.42h-8v-16.13h8V939.42z M1204,895.07h-8v-16.13h8V895.07z M1204,850.71h-8v-16.13h8V850.71z M1204,806.36h-8v-16.13h8V806.36z M1204,762.01h-8v-16.13h8V762.01z M1204,717.66h-8v-16.13h8 V717.66z M1204,673.3h-8v-16.13h8V673.3z M1204,628.95h-8v-16.13h8V628.95z M1204,584.59h-8v-16.13h8V584.59z M1204,540.24h-8 v-16.13h8V540.24z M1204,495.89h-8v-16.13h8V495.89z M1204,451.53h-8v-16.13h8V451.53z M1204,407.18h-8v-16.13h8V407.18z M1204,362.83h-8V346.7h8V362.83z M1204,318.47h-8v-16.13h8V318.47z M1204,274.12h-8v-16.13h8V274.12z M1204,229.77h-8v-16.13h8 V229.77z M1204,185.41h-8v-16.13h8V185.41z M1204,141.06h-8v-16.13h8V141.06z M1204,96.71h-8V80.58h8V96.71z M1204,52.35h-8V36.23 h8V52.35z"
                ></path>
                <rect
                  x="1196"
                  y="1012"
                  fill="#FFFFFF"
                  width="8"
                  height="8"
                ></rect>
              </g>
              <g>
                <g>
                  <g>
                    <circle fill="none" cx="372" cy="246" r="180"></circle>
                    <path
                      fill="#CC3333"
                      d="M372,68c24.03,0,47.34,4.71,69.29,13.99c21.2,8.97,40.23,21.8,56.58,38.15s29.18,35.38,38.15,56.58 C545.29,198.66,550,221.97,550,246s-4.71,47.34-13.99,69.29c-8.97,21.2-21.8,40.23-38.15,56.58 c-16.35,16.35-35.38,29.18-56.58,38.15C419.34,419.29,396.03,424,372,424s-47.34-4.71-69.29-13.99 c-21.2-8.97-40.23-21.8-56.58-38.15c-16.35-16.35-29.18-35.38-38.15-56.58C198.71,293.34,194,270.03,194,246 s4.71-47.34,13.99-69.29c8.97-21.2,21.8-40.23,38.15-56.58s35.38-29.18,56.58-38.15C324.66,72.71,347.97,68,372,68 M372,66 c-99.41,0-180,80.59-180,180s80.59,180,180,180s180-80.59,180-180S471.41,66,372,66L372,66z"
                    ></path>
                  </g>
                  <path
                    fill="#CC3333"
                    d="M372,236c5.51,0,10,4.49,10,10s-4.49,10-10,10s-10-4.49-10-10S366.49,236,372,236 M372,234 c-6.63,0-12,5.37-12,12s5.37,12,12,12s12-5.37,12-12S378.63,234,372,234L372,234z"
                  ></path>
                  <g>
                    <rect
                      x="329"
                      y="218"
                      transform="matrix(6.123234e-17 -1 1 6.123234e-17 128 566)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="300"
                      y="235"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                    <rect
                      x="329"
                      y="272"
                      transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 620 -74)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="300"
                      y="255"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                  </g>
                  <g>
                    <rect
                      x="379"
                      y="218"
                      transform="matrix(4.489393e-11 -1 1 4.489393e-11 178 616)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="396"
                      y="235"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                    <rect
                      x="379"
                      y="272"
                      transform="matrix(-4.489405e-11 1 -1 -4.489405e-11 670 -124)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="396"
                      y="255"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                  </g>
                  <polygon
                    fill="#CC3333"
                    points="339,69 337,70 337,45 339,45 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="407,70 405,69 405,45 407,45 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="339,423 337,422 337,447 339,447 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="407,422 405,423 405,447 407,447 		"
                  ></polygon>
                </g>
                <g>
                  <path
                    fill="none"
                    d="M379,236.27v19.47c3.02-2.18,5-5.72,5-9.73C384,241.99,382.02,238.45,379,236.27z"
                  ></path>
                  <path
                    fill="none"
                    d="M372,234c-2.45,0-4.73,0.74-6.63,2h13.26C376.73,234.74,374.45,234,372,234z"
                  ></path>
                  <path
                    fill="none"
                    d="M372,258c2.45,0,4.73-0.74,6.63-2h-13.26C367.27,257.26,369.55,258,372,258z"
                  ></path>
                  <path
                    fill="none"
                    d="M360,246c0,4.01,1.98,7.55,5,9.73v-19.47C361.98,238.45,360,241.99,360,246z"
                  ></path>
                  <path
                    fill="#CC3333"
                    d="M378.63,236h-13.26c-0.13,0.08-0.25,1.18-1.37,1.27v17.47c1.12,0.09,1.24,1.18,1.37,1.27h13.26 c0.13-0.08,0.25-1.18,1.37-1.27v-17.47C378.88,237.18,378.76,236.08,378.63,236z"
                  ></path>
                </g>
              </g>
              <g>
                <g>
                  <circle fill="none" cx="372" cy="774" r="180"></circle>
                  <path
                    fill="#CC3333"
                    d="M552,774c0-87.43-62.34-160.3-145-176.59V573h-2v24l0.09,0.05C394.37,595.05,383.31,594,372,594 s-22.37,1.05-33.09,3.05L339,597v-24h-2v24.41C254.34,613.7,192,686.57,192,774s62.34,160.3,145,176.59V975h2v-24l-0.09-0.05 c10.73,1.99,21.79,3.05,33.09,3.05s22.37-1.05,33.09-3.05L405,951v24h2v-24.41C489.66,934.3,552,861.43,552,774z M441.29,938.01 C419.34,947.29,396.03,952,372,952s-47.34-4.71-69.28-13.99c-21.2-8.97-40.23-21.8-56.58-38.15s-29.18-35.38-38.15-56.58 C198.71,821.34,194,798.03,194,774s4.71-47.34,13.99-69.29c8.97-21.2,21.8-40.23,38.15-56.58c16.35-16.35,35.38-29.18,56.58-38.15 C324.66,600.71,347.97,596,372,596s47.34,4.71,69.29,13.99c21.2,8.97,40.23,21.8,56.58,38.15c16.35,16.35,29.18,35.38,38.15,56.58 C545.29,726.66,550,749.97,550,774s-4.71,47.34-13.99,69.28c-8.97,21.2-21.8,40.23-38.15,56.58S462.48,929.05,441.29,938.01z"
                  ></path>
                </g>
                <g>
                  <path
                    fill="none"
                    d="M379,764.27v19.47c3.02-2.18,5-5.72,5-9.73C384,769.99,382.02,766.45,379,764.27z"
                  ></path>
                  <path
                    fill="none"
                    d="M372,762c-2.45,0-4.73,0.74-6.63,2h13.26C376.73,762.74,374.45,762,372,762z"
                  ></path>
                  <path
                    fill="none"
                    d="M372,786c2.45,0,4.73-0.74,6.63-2h-13.26C367.27,785.26,369.55,786,372,786z"
                  ></path>
                  <path
                    fill="none"
                    d="M360,774c0,4.01,1.98,7.55,5,9.73v-19.47C361.98,766.45,360,769.99,360,774z"
                  ></path>
                  <g>
                    <polygon
                      fill="#CC3333"
                      points="346,763 300,763 300,765 346,765 348,765 348,763 348,729 346,729 		"
                    ></polygon>
                    <polygon
                      fill="#CC3333"
                      points="300,783 300,785 346,785 346,819 348,819 348,785 348,783 346,783 		"
                    ></polygon>
                    <polygon
                      fill="#CC3333"
                      points="398,763 398,729 396,729 396,763 396,765 398,765 444,765 444,763 		"
                    ></polygon>
                    <polygon
                      fill="#CC3333"
                      points="396,783 396,785 396,819 398,819 398,785 444,785 444,783 398,783 		"
                    ></polygon>
                    <path
                      fill="#CC3333"
                      d="M372,762c-2.45,0-4.73,0.74-6.63,2h0v0c-3.24,2.15-5.37,5.82-5.37,10s2.14,7.85,5.37,10l0,0h0 c1.9,1.26,4.18,2,6.63,2c2.45,0,4.73-0.74,6.63-2c3.24-2.15,5.37-5.82,5.37-10C384,767.37,378.63,762,372,762z M364,779.97 c-1.25-1.67-2-3.73-2-5.97s0.75-4.31,2-5.97V779.97z M380,779.97v-11.95c1.25,1.67,2,3.73,2,5.97S381.25,778.31,380,779.97z"
                    ></path>
                  </g>
                </g>
              </g>
              <g>
                <g>
                  <g>
                    <circle fill="none" cx="2028" cy="246" r="180"></circle>
                    <path
                      fill="#CC3333"
                      d="M2028,68c24.03,0,47.34,4.71,69.28,13.99c21.2,8.97,40.23,21.8,56.58,38.15s29.18,35.38,38.15,56.58 c9.28,21.94,13.99,45.25,13.99,69.29s-4.71,47.34-13.99,69.29c-8.97,21.2-21.8,40.23-38.15,56.58 c-16.35,16.35-35.38,29.18-56.58,38.15c-21.94,9.28-45.25,13.99-69.28,13.99s-47.34-4.71-69.29-13.99 c-21.2-8.97-40.23-21.8-56.58-38.15c-16.35-16.35-29.18-35.38-38.15-56.58c-9.28-21.94-13.99-45.25-13.99-69.29 s4.71-47.34,13.99-69.29c8.97-21.2,21.8-40.23,38.15-56.58c16.35-16.35,35.38-29.18,56.58-38.15 C1980.66,72.71,2003.97,68,2028,68 M2028,66c-99.41,0-180,80.59-180,180s80.59,180,180,180c99.41,0,180-80.59,180-180 S2127.41,66,2028,66L2028,66z"
                    ></path>
                  </g>
                  <path
                    fill="#CC3333"
                    d="M2028,236c5.51,0,10,4.49,10,10s-4.49,10-10,10s-10-4.49-10-10S2022.49,236,2028,236 M2028,234 c-6.63,0-12,5.37-12,12s5.37,12,12,12s12-5.37,12-12S2034.63,234,2028,234L2028,234z"
                  ></path>
                  <g>
                    <rect
                      x="1985"
                      y="218"
                      transform="matrix(6.123234e-17 -1 1 6.123234e-17 1784 2222)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="1956"
                      y="235"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                    <rect
                      x="1985"
                      y="272"
                      transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 2276 -1730)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="1956"
                      y="255"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                  </g>
                  <g>
                    <rect
                      x="2035"
                      y="218"
                      transform="matrix(4.496942e-11 -1 1 4.496942e-11 1834 2272)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="2052"
                      y="235"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                    <rect
                      x="2035"
                      y="272"
                      transform="matrix(-4.496955e-11 1 -1 -4.496955e-11 2326 -1780)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="2052"
                      y="255"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                  </g>
                  <polygon
                    fill="#CC3333"
                    points="1995,69 1993,70 1993,45 1995,45 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="2063,70 2061,69 2061,45 2063,45 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="1995,423 1993,422 1993,447 1995,447 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="2063,422 2061,423 2061,447 2063,447 		"
                  ></polygon>
                </g>
                <g>
                  <path
                    fill="none"
                    d="M2035,236.27v19.47c3.02-2.18,5-5.72,5-9.73C2040,241.99,2038.02,238.45,2035,236.27z"
                  ></path>
                  <path
                    fill="none"
                    d="M2028,234c-2.45,0-4.73,0.74-6.63,2h13.26C2032.73,234.74,2030.45,234,2028,234z"
                  ></path>
                  <path
                    fill="none"
                    d="M2028,258c2.45,0,4.73-0.74,6.63-2h-13.26C2023.27,257.26,2025.55,258,2028,258z"
                  ></path>
                  <path
                    fill="none"
                    d="M2016,246c0,4.01,1.98,7.55,5,9.73v-19.47C2017.98,238.45,2016,241.99,2016,246z"
                  ></path>
                  <path
                    fill="#CC3333"
                    d="M2034.63,236h-13.26c-0.13,0.08-0.25,1.18-1.37,1.27v17.47c1.12,0.09,1.24,1.18,1.37,1.27h13.26 c0.13-0.08,0.25-1.18,1.37-1.27v-17.47C2034.88,237.18,2034.76,236.08,2034.63,236z"
                  ></path>
                </g>
              </g>
              <g>
                <g>
                  <g>
                    <circle fill="none" cx="2028" cy="774" r="180"></circle>
                    <path
                      fill="#CC3333"
                      d="M2028,596c24.03,0,47.34,4.71,69.28,13.99c21.2,8.97,40.23,21.8,56.58,38.15s29.18,35.38,38.15,56.58 c9.28,21.94,13.99,45.25,13.99,69.29s-4.71,47.34-13.99,69.29c-8.97,21.2-21.8,40.23-38.15,56.58 c-16.35,16.35-35.38,29.18-56.58,38.15c-21.94,9.28-45.25,13.99-69.28,13.99s-47.34-4.71-69.29-13.99 c-21.2-8.97-40.23-21.8-56.58-38.15c-16.35-16.35-29.18-35.38-38.15-56.58c-9.28-21.94-13.99-45.25-13.99-69.29 s4.71-47.34,13.99-69.29c8.97-21.2,21.8-40.23,38.15-56.58c16.35-16.35,35.38-29.18,56.58-38.15 C1980.66,600.71,2003.97,596,2028,596 M2028,594c-99.41,0-180,80.59-180,180s80.59,180,180,180c99.41,0,180-80.59,180-180 S2127.41,594,2028,594L2028,594z"
                    ></path>
                  </g>
                  <path
                    fill="#CC3333"
                    d="M2028,764c5.51,0,10,4.49,10,10s-4.49,10-10,10s-10-4.49-10-10S2022.49,764,2028,764 M2028,762 c-6.63,0-12,5.37-12,12s5.37,12,12,12s12-5.37,12-12S2034.63,762,2028,762L2028,762z"
                  ></path>
                  <g>
                    <rect
                      x="1985"
                      y="746"
                      transform="matrix(6.123234e-17 -1 1 6.123234e-17 1256 2750)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="1956"
                      y="763"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                    <rect
                      x="1985"
                      y="800"
                      transform="matrix(-1.836970e-16 1 -1 -1.836970e-16 2804 -1202)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="1956"
                      y="783"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                  </g>
                  <g>
                    <rect
                      x="2035"
                      y="746"
                      transform="matrix(4.496942e-11 -1 1 4.496942e-11 1306 2800)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="2052"
                      y="763"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                    <rect
                      x="2035"
                      y="800"
                      transform="matrix(-4.496955e-11 1 -1 -4.496955e-11 2854 -1252)"
                      fill="#CC3333"
                      width="36"
                      height="2"
                    ></rect>
                    <rect
                      x="2052"
                      y="783"
                      fill="#CC3333"
                      width="48"
                      height="2"
                    ></rect>
                  </g>
                  <polygon
                    fill="#CC3333"
                    points="1995,597 1993,598 1993,573 1995,573 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="2063,598 2061,597 2061,573 2063,573 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="1995,951 1993,950 1993,975 1995,975 		"
                  ></polygon>
                  <polygon
                    fill="#CC3333"
                    points="2063,950 2061,951 2061,975 2063,975 		"
                  ></polygon>
                </g>
                <g>
                  <path
                    fill="none"
                    d="M2035,764.27v19.47c3.02-2.18,5-5.72,5-9.73C2040,769.99,2038.02,766.45,2035,764.27z"
                  ></path>
                  <path
                    fill="none"
                    d="M2028,762c-2.45,0-4.73,0.74-6.63,2h13.26C2032.73,762.74,2030.45,762,2028,762z"
                  ></path>
                  <path
                    fill="none"
                    d="M2028,786c2.45,0,4.73-0.74,6.63-2h-13.26C2023.27,785.26,2025.55,786,2028,786z"
                  ></path>
                  <path
                    fill="none"
                    d="M2016,774c0,4.01,1.98,7.55,5,9.73v-19.47C2017.98,766.45,2016,769.99,2016,774z"
                  ></path>
                  <path
                    fill="#CC3333"
                    d="M2034.63,764h-13.26c-0.13,0.08-0.25,1.18-1.37,1.27v17.47c1.12,0.09,1.24,1.18,1.37,1.27h13.26 c0.13-0.08,0.25-1.18,1.37-1.27v-17.47C2034.88,765.18,2034.76,764.08,2034.63,764z"
                  ></path>
                </g>
              </g>
              <g>
                <path
                  fill="#CC3333"
                  d="M2213.7,462.29c-12.17,12.06-17.7,28.48-17.7,47.71c0,19.38,5.37,35.64,17.7,47.71 c0.19,0.19,0.45,0.29,0.71,0.29H2268v392.49c0.67-0.51,1.34-1.02,2-1.54V642.23l130,35.45v-2.07l-130-35.45V557v-11h20.58 c9.62,0,17.42-7.02,17.42-15.68v-40.65c0-8.66-7.8-15.67-17.42-15.67H2270v-11v-83.24l130-35.45v-2.07l-130,35.45V71.04 c-0.66-0.52-1.33-1.02-2-1.54V462h-53.58C2214.15,462,2213.89,462.11,2213.7,462.29z M2270,544v-68h20.58 c8.5,0,15.42,6.13,15.42,13.67v40.65c0,7.54-6.92,13.68-15.42,13.68H2270z M2198,510c0-19.29,5.66-34.77,16.82-46h4.18v5h2v-5h47 v10.31v71.47V556h-47v-5h-2v5h-4.18C2203.5,544.76,2198,529.71,2198,510z"
                ></path>
              </g>
              <g>
                <path
                  fill="#CC3333"
                  d="M185.58,462H132V69.51c-0.67,0.51-1.34,1.02-2,1.54v306.65L0,342.24v2.07l130,35.45V463v11h-20.58 C99.8,474,92,481.02,92,489.67v40.65c0,8.66,7.8,15.68,17.42,15.68H130v11v83.16L0,675.61v2.07l130-35.45v306.73 c0.66,0.52,1.33,1.02,2,1.54V558h53.59c0.26,0,0.52-0.1,0.71-0.29C198.63,545.64,204,529.39,204,510c0-19.23-5.54-35.64-17.7-47.71 C186.11,462.11,185.85,462,185.58,462z M109.42,544c-8.5,0-15.42-6.14-15.42-13.68v-40.65c0-7.54,6.92-13.67,15.42-13.67H130v68 H109.42z M185.18,556H181v-5h-2v5h-47v-10.22v-71.47V464h47v5h2v-5h4.18c11.16,11.24,16.82,26.71,16.82,46 C202,529.71,196.5,544.76,185.18,556z"
                ></path>
              </g>
              {replayData && replayData[currentFrame] && (
                <>
                  {Object.values(replayData[currentFrame].onIce).map(
                    renderPlayer
                  )}
                </>
              )}
              <div></div>
              <path
                fill="#CC3333"
                d="M972,774c0-6.63-5.37-12-12-12c-2.45,0-4.73,0.74-6.63,2h0v0c-3.24,2.15-5.37,5.82-5.37,10s2.14,7.85,5.37,10 l0,0h0c1.9,1.26,4.18,2,6.63,2c2.45,0,4.73-0.74,6.63-2l0,0l0,0C969.86,781.85,972,778.18,972,774z M970,774 c0,2.24-0.75,4.31-2,5.97v-11.95C969.25,769.69,970,771.76,970,774z M950,774c0-2.24,0.75-4.31,2-5.97v11.95 C950.75,778.31,950,776.24,950,774z"
              ></path>
              <path
                fill="#CC3333"
                d="M972,246c0-6.63-5.37-12-12-12c-2.45,0-4.73,0.74-6.63,2h0v0c-3.24,2.15-5.37,5.82-5.37,10s2.14,7.85,5.37,10 l0,0h0c1.9,1.26,4.18,2,6.63,2c2.45,0,4.73-0.74,6.63-2l0,0l0,0C969.86,253.85,972,250.18,972,246z M970,246 c0,2.24-0.75,4.31-2,5.97v-11.95C969.25,241.69,970,243.76,970,246z M950,246c0-2.24,0.75-4.31,2-5.97v11.95 C950.75,250.31,950,248.24,950,246z"
              ></path>
              <path
                fill="#CC3333"
                d="M1452,774c0-6.63-5.37-12-12-12c-2.45,0-4.73,0.74-6.63,2l0,0v0c-3.24,2.15-5.37,5.82-5.37,10 s2.14,7.85,5.37,10v0h0c1.9,1.26,4.18,2,6.63,2c2.45,0,4.73-0.74,6.63-2l0,0l0,0C1449.86,781.85,1452,778.18,1452,774z M1450,774 c0,2.24-0.75,4.31-2,5.97v-11.95C1449.25,769.69,1450,771.76,1450,774z M1430,774c0-2.24,0.75-4.31,2-5.97v11.95 C1430.75,778.31,1430,776.24,1430,774z"
              ></path>
              <path
                fill="#CC3333"
                d="M1452,246c0-6.63-5.37-12-12-12c-2.45,0-4.73,0.74-6.63,2l0,0v0c-3.24,2.15-5.37,5.82-5.37,10 s2.14,7.85,5.37,10v0h0c1.9,1.26,4.18,2,6.63,2c2.45,0,4.73-0.74,6.63-2l0,0l0,0C1449.86,253.85,1452,250.18,1452,246z M1450,246 c0,2.24-0.75,4.31-2,5.97v-11.95C1449.25,241.69,1450,243.76,1450,246z M1430,246c0-2.24,0.75-4.31,2-5.97v11.95 C1430.75,250.31,1430,248.24,1430,246z"
              ></path>
              <g>
                <circle fill="#3366CC" cx="1200" cy="510" r="6"></circle>
              </g>
            </svg>
          </div>
        </div>
      </Accordion>
    </>
  );
};
