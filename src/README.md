# 🌿 LawnMowerApplication

A TypeScript-based simulation of an automatic lawn mower that can navigate and mow a rectangular grid.

---

## 📖 Overview

**LawnMowerApplication** simulates one or more lawn mowers operating on a rectangular lawn. Each mower can be given a sequence of instructions to move forward and rotate, while staying within the boundaries of the lawn. At the end of the simulation, each mower reports its final position and orientation.

---

## 🗂️ Project Structure

```
LawnMowerApplication/
├── src/                  # TypeScript source files
│   ├── index.ts          # Application entry point
│   ├── Lawn.ts           # Lawn grid definition
│   ├── Mower.ts          # Mower logic and movement
│   ├── Parser.ts         # Input parsing utilities
│   └── README.md         # This file
├── lib/                  # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── ...
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)

### Installation

```bash
npm install
```

### Build

Compile the TypeScript source into JavaScript:

```bash
npm run build
```

### Run

```bash
npm start
```

---

## 🧠 How It Works

### 1. The Lawn

The lawn is defined as a rectangular grid. Its upper-right corner coordinates are provided as input (the lower-left corner is always `(0, 0)`).

**Example:** A lawn defined by `5 5` has valid positions ranging from `(0,0)` to `(5,5)`.

### 2. The Mower

Each mower has:
- A **position** `(x, y)` on the grid.
- An **orientation** — one of the four cardinal directions: `N` (North), `E` (East), `S` (South), `W` (West).

### 3. Instructions

Each mower receives a string of instructions, where each character is one of:

| Instruction | Description                          |
|:-----------:|--------------------------------------|
| `L`         | Rotate 90° to the **left** (counter-clockwise) |
| `R`         | Rotate 90° to the **right** (clockwise)         |
| `F`         | Move **forward** one cell in the current direction |

> ⚠️ If a `F` instruction would move the mower outside the lawn boundaries, the mower **stays in place** and the instruction is ignored.

### 4. Input Format

```
<lawn_width> <lawn_height>
<mower_x> <mower_y> <mower_orientation>
<instructions>
[<mower_x> <mower_y> <mower_orientation>]
[<instructions>]
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

### 5. Output Format

After processing all instructions, each mower prints its final position and orientation:

```
<final_x> <final_y> <final_orientation>
```

**Expected output for the example above:**

```
1 3 N
5 1 E
```

---

## 🧩 Mower Capabilities

| Capability                  | Details                                                 |
|-----------------------------|---------------------------------------------------------|
| **Move forward**            | Advances one cell in the currently faced direction      |
| **Turn left**               | Rotates 90° counter-clockwise without moving            |
| **Turn right**              | Rotates 90° clockwise without moving                    |
| **Boundary detection**      | Refuses to move outside the defined lawn area           |
| **Multiple mowers**         | Supports running several mowers sequentially            |
| **Orientation tracking**    | Always knows which cardinal direction it is facing      |

---

## 🛠️ Development

### Run tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

---

## 📐 Cardinal Direction Reference

```
        N (North)
        ↑
W ←  [Mower] → E
        ↓
        S (South)
```

---

## 📄 License

This project is provided for educational and demonstration purposes.
