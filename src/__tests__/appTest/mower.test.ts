// Test Mower class
import { Mower } from '../../model/app/impl/mower';
import { Position } from '../../model/app/impl/position';
import { Direction } from '../../model/enum/direction'

test('Mower : function moveTo', () => {
    // Set init pos to the mower
    const pos: Position = new Position(6, 3, Direction.NORTH);
    const mower : Mower = new Mower(pos);
    expect(mower.getPosition()).toBe(pos);
    // Mower : function moveTo newPos 
    const newPos: Position = new Position(1, 1, Direction.SOUTH);
    mower.moveTo(newPos);
    // Expect the newPos
    expect(mower.getPosition()).toBe(newPos);
});