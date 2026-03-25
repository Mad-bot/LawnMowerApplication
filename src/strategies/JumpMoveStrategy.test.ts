import { JumpMoveStrategy } from './JumpMoveStrategy';
import { Mower } from '../models/Mower';
import { Plateau } from '../models/Plateau';

describe('JumpMoveStrategy', () => {
  let strategy: JumpMoveStrategy;
  let plateau: Plateau;

  beforeEach(() => {
    strategy = new JumpMoveStrategy();
    plateau = { maxX: 10, maxY: 10 };
  });

  it('should move 2 steps North', () => {
    const mower: Mower = { x: 3, y: 3, direction: 'N' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(3);
    expect(mower.y).toBe(5);
  });

  it('should move 2 steps East', () => {
    const mower: Mower = { x: 3, y: 3, direction: 'E' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(5);
    expect(mower.y).toBe(3);
  });

  it('should move 2 steps South', () => {
    const mower: Mower = { x: 3, y: 3, direction: 'S' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(3);
    expect(mower.y).toBe(1);
  });

  it('should move 2 steps West', () => {
    const mower: Mower = { x: 3, y: 3, direction: 'W' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(1);
    expect(mower.y).toBe(3);
  });

  it('should not move if jump would go out of bounds (North)', () => {
    const mower: Mower = { x: 5, y: 10, direction: 'N' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(5);
    expect(mower.y).toBe(10);
  });

  it('should not move if jump would go out of bounds (East)', () => {
    const mower: Mower = { x: 10, y: 5, direction: 'E' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(10);
    expect(mower.y).toBe(5);
  });

  it('should not move if jump would go out of bounds (South)', () => {
    const mower: Mower = { x: 5, y: 0, direction: 'S' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(5);
    expect(mower.y).toBe(0);
  });

  it('should not move if jump would go out of bounds (West)', () => {
    const mower: Mower = { x: 0, y: 5, direction: 'W' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(0);
    expect(mower.y).toBe(5);
  });

  it('should not perform a partial jump — stays in place when only 1 step fits', () => {
    // Only 1 cell of space to the North but jump requires 2
    const mower: Mower = { x: 5, y: 9, direction: 'N' };
    strategy.move(mower, plateau);
    expect(mower.x).toBe(5);
    expect(mower.y).toBe(9);
  });

  it('should not change the mower direction after a jump', () => {
    const mower: Mower = { x: 3, y: 3, direction: 'E' };
    strategy.move(mower, plateau);
    expect(mower.direction).toBe('E');
  });
});
