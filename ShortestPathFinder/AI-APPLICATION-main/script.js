// Constants and State
const ROWS = 23;
const COLS = 45;
let grid = [];
let startNode = { row: 11, col: 10 };
let targetNode = { row: 11, col: 35 };

let isDrawingWall = false;
let isMovingStart = false;
let isMovingTarget = false;
let animationInProgress = false;

// DOM Elements
const gridContainer = document.getElementById('grid');
const algoSelect = document.getElementById('algorithm');
const algDescription = document.getElementById('alg-description');
const speedSlider = document.getElementById('speed');
const btnVisualize = document.getElementById('btn-visualize');
const btnCompare = document.getElementById('btn-compare');
const btnClearBoard = document.getElementById('btn-clear-board');
const btnClearPath = document.getElementById('btn-clear-path');
const btnGenerateMaze = document.getElementById('btn-generate-maze');

const statsContainer = document.getElementById('stats-container');
const statNodes = document.getElementById('stat-nodes');
const statPath = document.getElementById('stat-path');
const compareModal = document.getElementById('compare-modal');
const compareResults = document.getElementById('compare-results');
const btnCloseModal = document.getElementById('btn-close-modal');

const descriptions = {
    bfs: "Guarantees the shortest path. Explores all neighbors at the present depth before moving on to the next depth level.",
    dfs: "Does NOT guarantee the shortest path. Explores as far as possible along each branch before backtracking.",
    astar: "Guarantees the shortest path. Uses heuristics to heavily optimize the search toward the target."
};

// Initialize Grid
function initGrid() {
    gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
    gridContainer.innerHTML = '';
    grid = [];

    for (let r = 0; r < ROWS; r++) {
        let currentRow = [];
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.id = `cell-${r}-${c}`;
            cell.classList.add('cell');
            
            if (r === startNode.row && c === startNode.col) cell.classList.add('start');
            if (r === targetNode.row && c === targetNode.col) cell.classList.add('target');

            // Event Listeners for Interaction
            cell.addEventListener('mousedown', (e) => handleMouseDown(e, r, c));
            cell.addEventListener('mouseenter', (e) => handleMouseEnter(e, r, c));
            cell.addEventListener('mouseup', handleMouseUp);
            // Prevent default drag
            cell.addEventListener('dragstart', (e) => e.preventDefault());

            gridContainer.appendChild(cell);
            currentRow.push({
                row: r,
                col: c,
                isWall: false,
                isStart: r === startNode.row && c === startNode.col,
                isTarget: r === targetNode.row && c === targetNode.col,
                distance: Infinity,
                totalDistance: Infinity,
                previousNode: null,
                isVisited: false
            });
        }
        grid.push(currentRow);
    }
}

// Mouse Interactions
function handleMouseDown(e, r, c) {
    if (animationInProgress) return;
    if (r === startNode.row && c === startNode.col) {
        isMovingStart = true;
    } else if (r === targetNode.row && c === targetNode.col) {
        isMovingTarget = true;
    } else {
        isDrawingWall = true;
        toggleWall(r, c);
    }
}

function handleMouseEnter(e, r, c) {
    if (animationInProgress) return;
    if (isDrawingWall) {
        toggleWall(r, c);
    } else if (isMovingStart) {
        moveStartNode(r, c);
    } else if (isMovingTarget) {
        moveTargetNode(r, c);
    }
}

function handleMouseUp() {
    isDrawingWall = false;
    isMovingStart = false;
    isMovingTarget = false;
}

function toggleWall(r, c) {
    if ((r === startNode.row && c === startNode.col) || (r === targetNode.row && c === targetNode.col)) return;
    const node = grid[r][c];
    node.isWall = !node.isWall;
    const cellElement = document.getElementById(`cell-${r}-${c}`);
    if (node.isWall) cellElement.classList.add('wall');
    else cellElement.classList.remove('wall');
}

function moveStartNode(r, c) {
    if (grid[r][c].isWall || (r === targetNode.row && c === targetNode.col)) return;
    document.getElementById(`cell-${startNode.row}-${startNode.col}`).classList.remove('start');
    grid[startNode.row][startNode.col].isStart = false;
    
    startNode = { row: r, col: c };
    grid[r][c].isStart = true;
    document.getElementById(`cell-${r}-${c}`).classList.add('start');
}

function moveTargetNode(r, c) {
    if (grid[r][c].isWall || (r === startNode.row && c === startNode.col)) return;
    document.getElementById(`cell-${targetNode.row}-${targetNode.col}`).classList.remove('target');
    grid[targetNode.row][targetNode.col].isTarget = false;
    
    targetNode = { row: r, col: c };
    grid[r][c].isTarget = true;
    document.getElementById(`cell-${r}-${c}`).classList.add('target');
}

// Global Event Listeners
document.addEventListener('mouseup', handleMouseUp);
algoSelect.addEventListener('change', (e) => algDescription.innerText = descriptions[e.target.value]);

btnClearBoard.addEventListener('click', () => {
    if (animationInProgress) return;
    initGrid();
});

btnClearPath.addEventListener('click', () => {
    if (animationInProgress) return;
    clearPathAndVisited();
});

btnGenerateMaze.addEventListener('click', async () => {
    if (animationInProgress) return;
    animationInProgress = true;
    btnGenerateMaze.disabled = true;
    initGrid();
    await generateMazeRecursiveDivision();
    animationInProgress = false;
    btnGenerateMaze.disabled = false;
});

function clearPathAndVisited() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const node = grid[r][c];
            node.isVisited = false;
            node.distance = Infinity;
            node.totalDistance = Infinity;
            node.previousNode = null;
            const element = document.getElementById(`cell-${r}-${c}`);
            element.classList.remove('visited', 'path');
        }
    }
}

async function generateMazeRecursiveDivision() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
                setWall(r, c);
                await sleep(2);
            }
        }
    }
    await recursiveDivision(1, 1, ROWS - 2, COLS - 2);
    clearCell(startNode.row, startNode.col);
    clearCell(targetNode.row, targetNode.col);
}

function setWall(r, c) {
    if ((r === startNode.row && c === startNode.col) || (r === targetNode.row && c === targetNode.col)) return;
    if (!grid[r][c].isWall) {
        grid[r][c].isWall = true;
        document.getElementById(`cell-${r}-${c}`).classList.add('wall');
    }
}

function clearCell(r, c) {
    if (grid[r][c].isWall) {
        grid[r][c].isWall = false;
        document.getElementById(`cell-${r}-${c}`).classList.remove('wall');
    }
}

async function recursiveDivision(r1, c1, r2, c2) {
    if (r2 < r1 || c2 < c1) return;
    let width = c2 - c1 + 1;
    let height = r2 - r1 + 1;
    if (width < 3 || height < 3) return;
    
    let orientation = width > height ? 'VERTICAL' : 'HORIZONTAL';
    
    if (orientation === 'HORIZONTAL') {
        let possibleRows = [];
        for (let r = r1 + 1; r <= r2 - 1; r += 2) possibleRows.push(r);
        if (possibleRows.length === 0) return;
        let wallRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        
        let possibleCols = [];
        for (let c = c1; c <= c2; c += 2) possibleCols.push(c);
        let passageCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        
        for (let c = c1; c <= c2; c++) {
            if (c !== passageCol) {
                setWall(wallRow, c);
                await sleep(2);
            }
        }
        await recursiveDivision(r1, c1, wallRow - 1, c2);
        await recursiveDivision(wallRow + 1, c1, r2, c2);
    } else {
        let possibleCols = [];
        for (let c = c1 + 1; c <= c2 - 1; c += 2) possibleCols.push(c);
        if (possibleCols.length === 0) return;
        let wallCol = possibleCols[Math.floor(Math.random() * possibleCols.length)];
        
        let possibleRows = [];
        for (let r = r1; r <= r2; r += 2) possibleRows.push(r);
        let passageRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
        
        for (let r = r1; r <= r2; r++) {
            if (r !== passageRow) {
                setWall(r, wallCol);
                await sleep(2);
            }
        }
        await recursiveDivision(r1, c1, r2, wallCol - 1);
        await recursiveDivision(r1, wallCol + 1, r2, c2);
    }
}

// Utilities for Algorithms
function getNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]); // up
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]); // down
    if (col > 0) neighbors.push(grid[row][col - 1]); // left
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]); // right
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

// Delay Function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function getSpeedMs() {
    const val = speedSlider.value; // 1 to 100
    // If val is 100, delay is 1ms. If 1, delay is 100ms.
    return 101 - val;
}

// BFS Algorithm
async function executeBFS(animate = true) {
    let nodesExpanded = 0;
    const queue = [grid[startNode.row][startNode.col]];
    grid[startNode.row][startNode.col].isVisited = true;

    while (queue.length > 0) {
        const currentNode = queue.shift();
        nodesExpanded++;
        
        if (currentNode.isTarget) {
            return { found: true, nodesExpanded };
        }

        if (!currentNode.isStart && !currentNode.isTarget) {
            if (animate) {
                document.getElementById(`cell-${currentNode.row}-${currentNode.col}`).classList.add('visited');
                await sleep(getSpeedMs());
            }
        }

        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;
            queue.push(neighbor);
        }
    }
    return { found: false, nodesExpanded };
}

// DFS Algorithm
async function executeDFS(animate = true) {
    let nodesExpanded = 0;
    const stack = [grid[startNode.row][startNode.col]];

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (currentNode.isWall || currentNode.isVisited) continue;

        currentNode.isVisited = true;
        nodesExpanded++;

        if (currentNode.isTarget) {
            return { found: true, nodesExpanded };
        }

        if (!currentNode.isStart && !currentNode.isTarget) {
            if (animate) {
                document.getElementById(`cell-${currentNode.row}-${currentNode.col}`).classList.add('visited');
                await sleep(getSpeedMs());
            }
        }

        // Push neighbors (up, right, down, left to visit in typical visually intuitive order)
        const unvisitedNeighbors = getNeighbors(currentNode, grid);
        for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
            const neighbor = unvisitedNeighbors[i];
            if (!neighbor.isVisited) {
                neighbor.previousNode = currentNode;
                stack.push(neighbor);
            }
        }
    }
    return { found: false, nodesExpanded };
}

// A* Algorithm
function heuristic(nodeA, nodeB) {
    // Manhattan distance
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

async function executeAStar(animate = true) {
    let nodesExpanded = 0;
    const start = grid[startNode.row][startNode.col];
    const target = grid[targetNode.row][targetNode.col];
    start.distance = 0;
    start.totalDistance = heuristic(start, target);
    
    let unvisitedNodes = [start];

    while (unvisitedNodes.length > 0) {
        unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
        const currentNode = unvisitedNodes.shift();

        if (currentNode.isWall || currentNode.isVisited) continue;
        currentNode.isVisited = true;
        nodesExpanded++;

        if (currentNode.isTarget) {
            return { found: true, nodesExpanded };
        }

        if (!currentNode.isStart && !currentNode.isTarget) {
            if (animate) {
                document.getElementById(`cell-${currentNode.row}-${currentNode.col}`).classList.add('visited');
                await sleep(getSpeedMs());
            }
        }

        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            const tempDistance = currentNode.distance + 1;
            
            if (tempDistance < neighbor.distance) {
                neighbor.previousNode = currentNode;
                neighbor.distance = tempDistance;
                neighbor.totalDistance = neighbor.distance + heuristic(neighbor, target);
                
                if (!unvisitedNodes.includes(neighbor)) {
                    unvisitedNodes.push(neighbor);
                }
            }
        }
    }
    return { found: false, nodesExpanded };
}

// Animate Shortest Path
async function animatePath(animate = true) {
    let currentNode = grid[targetNode.row][targetNode.col].previousNode;
    const path = [];
    while (currentNode !== null && !currentNode.isStart) {
        path.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    
    if (animate) {
        // Animate
        for (const node of path) {
            document.getElementById(`cell-${node.row}-${node.col}`).classList.remove('visited');
            document.getElementById(`cell-${node.row}-${node.col}`).classList.add('path');
            await sleep(getSpeedMs() + 20); // slightly slower for dramatic effect
        }
    }
    return path.length;
}

// Main Visualize Flow
btnVisualize.addEventListener('click', async () => {
    if (animationInProgress) return;
    
    clearPathAndVisited();
    statsContainer.style.display = 'none';
    animationInProgress = true;
    btnVisualize.disabled = true;
    
    const alg = algoSelect.value;
    let result = null;

    if (alg === 'bfs') result = await executeBFS();
    else if (alg === 'dfs') result = await executeDFS();
    else if (alg === 'astar') result = await executeAStar();

    if (result && result.found) {
        const pathLength = await animatePath('true');
        statNodes.innerText = result.nodesExpanded;
        statPath.innerText = pathLength;
        statsContainer.style.display = 'block';
    } else {
        alert("No path found!");
        statNodes.innerText = result ? result.nodesExpanded : 0;
        statPath.innerText = "N/A";
        statsContainer.style.display = 'block';
    }

    animationInProgress = false;
    btnVisualize.disabled = false;
});

// Compare All Algorithms
btnCompare.addEventListener('click', async () => {
    if (animationInProgress) return;
    animationInProgress = true;
    btnCompare.disabled = true;
    btnVisualize.disabled = true;
    statsContainer.style.display = 'none';

    const results = [];
    const algorithms = [
        { id: 'bfs', name: 'Breadth-First Search' },
        { id: 'dfs', name: 'Depth-First Search' },
        { id: 'astar', name: 'A* Search' }
    ];

    for (const alg of algorithms) {
        clearPathAndVisited();
        let res;
        if (alg.id === 'bfs') res = await executeBFS(false);
        else if (alg.id === 'dfs') res = await executeDFS(false);
        else if (alg.id === 'astar') res = await executeAStar(false);

        let pathLength = "N/A";
        if (res.found) {
            pathLength = await animatePath(false);
        }
        
        results.push({ name: alg.name, nodesExpanded: res.nodesExpanded, pathLength });
    }

    // clear visual representation
    clearPathAndVisited();

    // Populate Modal
    compareResults.innerHTML = '';
    results.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${r.name}</td><td style="text-align:center;">${r.nodesExpanded}</td><td style="text-align:center;">${r.pathLength}</td>`;
        compareResults.appendChild(tr);
    });

    compareModal.style.display = 'flex';
    animationInProgress = false;
    btnCompare.disabled = false;
    btnVisualize.disabled = false;
});

btnCloseModal.addEventListener('click', () => {
    compareModal.style.display = 'none';
});

// Run Init
window.onload = initGrid;
