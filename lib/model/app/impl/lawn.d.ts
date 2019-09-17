import { Area } from "../core/area";
import { Position } from "./position";
/**
 * A lawn (x, y)
 */
export declare class Lawn implements Area {
    private xSize;
    private ySize;
    constructor(x: number, y: number);
    getXSize(): number;
    getYSize(): number;
    isInside(position: Position): boolean;
}
