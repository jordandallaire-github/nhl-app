import React, { useCallback, useState } from "react";
import { INTeamSchedule } from "../../../interfaces/team/teamSchedule";
import {
  formatDateMonthYear,
  formatDateMonthShortYear,
} from "../../utils/formatDate";
import { formatGameTime } from "../../utils/formatGameTime";
import { Svg } from "../../utils/Icons";

interface SingleTeamScheduleProps {
  teamColor: string | null;
  schedule: INTeamSchedule | null;
  abr: string | null;
}

const SingleTeamSchedule: React.FC<SingleTeamScheduleProps> = ({
  teamColor,
  schedule: initialSchedule,
  abr,
}) => {
  const [, setCurrentMonth] = useState<string>("2024-09");
  const [schedule, setSchedule] = useState<INTeamSchedule | null>(
    initialSchedule
  );

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

  const handleMonthChange = useCallback(
    async (direction: "previous" | "next") => {
      if (!abr || !schedule) return;

      let newMonth: Date;
      if (direction === "previous" && schedule.previousMonth) {
        newMonth = new Date(schedule.previousMonth);
      } else if (direction === "next" && schedule.nextMonth) {
        newMonth = new Date(schedule.nextMonth);
      } else {
        return;
      }

      try {
        const res = await fetch(
          `https://api-web.nhle.com/v1/club-schedule/${abr}/month/${newMonth
            .toISOString()
            .slice(0, 7)}`
        );
        if (!res.ok) throw new Error("Failed to fetch new schedule");
        const newSchedule: INTeamSchedule = await res.json();
        setSchedule(newSchedule);
        setCurrentMonth(newMonth.toISOString().slice(0, 7));
      } catch (error: unknown) {
        console.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      }
    },
    [abr, schedule]
  );

  return (
    <section className="schedule">
      <div className="wrapper">
        <h2>Calendrier :</h2>
        <div className="schedule-panel">
          <div className="general-schedule-infos">
            <h3>
              {schedule?.currentMonth
                ? formatDateMonthYear(schedule.currentMonth)
                : ""}
            </h3>
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
              {[
                "Dimanche",
                "Lundi",
                "Mardi",
                "Mercredi",
                "Jeudi",
                "Vendredi",
                "Samedi",
              ].map((day, index) => (
                <h4 key={index}>{day}</h4>
              ))}
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
                      />
                    ) : (
                      <DayWithoutGames dayNumber={date?.getDate() ?? null} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
        <div className="nav-month">
          <button
            className="window-effect"
            onClick={() => handleMonthChange("previous")}
          >
            <Svg name="left-arrow" size="sm" />
            {`${formatDateMonthShortYear(schedule?.previousMonth ?? "")}`}
          </button>
          <button
            className="window-effect"
            onClick={() => handleMonthChange("next")}
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
}> = ({ game, teamColor, teamAbr }) => (
  <div
    style={{
      backgroundColor: `${game.homeTeam.abbrev === teamAbr ? teamColor : ""}`,
    }}
    className={`day window-effect games-day ${
      game.homeTeam.abbrev === teamAbr ? "homeTeam" : "awayTeam"
    }`}
  >
    <p className="day-number">{new Date(game.gameDate).getDate() + 1}</p>
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
              {game.gameState !== "LIVE" && game.gameState !== "FINAL" && (
                <>
                  <p>
                    {formatGameTime(game.startTimeUTC, game.easternUTCOffset)}
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
                      : "D " + game.awayTeam.score + "-" + game.homeTeam.score}
                  </p>
                )}
              <div className="game-links noMobile">
                <a href={`#`}>
                  <Svg name="game-stats" size="sm" />
                </a>
                {game.ticketsLink && game.gameState === "FUT" && (
                  <a target="_blank" href={game.ticketsLinkFr}>
                    <Svg name="ticket" size="sm" isStroke={true} />
                  </a>
                )}
                {(game?.threeMinRecap !== undefined ||
                  game?.threeMinRecapFr !== undefined) && (
                  <a
                    target="_blank"
                    href={`https://www.nhl.com${
                      game?.threeMinRecap
                        ? game?.threeMinRecap
                        : game?.threeMinRecapFr
                    }`}
                  >
                    <Svg name="recap-play-video" size="sm" />
                  </a>
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
