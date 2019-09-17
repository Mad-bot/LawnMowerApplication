"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var position_1 = require("../../model/app/impl/position");
var direction_1 = require("../../model/enum/direction");
/**
 * Left move strategy of rotation
 *
 * @class RotateLeftMoveStrategy
 * @implements {MoveStrategy}
 */
var RotateLeftMoveStrategy = /** @class */ (function () {
    function RotateLeftMoveStrategy() {
    }
    /**
     * Impl : Compute a new position
     * @param position
     */
    RotateLeftMoveStrategy.prototype.move = function (position) {
        var direction = position.getDirection();
        var newDirection;
        switch (direction) {
            case direction_1.Direction.NORTH:
                newDirection = direction_1.Direction.WEST;
                break;
            case direction_1.Direction.SOUTH:
                newDirection = direction_1.Direction.EAST;
                break;
            case direction_1.Direction.EAST:
                newDirection = direction_1.Direction.NORTH;
                break;
            case direction_1.Direction.WEST:
                newDirection = direction_1.Direction.SOUTH;
                break;
            default:
                throw new Error('Something bad happened with direction : ' + direction);
        }
        // Returns position with the new direction
        return new position_1.Position(position.getX(), position.getY(), newDirection);
    };
    return RotateLeftMoveStrategy;
}());
exports.RotateLeftMoveStrategy = RotateLeftMoveStrategy;
