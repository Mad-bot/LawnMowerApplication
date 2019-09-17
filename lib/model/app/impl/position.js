"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Position = /** @class */ (function () {
    // Constructor
    function Position(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
    }
    // Getter : returns the x position
    Position.prototype.getX = function () {
        return this.x;
    };
    // Getter : returns the y position
    Position.prototype.getY = function () {
        return this.y;
    };
    Position.prototype.getDirection = function () {
        return this.direction;
    };
    return Position;
}());
exports.Position = Position;
