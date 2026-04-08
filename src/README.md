# LawnMowerApplication

A TypeScript application that simulates automatic lawn mowers navigating a rectangular grid.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
  - [Running the Tests](#running-the-tests)
- [How It Works](#how-it-works)
  - [The Grid](#the-grid)
  - [Mower Orientation](#mower-orientation)
  - [Mower Instructions](#mower-instructions)
- [Input Format](#input-format)
- [Output Format](#output-format)
- [Example](#example)
- [Architecture](#architecture)

---

## Overview

LawnMowerApplication models a set of automatic lawn mowers operating on a rectangular grid lawn. Each mower starts at a given position and orientation, then executes a sequence of movement instructions. The application reports the final position and orientation of every mower after all instructions have been processed.

---

## Project Structure

```
LawnMowerApplication/
├── src/
│   ├── models/          # Domain models (Mower, Grid, Position, Orientation …)
│   ├── services/        # Business logic (MowerService, InstructionParser …)
│   ├── utils/           # Utility helpers
│   └── index.ts         # Application entry point
├── tests/               # Unit and integration tests
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | ≥ 16 |
| [npm](https://www.npmjs.com/) | ≥ 8 |
| [TypeScript](https://www.typescriptlang.org/) | ≥ 4 |

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd LawnMowerApplication

# Install dependencies
npm install
```

### Running the Application

```bash
# Compile TypeScript
npm run build

# Execute the compiled output
npm start
```

Or, to run directly with `ts-node`:

```bash
npx ts-node src/index.ts
```

### Running the Tests

```bash
npm test
```

---

## How It Works

### The Grid

The lawn is represented as a rectangular grid defined by the coordinates of its **upper-right corner** (the lower-left corner is implicitly `0 0`).

```
(0,4) ─────────── (4,4)
  │                 │
  │    L A W N      │
  │                 │
(0,0) ─────────── (4,0)
```

A mower cannot move outside the grid boundaries.

### Mower Orientation

Each mower faces one of the four cardinal directions:

| Letter | Direction |
|--------|-----------|
| `N`    | North     |
| `E`    | East      |
| `S`    | South     |
| `W`    | West      |

### Mower Instructions

Instructions are given as a string of characters, each representing one command:

| Command | Effect |
|---------|--------|
| `L`     | Rotate 90° to the **left** (counter-clockwise) without moving |
| `R`     | Rotate 90° to the **right** (clockwise) without moving |
| `F`     | Move **forward** one cell in the current direction |

> **Note:** A mower that would move outside the grid boundary simply stays in place.

---

## Input Format

```
<upper-right-x> <upper-right-y>
<mower-1-x> <mower-1-y> <mower-1-orientation>
<mower-1-instructions>
<mower-2-x> <mower-2-y> <mower-2-orientation>
<mower-2-instructions>
...
```

- **Line 1** – Upper-right corner of the grid.
- **Odd subsequent lines** – Initial position and orientation of a mower.
- **Even subsequent lines** – Instruction sequence for the preceding mower.

---

## Output Format

For each mower, the final state is printed on a single line:

```
<final-x> <final-y> <final-orientation>
```

---

## Example

**Input:**
```
5 5
1 2 N
LFLFLFLFF
3 3 E
FFRFFRFRRF
```

**Output:**
```
1 3 N
5 1 E
```

**Explanation:**

*Mower 1* starts at `(1, 2)` facing `N` and executes `LFLFLFLFF`:
1. `L` → faces `W`
2. `F` → moves to `(0, 2)`
3. `L` → faces `S`
4. `F` → moves to `(0, 1)`
5. `L` → faces `E`
6. `F` → moves to `(1, 1)`
7. `L` → faces `N`
8. `F` → moves to `(1, 2)`
9. `F` → moves to `(1, 3)`

Final: **1 3 N** ✓

*Mower 2* starts at `(3, 3)` facing `E` and executes `FFRFFRFRRF`:

Final: **5 1 E** ✓

---

## Architecture

```
index.ts
   │
   └─► InstructionParser      Reads and validates the raw input
           │
           └─► MowerService   Orchestrates mower execution
                   │
                   ├─► Grid   Enforces boundary constraints
                   └─► Mower  Holds position/orientation & processes commands
```

- **`Grid`** – Immutable value object that knows the lawn dimensions and can check whether a coordinate is within bounds.
- **`Mower`** – Encapsulates the current position and orientation of a single mower and exposes methods to turn and move forward.
- **`MowerService`** – Iterates over each mower's instruction string and delegates each command to the appropriate `Mower` method.
- **`InstructionParser`** – Transforms the raw text input into strongly-typed domain objects consumed by `MowerService`.
