import React, { useEffect, useRef, useState } from "react";
import { INTeamSchedule } from "../../../interfaces/team/teamSchedule";
import {
  formatDateMonthYear,
  formatDateMonthShortYear,
} from "../../../scripts/utils/formatDate";
import { formatGameTime } from "../../../scripts/utils/formatGameTime";
import { Svg } from "../../../scripts/utils/Icons";
import { GameLink } from "../../../scripts/utils/formatGameURL";
import GoalClip from "../../match/components/goalClip";

interface SingleTeamScheduleProps {
  teamColor: string | null;
  schedule: INTeamSchedule | null;
  abr: string | null;
  onMonthChange: (direction: "previous" | "next") => void;
}

const SingleTeamSchedule: React.FC<SingleTeamScheduleProps> = ({
  teamColor,
  schedule: initialSchedule,
  abr,
  onMonthChange,
}) => {
  const [selectedGame, setSelectedGame] = useState<
    INTeamSchedule["games"][number] | null
  >(null);
  const [activeGameTop, setActiveGameTop] = useState<number | null>(null);
  const [activeGameLeft, setActiveGameLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const gameLinksRef = useRef<HTMLDivElement | null>(null);
  const [schedule, setSchedule] = useState<INTeamSchedule | null>(
    initialSchedule
  );

  useEffect(() => {
    setSchedule(initialSchedule);
  }, [initialSchedule]);

  const totalDays = 35;
  const nextMonthDate = new Date(schedule?.nextMonth ?? "");

  const firstDayOfMonth = new Date(
    nextMonthDate.getFullYear(),
    nextMonthDate.getMonth(),
    1
  );
  const daysInMonth = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();

  const daysArray = Array.from({ length: totalDays }, (_, index) => {
    if (index < firstDayWeekday) return null;
    const day = index - firstDayWeekday + 1;
    return day <= daysInMonth
      ? new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), day)
      : null;
  });

  const handleGameClick = (
    _event: React.MouseEvent,
    game: INTeamSchedule["games"][number],
    gameDayElement: HTMLElement
  ) => {
    const { top, left } = gameDayElement.getBoundingClientRect();
    if (gameLinksRef.current) {
      const gameLinksWidth = gameLinksRef.current.getBoundingClientRect().width;
      const gameDayHeight = gameDayElement.offsetHeight;
      if (left + gameLinksWidth > window.innerWidth) {
        setActiveGameLeft(window.innerWidth - gameLinksWidth - 20);
      } else {
        setActiveGameLeft(left);
      }

      setActiveGameTop(top + window.scrollY + gameDayHeight);
      setIsActive(true);
      setSelectedGame(game);
    }
  };

  useEffect(() => {
    if (window.innerWidth < 1050) {
      if (isActive) {
        document.documentElement.style.overflow = "hidden";
      } else {
        document.documentElement.style.overflow = "";
      }
      const handleClickOutside = (event: MouseEvent) => {
        if (
          gameLinksRef.current &&
          !gameLinksRef.current.contains(event.target as Node)
        ) {
          setIsActive(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isActive]);


  return (
    <section className="schedule">
      <div className="wrapper">
        <h1>Calendrier :</h1>
        <div className="schedule-panel">
          <div className="general-schedule-infos">
            <h2>
              {schedule?.currentMonth
                ? formatDateMonthYear(schedule.currentMonth)
                : ""}
            </h2>
            <div className="home-away-infos">
              <div className="home">
                <div
                  className="color-team"
                  style={{ backgroundColor: `${teamColor}` }}
                ></div>
                <p>Dom.</p>
              </div>
              <div className="away">
                <div className="color-team"></div>
                <p>Étr.</p>
              </div>
            </div>
          </div>
          <div className="schedule-container">
            <div className="day-week">
              {["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."].map(
                (day, index) => (
                  <p key={index}><strong>{day}</strong></p>
                )
              )}
            </div>
            <div className="schedule-day">
              {daysArray.map((date, index) => {
                const game = date
                  ? schedule?.games.find(
                      (g) =>
                        new Date(g.gameDate).toISOString().slice(0, 10) ===
                        date.toISOString().slice(0, 10)
                    )
                  : null;
                return (
                  <React.Fragment key={index}>
                    {game ? (
                      <DayWithGames
                        teamAbr={abr}
                        game={game}
                        teamColor={teamColor}
                        onClick={(e) =>
                          handleGameClick(e, game, e.currentTarget)
                        }
                      />
                    ) : (
                      <DayWithoutGames dayNumber={date?.getDate() ?? null} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div
              className={`game-links modal ${isActive ? "active" : ""}`}
              style={{
                top: `calc(${activeGameTop}px)`,
                left: `calc(${activeGameLeft}px)`,
              }}
              ref={gameLinksRef}
            >
              {selectedGame ? (
                <>
                  <GameLink game={selectedGame.gameCenterLink} withSvg />
                  {selectedGame.ticketsLink &&
                    selectedGame.gameState === "FUT" && (
                      <a target="_blank" href={selectedGame.ticketsLinkFr}>
                        <Svg name="ticket" size="sm" isStroke={true} />
                        <span className="mobile">Billets</span>
                        <Svg className="mobile" name="right-arrow" size="sm" />
                      </a>
                    )}
                  {(selectedGame?.threeMinRecap !== undefined ||
                    selectedGame?.threeMinRecapFr !== undefined) && (
                    <GoalClip
                      fr={`https://www.nhl.com${
                        selectedGame?.threeMinRecapFr ??
                        selectedGame?.threeMinRecap}`}
                    >
                      <Svg name="recap-play-video" size="sm" />
                      <span className="mobile">Résumé</span>
                      <Svg className="mobile" name="right-arrow" size="sm" />
                    </GoalClip>
                  )}
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="nav-month">
          <button
            className="window-effect"
            onClick={() => onMonthChange("previous")}
          >
            <Svg name="left-arrow" size="sm" />
            {`${formatDateMonthShortYear(schedule?.previousMonth ?? "")}`}
          </button>
          <button
            className="window-effect"
            onClick={() => onMonthChange("next")}
          >
            {`${formatDateMonthShortYear(schedule?.nextMonth ?? "")}`}
            <Svg name="right-arrow" size="sm" />
          </button>
        </div>
      </div>
    </section>
  );
};

const DayWithoutGames: React.FC<{ dayNumber: number | null }> = ({
  dayNumber,
}) => (
  <div className="day window-effect">
    <p className="day-number">{dayNumber !== null ? dayNumber : ""}</p>
  </div>
);

const DayWithGames: React.FC<{
  game: INTeamSchedule["games"][number];
  teamColor: string | null;
  teamAbr: string | null;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}> = ({ game, teamColor, teamAbr, onClick }) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: `${game.homeTeam.abbrev === teamAbr ? teamColor : ""}`,
    }}
    className={`day window-effect games-day ${
      game.homeTeam.abbrev === teamAbr ? "homeTeam" : "awayTeam"
    }`}
  >
    <p className="day-number">
      {new Date(game.gameDate).getDate() + 1 === 32
        ? 1
        : new Date(game.gameDate).getDate() + 1}
    </p>
    <div className="game-infos">
      <div className="opp-logo noMobile">
        <img
          src={`${
            game.awayTeam.abbrev === teamAbr
              ? game.homeTeam.logo
              : game.awayTeam.darkLogo
          }`}
          alt={`${
            game.awayTeam.abbrev === teamAbr
              ? game.homeTeam.abbrev
              : game.awayTeam.abbrev
          } logo`}
          loading="lazy"
        />
      </div>
      <h4 className="mobile">{`${
        game.awayTeam.abbrev === teamAbr
          ? game.homeTeam.abbrev
          : game.awayTeam.abbrev
      }`}</h4>
      <div className="content">
        <div className="livescore">
          {game.gameState === "LIVE" ? (
            <>
              <p
                className={`live ${
                  game.homeTeam.abbrev === teamAbr ? "homeTeam" : "awayTeam"
                } `}
              >
                Direct
              </p>
              <p className="noMobile">{`${
                game.homeTeam.abbrev + " " + game.homeTeam.score
              }, ${game.awayTeam.abbrev + " " + game.awayTeam.score}`}</p>
              <div className="game-links noMobile">
                <a href={`#`}>
                  <Svg name="game-stats" size="sm" />
                </a>
              </div>
            </>
          ) : (
            <>
              {game.gameState !== "LIVE" &&
                game.gameState !== "FINAL" &&
                game.gameState !== "OFF" && (
                  <>
                    <p>
                      {formatGameTime(game.startTimeUTC, game.easternUTCOffset)}{" "}
                      <span className="noMobile">HAE</span>
                    </p>
                    <div className="broadcast noMobile">
                      {game.tvBroadcasts.map((broadcast) => (
                        <p key={broadcast.id}>{broadcast.network}</p>
                      ))}
                    </div>
                  </>
                )}
              {game.awayTeam.score !== undefined &&
                game.homeTeam.score !== undefined && (
                  <p>
                    {game.homeTeam.abbrev === teamAbr &&
                    game.homeTeam.score > game.awayTeam.score
                      ? "V " + game.homeTeam.score + "-" + game.awayTeam.score
                      : game.awayTeam.abbrev === teamAbr &&
                        game.awayTeam.score > game.homeTeam.score
                      ? "V " + game.awayTeam.score + "-" + game.homeTeam.score
                      : game.homeTeam.abbrev === teamAbr &&
                        game.homeTeam.score < game.awayTeam.score
                      ? "D " + game.awayTeam.score + "-" + game.homeTeam.score
                      : game.awayTeam.abbrev === teamAbr &&
                        game.awayTeam.score < game.homeTeam.score
                      ? "D " + game.homeTeam.score + "-" + game.awayTeam.score
                      : ""}
                  </p>
                )}

              <div className="game-links noMobile">
                <GameLink game={game.gameCenterLink} withSvg />
                {game.ticketsLink && game.gameState === "FUT" && (
                  <a target="_blank" href={game.ticketsLinkFr}>
                    <Svg name="ticket" size="sm" isStroke={true} />
                    <span className="mobile">Billets</span>
                    <Svg className="mobile" name="right-arrow" size="sm" />
                  </a>
                )}
                {(game?.threeMinRecap !== undefined ||
                  game?.threeMinRecapFr !== undefined) && (
                    <GoalClip
                      fr={`https://www.nhl.com${
                        game?.threeMinRecapFr ??
                        game?.threeMinRecap}`}
                    >
                      <Svg name="recap-play-video" size="xs" />
                      <span className="mobile">Résumé</span>
                      <Svg className="mobile" name="right-arrow" size="sm" />
                    </GoalClip>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default SingleTeamSchedule;
