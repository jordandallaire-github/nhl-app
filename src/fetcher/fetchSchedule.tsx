import React, { useCallback, useEffect, useState } from "react";
import { INTSchedule } from "../interfaces/schedule";
import SingleSchedule from "../components/schedule/single-schedule";

const modifyDateByDays = (date: string, days: number): string => {
  const resultDate = new Date(date);
  resultDate.setDate(resultDate.getDate() - days);
  return resultDate.toISOString().split("T")[0];
};

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [schedule, setSchedule] = useState<INTSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSchedule = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api-web.nhle.com/v1/score/${date}`);
      if (!response.ok) {
        console.log(currentDate)
        throw new Error("Erreur lors de la récupération du calendrier.");
      }
      const data: INTSchedule = await response.json();
      setSchedule(data);
      setCurrentDate(date);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchSchedule(currentDate);
  }, [fetchSchedule, currentDate]);

  const handleWeekChange = (direction: "prev" | "next") => {
    const newDate = modifyDateByDays(
      currentDate,
      direction === "prev" ? -7 : 7
    );
    fetchSchedule(newDate);
  };

  const handleDayChange = (newDate: string) => {
    fetchSchedule(newDate);
  };

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <SingleSchedule
      schedule={schedule}
      onChangeWeek={(direction: "prev" | "next") => handleWeekChange(direction)}
      onChangeDay={handleDayChange}
    />
  );
};

export default Schedule;
