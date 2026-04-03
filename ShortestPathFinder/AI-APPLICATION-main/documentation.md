# Poster Content: AI Pathfinding Visualizer

*This detailed documentation is specifically organized to map to your poster requirements (Problem, Solution, Features, Concept, Design, Functionality) while explicitly addressing the syllabus topics from Units 1, 2, and 3.*

---

## 1. Problem Statement (Unit 1 Tie-in)
**Concept: Formulating Problems & Problem Space**
In Artificial Intelligence, understanding the "Problem Space" is the first step functionally required to resolve complex tasks.
* **The Problem**: How can an autonomous AI agent calculate the most optimal path from an initial state (Start) to a goal state (Target) while navigating around unpredictable obstacles?
* **Problem Characteristics**: This project acts as a classic AI "Toy Problem" demonstrating real-world pathfinding search spaces. The grid represents the problem space, where individual cells are discrete states, and orthogonal movements determine the transition model.

## 2. Solution & Algorithms (Unit 2 Tie-in)
**Design: Data Structures & Search Algorithms**
We developed an interactive web application that acts as a Problem-Solving Agent. By utilizing core data structures (Stacks, Queues, Graphs), the application physically visualizes both Uninformed and Informed search methods locating the goal state.

* **Breadth-First Search (BFS)**: An **Uninformed Search** employing a **Queue (FIFO)** data structure. It guarantees the absolute shortest path by aggressively exploring all neighbor nodes symmetrically at the present depth level.
* **Depth-First Search (DFS)**: An **Uninformed Search** utilizing a **Stack (LIFO)** data structure. It illustrates a different control strategy by exploring blindly down a singular branch until it hits a dead end before backtracking.
* **A* Algorithm (A-Star)**: An **Informed Search** method that dramatically optimizes graph traversal. It uses a heuristic function (Manhattan Distance) evaluating nodes based on optimal efficiency towards the target, guaranteeing the shortest path but with massive computational savings.

## 3. The Intelligent Agent & Design (Unit 3 Tie-in)
**Functionality: Agent & Task Environments**
* **The Intelligent Agent**: Designed as a Rational Agent, its fundamental goal is performance maximization—finding the absolute shortest path while exploring the minimum requisite number of nodes.
* **Task Environment Properties**: The visualizer executes in an environment that heavily mirrors Unit 3 properties:
  * *Fully Observable*: The agent has full layout access.
  * *Deterministic*: Moving left always securely results in moving left.
  * *Discrete*: The maze consists of defined, individual grid cells.
  * *Static*: The environment does not change while the algorithm calculates.

## 4. Key Features & Visual Functionality
* **Interactive Dynamic Environment**: Users have full mouse control to dynamically draw un-passable walls, creating intricate labyrinths to stress-test the algorithms.
* **Live Step-by-Step Visualization**: The application strictly avoids instantly snapping to the solution. Through asynchronous event loop throttling, users visually watch the "thinking" process, node-by-node, fulfilling the demo requirement perfectly.
* **Recursive Maze Generation**: A mathematical script capable of instantaneously producing structurally continuous, complex mazes for rapid testing phases.
* **Dynamic Objective Relocation**: Users can click and drag the Start and Target nodes on the fly to see how the environmental solution shifts dynamically.
* **Algorithm Comparison & Node Counting**: A dedicated "Compare All Algorithms" feature autonomously dry-runs BFS, DFS, and A* in the background, instantly producing a clean tabular head-to-head comparison defining exactly how many "Nodes Expanded" each takes, thus experimentally proving A*'s algorithmic superiority over Uninformed searches.

## 5. Tools Used
* **HTML5**: Defines the structural layout, canvas bounds, and grid container geometries.
* **CSS3**: Implements dark-mode aesthetics, custom CSS-Grid cell spacing, and visually appealing keyframe animations mapping agent progress (exploring, visited, and final path trace).
* **Vanilla JavaScript (ES6+)**: Houses 100% of the artificial intelligence logic, memory matrix handling, and DOM manipulations without reliance on any external libraries.
