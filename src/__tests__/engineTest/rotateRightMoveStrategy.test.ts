// Test RotateRightMoveStrategy class
import { RotateRightMoveStrategy } from '../../engine/impl/rotateRightMoveStrategy'
import { Position } from '../../model/app/impl/position';
import { Direction } from '../../model/enum/direction'

test('ROTATE RIGHT : function move NORTH to EAST', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const rStrat: RotateRightMoveStrategy = new RotateRightMoveStrategy();
    // Rotate right
    expect(rStrat.move(pos)).toEqual(new Position(6, 3, Direction.EAST));
});

test('ROTATE RIGHT : function move SOUTH to WEST', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.SOUTH);
    const rStrat: RotateRightMoveStrategy = new RotateRightMoveStrategy();
    // Rotate right
    expect(rStrat.move(pos)).toEqual(new Position(6, 3, Direction.WEST));
});

test('ROTATE RIGHT : function move EAST to SOUTH', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.EAST);
    const rStrat: RotateRightMoveStrategy = new RotateRightMoveStrategy();
    // Rotate right
    expect(rStrat.move(pos)).toEqual(new Position(6, 3, Direction.SOUTH));
});

test('ROTATE RIGHT : function move WEST to NORTH', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.WEST);
    const rStrat: RotateRightMoveStrategy = new RotateRightMoveStrategy();
    // Rotate right
    expect(rStrat.move(pos)).toEqual(new Position(6, 3, Direction.NORTH));
});