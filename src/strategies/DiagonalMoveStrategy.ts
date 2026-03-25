import { IMoveStrategy } from "./IMoveStrategy";
import { Mower } from "../Mower";
import { Direction } from "../Direction";

/**
 * DiagonalMoveStrategy moves the mower diagonally across the lawn by
 * alternating forward movement with 45-degree (diagonal) turns.
 *
 * Pattern per pass:
 *   1. Move one step forward.
 *   2. Turn 45° right (one step diagonally).
 *   3. Move one step forward.
 *   4. Turn 45° left (restore bearing) to continue the next pass.
 *
 * This produces a diagonal zigzag traversal of the lawn surface.
 */
export class DiagonalMoveStrategy implements IMoveStrategy {
  /** Number of forward steps to take in each diagonal pass. */
  private readonly stepsPerPass: number;

  constructor(stepsPerPass: number = 3) {
    if (stepsPerPass < 1) {
      throw new Error("stepsPerPass must be at least 1.");
    }
    this.stepsPerPass = stepsPerPass;
  }

  /**
   * Execute one diagonal pass for the given mower.
   *
   * @param mower - The mower instance to move.
   */
  public execute(mower: Mower): void {
    for (let step = 0; step < this.stepsPerPass; step++) {
      // Move forward one step along the current bearing.
      mower.moveForward();

      // Turn 45° right to take the diagonal step.
      mower.turnRight45();

      // Move one diagonal step.
      mower.moveForward();

      // Turn 45° left to restore the original bearing for the next forward step.
      mower.turnLeft45();
    }
  }

  /**
   * Build the full sequence of moves needed to traverse the lawn diagonally
   * and return it as an array of direction vectors.
   *
   * @param mower - The mower instance used to resolve the current heading.
   * @returns An ordered list of {@link Direction} values representing each move.
   */
  public buildMoveSequence(mower: Mower): Direction[] {
    const sequence: Direction[] = [];
    const originalDirection: Direction = mower.getDirection();

    for (let step = 0; step < this.stepsPerPass; step++) {
      // Forward step along the current heading.
      sequence.push(originalDirection);

      // Diagonal step (45° right of current heading).
      sequence.push(this.rotate45Right(originalDirection));
    }

    return sequence;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * Rotate a {@link Direction} 45° clockwise.
   *
   * @param direction - The starting direction.
   * @returns The direction after a 45° clockwise rotation.
   */
  private rotate45Right(direction: Direction): Direction {
    const order: Direction[] = [
      Direction.NORTH,
      Direction.NORTH_EAST,
      Direction.EAST,
      Direction.SOUTH_EAST,
      Direction.SOUTH,
      Direction.SOUTH_WEST,
      Direction.WEST,
      Direction.NORTH_WEST,
    ];

    const index = order.indexOf(direction);
    if (index === -1) {
      throw new Error(`Unknown direction: ${direction}`);
    }

    return order[(index + 1) % order.length];
  }
}
