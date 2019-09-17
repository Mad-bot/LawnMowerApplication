import { Position } from "../../model/app/impl/position";
import { MoveStrategy } from "../core/moveStrategy";
export declare class ForwardMoveStrategy implements MoveStrategy {
    /**
     * Move forward according to the direction
     *
     * @param {Position} position
     * @returns {Position}
     * @memberof ForwardMoveStrategy
     */
    move(position: Position): Position;
}
