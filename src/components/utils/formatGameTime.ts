 export function formatGameTime(startTimeUTC: string, offset: string) {
  const utcDate = new Date(startTimeUTC);

  const offsetHours = parseInt(offset.split(":")[0], 10);
  const offsetMinutes = parseInt(offset.split(":")[1], 10);
  utcDate.setHours(utcDate.getHours() + offsetHours);
  utcDate.setMinutes(utcDate.getMinutes() + offsetMinutes);

  const formattedTime = new Intl.DateTimeFormat("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(utcDate);

  return formattedTime;
}
