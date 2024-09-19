const formatSeason = (season: number | undefined): string => {
  if (!season) return "";
  const seasonString = season.toString();
  const startYear = seasonString.slice(0, 4);
  const endYear = seasonString.slice(6, 8);
  return `${startYear}-${endYear}`;
};

export default formatSeason;
