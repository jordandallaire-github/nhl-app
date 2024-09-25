import React from "react";
import { INTeamSchedule } from "../../../interfaces/team/teamSchedule";
import { formatDateMonthYear } from "../../utils/formatDate";

interface SingleTeamScheduleProps {
  teamColor: string | null;
  schedule: INTeamSchedule | null;
  abr : string | null;
}

const SingleTeamSchedule: React.FC<SingleTeamScheduleProps> = ({
  teamColor,
  schedule,
  abr,
}) => {
  const totalDays = 35;
  const nextMonthDate = new Date(schedule?.nextMonth ?? "");
  
  const firstDayOfMonth = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), 1);
  const daysInMonth = new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth() + 1, 0).getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();

  const daysArray = Array.from({ length: totalDays }, (_, index) => {
    if (index < firstDayWeekday) return null;
    const day = index - firstDayWeekday + 1;
    return day <= daysInMonth ? new Date(firstDayOfMonth.getFullYear(), firstDayOfMonth.getMonth(), day) : null;
  });

  return (
    <section className="schedule">
      <div className="wrapper">
        <h2>Calendrier :</h2>
        <div className="schedule-panel">
          <div className="general-schedule-infos">
            <h3>{schedule?.nextMonth ? formatDateMonthYear(schedule.nextMonth) : ""}</h3>
            <div className="home-away-infos">
              <div className="home">
                <div className="color-team" style={{ backgroundColor: `${teamColor}` }}></div>
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
              {["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"].map((day, index) => (
                <h4 key={index}>{day}</h4>
              ))}
            </div>
            <div className="schedule-day">
              {daysArray.map((date, index) => {
                const game = date ? schedule?.games.find((g) => new Date(g.gameDate).toISOString().slice(0, 10) === date.toISOString().slice(0, 10)) : null;
                return (
                  <React.Fragment key={index}>
                    {game ? <DayWithGames teamAbr={abr}  game={game} teamColor={teamColor} /> : <DayWithoutGames dayNumber={date?.getDate() ?? null} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DayWithoutGames: React.FC<{ dayNumber: number | null }> = ({ dayNumber }) => (
  <div className="day window-effect">
    <p>{dayNumber !== null ? dayNumber : ""}</p>
  </div>
);

const DayWithGames: React.FC<{ game: INTeamSchedule["games"][number]; teamColor: string | null; teamAbr: string | null }> = ({ game, teamColor, teamAbr }) => (
  <div style={{ backgroundColor: `${game.homeTeam.abbrev === teamAbr ? teamColor : "" }` }} className={`day window-effect games-day ${game.homeTeam.abbrev === teamAbr ? "homeTeam" : "awayTeam" }`}>
    <p>{new Date(game.gameDate).getDate() + 1}</p>
    <div className="game-info">
       
      <span>{game.awayTeam.placeName.default}</span>
      <span>-</span>
      <span>{game.homeTeam.placeName.default}</span>
    </div>
  </div>
);

export default SingleTeamSchedule;
