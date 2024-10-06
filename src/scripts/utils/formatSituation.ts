 export const formatSituation = (situationCodes: string[] | string): string => {
  if (Array.isArray(situationCodes)) {
    return situationCodes
      .map((code) => {
        switch (code) {
          case "PP":
            return "AN";
          case "EN":
            return "FD";
          case "PS":
            return "TP";
          default:
            return code;
        }
      })
      .join(", ");
  } else {
    switch (situationCodes) {
      case "PP":
        return "AN";
      case "EN":
        return "FD";
      case "PS":
        return "TP";
      default:
        return situationCodes;
    }
  }
};
