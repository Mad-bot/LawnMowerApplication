# 🌿 Lawn Mower Application

A TypeScript-based simulation of an automatic lawn mower that navigates a rectangular grid, following a set of movement instructions while staying within boundaries.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Input Format](#input-format)
- [Output Format](#output-format)
- [Example](#example)

---

## Overview

The **Lawn Mower Application** simulates one or more automated lawn mowers operating on a rectangular grid (lawn). Each mower is given an initial position and orientation, along with a sequence of instructions to move forward or rotate. The mowers execute their instructions sequentially and report their final position and orientation once all instructions are processed.

---

## Features

- Simulate multiple lawn mowers on a single rectangular grid.
- Supports cardinal directions: **North (N)**, **East (E)**, **South (S)**, **West (W)**.
- Supports three instructions:
  - `L` – Rotate 90° to the **left** (counter-clockwise).
  - `R` – Rotate 90° to the **right** (clockwise).
  - `F` – Move **forward** one step in the current direction.
- Boundary protection: mowers will not move outside the lawn grid.
- Written in **TypeScript** for strong typing and maintainability.

---

## Prerequisites

Make sure you have the following installed on your machine:

| Tool    | Version       |
|---------|---------------|
| Node.js | >= 14.x       |
| npm     | >= 6.x        |
| TypeScript | >= 4.x     |

---

## Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd LawnMowerApplication
```

2. **Install dependencies:**

```bash
npm install
```

3. **Compile TypeScript** (if not using ts-node):

```bash
npm run build
```

---

## Running the Application

You can run the application using one of the following methods:

### Using ts-node (development)

```bash
npx ts-node src/index.ts
```

### Using compiled JavaScript

```bash
npm run build
node lib/index.js
```

### Using npm start script (if configured)

```bash
npm start
```

---

## Running Tests

To execute the test suite:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

---

## Project Structure

```
LawnMowerApplication/
├── src/
│   ├── index.ts          # Application entry point
│   ├── Mower.ts          # Mower class: position, orientation, movement logic
│   ├── Lawn.ts           # Lawn class: grid dimensions and boundary checks
│   ├── Simulation.ts     # Simulation orchestrator: parses input and runs mowers
│   ├── README.md         # Project documentation
│   └── ...               # Additional source files
├── lib/                  # Compiled JavaScript output
├── package.json          # Project metadata and scripts
├── tsconfig.json         # TypeScript compiler configuration
└── node_modules/         # Installed dependencies
```

---

## How It Works

1. The **lawn** is defined by its upper-right corner coordinates (the lower-left corner is always `0,0`).
2. Each **mower** is given:
   - A starting position `(x, y)` on the grid.
   - An initial orientation (`N`, `E`, `S`, or `W`).
   - A string of movement instructions (`L`, `R`, `F`).
3. Mowers are processed **one at a time**, each completing all its instructions before the next begins.
4. A mower **will not move** if an `F` instruction would take it outside the lawn boundaries.
5. After all instructions, each mower reports its **final position and orientation**.

### Orientation & Movement

| Direction | F moves to       |
|-----------|-----------------|
| N (North) | y + 1           |
| E (East)  | x + 1           |
| S (South) | y - 1           |
| W (West)  | x - 1           |

### Rotation

| Current | L    | R    |
|---------|------|------|
| N       | W    | E    |
| E       | N    | S    |
| S       | E    | W    |
| W       | S    | N    |

---

## Input Format

The input is typically provided as a text file or string with the following structure:

```
<lawn_width> <lawn_height>
<mower1_x> <mower1_y> <mower1_orientation>
<mower1_instructions>
<mower2_x> <mower2_y> <mower2_orientation>
<mower2_instructions>
...
```

**Example input:**

```
5 5
1 2 N
LFLFLFLFF
3 3 E
FFRFFRFRRF
```

---

## Output Format

For each mower, the final position and orientation are printed on a single line:

```
<final_x> <final_y> <final_orientation>
```

**Example output:**

```
1 3 N
5 1 E
```

---

## Example

Given a **5×5** lawn and two mowers:

**Mower 1:** starts at `(1, 2)` facing **North**, instructions: `LFLFLFLFF`
→ Final position: `1 3 N`

**Mower 2:** starts at `(3, 3)` facing **East**, instructions: `FFRFFRFRRF`
→ Final position: `5 1 E`

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](../LICENSE) file for details.
