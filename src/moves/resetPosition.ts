import { MowerState } from '../MowerState';

/**
 * Resets the lawn mower to its initial position and orientation.
 */
export function resetPosition(state: MowerState): MowerState {
  return {
    ...state,
    x: state.initialX,
    y: state.initialY,
    direction: state.initialDirection,
  };
}
