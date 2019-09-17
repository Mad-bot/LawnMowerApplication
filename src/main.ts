import fs = require('fs');
import { Lawn } from "./model/app/impl/lawn";
import { Mower } from "./model/app/impl/mower";
import { Position } from "./model/app/impl/position";
import { MoveEngineImpl } from "./engine/impl/moveEngineImpl";
import { Direction } from "./model/enum/direction";
import { Move } from "./model/enum/move";
var fileLines: string;

runApp();

/**
 * Run the lawn mower application
 */
export function runApp() {
    // Load input file 
    executeFile('resources/inputData.txt');
}

/**
 * Load file and execute commands
 * Results in the output file 'resources/outputData.txt'
 * @param fileName 
 */
export function executeFile(fileName: string): any {
    fileLines = readInputFile(fileName);
    if(fileLines != null) {
        var firstLine = fileLines[0].split(' ');
        var xSize = parseInt(firstLine[0]);
        var ySize = parseInt(firstLine[1]);

        const lawn: Lawn = new Lawn(xSize, ySize);
        let moveEngine: MoveEngineImpl = new MoveEngineImpl();
        moveEngine.setArea(lawn);
        
        fs.writeFile('resources/outputData.txt', '', function (err) { });
        for (let i = 1; i < fileLines.length; i = i + 2) {
            var fileCoordinates = fileLines[i].split(' ');
            var x = parseInt(fileCoordinates[0]);
            var y = parseInt(fileCoordinates[1]);
            var direction: string = fileCoordinates[2];
            var defaultPosition: Position = new Position(x, y, parseDirection(direction));
            let mower: Mower = new Mower(defaultPosition);
            let id = moveEngine.addMovable(mower, defaultPosition);
            
            var instructions = fileLines[i + 1];
            instructions.split('').forEach((cmd) => {
                moveEngine.move(id, parseMove(cmd));
            });

            let lastPosition = mower.getPosition();
            let result = lastPosition.getX().toString() + ' ' + lastPosition.getY().toString() + ' ' + lastPosition.getDirection() + '\n'

            // Write last position of mower in the output file 'outputData.txt'
            fs.appendFile('resources/outputData.txt', result, function (err) { });
            console.log(result); 
        }
    }

}

/**
 * Read file
 * @param fileName 
 */
export function readInputFile(fileName: string): any {
    try {
        var file = fs.readFileSync(fileName).toString().match(/^.+$/gm);
        if (file == null) {
            throw new Error('Something bad happened with file : empty');
        } else {
            return file;
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            //the file is empty
            throw new Error('Empty file');
        } else {
            //the file does not exist
            throw new Error('No such file');
        }
    }
}

/**
 * Parse string to enum Direction
 * @param value 
 */
export function parseDirection(value: string): Direction {
    var direction: Direction;
    switch(value) {
        case 'N' :
            direction = Direction.NORTH;
            break;
        case 'S' :
            direction = Direction.SOUTH;
            break;
        case 'E' :
            direction = Direction.EAST;
            break;
        case 'W' :
            direction = Direction.WEST;
            break;
        default :
            throw new Error('Something bad happened with direction : ' + value);
            break;
    }
    return direction;
}

/**
 * Parse string to enum Move
 * @param value 
 */
export function parseMove(value: string): Move {
    var move: Move;
    switch(value) {
        case 'L' :
            move = Move.LEFT;
            break;
        case 'R' :
            move = Move.RIGHT;
            break;
        case 'F' :
            move = Move.FORWARD;
            break;
        default :
            throw new Error('Something bad happened with move : ' + value);
            break;
    }
    return move;
}