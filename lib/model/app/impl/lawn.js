"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A lawn (x, y)
 */
var Lawn = /** @class */ (function () {
    // Constructor
    function Lawn(x, y) {
        this.xSize = x;
        this.ySize = y;
    }
    // Getters
    Lawn.prototype.getXSize = function () {
        return this.xSize;
    };
    Lawn.prototype.getYSize = function () {
        return this.ySize;
    };
    Lawn.prototype.isInside = function (position) {
        var x = position.getX();
        var y = position.getY();
        return (x >= 0 && x <= this.xSize && y >= 0 && y <= this.ySize);
    };
    return Lawn;
}());
exports.Lawn = Lawn;
