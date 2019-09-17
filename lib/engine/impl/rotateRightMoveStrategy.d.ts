import { Position } from "../../model/app/impl/position";
import { MoveStrategy } from "../core/moveStrategy";
/**
 * Right move strategy of rotation
 *
 * @class RotateRightMoveStrategy
 * @implements {MoveStrategy}
 */
export declare class RotateRightMoveStrategy implements MoveStrategy {
    /**
     * Impl : Compute a new position
     * @param position
     */
    move(position: Position): Position;
}
