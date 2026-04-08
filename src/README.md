# LawnMowerApplication

A TypeScript application for simulating autonomous lawn mowers navigating a grid-based lawn.

## Overview

LawnMowerApplication allows you to define a lawn of a given size and program one or more mowers to move and rotate automatically within it. Each mower follows a sequence of instructions and reports its final position and orientation.

## Features

- Define a rectangular lawn by specifying its dimensions
- Place multiple mowers on the lawn with an initial position and orientation
- Issue movement and rotation commands to each mower
- Mowers stay within lawn boundaries (no movement outside the grid)
- Fully typed TypeScript codebase

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/your-org/LawnMowerApplication.git
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

```bash
npm test
```

## Usage

### Lawn

A lawn is defined by its upper-right corner coordinates (the lower-left corner is always `0,0`).

```
5 5
```

This creates a 6×6 grid (coordinates 0–5 on each axis).

### Mowers

Each mower is defined by two lines:

1. **Initial state**: `X Y Orientation` — e.g., `1 2 N`
2. **Instructions**: a string of commands — e.g., `LMLMLMLMM`

#### Orientations

| Letter | Direction |
|--------|-----------|
| `N`    | North     |
| `E`    | East      |
| `S`    | South     |
| `W`    | West      |

#### Instructions

| Command | Action                        |
|---------|-------------------------------|
| `L`     | Rotate 90° to the left        |
| `R`     | Rotate 90° to the right       |
| `M`     | Move one step forward         |

### Example Input

```
5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM
```

### Example Output

```
1 3 N
5 1 E
```

## Project Structure

```
LawnMowerApplication/
├── src/          # TypeScript source files
├── lib/          # Compiled JavaScript output
├── package.json
└── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
