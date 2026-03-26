import { IMowerMove } from '../interfaces/IMowerMove';
import { MowerContext } from '../models/MowerContext';

export class JumpTwoCasesMove implements IMowerMove {
  private readonly JUMP_SIZE = 2;

  execute(context: MowerContext): void {
    const { mower, lawn } = context;
    const orientation = mower.getOrientation();

    let x = mower.getX();
    let y = mower.getY();

    switch (orientation) {
      case 'N':
        y += this.JUMP_SIZE;
        break;
      case 'S':
        y -= this.JUMP_SIZE;
        break;
      case 'E':
        x += this.JUMP_SIZE;
        break;
      case 'W':
        x -= this.JUMP_SIZE;
        break;
      default:
        break;
    }

    if (x >= 0 && y >= 0 && x <= lawn.getWidth() && y <= lawn.getHeight()) {
      mower.setX(x);
      mower.setY(y);
    }
  }
}
