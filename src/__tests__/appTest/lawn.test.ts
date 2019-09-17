// Test Lawn class
import { Lawn } from '../../model/app/impl/lawn';
import { Position } from '../../model/app/impl/position';
import { Direction } from '../../model/enum/direction'

test('Lawn : function isInside => False', () => {
    const lawn: Lawn = new Lawn(5, 5)
    const outPos: Position = new Position(6, 3, Direction.NORTH);
  expect(lawn.isInside(outPos)).toBe(false);
});

test('Lawn : function isInside => True', () => {
  const lawn: Lawn = new Lawn(5, 5)
  const inPos: Position = new Position(2, 3, Direction.NORTH);
expect(lawn.isInside(inPos)).toBe(true);
});