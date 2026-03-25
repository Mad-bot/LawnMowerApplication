export interface MowerState {
  x: number;
  y: number;
  direction: string;
  initialX: number;
  initialY: number;
  initialDirection: string;
}

/**
 * Creates a new MowerState, recording the initial position and direction.
 */
export function createMowerState(
  x: number,
  y: number,
  direction: string
): MowerState {
  return {
    x,
    y,
    direction,
    initialX: x,
    initialY: y,
    initialDirection: direction,
  };
}
