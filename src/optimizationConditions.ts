export interface OptimizationCondition {
  id: string;
  name: string;
  description: string;
  evaluate: (context: OptimizationContext) => boolean;
}

export interface OptimizationContext {
  batteryLevel: number;       // 0–100 (%)
  grassHeight: number;        // cm
  weatherScore: number;       // 0–100 (higher = better weather)
  lastMowedHoursAgo: number;  // hours since last mow
  slopeAngle: number;         // degrees
}

export const defaultConditions: OptimizationCondition[] = [
  {
    id: "sufficient-battery",
    name: "Sufficient Battery",
    description: "Battery level must be at least 20% to start mowing.",
    evaluate: (ctx) => ctx.batteryLevel >= 20,
  },
  {
    id: "grass-needs-mowing",
    name: "Grass Needs Mowing",
    description: "Grass height must exceed 5 cm before mowing.",
    evaluate: (ctx) => ctx.grassHeight > 5,
  },
  {
    id: "good-weather",
    name: "Good Weather",
    description: "Weather score must be at least 60 to proceed.",
    evaluate: (ctx) => ctx.weatherScore >= 60,
  },
  {
    id: "time-since-last-mow",
    name: "Time Since Last Mow",
    description: "At least 24 hours must have passed since the last mow.",
    evaluate: (ctx) => ctx.lastMowedHoursAgo >= 24,
  },
  {
    id: "safe-slope",
    name: "Safe Slope",
    description: "Slope angle must not exceed 30 degrees for safe operation.",
    evaluate: (ctx) => ctx.slopeAngle <= 30,
  },
];

export interface ConditionResult {
  condition: OptimizationCondition;
  passed: boolean;
}

export interface OptimizationEvaluation {
  canOptimize: boolean;
  results: ConditionResult[];
  passedCount: number;
  failedCount: number;
}

/**
 * Evaluates all provided optimization conditions against the given context.
 *
 * @param context  - The current operational context.
 * @param conditions - The list of conditions to evaluate (defaults to the built-in set).
 * @returns An OptimizationEvaluation describing which conditions passed or failed.
 */
export function evaluateOptimizationConditions(
  context: OptimizationContext,
  conditions: OptimizationCondition[] = defaultConditions
): OptimizationEvaluation {
  const results: ConditionResult[] = conditions.map((condition) => ({
    condition,
    passed: condition.evaluate(context),
  }));

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;
  const canOptimize = failedCount === 0;

  return { canOptimize, results, passedCount, failedCount };
}

/**
 * Adds a new custom condition to an existing list of conditions.
 * Throws if a condition with the same id already exists.
 *
 * @param conditions - The existing conditions array.
 * @param newCondition - The condition to add.
 * @returns A new array containing all previous conditions plus the new one.
 */
export function addOptimizationCondition(
  conditions: OptimizationCondition[],
  newCondition: OptimizationCondition
): OptimizationCondition[] {
  if (conditions.some((c) => c.id === newCondition.id)) {
    throw new Error(
      `An optimization condition with id "${newCondition.id}" already exists.`
    );
  }
  return [...conditions, newCondition];
}

/**
 * Removes a condition by id from an existing list of conditions.
 * Throws if no condition with the given id is found.
 *
 * @param conditions - The existing conditions array.
 * @param id - The id of the condition to remove.
 * @returns A new array with the specified condition removed.
 */
export function removeOptimizationCondition(
  conditions: OptimizationCondition[],
  id: string
): OptimizationCondition[] {
  if (!conditions.some((c) => c.id === id)) {
    throw new Error(
      `No optimization condition with id "${id}" was found.`
    );
  }
  return conditions.filter((c) => c.id !== id);
}
