# LawnMowerApplication

A TypeScript application that simulates the movement of automatic lawn mowers on a rectangular grid.

## Description

This application allows you to control one or more lawn mowers on a rectangular grass field. Each mower can be programmed with a series of instructions to move and turn automatically. The application processes each mower's instructions sequentially and reports their final positions.

## Features

- Define a rectangular lawn of any size
- Place multiple mowers at specific positions and orientations
- Program mowers with movement and rotation instructions
- Prevent mowers from moving outside the lawn boundaries
- Process multiple mowers in sequence

## Installation

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

```bash
npm install
```

## Usage

```bash
npm start
```

## Running Tests

```bash
npm test
```

## Mower Instructions

Each mower is controlled using a string of commands:

| Command | Description                        |
|---------|------------------------------------|
| `L`     | Turn the mower 90° to the left     |
| `R`     | Turn the mower 90° to the right    |
| `F`     | Move the mower forward one step    |

## Orientation

Mowers can face one of four cardinal directions:

| Symbol | Direction |
|--------|-----------|
| `N`    | North     |
| `E`    | East      |
| `S`    | South     |
| `W`    | West      |

## Example

Given a 5x5 lawn (upper-right corner at coordinates `5 5`):

**Mower 1:**
- Initial position: `1 2 N` (x=1, y=2, facing North)
- Instructions: `LFLFLFLFF`
- Final position: `1 3 N`

**Mower 2:**
- Initial position: `3 3 E` (x=3, y=3, facing East)
- Instructions: `FFRFFRFRRF`
- Final position: `5 1 E`

## Project Structure

```
LawnMowerApplication/
├── src/
│   ├── index.ts          # Entry point
│   ├── Lawn.ts           # Lawn grid definition
│   ├── Mower.ts          # Mower logic and movement
│   └── ...
├── package.json
├── tsconfig.json
└── README.md
```

## License

This project is licensed under the MIT License.
