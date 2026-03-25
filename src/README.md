# LawnMowerApplication

A TypeScript application that simulates autonomous lawn mowers navigating a rectangular grid.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Input Format](#input-format)
- [Output Format](#output-format)
- [Example](#example)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)

---

## Overview

LawnMowerApplication models a fleet of robotic lawn mowers operating on a rectangular lawn. Each mower is given a starting position and orientation, along with a sequence of movement instructions. The application processes each mower's instructions in order and reports the final position and heading of every mower.

---

## Features

- Supports multiple mowers operating sequentially on the same lawn.
- Cardinal directions: **N**orth, **E**ast, **S**outh, **W**est.
- Three instructions per mower:
  - `L` – Rotate 90° to the **left** (counter-clockwise).
  - `R` – Rotate 90° to the **right** (clockwise).
  - `F` – Move **forward** one cell in the current direction.
- Boundary safety: mowers that would move outside the lawn stay in place.
- Written in **TypeScript** for strong typing and maintainability.

---

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 14
- [npm](https://www.npmjs.com/) ≥ 6 (or [yarn](https://yarnpkg.com/))

---

## Installation

```bash
# Clone the repository
git clone https://github.com/<your-org>/LawnMowerApplication.git
cd LawnMowerApplication

# Install dependencies
npm install
```

---

## Usage

```bash
# Compile TypeScript
npm run build

# Run the application
npm start
```

Or, to run directly with `ts-node`:

```bash
npx ts-node src/index.ts
```

---

## Input Format

The input is provided as plain text (via a file or standard input) and follows this structure:

```
<max_X> <max_Y>          ← Upper-right corner of the lawn (lower-left is always 0 0)
<x> <y> <orientation>    ← Initial position and heading of mower 1
<instructions>           ← Movement instructions for mower 1
<x> <y> <orientation>    ← Initial position and heading of mower 2
<instructions>           ← Movement instructions for mower 2
...
```

| Token | Description |
|-------|-------------|
| `max_X`, `max_Y` | Non-negative integers defining the grid size |
| `x`, `y` | Starting coordinates of the mower |
| `orientation` | One of `N`, `E`, `S`, `W` |
| `instructions` | A string of `L`, `R`, `F` characters |

---

## Output Format

For each mower, the final state is printed on its own line:

```
<x> <y> <orientation>
```

---

## Example

**Input**

```
5 5
1 2 N
LFLFLFLFF
3 3 E
FFRFFRFRRF
```

**Output**

```
1 3 N
5 1 E
```

---

## Project Structure

```
LawnMowerApplication/
├── src/
│   ├── index.ts          # Application entry point
│   ├── Lawn.ts           # Lawn grid model
│   ├── Mower.ts          # Mower entity (position + orientation)
│   ├── Instruction.ts    # Instruction definitions (L, R, F)
│   ├── Parser.ts         # Input parsing logic
│   └── README.md         # This file
├── tests/                # Unit & integration tests
├── package.json
├── tsconfig.json
└── ...
```

---

## Running Tests

```bash
npm test
```

Tests are located in the `tests/` directory and cover:

- Mower movement and rotation logic.
- Boundary collision handling.
- Full end-to-end input/output scenarios.

---

## License

This project is licensed under the [MIT License](../LICENSE).
