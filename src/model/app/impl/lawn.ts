import { Area } from "../core/area";
import { Position } from "./position";

/**
 * A lawn (x, y)
 */
export class Lawn implements Area {
  // Field
  xSize: number;
  ySize: number;
  // Constructor
  constructor(x: number, y: number ) {
    this.xSize = x;
    this.ySize = y;
  }
  // Getters
  getXSize(): number {
    return this.xSize;
  }
  getYSize(): number {
    return this.ySize;
  }
  isInside(position: Position): boolean {
    const x: number = position.getX();
    const y: number = position.getY();

    return (x >= 0 && x <= this.xSize && y >= 0 && y <= this.ySize)
  }
}
