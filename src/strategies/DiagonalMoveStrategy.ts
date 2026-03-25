import { IMoveStrategy } from "./IMoveStrategy";
import { Mower } from "../Mower";
import { Orientation } from "../Orientation";
import { Position } from "../Position";
import { Lawn } from "../Lawn";

/**
 * DiagonalMoveStrategy moves the mower diagonally across the lawn.
 *
 * The mower advances one step diagonally on each move instruction:
 *   - NORTH / SOUTH component is derived from the current orientation.
 *   - The perpendicular (EAST / WEST) component alternates each step,
 *     starting with EAST.
 *
 * Boundary rules are identical to the standard strategy: a move that
 * would take the mower outside the lawn boundaries is simply ignored.
 */
export class DiagonalMoveStrategy implements IMoveStrategy {
  private eastwardStep: boolean = true;

  move(mower: Mower, lawn: Lawn): void {
    const position: Position = mower.getPosition();
    const orientation: Orientation = mower.getOrientation();

    // Determine the vertical delta from the current orientation
    let deltaY = 0;
    let deltaX = 0;

    switch (orientation) {
      case Orientation.NORTH:
        deltaY = 1;
        break;
      case Orientation.SOUTH:
        deltaY = -1;
        break;
      case Orientation.EAST:
        deltaX = 1;
        break;
      case Orientation.WEST:
        deltaX = -1;
        break;
    }

    // Add the perpendicular (diagonal) component
    if (deltaY !== 0) {
      // Moving vertically → add horizontal diagonal component
      deltaX = this.eastwardStep ? 1 : -1;
    } else {
      // Moving horizontally → add vertical diagonal component
      deltaY = this.eastwardStep ? 1 : -1;
    }

    const newX = position.getX() + deltaX;
    const newY = position.getY() + deltaY;

    // Only move if the new position is within lawn boundaries
    if (
      newX >= 0 &&
      newY >= 0 &&
      newX <= lawn.getWidth() &&
      newY <= lawn.getHeight()
    ) {
      mower.setPosition(new Position(newX, newY));
    }

    // Alternate the diagonal direction for the next move
    this.eastwardStep = !this.eastwardStep;
  }
}
