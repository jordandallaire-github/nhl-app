const fetchTeamNames = async (): Promise<{ [key: string]: string }> => {
    const isBuildProduction = true;
    const path = isBuildProduction ? "/projets/jdh/" : "/";

    const response = await fetch(`${path}teamName.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch team names");
    }
    return response.json();
};

export default fetchTeamNames;
