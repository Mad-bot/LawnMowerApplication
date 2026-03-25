import { IMoveStrategy } from './IMoveStrategy';
import { Mower } from '../models/Mower';
import { Plateau } from '../models/Plateau';

/**
 * JumpMoveStrategy - moves the mower forward by 2 positions (jumps) in the
 * direction it is currently facing, as long as the resulting position is
 * within the plateau boundaries.  If the full jump would land outside the
 * plateau the mower stays in place (no partial move).
 */
export class JumpMoveStrategy implements IMoveStrategy {
  move(mower: Mower, plateau: Plateau): void {
    const JUMP_SIZE = 2;

    let newX = mower.x;
    let newY = mower.y;

    switch (mower.direction) {
      case 'N':
        newY += JUMP_SIZE;
        break;
      case 'E':
        newX += JUMP_SIZE;
        break;
      case 'S':
        newY -= JUMP_SIZE;
        break;
      case 'W':
        newX -= JUMP_SIZE;
        break;
      default:
        break;
    }

    if (
      newX >= 0 &&
      newY >= 0 &&
      newX <= plateau.maxX &&
      newY <= plateau.maxY
    ) {
      mower.x = newX;
      mower.y = newY;
    }
  }
}
