# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build       # Compile TypeScript to lib/
npm test            # Run all tests with Jest
npm run lint        # Run tslint
npm run format      # Prettier format src/**/*.ts and *.js
```

Run a single test file:
```bash
npx jest src/__tests__/engineTest/moveEngineImpl.test.ts
```

## Architecture

This is a TypeScript lawn mower simulation. Given an input file describing a lawn and mower instructions, it moves each mower sequentially and writes final positions to an output file.

**Entry point**: `src/index.ts` — reads `resources/inputData.txt`, parses it, runs moves, writes to `resources/outputData.txt`.

**Input format**:
```
5 5          ← lawn upper-right corner (origin is 0,0)
1 2 N        ← mower initial position and direction
LFLFLFLFF    ← move instructions: L=rotate left, R=rotate right, F=forward
3 3 E
FFRFFRFRRF
```

**Layer structure** (core/impl pattern throughout):

- `model/app/core/` — interfaces: `Area`, `Movable`
- `model/app/impl/` — concrete classes: `Lawn` (implements `Area`), `Mower` (implements `Movable`), `Position` (x, y, Direction)
- `model/enum/` — `Direction` (N/S/E/W), `Move` (LEFT/RIGHT/FORWARD)
- `engine/core/` — interfaces: `MoveEngine`, `MoveStrategy`
- `engine/impl/` — `MoveEngineImpl` (manages movables + area bounds checking), `ForwardMoveStrategy`, `RotateLeftMoveStrategy`, `RotateRightMoveStrategy`

**Key design**: `MoveEngineImpl` uses the Strategy pattern — each `Move` enum value maps to a `MoveStrategy` implementation. When a forward move would go out of bounds, the mower stays in place (no error). Mowers are processed sequentially, not concurrently.

**Note**: `src/` contains both `.ts` source and compiled `.js` files alongside the TypeScript. The canonical compiled output goes to `lib/` via `tsc`.
