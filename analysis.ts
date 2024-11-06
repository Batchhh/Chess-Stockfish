import { Classification } from "./classification";
import { Evaluation } from "./types/Engine";

export default function analyse(evaluation: Evaluation): Classification | undefined {

    /* Analysis logic - Still work in progress */

    if (!evaluation) return undefined;

    const value = evaluation.value;
    const type = evaluation.type;

    if (type === "mate") {
        return Classification.FORCED;
    } else if (type === "cp") {
        if (value > 300) {
            return Classification.BEST; 
        } else if (value > 100) {
            return Classification.GOOD;
        } else if (value > -100) {
            return Classification.INACCURACY;
        } else if (value > -300) {
            return Classification.MISTAKE;
        } else {
            return Classification.BLUNDER;
        }
    } else {
        console.warn("Unknown evaluation type:", type);
        return undefined;
    }
}