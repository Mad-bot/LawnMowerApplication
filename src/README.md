# LawnMowerApplication

A TypeScript application that simulates autonomous lawn mowers navigating a grid.

## Overview

This application models one or more lawn mowers operating on a rectangular grid (lawn). Each mower follows a sequence of instructions to move and rotate, staying within the bounds of the lawn. The final positions and orientations of all mowers are reported after all instructions have been executed.

## Features

- Define a lawn of any size using grid coordinates
- Place multiple mowers at different starting positions and orientations
- Issue movement and rotation commands to each mower
- Mowers respect lawn boundaries (they won't move outside the grid)
- Written in TypeScript for type safety and maintainability

## Concepts

### The Lawn

The lawn is defined by its upper-right corner coordinates (the lower-left corner is always `0 0`). For example, a lawn defined as `5 5` has a 6×6 grid of positions (0–5 on each axis).

### Mower Orientation

Each mower faces one of four cardinal directions:

| Letter | Direction |
|--------|-----------|
| `N`    | North     |
| `E`    | East      |
| `S`    | South     |
| `W`    | West      |

### Instructions

Each mower accepts a string of commands:

| Command | Action                          |
|---------|---------------------------------|
| `L`     | Rotate 90° to the left          |
| `R`     | Rotate 90° to the right         |
| `F`     | Move forward one step           |

If a `F` command would move the mower outside the lawn boundaries, the mower stays in place.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone <repository-url>
cd LawnMowerApplication
npm install
```

### Build

Compile the TypeScript source to JavaScript:

```bash
npm run build
```

### Run

```bash
npm start
```

### Tests

Run the test suite:

```bash
npm test
```

## Project Structure

```
LawnMowerApplication/
├── src/                  # TypeScript source files
│   ├── index.ts          # Application entry point
│   ├── lawn.ts           # Lawn model
│   ├── mower.ts          # Mower model and movement logic
│   └── ...
├── lib/                  # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── src/README.md         # This file
```

## Example

Given a `5 5` lawn, two mowers with the following configuration:

```
5 5
1 2 N
LFLFLFLFF
3 3 E
FFRFFRFRRF
```

**Mower 1** starts at `(1, 2)` facing `N` and executes `LFLFLFLFF`.
→ Final position: `1 3 N`

**Mower 2** starts at `(3, 3)` facing `E` and executes `FFRFFRFRRF`.
→ Final position: `5 1 E`

## License

This project is licensed under the MIT License.
