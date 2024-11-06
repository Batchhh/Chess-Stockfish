export enum Classification {
    BRILLIANT = "brilliant",
    GREAT = "great",
    BEST = "best",
    EXCELLENT = "excellent",
    GOOD = "good",
    INACCURACY = "inaccuracy",
    MISTAKE = "mistake",
    BLUNDER = "blunder",
    BOOK = "book",
    FORCED = "forced"
}

export const classificationColorMap: Record<Classification, string> = {
    [Classification.BRILLIANT]: "#FFD700",     // Gold for brilliant moves
    [Classification.GREAT]: "#87CEFA",          // Light blue for great moves
    [Classification.BEST]: "#008000",           // Green for best moves
    [Classification.EXCELLENT]: "#32CD32",      // Lime green for excellent moves
    [Classification.GOOD]: "#0000FF",           // Blue for good moves
    [Classification.INACCURACY]: "#FFA500",     // Orange for inaccuracies
    [Classification.MISTAKE]: "#FF0000",        // Red for mistakes
    [Classification.BLUNDER]: "#8B0000",        // Dark red for blunders
    [Classification.BOOK]: "#808080",           // Grey for book moves
    [Classification.FORCED]: "#800080"          // Purple for forced moves
  };

export const classificationValues = {
    "blunder": 0,
    "mistake": 0.2,
    "inaccuracy": 0.4,
    "good": 0.65,
    "excellent": 0.9,
    "best": 1,
    "great": 1,
    "brilliant": 1,
    "book": 1,
    "forced": 1
}

