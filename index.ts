import Stockfish from "./engine";
import { EvaluatedPosition } from "./types/Position"; 
import analyse from "./analysis";
import { createMark, getBoard } from "./board";
import { Classification } from "./classification";

declare global {
    interface Window {
        main: Main;
    }
}

class Main {
    public stockfish: Stockfish = new Stockfish();  
    public positions: EvaluatedPosition[] = [];     
    public lastKnownFEN: string = "";     
    
    /* Options */
    public marking: Boolean = true;
    public autoMove: Boolean = true;

    /* Move time in milliseconds */
    public min: number = 1000; //1s
    public max: number = 5000; //5s

    public getBestMove(FEN: string, depth: number = 15): void {

        this.stockfish.evaluate(FEN, depth).then((lines) => {
            for (let line of lines) {

                const analyseMove = analyse(line.evaluation) || null;
                const from = line.moveUCI.substring(0, 2);
                const to = line.moveUCI.substring(2, 4);
                const automove = {from, to, promotion: ""};

                if (this.marking) createMark(from, to, analyseMove ? analyseMove : Classification.BOOK);
                if (this.autoMove) {
                    setTimeout(() => {
                        getBoard()?.game.move(automove);
                    }, this.getRandomInt(this.min, this.max));
                }

                console.log(`[STOCKFISH] Calculated move: ${line.moveUCI}, Evaluation: ${line.evaluation.type} ${line.evaluation.value}`);
            }
        }).catch(err => {
            console.error("Error evaluating the move:", err);
        });
    }

    public render(): void {
        const renderloop = () => {
            const FEN: string | undefined = getBoard()?.game.getFEN();  
            if (!FEN) return;

            if (FEN === this.lastKnownFEN) return;  
            
            this.getBestMove(FEN); 

            this.lastKnownFEN = FEN;  
        };

        setInterval(renderloop, 20); 
    }

    private getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


window.main = new Main();
window.main.render();

/* Other options 

window.main.stockfish.skill

window.main.stockfish.elo

window.main.stockfish.PV

*/
