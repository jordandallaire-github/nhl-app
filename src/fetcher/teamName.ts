const fetchTeamNames = async (): Promise<{ [key: string]: string }> => {
    const isBuildProduction = false;
    const path = isBuildProduction ? "/projets/dist/" : "/";

    const response = await fetch(`${path}teamName.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch team names");
    }
    return response.json();
};

export default fetchTeamNames;
