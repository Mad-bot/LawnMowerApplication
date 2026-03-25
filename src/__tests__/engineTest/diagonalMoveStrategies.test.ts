import { ForwardNorthWestMoveStrategy } from '../../engine/impl/forwardNorthWestMoveStrategy';
import { ForwardSouthWestMoveStrategy } from '../../engine/impl/forwardSouthWestMoveStrategy';
import { ForwardNorthEastMoveStrategy } from '../../engine/impl/forwardNorthEastMoveStrategy';
import { ForwardSouthEastMoveStrategy } from '../../engine/impl/forwardSouthEastMoveStrategy';
import { Position } from '../../model/app/impl/position';
import { Direction } from '../../model/enum/direction';

test('ForwardNorthWest : move (x-1, y+1, NW)', () => {
    const pos: Position = new Position(3, 3, Direction.NORTH_WEST);
    expect(new ForwardNorthWestMoveStrategy().move(pos)).toEqual(new Position(2, 4, Direction.NORTH_WEST));
});

test('ForwardSouthWest : move (x-1, y-1, SW)', () => {
    const pos: Position = new Position(3, 3, Direction.SOUTH_WEST);
    expect(new ForwardSouthWestMoveStrategy().move(pos)).toEqual(new Position(2, 2, Direction.SOUTH_WEST));
});

test('ForwardNorthEast : move (x+1, y+1, NE)', () => {
    const pos: Position = new Position(3, 3, Direction.NORTH_EAST);
    expect(new ForwardNorthEastMoveStrategy().move(pos)).toEqual(new Position(4, 4, Direction.NORTH_EAST));
});

test('ForwardSouthEast : move (x+1, y-1, SE)', () => {
    const pos: Position = new Position(3, 3, Direction.SOUTH_EAST);
    expect(new ForwardSouthEastMoveStrategy().move(pos)).toEqual(new Position(4, 2, Direction.SOUTH_EAST));
});

test('ForwardNorthWest : out of bounds stays in place (handled by engine)', () => {
    // Strategy itself always computes new position; bounds check is in MoveEngineImpl
    const pos: Position = new Position(0, 5, Direction.NORTH_WEST);
    expect(new ForwardNorthWestMoveStrategy().move(pos)).toEqual(new Position(-1, 6, Direction.NORTH_WEST));
});
