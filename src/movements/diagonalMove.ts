import { Mower } from "../mower";

/**
 * Moves the mower diagonally by applying both an X and Y offset simultaneously.
 * @param mower  The mower instance to move.
 * @param deltaX The number of steps to move along the X axis (positive = right, negative = left).
 * @param deltaY The number of steps to move along the Y axis (positive = up, negative = down).
 */
export function diagonalMove(mower: Mower, deltaX: number, deltaY: number): void {
  mower.x += deltaX;
  mower.y += deltaY;
}
