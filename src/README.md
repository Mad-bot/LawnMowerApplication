# LawnMowerApplication

A TypeScript application that simulates autonomous lawn mowers navigating a rectangular grid.

## Overview

This application models one or more lawn mowers operating on a rectangular lawn. Each mower follows a sequence of instructions to move and rotate within the bounds of the lawn. The goal is to determine the final position and orientation of each mower after executing all its instructions.

## Features

- Define a rectangular lawn of any size
- Place multiple mowers at different starting positions and orientations
- Execute movement instructions for each mower
- Boundary checking to prevent mowers from leaving the lawn
- Clean TypeScript implementation with strong typing

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd LawnMowerApplication

# Install dependencies
npm install
```

### Build

```bash
npm run build
```

### Run

```bash
npm start
```

### Tests

```bash
npm test
```

## How It Works

### Lawn

The lawn is represented as a rectangular grid. Its size is defined by the coordinates of its upper-right corner (the lower-left corner is always `(0, 0)`).

### Mower

Each mower has:
- A **position** `(x, y)` on the grid
- An **orientation** — one of `N` (North), `E` (East), `S` (South), or `W` (West)

### Instructions

Each mower receives a string of instructions, where each character is one of:

| Instruction | Description |
|-------------|-------------|
| `L` | Rotate 90° to the left (counter-clockwise) |
| `R` | Rotate 90° to the right (clockwise) |
| `F` | Move forward one cell in the current direction |

> If a `F` instruction would move the mower outside the lawn boundaries, the mower stays in place and the next instruction is processed.

### Example

Given a lawn of size `5x5` (upper-right corner at `5, 5`):

```
Lawn: 5 5

Mower 1: 1 2 N
Instructions: LFLFLFLFF
→ Final position: 1 3 N

Mower 2: 3 3 E
Instructions: FFRFFRFRRF
→ Final position: 5 1 E
```

## Project Structure

```
LawnMowerApplication/
├── src/                  # TypeScript source files
│   ├── index.ts          # Entry point
│   ├── lawn.ts           # Lawn model
│   ├── mower.ts          # Mower model
│   └── ...
├── lib/                  # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## License

This project is licensed under the ISC License.
