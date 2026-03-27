import {
  OptimizationContext,
  OptimizationCondition,
  defaultConditions,
  evaluateOptimizationConditions,
  addOptimizationCondition,
  removeOptimizationCondition,
} from "./optimizationConditions";

const goodContext: OptimizationContext = {
  batteryLevel: 80,
  grassHeight: 10,
  weatherScore: 75,
  lastMowedHoursAgo: 48,
  slopeAngle: 15,
};

describe("evaluateOptimizationConditions", () => {
  it("returns canOptimize=true when all default conditions pass", () => {
    const result = evaluateOptimizationConditions(goodContext);
    expect(result.canOptimize).toBe(true);
    expect(result.failedCount).toBe(0);
    expect(result.passedCount).toBe(defaultConditions.length);
  });

  it("returns canOptimize=false when battery is too low", () => {
    const ctx: OptimizationContext = { ...goodContext, batteryLevel: 10 };
    const result = evaluateOptimizationConditions(ctx);
    expect(result.canOptimize).toBe(false);
    const batteryResult = result.results.find(
      (r) => r.condition.id === "sufficient-battery"
    );
    expect(batteryResult?.passed).toBe(false);
  });

  it("returns canOptimize=false when grass is too short", () => {
    const ctx: OptimizationContext = { ...goodContext, grassHeight: 3 };
    const result = evaluateOptimizationConditions(ctx);
    expect(result.canOptimize).toBe(false);
    const grassResult = result.results.find(
      (r) => r.condition.id === "grass-needs-mowing"
    );
    expect(grassResult?.passed).toBe(false);
  });

  it("returns canOptimize=false when weather is poor", () => {
    const ctx: OptimizationContext = { ...goodContext, weatherScore: 40 };
    const result = evaluateOptimizationConditions(ctx);
    expect(result.canOptimize).toBe(false);
    const weatherResult = result.results.find(
      (r) => r.condition.id === "good-weather"
    );
    expect(weatherResult?.passed).toBe(false);
  });

  it("returns canOptimize=false when mowed too recently", () => {
    const ctx: OptimizationContext = { ...goodContext, lastMowedHoursAgo: 12 };
    const result = evaluateOptimizationConditions(ctx);
    expect(result.canOptimize).toBe(false);
    const timeResult = result.results.find(
      (r) => r.condition.id === "time-since-last-mow"
    );
    expect(timeResult?.passed).toBe(false);
  });

  it("returns canOptimize=false when slope is too steep", () => {
    const ctx: OptimizationContext = { ...goodContext, slopeAngle: 45 };
    const result = evaluateOptimizationConditions(ctx);
    expect(result.canOptimize).toBe(false);
    const slopeResult = result.results.find(
      (r) => r.condition.id === "safe-slope"
    );
    expect(slopeResult?.passed).toBe(false);
  });

  it("correctly counts multiple failures", () => {
    const ctx: OptimizationContext = {
      batteryLevel: 5,
      grassHeight: 2,
      weatherScore: 10,
      lastMowedHoursAgo: 1,
      slopeAngle: 60,
    };
    const result = evaluateOptimizationConditions(ctx);
    expect(result.canOptimize).toBe(false);
    expect(result.failedCount).toBe(5);
    expect(result.passedCount).toBe(0);
  });

  it("works with a custom conditions list", () => {
    const custom: OptimizationCondition[] = [
      {
        id: "custom-check",
        name: "Custom Check",
        description: "Always passes.",
        evaluate: () => true,
      },
    ];
    const result = evaluateOptimizationConditions(goodContext, custom);
    expect(result.canOptimize).toBe(true);
    expect(result.passedCount).toBe(1);
  });

  it("returns canOptimize=false with empty conditions list (no failures but 0 conditions)", () => {
    // 0 failures → canOptimize = true with empty list
    const result = evaluateOptimizationConditions(goodContext, []);
    expect(result.canOptimize).toBe(true);
    expect(result.passedCount).toBe(0);
    expect(result.failedCount).toBe(0);
  });
});

describe("addOptimizationCondition", () => {
  it("adds a new condition to the list", () => {
    const newCondition: OptimizationCondition = {
      id: "new-condition",
      name: "New Condition",
      description: "A brand new condition.",
      evaluate: () => true,
    };
    const updated = addOptimizationCondition(defaultConditions, newCondition);
    expect(updated).toHaveLength(defaultConditions.length + 1);
    expect(updated.find((c) => c.id === "new-condition")).toBeDefined();
  });

  it("does not mutate the original array", () => {
    const original = [...defaultConditions];
    const newCondition: OptimizationCondition = {
      id: "immutable-test",
      name: "Immutable Test",
      description: "Tests immutability.",
      evaluate: () => false,
    };
    addOptimizationCondition(defaultConditions, newCondition);
    expect(defaultConditions).toHaveLength(original.length);
  });

  it("throws when adding a duplicate id", () => {
    expect(() =>
      addOptimizationCondition(defaultConditions, defaultConditions[0])
    ).toThrow(/already exists/);
  });
});

describe("removeOptimizationCondition", () => {
  it("removes a condition by id", () => {
    const updated = removeOptimizationCondition(
      defaultConditions,
      "sufficient-battery"
    );
    expect(updated).toHaveLength(defaultConditions.length - 1);
    expect(updated.find((c) => c.id === "sufficient-battery")).toBeUndefined();
  });

  it("does not mutate the original array", () => {
    const original = [...defaultConditions];
    removeOptimizationCondition(defaultConditions, "sufficient-battery");
    expect(defaultConditions).toHaveLength(original.length);
  });

  it("throws when the id does not exist", () => {
    expect(() =>
      removeOptimizationCondition(defaultConditions, "non-existent-id")
    ).toThrow(/No optimization condition/);
  });
});
