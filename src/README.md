# LawnMowerApplication

A TypeScript-based application that simulates automated lawn mowers navigating and mowing a rectangular grid.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Contributing](#contributing)

---

## Overview

LawnMowerApplication models a scenario where one or more automated lawn mowers are deployed on a rectangular lawn. Each mower follows a sequence of instructions to move forward or rotate, while staying within the bounds of the lawn. This project is written in **TypeScript** and follows object-oriented design principles.

---

## Features

- Define a rectangular lawn of any size.
- Deploy multiple lawn mowers with individual starting positions and orientations.
- Provide instruction sequences (`L`, `R`, `F`) to control each mower.
- Automatic boundary detection — mowers will not move outside the lawn.
- Clean, type-safe TypeScript implementation.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- TypeScript (`npm install -g typescript`)

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

3. **Compile TypeScript:**

   ```bash
   npm run build
   ```

---

## Usage

1. Configure your lawn dimensions and mower instructions (see input format below).
2. Run the application:

   ```bash
   npm start
   ```

### Input Format

The application accepts the following input structure:

1. **First line:** The upper-right coordinates of the lawn (e.g., `5 5`). The lower-left corner is always `0 0`.
2. **For each mower:**
   - A line with the mower's initial position and orientation (e.g., `1 2 N`).
   - A line with the sequence of instructions (e.g., `LFLFLFLFF`).

### Example

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

### Orientation Values

| Symbol | Direction |
|--------|-----------|
| `N`    | North     |
| `E`    | East      |
| `S`    | South     |
| `W`    | West      |

### Instruction Values

| Instruction | Action                            |
|-------------|-----------------------------------|
| `L`         | Turn left 90° (without moving)    |
| `R`         | Turn right 90° (without moving)   |
| `F`         | Move forward one step             |

---

## How It Works

1. A **Lawn** is created with defined upper-right boundary coordinates.
2. Each **LawnMower** is placed at a starting `(x, y)` position with a cardinal direction (`N`, `E`, `S`, `W`).
3. Instructions are processed one by one:
   - `L` / `R` rotate the mower without changing its position.
   - `F` moves the mower one cell forward in the direction it is currently facing.
   - If a move would take the mower outside the lawn boundaries, the instruction is ignored.
4. After all instructions are processed, the final position and orientation of each mower is reported.

---

## Project Structure

```
LawnMowerApplication/
├── src/
│   ├── models/         # Core domain models (Lawn, LawnMower, etc.)
│   ├── services/       # Business logic and instruction processing
│   ├── utils/          # Helper utilities
│   └── index.ts        # Application entry point
├── tests/              # Unit and integration tests
├── package.json
├── tsconfig.json
└── README.md
```

---

## Running Tests

```bash
npm test
```

Tests are written to validate:
- Correct rotation behaviour (`L` and `R` instructions).
- Correct forward movement (`F` instruction).
- Boundary enforcement (mowers do not exit the lawn).
- Multiple mower scenarios.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
