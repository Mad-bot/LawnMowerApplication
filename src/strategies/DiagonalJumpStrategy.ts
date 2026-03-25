import { ILawnMower } from "../interfaces/ILawnMower";
import { IJumpStrategy } from "../interfaces/IJumpStrategy";

export class DiagonalJumpStrategy implements IJumpStrategy {
  jump(lawnMower: ILawnMower): void {
    const currentX = lawnMower.getX();
    const currentY = lawnMower.getY();

    lawnMower.setX(currentX + 1);
    lawnMower.setY(currentY + 1);
  }
}
