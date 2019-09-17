import { Direction } from "../../enum/direction";
export declare class Position {
    private x;
    private y;
    private direction;
    constructor(x: number, y: number, direction: Direction);
    getX(): number;
    getY(): number;
    getDirection(): Direction;
}
