import { Move } from './Move';

export class StrategyMove implements Move {
  private strategy: () => void;

  constructor(strategy: () => void) {
    this.strategy = strategy;
  }

  execute(): void {
    this.strategy();
  }
}
