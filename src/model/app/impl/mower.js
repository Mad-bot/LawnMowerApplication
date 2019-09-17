"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mower = /** @class */ (function () {
    // Constructor
    function Mower(position) {
        this.position = position;
    }
    /**
     * Move from a position to a new location
     * @param position
     */
    Mower.prototype.moveTo = function (position) {
        this.position = position;
    };
    /**
     * Returns the current position
     */
    Mower.prototype.getPosition = function () {
        return this.position;
    };
    return Mower;
}());
exports.Mower = Mower;
