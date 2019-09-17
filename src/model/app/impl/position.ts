import { Direction } from "../../enum/direction";

export class Position {
  // Field
  private x: number;
  private y: number;
  private direction: Direction;

  // Constructor
  constructor(x: number, y: number, direction: Direction ) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  // Getter : returns the x position
  public getX(): number {
    return this.x;
  }

  // Getter : returns the y position
  public getY(): number {
    return this.y;
  }

  public getDirection(): Direction {
    return this.direction;
  }

}
