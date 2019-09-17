// Test ForwardMoveStrategy class
import { ForwardMoveStrategy } from '../../engine/impl/forwardMoveStrategy'
import { Position } from '../../model/app/impl/position';
import { Direction } from '../../model/enum/direction'

test('Forward : function move NORTH (x, y+1)', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const fStrat: ForwardMoveStrategy = new ForwardMoveStrategy();
    expect(fStrat.move(pos)).toEqual(new Position(6, 4, Direction.NORTH));
});

test('Forward : function move SOUTH (x, y-1)', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.SOUTH);
    const fStrat: ForwardMoveStrategy = new ForwardMoveStrategy();
    expect(fStrat.move(pos)).toEqual(new Position(6, 2, Direction.SOUTH));
});

test('Forward : function move EAST (x+1, y)', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.EAST);
    const fStrat: ForwardMoveStrategy = new ForwardMoveStrategy();
    expect(fStrat.move(pos)).toEqual(new Position(7, 3, Direction.EAST));
});

test('Forward : function move WEST (x-1, y)', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.WEST);
    const fStrat: ForwardMoveStrategy = new ForwardMoveStrategy();
    expect(fStrat.move(pos)).toEqual(new Position(5, 3, Direction.WEST));
});