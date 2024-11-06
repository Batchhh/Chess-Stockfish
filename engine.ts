import { StockfishWorker, Evaluation, EngineLine } from './types/Engine';

declare function STOCKFISH(): StockfishWorker;

class Stockfish {
  private worker: StockfishWorker;
  public depth: number = 15;

  /* Settings */
  public elo: number = 2200; //max 3190
  public skill: number = 20; //max 20
  public PV: number = 2; //max 500


  constructor() {
    this.worker = STOCKFISH();

    this.setEngine();

    this.worker.onerror = (event) => {
      console.log(`Problem with stockfish: ${event.message}`);
    };
  }

  public setEngine(): void {
    this.worker.postMessage("uci");
    this.worker.postMessage(`setoption name MultiPV value ${this.PV}`);
    this.worker.postMessage(`setoption name UCI_Elo value ${this.elo}`);
    this.worker.postMessage(`setoption name Skill Level value ${this.skill}`);
  }

  public evaluate(FEN: string, targetDepth: number): Promise<EngineLine[]> {
    this.worker.postMessage("position fen " + FEN);
    this.worker.postMessage("go depth " + targetDepth);

    const messages: string[] = [];
    const lines: EngineLine[] = [];

    return new Promise((resolve) => {
      this.worker.onmessage = (message: any) => {
        messages.unshift(message);

        let latestDepth = parseInt(
          message.match(/(?:depth )(\d+)/)?.[1] || "0"
        );
        this.depth = Math.max(latestDepth, this.depth);

        if (message.startsWith("bestmove") || message.includes("depth 0")) {
          let searchMessages = messages.filter((msg) =>
            msg.startsWith("info depth")
          );

          for (let searchMessage of searchMessages) {
            let idString = searchMessage?.match(/(?:multipv )(\d+)/)?.[1];
            let depthString = searchMessage?.match(/(?:depth )(\d+)/)?.[1];
            let moveUCI = searchMessage?.match(/(?: pv )(.+?)(?= |$)/)?.[1];
            let evaluation: Evaluation = {
              type: searchMessage.includes(" cp ") ? "cp" : "mate",
              value: parseInt(
                searchMessage?.match(/(?:(?:cp )|(?:mate ))([\d-]+)/)?.[1] || "0"
              ),
            };

            if (FEN.includes(" b ")) {
              evaluation.value *= -1;
            }

            if (!idString || !depthString || !moveUCI) continue;

            let id = parseInt(idString);
            let currDepth = parseInt(depthString);

            if (currDepth !== targetDepth || lines.some((line) => line.id === id)) {
              continue;
            }

            lines.push({
              id,
              depth: currDepth,
              evaluation,
              moveUCI,
              moveSAN: moveUCI.substring(2, 4)
            });
          }

          resolve(lines);
        }
      };
    });
  }
}

export default Stockfish;