import { Position } from "../../model/app/impl/position";
/**
 * A move strategy
 */
export interface MoveStrategy {
    /**
     * Compute a new position
     * @param position
     * @return {Position}
     */
    move(position: Position): Position;
}
