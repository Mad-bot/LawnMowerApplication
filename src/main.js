"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var lawn_1 = require("./model/app/impl/lawn");
var mower_1 = require("./model/app/impl/mower");
var position_1 = require("./model/app/impl/position");
var moveEngineImpl_1 = require("./engine/impl/moveEngineImpl");
var direction_1 = require("./model/enum/direction");
var move_1 = require("./model/enum/move");
var fileLines;
runApp();
function runApp() {
    loadFile('resources/inputData.txt');
}
exports.runApp = runApp;
function loadFile(fileName) {
    fileLines = readInputFile(fileName);
    if (fileLines != null) {
        var firstLine = fileLines[0].split(' ');
        var xSize = parseInt(firstLine[0]);
        var ySize = parseInt(firstLine[1]);
        var lawn = new lawn_1.Lawn(xSize, ySize);
        var moveEngine_1 = new moveEngineImpl_1.MoveEngineImpl();
        moveEngine_1.setArea(lawn);
        fs.writeFile('resources/outputData.txt', '', function (err) { });
        var _loop_1 = function (i) {
            fileCoordinates = fileLines[i].split(' ');
            x = parseInt(fileCoordinates[0]);
            y = parseInt(fileCoordinates[1]);
            direction = fileCoordinates[2];
            defaultPosition = new position_1.Position(x, y, parseDirection(direction));
            var mower = new mower_1.Mower(defaultPosition);
            var id = moveEngine_1.addMovable(mower, defaultPosition);
            instructions = fileLines[i + 1];
            instructions.split('').forEach(function (cmd) {
                moveEngine_1.move(id, parseMove(cmd));
            });
            var lastPosition = mower.getPosition();
            var result = lastPosition.getX().toString() + ' ' + lastPosition.getY().toString() + ' ' + lastPosition.getDirection() + '\n';
            fs.appendFile('resources/outputData.txt', result, function (err) { });
            console.log(result);
        };
        var fileCoordinates, x, y, direction, defaultPosition, instructions;
        for (var i = 1; i < fileLines.length; i = i + 2) {
            _loop_1(i);
        }
    }
}
exports.loadFile = loadFile;
function readInputFile(fileName) {
    try {
        var file = fs.readFileSync(fileName).toString().match(/^.+$/gm);
        if (file == null) {
            throw new Error('Something bad happened with file : empty');
        }
        else {
            return file;
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            //the file is empty
            throw new Error('Empty file');
        }
        else {
            //the file does not exist
            throw new Error('No such file');
        }
    }
}
exports.readInputFile = readInputFile;
function parseDirection(value) {
    var direction;
    switch (value) {
        case 'N':
            direction = direction_1.Direction.NORTH;
            break;
        case 'S':
            direction = direction_1.Direction.SOUTH;
            break;
        case 'E':
            direction = direction_1.Direction.EAST;
            break;
        case 'W':
            direction = direction_1.Direction.WEST;
            break;
        default:
            throw new Error('Something bad happened with direction : ' + value);
            break;
    }
    return direction;
}
exports.parseDirection = parseDirection;
function parseMove(value) {
    var move;
    switch (value) {
        case 'L':
            move = move_1.Move.LEFT;
            break;
        case 'R':
            move = move_1.Move.RIGHT;
            break;
        case 'F':
            move = move_1.Move.FORWARD;
            break;
        default:
            throw new Error('Something bad happened with move : ' + value);
            break;
    }
    return move;
}
exports.parseMove = parseMove;
