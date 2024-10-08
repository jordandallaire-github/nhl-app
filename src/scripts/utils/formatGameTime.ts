export function formatGameTime(startTimeUTC: string, offset: string) {
  const utcDate = new Date(startTimeUTC);

  const offsetHours = parseInt(offset.split(":")[0], 10);
  const offsetMinutes = parseInt(offset.split(":")[1], 10);
  utcDate.setHours(utcDate.getHours() + offsetHours);
  utcDate.setMinutes(utcDate.getMinutes() + offsetMinutes);

  const isSmallScreen = window.innerWidth < 1050;

  let formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: isSmallScreen,
    timeZone: "UTC",
  }).format(utcDate);

  if (isSmallScreen) {
    formattedTime = formattedTime.replace(" AM", " AM").replace(" PM", " PM");
  }

  return formattedTime;
}
