import { Mower } from "../mower";

/**
 * Makes the mower jump to an absolute position on the grid.
 * @param mower  The mower instance to move.
 * @param targetX The absolute X coordinate to jump to.
 * @param targetY The absolute Y coordinate to jump to.
 */
export function jumpMove(mower: Mower, targetX: number, targetY: number): void {
  mower.x = targetX;
  mower.y = targetY;
}
