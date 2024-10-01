export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "2-digit",
    timeZone: "UTC",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", options);
};

export const formatDateMonthDay = (
  dateString: string,
  isLongMonth: boolean
): string => {
  const date = new Date(dateString);
  if (!isLongMonth) {
    return date.toLocaleDateString("fr-FR", {
      year: undefined,
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } else {
    return date.toLocaleDateString("fr-FR", {
      year: undefined,
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }
};

export const formatDateMonthShortYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: undefined,
    timeZone: "UTC",
  });
};

 export const formatDateDay = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString('fr-FR', { weekday: 'long' });
};

export const formatDateMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    day: undefined,
    timeZone: "UTC",
  });
};
