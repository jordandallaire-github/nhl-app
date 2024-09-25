export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "2-digit",
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
  });
};

export const formatDateMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    day: undefined,
  });
};
