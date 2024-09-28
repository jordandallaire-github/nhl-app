 export const FormatPosition = (positionCode: string) => {
    switch (positionCode) {
      case "R":
        return "AD";
      case "L":
        return "AG";
      default:
        return positionCode;
    }
};