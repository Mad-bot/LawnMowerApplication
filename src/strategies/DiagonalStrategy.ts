import { ILawnMowerStrategy } from "./ILawnMowerStrategy";
import { Lawn } from "../models/Lawn";
import { LawnMower } from "../models/LawnMower";
import { Position } from "../models/Position";
import { Orientation } from "../models/Orientation";

/**
 * DiagonalStrategy moves the lawn mower diagonally across the lawn.
 *
 * The mower starts at its current position and advances in a diagonal pattern:
 * - It moves one step forward (in its current facing direction) and then
 *   turns right, alternating turns to trace diagonal lines across the lawn.
 *
 * Concretely the strategy works as follows:
 *   1. Move forward along the current column/row until reaching an edge.
 *   2. Turn right twice (180°) to reverse, then shift one step diagonally
 *      by turning right once more and advancing one step, then turning left
 *      (i.e. turning right three times) to face back.
 *
 * A simpler, practical interpretation used here:
 *   - The mower traverses the grid visiting cells (x, y) where (x + y) has
 *     the same parity, stepping diagonally: at each step the mower moves
 *     +1 in X and +1 in Y (or wraps to the next diagonal).
 *
 * Implementation detail:
 *   The strategy generates an ordered list of (x, y) positions by walking
 *   all diagonals of the lawn grid (top-left to bottom-right), then emits
 *   the sequence of MOVE / LEFT / RIGHT instructions that guides the mower
 *   through those positions in order.
 */
export class DiagonalStrategy implements ILawnMowerStrategy {
  /**
   * Returns the sequence of instructions ("L", "R", "F") that will move
   * the mower diagonally across the entire lawn surface.
   */
  getInstructions(lawn: Lawn, mower: LawnMower): string[] {
    const width = lawn.width;
    const height = lawn.height;

    // Build the ordered list of grid positions to visit using diagonal sweeps.
    // We iterate over diagonals d = x + y from 0 to (width-1 + height-1).
    const positions: Position[] = [];

    for (let d = 0; d < width + height - 1; d++) {
      // Determine the starting x for this diagonal.
      const xStart = Math.min(d, width - 1);
      const yStart = d - xStart;

      // Walk the diagonal: decrease x by 1 and increase y by 1 each step.
      // On even diagonals go "down-right", on odd diagonals go "up-left"
      // to create a boustrophedon (snake) pattern along diagonals.
      if (d % 2 === 0) {
        let x = xStart;
        let y = yStart;
        while (x >= 0 && y < height) {
          positions.push(new Position(x, y));
          x--;
          y++;
        }
      } else {
        // Collect the diagonal cells first then reverse them.
        const diag: Position[] = [];
        let x = xStart;
        let y = yStart;
        while (x >= 0 && y < height) {
          diag.push(new Position(x, y));
          x--;
          y++;
        }
        diag.reverse();
        positions.push(...diag);
      }
    }

    // Now convert the position sequence into mower instructions.
    const instructions: string[] = [];

    // The mower starts at its current position and orientation.
    let currentPos = new Position(mower.position.x, mower.position.y);
    let currentOrientation: Orientation = mower.orientation;

    // Find the starting position in our list (skip positions already visited
    // before the mower's starting cell, or start from the beginning).
    let startIdx = positions.findIndex(
      (p) => p.x === currentPos.x && p.y === currentPos.y
    );
    if (startIdx === -1) {
      startIdx = 0;
    }

    for (let i = startIdx + 1; i < positions.length; i++) {
      const target = positions[i];
      const dx = target.x - currentPos.x;
      const dy = target.y - currentPos.y;

      if (dx === 0 && dy === 0) {
        continue;
      }

      // Determine the required orientation to move toward target.
      const requiredOrientation = getOrientationForDelta(dx, dy);
      if (requiredOrientation === null) {
        // Cannot reach target in one step — skip (should not happen with
        // a well-formed diagonal sequence, but guard anyway).
        continue;
      }

      // Rotate from currentOrientation to requiredOrientation.
      const turns = getTurns(currentOrientation, requiredOrientation);
      instructions.push(...turns);
      currentOrientation = requiredOrientation;

      // Move forward one step.
      instructions.push("F");
      currentPos = target;
    }

    return instructions;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the Orientation that corresponds to a unit delta (dx, dy).
 * Returns null when the delta is not a single cardinal/diagonal unit step.
 */
function getOrientationForDelta(
  dx: number,
  dy: number
): Orientation | null {
  if (dx === 0 && dy === 1) return Orientation.NORTH;
  if (dx === 0 && dy === -1) return Orientation.SOUTH;
  if (dx === 1 && dy === 0) return Orientation.EAST;
  if (dx === -1 && dy === 0) return Orientation.WEST;
  return null;
}

/**
 * Returns the minimal sequence of "L" / "R" turns to rotate from `from`
 * to `to`.
 */
function getTurns(from: Orientation, to: Orientation): string[] {
  const order: Orientation[] = [
    Orientation.NORTH,
    Orientation.EAST,
    Orientation.SOUTH,
    Orientation.WEST,
  ];

  const fromIdx = order.indexOf(from);
  const toIdx = order.indexOf(to);

  if (fromIdx === toIdx) return [];

  const rightSteps = (toIdx - fromIdx + 4) % 4;
  const leftSteps = (fromIdx - toIdx + 4) % 4;

  if (rightSteps <= leftSteps) {
    return Array(rightSteps).fill("R");
  } else {
    return Array(leftSteps).fill("L");
  }
}
