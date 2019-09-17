import fs = require('fs');
import { MoveEngineImpl } from "./engine/impl/moveEngineImpl";
import { Lawn } from "./model/app/impl/lawn";
import { Mower } from "./model/app/impl/mower";
import { Position } from "./model/app/impl/position";
import { Direction } from "./model/enum/direction";
import { Move } from "./model/enum/move";
let fileLines: string;

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
        const firstLine = fileLines[0].split(' ');
        const xSize = parseInt(firstLine[0]);
        const ySize = parseInt(firstLine[1]);

        const lawn: Lawn = new Lawn(xSize, ySize);
        const moveEngine: MoveEngineImpl = new MoveEngineImpl();
        moveEngine.setArea(lawn);
        
        fs.writeFile('resources/outputData.txt', '', function () { });
        for (let i = 1; i < fileLines.length; i = i + 2) {
            const fileCoordinates = fileLines[i].split(' ');
            const x = parseInt(fileCoordinates[0]);
            const y = parseInt(fileCoordinates[1]);
            const direction: string = fileCoordinates[2];
            const defaultPosition: Position = new Position(x, y, parseDirection(direction));
            const mower: Mower = new Mower(defaultPosition);
            const id = moveEngine.addMovable(mower, defaultPosition);
            
            const instructions = fileLines[i + 1];
            instructions.split('').forEach((cmd) => {
                moveEngine.move(id, parseMove(cmd));
            });

            const lastPosition = mower.getPosition();
            const result = lastPosition.getX().toString() + ' ' + lastPosition.getY().toString() + ' ' + lastPosition.getDirection() + '\n'

            // Write the last position of mower in the output file 'outputData.txt'
            fs.appendFile('resources/outputData.txt', result, function () { });
        }
    }

}

/**
 * Read file
 * @param fileName 
 */
export function readInputFile(fileName: string): any {
    try {
        const file = fs.readFileSync(fileName).toString().match(/^.+$/gm);
        if (file == null) {
            throw new Error('Something bad happened with file : empty');
        } else {
            return file;
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            // The file is empty
            throw new Error('Empty file');
        } else {
            // The file does not exist
            throw new Error('No such file');
        }
    }
}

/**
 * Parse string to enum Direction
 * @param value 
 */
export function parseDirection(value: string): Direction {
    let direction: Direction;
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
    }
    return direction;
}

/**
 * Parse string to enum Move
 * @param value 
 */
export function parseMove(value: string): Move {
    let move: Move;
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
    }
    return move;
}