"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var move_1 = require("../../model/enum/move");
var forwardMoveStrategy_1 = require("./forwardMoveStrategy");
var rotateLeftMoveStrategy_1 = require("./rotateLeftMoveStrategy");
var rotateRightMoveStrategy_1 = require("./rotateRightMoveStrategy");
/**
 * Implementation of the move engine
 */
var MoveEngineImpl = /** @class */ (function () {
    function MoveEngineImpl() {
        this.movables = [];
    }
    MoveEngineImpl.prototype.addMovable = function (movable, position) {
        if (!this.area) {
            throw new Error('Something bad happened : area does not exist');
        }
        else if (!this.area.isInside(position)) {
            throw new Error('Something bad happened : element is out of area');
        }
        else {
            // Register the element in the engine
            this.movables.push(movable);
            var index = this.movables.indexOf(movable);
            movable.moveTo(position);
            return index;
        }
    };
    MoveEngineImpl.prototype.move = function (id, move) {
        // Get the strategy move from move
        var strategy;
        switch (move) {
            case move_1.Move.LEFT:
                strategy = new rotateLeftMoveStrategy_1.RotateLeftMoveStrategy();
                break;
            case move_1.Move.RIGHT:
                strategy = new rotateRightMoveStrategy_1.RotateRightMoveStrategy();
                break;
            case move_1.Move.FORWARD:
                strategy = new forwardMoveStrategy_1.ForwardMoveStrategy();
                break;
            default:
                throw new Error('Something bad happened : move ' + move + ' is not supported');
        }
        // Get the movable from id
        var movable = this.movables[id];
        if (!movable) {
            throw new Error('Something bad happened : id ' + id + ' does not exist');
        }
        // Get old and new positions
        var oldPosition = movable.getPosition();
        var newPosition = strategy.move(oldPosition);
        // Check if the new position is valid
        if (!this.area) {
            throw new Error('Something bad happened : area does not exist');
        }
        else if (this.area.isInside(newPosition)) {
            // Move
            movable.moveTo(newPosition);
            return newPosition;
        }
        else {
            // Do nothing
            return oldPosition;
        }
    };
    MoveEngineImpl.prototype.getMovableFromId = function (id) {
        return this.movables[id];
    };
    MoveEngineImpl.prototype.getMovables = function () {
        return this.movables;
    };
    MoveEngineImpl.prototype.setArea = function (area) {
        this.area = area;
    };
    return MoveEngineImpl;
}());
exports.MoveEngineImpl = MoveEngineImpl;
