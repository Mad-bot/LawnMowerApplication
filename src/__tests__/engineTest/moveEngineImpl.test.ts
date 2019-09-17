// Test ForwardMoveStrategy class
import { MoveEngineImpl } from '../../engine/impl/moveEngineImpl'
import { Lawn } from '../../model/app/impl/lawn';
import { Mower } from '../../model/app/impl/mower';
import { Position } from '../../model/app/impl/position';
import { Direction } from '../../model/enum/direction'
import { Move } from '../../model/enum/move'

test('Move engine : throw error => init area', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const mower : Mower = new Mower(pos);
    const mStrat: MoveEngineImpl = new MoveEngineImpl();
    // Area is not set
    expect(() => {mStrat.addMovable(mower, pos)}).toThrow('Something bad happened : area does not exist');
});

test('Move engine : function add movables => return id = 0 then 1 ', () => {
    // Set init pos to the mower
    const lawn: Lawn = new Lawn(10, 10)
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const mower : Mower = new Mower(pos);
    const mStrat: MoveEngineImpl = new MoveEngineImpl();
    mStrat.setArea(lawn);
    // Add movable => id = 0
    expect(mStrat.addMovable(mower, pos)).toBe(0);

    const pos2: Position = new Position(5, 3, Direction.NORTH);
    const mower2 : Mower = new Mower(pos2);
    // Add movable => id = 1
    expect(mStrat.addMovable(mower2, pos2)).toBe(1);
});

test('Move engine : function move throw error => id is not set', () => {
    // Set init pos to the mower
    const lawn: Lawn = new Lawn(10, 10)
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const mower : Mower = new Mower(pos);
    const mStrat: MoveEngineImpl = new MoveEngineImpl();
    mStrat.setArea(lawn);
    mStrat.addMovable(mower, pos)
    // Throw error => id is not set
    expect(() => {mStrat.move(5, Move.FORWARD)}).toThrow('Something bad happened : id 5 does not exist');
});

test('Move engine : function move forward => apply forwardMoveStrategy', () => {
    // Set init pos to the mower
    const lawn: Lawn = new Lawn(10, 10)
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const mower : Mower = new Mower(pos);
    const mStrat: MoveEngineImpl = new MoveEngineImpl();
    mStrat.setArea(lawn);
    mStrat.addMovable(mower, pos)
    // Apply move forward strategy
    expect(mStrat.move(0, Move.FORWARD)).toEqual(new Position(6, 4, Direction.NORTH));
});

test('Move engine : function move left => apply leftRotationStrategy', () => {
    // Set init pos to the mower
    const lawn: Lawn = new Lawn(10, 10)
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const mower : Mower = new Mower(pos);
    const mStrat: MoveEngineImpl = new MoveEngineImpl();
    mStrat.setArea(lawn);
    mStrat.addMovable(mower, pos)
    // Apply move left rotation strategy
    expect(mStrat.move(0, Move.LEFT)).toEqual(new Position(6, 3, Direction.WEST));
});

test('Move engine : function move right => apply rightRotationStrategy', () => {
    // Set init pos to the mower
    const lawn: Lawn = new Lawn(10, 10)
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const mower : Mower = new Mower(pos);
    const mStrat: MoveEngineImpl = new MoveEngineImpl();
    mStrat.setArea(lawn);
    mStrat.addMovable(mower, pos)
    // Apply move right rotation strategy
    expect(mStrat.move(0, Move.RIGHT)).toEqual(new Position(6, 3, Direction.EAST));
});
