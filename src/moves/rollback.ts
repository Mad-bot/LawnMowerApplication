import { LawnMower } from "../lawnMower";

export function rollback(lawnMower: LawnMower): LawnMower {
  const history = lawnMower.getHistory();

  if (history.length === 0) {
    return lawnMower;
  }

  const previousState = history[history.length - 1];

  return new LawnMower(
    previousState.x,
    previousState.y,
    previousState.direction,
    history.slice(0, history.length - 1)
  );
}
