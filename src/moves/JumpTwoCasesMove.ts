import { IMowerMove } from '../interfaces/IMowerMove';
import { MowerContext } from '../models/MowerContext';

export class JumpTwoCasesMove implements IMowerMove {
  execute(context: MowerContext): void {
    const { mower, lawn } = context;
    const orientation = mower.getOrientation();

    let x = mower.getX();
    let y = mower.getY();

    switch (orientation) {
      case 'N':
        y += 2;
        break;
      case 'S':
        y -= 2;
        break;
      case 'E':
        x += 2;
        break;
      case 'W':
        x -= 2;
        break;
    }

    if (x >= 0 && y >= 0 && x <= lawn.getWidth() && y <= lawn.getHeight()) {
      mower.setX(x);
      mower.setY(y);
    }
  }
}
