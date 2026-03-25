import { createMowerState } from '../MowerState';
import { resetPosition } from './resetPosition';

describe('resetPosition', () => {
  it('should reset the mower to its initial position and direction', () => {
    // Create a mower starting at (2, 3) facing North
    let state = createMowerState(2, 3, 'N');

    // Simulate the mower having moved to a different position/direction
    state = { ...state, x: 5, y: 7, direction: 'E' };

    // Reset to initial place
    const result = resetPosition(state);

    expect(result.x).toBe(2);
    expect(result.y).toBe(3);
    expect(result.direction).toBe('N');
  });

  it('should preserve the initial fields after reset', () => {
    const state = createMowerState(0, 0, 'S');
    const movedState = { ...state, x: 4, y: 4, direction: 'W' };

    const result = resetPosition(movedState);

    expect(result.initialX).toBe(0);
    expect(result.initialY).toBe(0);
    expect(result.initialDirection).toBe('S');
  });

  it('should return a new state object (immutability)', () => {
    const state = createMowerState(1, 1, 'E');
    const movedState = { ...state, x: 3, y: 3, direction: 'S' };

    const result = resetPosition(movedState);

    expect(result).not.toBe(movedState);
  });
});
