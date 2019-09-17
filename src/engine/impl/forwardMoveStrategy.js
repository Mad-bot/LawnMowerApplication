"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var position_1 = require("../../model/app/impl/position");
var direction_1 = require("../../model/enum/direction");
var ForwardMoveStrategy = /** @class */ (function () {
    function ForwardMoveStrategy() {
    }
    /**
     * Move forward according to the direction
     *
     * @param {Position} position
     * @returns {Position}
     * @memberof ForwardMoveStrategy
     */
    ForwardMoveStrategy.prototype.move = function (position) {
        var newPosition;
        var direction = position.getDirection();
        switch (direction) {
            case direction_1.Direction.NORTH:
                newPosition = new position_1.Position(position.getX(), position.getY() + 1, direction);
                break;
            case direction_1.Direction.SOUTH:
                newPosition = new position_1.Position(position.getX(), position.getY() - 1, direction);
                break;
            case direction_1.Direction.EAST:
                newPosition = new position_1.Position(position.getX() + 1, position.getY(), direction);
                break;
            case direction_1.Direction.WEST:
                newPosition = new position_1.Position(position.getX() - 1, position.getY(), direction);
                break;
            default:
                throw new Error('Something bad happened with direction : ' + position.getDirection());
                break;
        }
        return newPosition;
    };
    return ForwardMoveStrategy;
}());
exports.ForwardMoveStrategy = ForwardMoveStrategy;
