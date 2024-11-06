import { Classification, classificationColorMap } from "./classification";

export interface ChessGame {
  turn: () => string;
  getFEN: () => string;

  move: (
    move: string | { from: string; to: string; promotion?: string }
  ) => void;

  agreeDraw: () => void;
  getPlayingAs: () => number | null;

  markings: {
    removeAll: () => void;
    addOne: (marking: {
      type: string;
      data: {
        color: string;
        square?: string;
        from?: string;
        to?: string;
      };
    }) => void;
    removeOne: any;
  };

  getJCEGameCopy: () => {
    threats: () => {
      pins: string[];
      undefended: string[];
      underdefended: string[];
      mates: string[];
    };
  };

  // New method to get position information, including game over status
  getPositionInfo: () => {
    gameOver: boolean; // Indicates whether the game is over
    // Additional properties can be added here if needed
    // check: boolean; // Indicates if there's a check
    // checkmate: boolean; // Indicates if it's checkmate
    // stalemate: boolean; // Indicates if it's stalemate
  };
}

export interface Marking {
  type: string,
  data: {
    color: string,
    from: string,
    to: string
  }
}

export function getBoard(): { game: ChessGame } | null {
  const chessBoardElement = document.querySelector("wc-chess-board") as {
    game: ChessGame;
  } | null;
  return chessBoardElement;
}

export function isMyTurn(): boolean {
  const FEN = getBoard()?.game.getFEN() || null;
  if (!FEN) return false;
  const playingAs = getBoard()?.game.getPlayingAs();
  const playerColor = playingAs === 1 ? "w" : playingAs === 2 ? "b" : null;
  return playerColor === null || FEN.split(" ")[1] === playerColor;
}

let lastMark: Marking;

export function createMark(from: string, to: string, classification: Classification) {
  
  if (!isMyTurn()) getBoard()?.game.markings.removeAll();

  const color = classificationColorMap[classification] || "#000000";

  lastMark = {
    type: "arrow",
    data: {
      color,
      from,
      to,
    },
  };

  getBoard()?.game.markings.addOne(lastMark);
}