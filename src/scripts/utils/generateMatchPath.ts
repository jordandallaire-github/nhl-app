export const generateMatchPath = (game: string) => {
  const parts = game.split("/");
  const teamAbbrs = parts[2].replace("vs", "vs");
  const [year, month, day] = parts.slice(3, 6);
  const matchId = parts[6];
  return `/match/${teamAbbrs}/${year}/${month}/${day}/${matchId}`;
};
