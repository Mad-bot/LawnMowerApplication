import { IStrategy } from "./IStrategy";
import { Mower } from "../Mower";
import { Plateau } from "../Plateau";

export class ClassicStrategy implements IStrategy {
  move(mower: Mower, plateau: Plateau): void {
    const instructions = mower.getInstructions();
    for (const instruction of instructions) {
      if (instruction === "L" || instruction === "R") {
        mower.rotate(instruction);
      } else if (instruction === "F") {
        const next = mower.nextPosition();
        if (plateau.isWithinBounds(next)) {
          mower.moveForward();
        }
      }
    }
  }
}
