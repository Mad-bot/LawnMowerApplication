import { Direction } from "../../enum/direction";

export class Position {
  // Field
  x: number;
  y: number;
  direction: Direction;

  // Constructor
  constructor(x: number, y: number, direction: Direction ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  // Getter : returns the x position
  getX(): number {
    return this.x;
  }

  // Getter : returns the y position
  getY(): number {
    return this.y;
  }

  getDirection(): Direction {
    return this.direction;
  }

}
