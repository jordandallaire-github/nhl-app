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

export const formatDateMonthDay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: undefined,
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
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


export const formatDateMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    day: undefined,
    timeZone: "UTC",
  });
};
