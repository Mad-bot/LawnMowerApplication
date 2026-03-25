# LawnMowerApplication

A TypeScript-based simulation application that automates lawn mowing by directing one or more mowers across a rectangular grid, following a sequence of movement instructions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Input Format](#input-format)
- [Output Format](#output-format)
- [How It Works](#how-it-works)
- [Running Tests](#running-tests)

---

## Overview

The **LawnMowerApplication** simulates automatic lawn mowers navigating a rectangular grid (the lawn). Each mower starts at a given position with a facing direction and executes a series of instructions to move around and mow the lawn. Mowers never leave the boundaries of the grid.

---

## Features

- Supports multiple mowers on the same lawn.
- Cardinal direction support: **North (N)**, **East (E)**, **South (S)**, **West (W)**.
- Three instruction types:
  - `L` – Rotate 90° to the left (counter-clockwise).
  - `R` – Rotate 90° to the right (clockwise).
  - `F` – Move one step forward in the current facing direction.
- Boundary protection: a mower that would move outside the lawn stays in place.
- Clean TypeScript implementation with strict typing.

---

## Project Structure

```
LawnMowerApplication/
├── src/
│   ├── app.ts               # Application entry point
│   ├── Lawn.ts              # Lawn grid definition and boundary logic
│   ├── LawnMower.ts         # LawnMower entity (position, direction, instructions)
│   ├── LawnMowerService.ts  # Core service orchestrating mower execution
│   ├── Direction.ts         # Direction enum (N, E, S, W)
│   ├── Instruction.ts       # Instruction enum (L, R, F)
│   ├── Position.ts          # Position model (x, y coordinates)
│   └── README.md            # Project documentation (this file)
├── package.json
├── tsconfig.json
└── node_modules/
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [npm](https://www.npmjs.com/) v6 or higher
- TypeScript (`npm install -g typescript`)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-org/LawnMowerApplication.git
   cd LawnMowerApplication
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Compile TypeScript:**

   ```bash
   npm run build
   ```

---

## Usage

Run the application using:

```bash
npm start
```

Or directly with `ts-node`:

```bash
npx ts-node src/app.ts
```

---

## Input Format

The input defines the lawn dimensions and each mower's starting state and instructions:

```
<X> <Y>
<mower_x> <mower_y> <direction>
<instructions>
...
```

| Line | Description |
|------|-------------|
| `X Y` | Upper-right corner of the lawn grid (lower-left is always `0 0`) |
| `mower_x mower_y direction` | Starting position and facing direction of a mower |
| `instructions` | Sequence of `L`, `R`, and `F` characters for that mower |

### Example Input

```
5 5
1 2 N
LFLFLFLFF
3 3 E
FFRFFRFRRF
```

---

## Output Format

After all instructions are executed, the final position and direction of each mower is printed:

```
<final_x> <final_y> <final_direction>
```

### Example Output

```
1 3 N
5 1 E
```

---

## How It Works

1. **Lawn initialisation** – A `Lawn` object is created with the given upper-right coordinates, establishing the valid movement boundaries `(0,0)` to `(X,Y)`.
2. **Mower initialisation** – Each `LawnMower` is created with an initial `Position`, a `Direction`, and a list of `Instruction` values.
3. **Execution** – The `LawnMowerService` iterates over each mower and processes its instructions sequentially:
   - `L` / `R` – Updates the mower's direction by rotating 90°.
   - `F` – Computes the next position; moves the mower only if the new position is within the lawn boundaries.
4. **Result** – The final position and direction of every mower are returned and displayed.

---

## Running Tests

```bash
npm test
```

Tests are written to validate:
- Correct rotation behaviour (`L` and `R`).
- Forward movement in all four cardinal directions.
- Boundary enforcement (mowers do not leave the grid).
- Full end-to-end scenarios with multiple mowers.

---

## License

This project is provided for educational and demonstration purposes.
