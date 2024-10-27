import React, { useCallback, useEffect, useState } from "react";
import { INTSchedule } from "../interfaces/schedule";
import SingleSchedule from "../components/single-schedule";

const getLocalDate = (): string => {
  const now = new Date();
  const localOffset = now.getTimezoneOffset() * 60000;
  const localTime = new Date(now.getTime() - localOffset);
  return localTime.toISOString().split("T")[0];
};

const modifyDateByDays = (date: string, days: number): string => {
  const resultDate = new Date(date);
  resultDate.setDate(resultDate.getDate() + days);
  return resultDate.toISOString().split("T")[0];
};

const Schedule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(getLocalDate());
  const [schedule, setSchedule] = useState<INTSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isBuildProduction = false;
  const apiWeb = isBuildProduction ? "/proxy.php/" : "https://api-web.nhle.com/"

  const fetchSchedule = useCallback(async (date: string) => {
    setLoading(true);
    try {
      console.log("Date envoyée à l'API:", date);
      const response = await fetch(`${apiWeb}v1/score/${date}`);
      if (!response.ok) {
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
  }, [apiWeb]);

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
    fetchSchedule(modifyDateByDays(newDate, 0));
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
