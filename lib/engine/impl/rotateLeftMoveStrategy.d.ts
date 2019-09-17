import { Position } from "../../model/app/impl/position";
import { MoveStrategy } from "../core/moveStrategy";
/**
 * Left move strategy of rotation
 *
 * @class RotateLeftMoveStrategy
 * @implements {MoveStrategy}
 */
export declare class RotateLeftMoveStrategy implements MoveStrategy {
    /**
     * Impl : Compute a new position
     * @param position
     */
    move(position: Position): Position;
}
