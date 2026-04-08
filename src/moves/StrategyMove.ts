import { MowerState } from '../MowerState';

export interface StrategyMove {
  move(mowerState: MowerState): MowerState;
}
