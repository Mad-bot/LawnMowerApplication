import { ILawnMower } from "../ILawnMower";
import { IStrategy } from "./IStrategy";

export class UndoStrategy implements IStrategy {
  execute(lawnMower: ILawnMower): void {
    lawnMower.undo();
  }
}
