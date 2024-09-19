const fetchTeamNames = async (): Promise<{ [key: string]: string }> => {
    const response = await fetch("/teamName.json");
    if (!response.ok) {
      throw new Error("Failed to fetch team names");
    }
    return response.json();
};

export default fetchTeamNames;