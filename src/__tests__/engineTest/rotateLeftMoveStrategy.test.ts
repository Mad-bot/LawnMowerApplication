// Test RotateLeftMoveStrategy class
import { RotateLeftMoveStrategy } from '../../engine/impl/rotateLeftMoveStrategy'
import { Position } from '../../model/app/impl/position';
import { Direction } from '../../model/enum/direction'

test('ROTATE LEFT : function move NORTH to WEST', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const lStrat: RotateLeftMoveStrategy = new RotateLeftMoveStrategy();
    // Rotate left
    expect(lStrat.move(pos)).toEqual(new Position(6, 3, Direction.WEST));
});

test('ROTATE LEFT : function move SOUTH to EAST', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.SOUTH);
    const lStrat: RotateLeftMoveStrategy = new RotateLeftMoveStrategy();
    // Rotate left
    expect(lStrat.move(pos)).toEqual(new Position(6, 3, Direction.EAST));
});

test('ROTATE LEFT : function move EAST to NORTH', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.EAST);
    const lStrat: RotateLeftMoveStrategy = new RotateLeftMoveStrategy();
    // Rotate left
    expect(lStrat.move(pos)).toEqual(new Position(6, 3, Direction.NORTH));
});

test('ROTATE LEFT : function move WEST to SOUTH', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.WEST);
    const lStrat: RotateLeftMoveStrategy = new RotateLeftMoveStrategy();
    // Rotate left
    expect(lStrat.move(pos)).toEqual(new Position(6, 3, Direction.SOUTH));
});