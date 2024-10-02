import { useCallback, useEffect, useState } from "react";
import { INTSchedule } from "../interfaces/schedule";
import SingleSchedule from "../components/schedule/single-schedule";

const Schedule: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<INTSchedule | null>(null);

  const fetchTeamData = useCallback(async () => {
    setLoading(true);
    try {
      const scheduleDataResponse = await fetch(
        `https://api-web.nhle.com/v1/score/now`
      );
      if (!scheduleDataResponse.ok)
        throw new Error("Failed to fetch game data");
      const scheduleData: INTSchedule = await scheduleDataResponse.json();
      setSchedule(scheduleData);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SingleSchedule schedule={schedule}></SingleSchedule>
    </>
  );
};

export default Schedule;
