const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options);
};

export default formatDate