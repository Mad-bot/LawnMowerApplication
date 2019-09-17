import { Direction } from "./model/enum/direction";
import { Move } from "./model/enum/move";
/**
 * Run the lawn mower application
 */
export declare function runApp(): void;
/**
 * Load file and execute commands
 * Results in the output file 'resources/outputData.txt'
 * @param fileName
 */
export declare function executeFile(fileName: string): any;
/**
 * Read file
 * @param fileName
 */
export declare function readInputFile(fileName: string): any;
/**
 * Parse string to enum Direction
 * @param value
 */
export declare function parseDirection(value: string): Direction;
/**
 * Parse string to enum Move
 * @param value
 */
export declare function parseMove(value: string): Move;
