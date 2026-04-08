import { IMove } from "./IMove";
import { Mower } from "../Mower";

/**
 * StrategyMove selects the best move from a list of candidate moves
 * by evaluating each one and picking the first that satisfies the
 * strategy's acceptance criteria, falling back to the last candidate
 * if none are accepted.
 */
export class StrategyMove implements IMove {
  private readonly moves: IMove[];

  constructor(moves: IMove[]) {
    if (!moves || moves.length === 0) {
      throw new Error("StrategyMove requires at least one candidate move.");
    }
    this.moves = moves;
  }

  execute(mower: Mower): void {
    for (const move of this.moves) {
      if (move.isValid(mower)) {
        move.execute(mower);
        return;
      }
    }
    // Fallback: execute the last move regardless of validity
    this.moves[this.moves.length - 1].execute(mower);
  }

  isValid(mower: Mower): boolean {
    return this.moves.some((move) => move.isValid(mower));
  }
}
